import EntityCard from "@/components/ui/EntityCard";
import { Entity } from "@/src/types";
import { Plus, RefreshCw, Trash } from "@tamagui/lucide-icons";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

/* =========================
   InitiativeScreen
   ========================= */

const createEntity = (): Entity => ({
  id: Date.now().toString(),
  name: "",
  ac: 0,
  initiative: 0,
  hp: 0,
  maxHp: 0,
});

export default function InitiativeScreen() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [sliding, setIsSliding] = useState(false);

  const addEntity = () => {
    setEntities(e => [...e, createEntity()]);
  };

  const updateEntity = (id: string, patch: Partial<Entity>) => {
    setEntities(e =>
      e.map(ent => (ent.id === id ? { ...ent, ...patch } : ent))
    );
  };

  const removeEntity = (id: string) => {
    setEntities(e => e.filter(ent => ent.id !== id));
  };

  const clearAll = () => {
    setEntities([]);
  };

  const recalcInitiative = () => {
    setEntities(e =>
      [...e].sort((a, b) => b.initiative - a.initiative)
    );
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Трекер инициативы</Text>

      <ScrollView ref={scrollRef} scrollEnabled={!sliding} style={{ marginTop: 16, flex: 1 }}>
        <View style={{ flexDirection: "column", gap: 12 }}>
          {entities.map((ent, i) => (
            <EntityCard onSlideStart={() => setIsSliding(true)} onSlideEnd={() => setIsSliding(false)} idx={i + 1} key={ent.id} entity={ent} updateEntity={updateEntity} removeEntity={removeEntity} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.nav}>
        <Pressable style={styles.button} onPress={addEntity}>
          <Plus color={"#fff"} />
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonRecalc]}
          onPress={recalcInitiative}
        >
          <RefreshCw color={"#fff"} />
        </Pressable>

        <Pressable
          style={[styles.button, styles.danger]}
          onPress={clearAll}
        >
          <Trash color={"#fff"} />
        </Pressable>
      </View>
    </View>
  );
}

/* =========================
   Styles
   ========================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 26,
    paddingHorizontal: 12,
    backgroundColor: "#111",
  },
  title: {
    color: "#fff",
    fontSize: 22,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    gap: 32,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    zIndex: 10,
  },
  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 6,
  },
  buttonRecalc: {
    backgroundColor: "#267f4a"
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
});
