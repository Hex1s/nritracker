import { Entity } from "@/src/types";
import { Trash } from "@tamagui/lucide-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ACShield from "./ACShield";
import HPSlider from "./HPSlider";

interface IEntityCard {
    entity: Entity;
    idx: number;
    updateEntity: (id: string, patch: Partial<Entity>) => void;
    removeEntity: (id: string) => void;
    onSlideStart: () => void;
    onSlideEnd: () => void;
}

function EntityCard({ entity, updateEntity, removeEntity, idx, onSlideStart, onSlideEnd }: IEntityCard) {

  return (
    <View style={styles.card}>
            <View>
                <View style={[styles.row, styles.between]}>
                    <Text style={styles.number}>{idx}</Text>
                    <Pressable style={{ backgroundColor: "#FF746C", padding: 8, borderRadius: "100%" }} onPress={() => removeEntity(entity.id)}>
                        <Trash color={"#fff"} size={24} />
                    </Pressable>
                </View>
                <Text style={styles.label}>Имя</Text>
                <TextInput
                    value={entity.name}
                    onChangeText={text => updateEntity(entity.id, { name: text })}
                    style={styles.input}
                />
            </View>

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Инициатива</Text>
                    <TextInput
                    keyboardType="numeric"
                    selectTextOnFocus
                    value={String(entity.initiative)}
                    onChangeText={text =>
                        updateEntity(entity.id, { initiative: Number(text) || 0 })
                    }
                    style={styles.inputSmall}
                    />
                </View>
                <ACShield onChange={updateEntity} entity={entity} ac={entity.ac} />
            </View>

            <HPSlider
            entity={entity}
            onSlideStart={onSlideStart}
            onSlideEnd={onSlideEnd}
            onHPChange={hp => updateEntity(entity.id, { hp })}
            onMaxHPChange={maxHp =>
                updateEntity(entity.id, { maxHp, hp: Math.min(entity.hp, maxHp) })
            }
            />
    </View>
  );
}

export default EntityCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1e1e1e",
        borderWidth: 2,
        borderColor: "#bbb",
        padding: 10,
        borderRadius: 8,
        gap: 6,
    },
    number: {
        fontSize: 20,
        color: "#fff",
        borderRadius: 300,
        aspectRatio: 1,
        textAlign: "center",
        fontWeight: "800",
        backgroundColor: "#556EE6",
        padding: 8
    },
    between: {
        justifyContent: "space-between"
    },
    deleteBackground: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#aa2222",
        padding: 8,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingRight: 16,
        zIndex: 0,
    },
    label: {
        color: "#aaa",
        fontSize: 12,
        marginBottom: 2,
    },
    input: {
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
    row: {
        flexDirection: "row",
        gap: 8,
    },
})
