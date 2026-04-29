import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

interface FeaturedWorkoutProps {
  title: string;
  subtitle: string;
  duration: string;
  calories: string;
  image: string;
  onPress: () => void;
}

export function FeaturedWorkout({ title, subtitle, duration, calories, image, onPress }: FeaturedWorkoutProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={{ borderRadius: 32 }}>
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']} 
          style={StyleSheet.absoluteFill} 
          locations={[0.2, 0.6, 1.0]}
          borderRadius={32}
        />
        
        <View style={styles.content}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>FEATURED WORKOUT</Text>
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <IconSymbol name="clock.fill" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statText}>{duration}</Text>
            </View>
            <View style={styles.stat}>
              <IconSymbol name="flame.fill" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statText}>{calories}</Text>
            </View>
          </View>

          <View style={styles.playBtn}>
             <IconSymbol name="play.fill" size={20} color="black" />
             <Text style={styles.playText}>Start Now</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 380,
    borderRadius: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 24,
  },
  tag: {
    backgroundColor: '#ec4899',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  playBtn: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
  },
  playText: {
    color: 'black',
    fontWeight: '800',
    fontSize: 15,
  }
});
