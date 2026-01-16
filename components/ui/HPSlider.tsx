import { Entity } from "@/src/types";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Slider } from "tamagui";

interface IHPSlider {
  entity: Entity;
  onHPChange: (hp: number) => void;
  onMaxHPChange: (maxHp: number) => void;
  onSlideStart: () => void;
  onSlideEnd: () => void;
}

const HPSlider = memo(({ entity, onHPChange, onMaxHPChange, onSlideStart, onSlideEnd }: IHPSlider) => {
    const slideStartHPRef = useRef<number | null>(null);
    const latestValueRef = useRef<number>(entity.hp);
    const [, forceRender] = useState(0); 

    useEffect(() => {
      if (slideStartHPRef.current === null) {
        latestValueRef.current = entity.hp;
      }
    }, [entity.hp]);

    const handleSlideStart = useCallback(() => {
      onSlideStart()
      slideStartHPRef.current = entity.hp;
      latestValueRef.current = entity.hp;
      forceRender(v => v + 1);
    }, [entity.hp]);

    const handleValueChange = useCallback((vals: number[]) => {
      latestValueRef.current = vals[0];
      forceRender(v => v + 1);
    }, []);

    const handleSlideEnd = useCallback(() => {
      onSlideEnd()
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

    const hpPercent =
      entity.maxHp > 0
        ? latestValueRef.current / entity.maxHp
        : 0;

    const getColor = (percent: number) => {
      if (percent <= 0.25) return "#ff4444";
      if (percent <= 0.5) return "#ffaa00";
      return "#44ff44";
    };

    return (
      <View style={styles.hpSliderContainer}>
        {/* Header */}
        <View style={styles.hpHeader}>
          <View style={styles.hpInputsRow}>
            <Text style={styles.hpLabel}>HP:</Text>
            <View>
                <Text style={styles.hpLabel}>Текущее</Text>
                <TextInput
                keyboardType="numeric"
                selectTextOnFocus
                value={String(entity.hp)}
                onChangeText={text => {
                    const newHP = Number(text) || 0;
                    onHPChange(Math.min(newHP, entity.maxHp));
                }}
                style={styles.hpInputInline}
                />

            </View>
            <Text style={styles.hpLabel}>/</Text>

            <View>
                <Text style={styles.hpLabel}>Максимальное</Text>
                <TextInput
                keyboardType="numeric"
                selectTextOnFocus
                value={String(entity.maxHp)}
                onChangeText={text => {
                    const newMax = Number(text) || 0;
                    onMaxHPChange(newMax);
                }}
                style={styles.hpInputInline}
                />
            </View>
          </View>

          <Text
            style={[
              styles.damageIndicator,
              entity.hp < entity.maxHp && styles.damageIndicatorActive,
            ]}
          >
            {entity.hp < entity.maxHp
              ? `-${entity.maxHp - entity.hp}`
              : "✓"}
          </Text>
        </View>

        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <Slider
            value={[latestValueRef.current]}
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
                  style={[
                    styles.thumbLabel,
                    {
                      borderColor:
                        delta < 0 ? "#ff4444" : "#44ff44",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.thumbText,
                      delta < 0 && styles.thumbTextDamage,
                    ]}
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
  }
);

export default HPSlider;

const styles = StyleSheet.create({
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
    alignItems: "flex-end",
    gap: 8,
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
  },
  thumbLabel: {
    position: "absolute",
    top: -42,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 2,
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
});