import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

interface GlassCardProps {
  title: string;
  icon: string;
  image: any; // Allow require() or {uri: ''}
  onPress: () => void;
  accentColor: string;
  size?: 'large' | 'small';
}

export function GlassCard({ title, icon, image, onPress, accentColor, size = 'large' }: GlassCardProps) {
  // We'll follow the user's provided design (Icon on left, Text in middle, Play button on right)
  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={{ borderRadius: 32 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
          style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
        />

        {/* Glass Overlay on Bottom Part - Matching the exact reference proportions */}
        <View style={styles.glassContainer}>
          <BlurView intensity={60} tint="dark" style={styles.blurView}>
            <View style={styles.content}>
              {/* Activity Icon - Dark circle on the left */}
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                <IconSymbol name={icon as any} size={26} color={accentColor} />
              </View>

              {/* Text Group - Middle */}
              <View style={styles.textContainer}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {title}
                </Text>
                <Text
                  style={styles.subtitle}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Tap to Start Session
                </Text>
              </View>

              {/* Play Button - Colorful circle on the right */}
              <View style={[styles.playBtn, { backgroundColor: accentColor }]}>
                <IconSymbol name="play.fill" size={24} color="black" />
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  glassContainer: {
    height: '50%',
    width: '100%',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 0,
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }
});
