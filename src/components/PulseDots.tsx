import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function PulseDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createAnimation = (anim: Animated.Value) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        ])
      );
    };

    createAnimation(dot1).start();
    setTimeout(() => createAnimation(dot2).start(), 200);
    setTimeout(() => createAnimation(dot3).start(), 400);
  }, [dot1, dot2, dot3]);

  const Dot = ({ anim }: { anim: Animated.Value }) => (
    <Animated.View style={[
      styles.dot, 
      { 
        opacity: anim,
        transform: [{ scale: anim.interpolate({ inputRange: [0.3, 1], outputRange: [1, 1.3] }) }]
      }
    ]} />
  );

  return (
    <View style={styles.container}>
      <Dot anim={dot1} />
      <Dot anim={dot2} />
      <Dot anim={dot3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B2E3A' },
});