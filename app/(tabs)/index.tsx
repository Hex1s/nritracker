import { Entity } from "@/src/types";
import { Slider } from "@tamagui/slider";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
  entity: Entity;
  onHPChange: (hp: number) => void;
  onMaxHPChange: (maxHp: number) => void;
};

const HPSlider = memo(({ entity, onHPChange, onMaxHPChange }: Props) => {
  const slideStartHPRef = useRef<number | null>(null);
  const latestValueRef = useRef<number>(entity.hp);

  const [, forceRender] = useState(0); // только для отображения дельты

  // синхронизация при внешнем изменении hp
  useEffect(() => {
    if (slideStartHPRef.current === null) {
      latestValueRef.current = entity.hp;
      forceRender(v => v + 1);
    }
  }, [entity.hp]);

  const handleSlideStart = useCallback(() => {
    slideStartHPRef.current = entity.hp;
    latestValueRef.current = entity.hp;
    forceRender(v => v + 1);
  }, [entity.hp]);

  const handleValueChange = useCallback((vals: number[]) => {
    latestValueRef.current = vals[0];
    forceRender(v => v + 1); // ТОЛЬКО визуал, thumb двигается нативно
  }, []);

  const handleSlideEnd = useCallback(() => {
    if (slideStartHPRef.current !== null) {
      onHPChange(latestValueRef.current);
      slideStartHPRef.current = null;
      forceRender(v => v + 1);
    }
  }, [onHPChange]);
  const slideStartHP = slideStartHPRef.current;

  const isSliding = slideStartHP !== null;
  const delta = isSliding
    ? latestValueRef.current - slideStartHP
    : 0;

  const hpPercent = entity.maxHp > 0
    ? latestValueRef.current / entity.maxHp
    : 0;

  const getColor = (percent: number) => {
    if (percent <= 0.25) return "#ff4444";
    if (percent <= 0.5) return "#ffaa00";
    return "#44ff44";
  };

  return (
    <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#333" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: "#aaa", fontSize: 14 }}>HP:</Text>

          <TextInput
            keyboardType="numeric"
            value={String(entity.hp)}
            onChangeText={text => {
              const newHP = Number(text) || 0;
              onHPChange(Math.min(newHP, entity.maxHp));
            }}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              padding: 4,
              borderRadius: 4,
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              minWidth: 50,
            }}
          />

          <Text style={{ color: "#aaa", fontSize: 14 }}>/</Text>

          <TextInput
            keyboardType="numeric"
            value={String(entity.maxHp)}
            onChangeText={text => {
              const newMax = Number(text) || 0;
              onMaxHPChange(newMax);
            }}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              padding: 4,
              borderRadius: 4,
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              minWidth: 50,
            }}
          />
        </View>

        <Text
          style={{
            color: entity.hp < entity.maxHp ? "#ff6666" : "#666",
            fontSize: 14,
            fontWeight: "bold",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            backgroundColor: entity.hp < entity.maxHp ? "#331111" : "#222",
          }}
        >
          {entity.hp < entity.maxHp ? `-${entity.maxHp - entity.hp}` : "✓"}
        </Text>
      </View>

      {/* Slider */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <Slider
          defaultValue={[entity.hp]}
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
              <View
                style={{
                  position: "absolute",
                  top: -42,
                  backgroundColor: "#000",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: delta < 0 ? "#ff4444" : "#44ff44",
                  minWidth: 70,
                }}
              >
                <Text
                  style={{
                    color: delta < 0 ? "#ff4444" : "#44ff44",
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                >
                  {delta > 0 ? "+" : ""}
                  {delta}
                </Text>
              </View>
            )}
          </Slider.Thumb>
        </Slider>
      </View>
    </View>
  );
});

export default HPSlider;
