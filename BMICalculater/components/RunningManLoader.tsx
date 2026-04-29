import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { IconSymbol } from './ui/icon-symbol';

const { width, height } = Dimensions.get('window');

interface RunningManLoaderProps {
  visible: boolean;
  message?: string;
}

const RING_ICONS = [
  { name: 'timer' as any, color: '#38bdf8' },
  { name: 'drop.fill' as any, color: '#60a5fa' },
  { name: 'leaf.fill' as any, color: '#4ade80' },
  { name: 'moon.fill' as any, color: '#8b5cf6' },
  { name: 'heart.fill' as any, color: '#f43f5e' },
  { name: 'scalemass.fill' as any, color: '#f59e0b' },
];

export const RunningManLoader: React.FC<RunningManLoaderProps> = ({ visible, message = "Loading..." }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) });
      rotation.value = withRepeat(
        withTiming(1, {
          duration: 4000,
          easing: Easing.linear
        }),
        -1,
        false
      );
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.9, { duration: 300 });
    }
  }, [visible]);

  const ringStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 360]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const iconBaseStyle = (index: number, radius: number) => {
    const angle = (index * 60) * (Math.PI / 180);
    return {
      position: 'absolute' as const,
      left: Math.cos(angle) * radius + 110 - 16,
      top: Math.sin(angle) * radius + 110 - 16,
    };
  };

  const counterRotationStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, -360]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={isDark ? 30 : 60} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />

        <Animated.View style={[styles.canvas, containerStyle]}>
          {/* Rotating Ring with Icons */}
          <Animated.View style={[styles.ringContainer, ringStyle]}>
            <View style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 6, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(14,165,233,0.05)' }} />

            <LinearGradient
              colors={['#0ea5e9', '#4ade80', 'transparent']}
              style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 3, opacity: 0.2 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {RING_ICONS.map((icon, i) => (
              <View key={i} style={iconBaseStyle(i, 110)}>
                <Animated.View style={[styles.iconCircle, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }, counterRotationStyle]}>
                  <IconSymbol name={icon.name} size={18} color={icon.color} />
                </Animated.View>
              </View>
            ))}
          </Animated.View>

          {/* Central Runner */}
          <View style={styles.runnerContainer}>
            <Image
              source={require('../assets/images/runner_loader.png')}
              style={styles.runnerImg}
              contentFit="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.content}>
            <Text style={[styles.message, { color: isDark ? '#ffffff' : '#0ea5e9' }]}>{message}</Text>
            <View style={styles.dotsRow}>
              {[0, 1, 2].map(i => (
                <View key={i} style={[styles.dot, { backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(14,165,233,0.3)' }]} />
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  canvas: {
    width: 300,
    height: 450,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  runnerContainer: {
    width: 160,
    height: 160,
    position: 'absolute',
    top: 120,
    zIndex: 10,
  },
  runnerImg: {
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  message: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
