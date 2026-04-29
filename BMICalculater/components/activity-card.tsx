import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ActivityCardProps {
  type: 'Outdoor Walk' | 'Outdoor Run' | 'Outdoor Cycle' | 'Hiking';
  onPress: () => void;
  isDark: boolean;
}

const { width } = Dimensions.get('window');

export function ActivityCard({ type, onPress, isDark }: ActivityCardProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'outdoor walk': return 'figure.walk';
      case 'outdoor run': return 'figure.run';
      case 'outdoor cycle': return 'figure.outdoor.cycle'; // Fallback if not available
      case 'hiking': return 'figure.hiking';
      default: return 'figure.run';
    }
  };

  const accentColor = '#a3e635'; // Vibrant Apple Fitness Green

  return (
    <TouchableOpacity 
        style={[styles.card, { backgroundColor: '#1c1c1e' }]} // Using dark Apple style by default for premium feel
        onPress={onPress}
        activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <IconSymbol name={getActivityIcon(type) as any} size={48} color={accentColor} />
          <Text style={styles.title}>{type}</Text>
        </View>
        
        <View style={styles.playBtnContainer}>
            <View style={[styles.playBtn, { backgroundColor: accentColor }]}>
                <IconSymbol name="play.fill" size={24} color="black" />
            </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
          <View style={styles.miniAction}>
            <IconSymbol name="flag.checkered" size={20} color={accentColor} />
          </View>
          <View style={styles.miniAction}>
            <IconSymbol name="timer" size={20} color={accentColor} />
          </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftCol: {
    gap: 12,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  playBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for depth
    shadowColor: '#a3e635',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniAction: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#2c2c2e',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
