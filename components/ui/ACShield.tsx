import { Entity } from "@/src/types";
import { Check, Shield } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Checkbox } from "tamagui";

type ACShieldProps = {
  ac: number;
  entity: Entity;
  onChange: (id: string, patch: Partial<Entity>) => void;
}

const SHIELD_BONUS = 2;

export function ACShield({ ac, entity, onChange }: ACShieldProps) {
    const [shield, setShield] = useState(false);    

    useEffect(() => {
        if (ac > 99 - SHIELD_BONUS) return;
        if (shield) {
        onChange(entity.id, { ac: ac + SHIELD_BONUS });
        }
    }, []);

    const toggleShield = (checked: boolean) => {
        setShield(checked);
        if (checked) {
        onChange(entity.id, { ac: ac + SHIELD_BONUS });
        } else {
        onChange(entity.id, { ac: Math.max(ac - SHIELD_BONUS, 0) });
        }
    };

    const getACColor = (ac: number) => {
        if (ac <= 5) return "#AA2222";
        if (ac <= 10) return "#DD4444";
        if (ac <= 15) return "#CCCC00";
        if (ac <= 20) return "#44CC44";
        if (ac <= 25) return "#22AA88";
        if (ac <= 29) return "#3399FF";
        return "#FFD700";
    }

    const shieldColor = getACColor(ac)

    return (
        <View style={styles.row}>
            <View style={styles.row}>
                <Text style={{ color: shield ? "#FFD700" : "#fff" }} onPress={() => toggleShield(!shield)}>Щит</Text>
                <Checkbox checked={shield} onCheckedChange={toggleShield}>
                    <Checkbox.Indicator>
                        <Check />
                    </Checkbox.Indicator>
                </Checkbox>
            </View>
            <View style={styles.container}>
                <Shield size={48} color={shieldColor} />

                <View style={styles.valueWrapper}>
                    <TextInput 
                        selectTextOnFocus 
                        style={styles.input} 
                        numberOfLines={1} 
                        keyboardType="numeric" 
                        value={String(ac)} 
                        onChangeText={(text) => onChange(entity.id, { ac: Math.min(Number(text), 99) })} />
                </View>
            </View>
        </View>
    )
    }

export default ACShield

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  valueWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: "#fff",
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  valueHigh: {
    textShadowColor: "#44ff44",
    textShadowRadius: 6,
  },
})

