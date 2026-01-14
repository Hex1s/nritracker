import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Простой анимированный шестигранник из View-элементов,
// чтобы не тащить лишние зависимости и не усложнять машинный дух.

const HEX_SIZE = 80;

export const HexSplash: React.FC = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 900, easing: Easing.out(Easing.quad) }),
        withTiming(0.9, { duration: 900, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [rotation, scale]);

  const hexStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.hexContainer, hexStyle]}>
        <View style={[styles.hexagon, styles.hexagonBefore]} />
        <View style={[styles.hexagon, styles.hexagonMain]} />
        <View style={[styles.hexagon, styles.hexagonAfter]} />
      </Animated.View>

      <Text style={styles.title}>NRITracker</Text>
      <Text style={styles.subtitle}>Подготовка к бою...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#05050A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexContainer: {
    width: HEX_SIZE,
    height: HEX_SIZE * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  hexagon: {
    position: 'absolute',
    width: HEX_SIZE,
    height: HEX_SIZE / 2,
    backgroundColor: '#3B82F6',
  },
  hexagonMain: {
    top: HEX_SIZE / 4,
  },
  hexagonBefore: {
    top: 0,
    transform: [{ rotate: '60deg' }],
    opacity: 0.9,
  },
  hexagonAfter: {
    top: HEX_SIZE / 2,
    transform: [{ rotate: '-60deg' }],
    opacity: 0.9,
  },
  title: {
    color: '#E5E7EB',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 14,
  },
});

export default HexSplash;

