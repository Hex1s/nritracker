import { Entity } from "@/src/types";
import { Slider } from '@tamagui/slider';
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// Компонент слайдера HP с оптимизацией и относительным отслеживанием урона
const HPSlider = memo(({ 
  entity, 
  onHPChange,
  onMaxHPChange
}: { 
  entity: Entity; 
  onHPChange: (hp: number) => void;
  onMaxHPChange: (maxHp: number) => void;
}) => {
  const [slideStartHP, setSlideStartHP] = useState<number | null>(null);
  const [tempHP, setTempHP] = useState<number>(entity.hp);
  const lastUpdateTimeRef = useRef<number>(0);
  const latestValueRef = useRef<number>(entity.hp);

  const isSliding = slideStartHP !== null;
  const delta = isSliding ? tempHP - slideStartHP : 0;

  // Синхронизация tempHP с entity.hp когда не в процессе слайдинга
  useEffect(() => {
    if (!isSliding) {
      setTempHP(entity.hp);
      latestValueRef.current = entity.hp;
    }
  }, [entity.hp, isSliding]);

  // Начало слайдинга - запоминаем стартовое HP
  const handleSlideStart = useCallback(() => {
    setSlideStartHP(entity.hp);
    setTempHP(entity.hp);
    latestValueRef.current = entity.hp;
    lastUpdateTimeRef.current = Date.now();
  }, [entity.hp]);

  // Во время движения - обновляем с throttle (не чаще 50мс)
  const handleValueChange = useCallback((vals: number[]) => {
    const newVal = vals[0];
    latestValueRef.current = newVal; // Всегда храним последнее значение
    
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    
    // Throttle: обновляем визуализацию не чаще чем раз в 50мс
    if (timeSinceLastUpdate >= 50) {
      setTempHP(newVal);
      lastUpdateTimeRef.current = now;
    }
  }, []);

  // Отпускание пальца - фиксируем ПОСЛЕДНЕЕ значение и сбрасываем состояние
  const handleSlideEnd = useCallback(() => {
    if (slideStartHP !== null) {
      // Используем последнее актуальное значение, а не throttled tempHP
      onHPChange(latestValueRef.current);
      setTempHP(latestValueRef.current);
      setSlideStartHP(null);
    }
  }, [slideStartHP, onHPChange]);

  const currentHP = isSliding ? tempHP : entity.hp;
  const hpPercent = currentHP / entity.maxHp;

  const getColor = (percent: number) => {
    if (percent <= 0.25) return "#ff4444";
    if (percent <= 0.5) return "#ffaa00";
    return "#44ff44";
  };

  return (
    <View style={styles.hpSliderContainer}>
      <View style={styles.hpHeader}>
        <View style={styles.hpInputsRow}>
          <Text style={styles.hpLabel}>HP: </Text>
          <TextInput
            keyboardType="numeric"
            value={String(entity.hp)}
            onChangeText={text => {
              const newHP = Number(text) || 0;
              onHPChange(Math.min(newHP, entity.maxHp));
            }}
            style={styles.hpInputInline}
          />
          <Text style={styles.hpLabel}> / </Text>
          <TextInput
            keyboardType="numeric"
            value={String(entity.maxHp)}
            onChangeText={text => {
              const newMax = Number(text) || 0;
              onMaxHPChange(newMax);
            }}
            style={styles.hpInputInline}
          />
        </View>
        <Text style={[styles.damageIndicator, entity.hp < entity.maxHp && styles.damageIndicatorActive]}>
          {entity.hp < entity.maxHp ? `-${entity.maxHp - entity.hp}` : '✓'}
        </Text>
      </View>
      
      <View style={styles.sliderWrapper}>
        <Slider
          size="$4"
          value={[currentHP]}
          min={0}
          max={entity.maxHp}
          step={1}
          onSlideStart={handleSlideStart}
          onValueChange={handleValueChange}
          onSlideEnd={handleSlideEnd}
        >
          <Slider.Track backgroundColor="#333" height={8} borderRadius={4}>
            <Slider.TrackActive backgroundColor={getColor(hpPercent)} />
          </Slider.Track>
          <Slider.Thumb 
            index={0}
            circular 
            size={24} 
            backgroundColor="#fff"
            borderWidth={2}
            borderColor={getColor(hpPercent)}
            alignItems="center"
            justifyContent="center"
          >
            {isSliding && delta !== 0 && (
              <View style={[
                styles.thumbLabel,
                { borderColor: delta < 0 ? '#ff4444' : '#44ff44' }
              ]}>
                <Text 
                  style={[styles.thumbText, delta < 0 && styles.thumbTextDamage]}
                  numberOfLines={1}
                >
                  {delta > 0 ? '+' : ''}{delta}
                </Text>
              </View>
            )}
          </Slider.Thumb>
        </Slider>
      </View>
    </View>
  );
});

