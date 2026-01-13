import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

const dices = [2, 4, 6, 8, 10, 12, 20, 100];

export default function DiceScreen() {
  const toast = useToast();
  const [count, setCount] = useState(1); 

  const rollDice = (dice: number, times: number) => {
    const results: number[] = [];
    for (let i = 0; i < times; i++) {
      const r = Math.floor(Math.random() * dice) + 1;
      results.push(r);
    }

    const messageJSX = (
    <View style={{
        backgroundColor: '#222',     
        borderRadius: 10,             
        padding: 12,                  
        borderWidth: 1,               
        borderColor: '#555',         
        flexDirection: 'row',        
        flexWrap: 'nowrap',            
        justifyContent: 'center',
        minWidth: 100
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            D{dice}:{' '}
        </Text>
        {results.map((r, i) => {
            let color = '#fff';
            if (r === dice) color = 'limegreen'; 
            if (r === 1) color = 'red';          
            return (
            <Text key={i} style={{ color, fontWeight: 'bold' }}>
                {r}{i < results.length - 1 ? ', ' : ''}
            </Text>
            );
        })}
        </View>
    );

  toast.show(messageJSX, { type: 'success' });
    
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Дайсы</Text>

      {/* Инпут с кнопками + / - */}
      <View style={styles.counterRow}>
        <Pressable
          style={styles.counterButton}
          onPress={() => setCount(Math.max(1, count - 1))}
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>
        <Text style={styles.counterValue}>{count}</Text>
        <Pressable
          style={styles.counterButton}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      {/* Кнопки для броска каждого кубика */}
      {dices.map((d, i) => (
        <View key={`${d}-${i}`} style={styles.card}>
          <Pressable style={styles.button} onPress={() => rollDice(d, count)}>
            <Text style={styles.buttonText}>D{d}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
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
  card: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    gap: 6,
  },
  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
    gap: 12,
  },
  counterButton: {
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  counterValue: {
    color: "#fff",
    fontSize: 18,
    minWidth: 30,
    textAlign: "center",
  },
});
