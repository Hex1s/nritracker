import { Entity } from "@/src/types";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const createEntity = (): Entity => ({
  id: Date.now().toString(),
  name: "",
  ac: 0,
  initiative: 0,
  hp: 0,
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
            <View>
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

            <View>
              <Text style={styles.label}>AC</Text>
              <TextInput
                value={String(ent.ac)}
                onChangeText={text =>
                  updateEntity(ent.id, { ac: Number(text) || 0 })
                }
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.label}>HP</Text>
              <TextInput
                keyboardType="numeric"
                value={String(ent.hp)}
                onChangeText={text =>
                  updateEntity(ent.id, {
                    hp: Number(text) || 0,
                  })
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
})