const createEntity = (): Entity => ({
  id: Date.now().toString(),
  name: "",
  ac: 0,
  initiative: 0,
  hp: 0,
  maxHp: 0,
})

export default function InitiativeScreen() {
  const [entities, setEntities] = useState<Entity[]>([]);

  const addEntity = () => {
    setEntities(e => [...e, createEntity()]);
  }

  const updateEntity = (id: string, patch: Partial<Entity>) => {
    setEntities(e => e.map(ent => ent.id === id ? { ...ent, ...patch } : ent));
  }

  const removeEntity = (id: string) => {
    setEntities(e => e.filter(ent => ent.id !== id))
  }

  const clearAll = () => {
    setEntities([]);
  }

  const recalcInitiative = () => {
    setEntities(e => [...e].sort((a, b) => b.initiative - a.initiative))
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>
        Трекер инициативы
      </Text>
      
      <View style={styles.row}>
        <Pressable style={styles.button} onPress={addEntity}>
          <Text style={styles.buttonText}>+ Добавить</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={recalcInitiative}>
          <Text style={styles.buttonText}>↻ Пересчитать</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.danger]} onPress={clearAll}>
          <Text style={styles.buttonText}>✖ Очистить</Text>
        </Pressable>
      </View>

      <ScrollView style={{ marginTop: 16 }}>
        {entities.map(ent => (
          <View key={ent.id} style={styles.card}>
          <View>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              value={ent.name}
              onChangeText={text =>
                updateEntity(ent.id, { name: text })
              }
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Инициатива</Text>
              <TextInput
                keyboardType="numeric"
                value={String(ent.initiative)}
                onChangeText={text =>
                  updateEntity(ent.id, {
                    initiative: Number(text) || 0,
                  })
                }
                style={styles.inputSmall}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>AC</Text>
              <TextInput
                keyboardType="numeric"
                value={String(ent.ac)}
                onChangeText={text =>
                  updateEntity(ent.id, { ac: Number(text) || 0 })
                }
                style={styles.inputSmall}
              />
            </View>

            <Pressable
              onPress={() => removeEntity(ent.id)}
              style={{ justifyContent: "flex-end" }}
            >
              <Text style={styles.deleteText}>Удалить</Text>
            </Pressable>
          </View>

          {/* Слайдер HP с визуализацией урона */}
          <HPSlider 
            entity={ent}
            onHPChange={(hp) => updateEntity(ent.id, { hp })}
            onMaxHPChange={(maxHp) => updateEntity(ent.id, { 
              maxHp, 
              hp: Math.min(ent.hp, maxHp) 
            })}
          />
        </View>
        ))}
      </ScrollView>
    </View>
  )

  
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 6,
  },
  danger: {
    backgroundColor: "#662222",
  },
  buttonText: {
    color: "#fff",
  },
  label: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 2,
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    gap: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    padding: 6,
    borderRadius: 4,
  },
  inputSmall: {
    width: 60,
    backgroundColor: "#333",
    color: "#fff",
    padding: 6,
    borderRadius: 4,
    textAlign: "center",
  },
  deleteText: {
    color: "#ff6666",
  },
  hpSliderContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  hpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  hpInputsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hpLabel: {
    color: "#aaa",
    fontSize: 14,
  },
  hpInputInline: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 4,
    borderRadius: 4,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 50,
  },
  damageIndicator: {
    color: "#666",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#222",
  },
  damageIndicatorActive: {
    color: "#ff6666",
    backgroundColor: "#331111",
  },
  sliderWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: "relative",
  },
  thumbLabel: {
    position: "absolute",
    top: -42,
    backgroundColor: "#000",
    maxWidth: 200,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 2,
    alignSelf: "center",
    minWidth: 70,
  },
  thumbText: {
    color: "#44ff44",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  thumbTextDamage: {
    color: "#ff4444",
  },
})