import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function GymScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  
  // Custom Icon component for levels
  const LevelIcon = ({ level }: { level: string }) => {
    if (level === 'Beginner') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(132, 204, 22, 0.15)' }]}>
          <IconSymbol name="figure.walk" size={24} color="#84cc16" />
        </View>
      );
    } else if (level === 'Intermediate') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
          <IconSymbol name="figure.run" size={24} color="#3b82f6" />
        </View>
      );
    } else {
      return (
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
          <IconSymbol name="flame.fill" size={24} color="#eab308" />
        </View>
      );
    }
  };

  const LEVELS = [
    {
      id: 'Beginner',
      title: 'Beginner',
      description: 'New to exercise or returning after a long break'
    },
    {
      id: 'Intermediate',
      title: 'Intermediate',
      description: 'Regular exerciser (6+ months consistent)'
    },
    {
      id: 'Advanced',
      title: 'Advanced',
      description: 'Experienced athlete (2+ years consistent)'
    }
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: isDark ? '#000000' : '#f8fafc' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textPrimary }]}>Fitness Level</Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          This affects weight recommendations and exercise selection
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.optionCard,
              { backgroundColor: cardBg, borderColor: selectedLevel === level.id ? '#84cc16' : cardBorder },
              selectedLevel === level.id && { borderWidth: 2 }
            ]}
            onPress={() => setSelectedLevel(level.id)}
            activeOpacity={0.7}
          >
            <LevelIcon level={level.id} />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: textPrimary }]}>{level.title}</Text>
              <Text style={[styles.optionDesc, { color: textSecondary }]}>{level.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: cardBorder }]} 
          onPress={() => router.back()}
        >
          <Text style={[styles.btnText, { color: '#eab308' }]}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: '#84cc16' }]} 
          onPress={() => {
            if (selectedLevel) {
              // Proceed to next screen or update user profile
              router.back(); // For now just go back
            }
          }}
          disabled={!selectedLevel}
        >
          <Text style={[styles.btnText, { color: '#000000' }, !selectedLevel && { opacity: 0.5 }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
  barShort: {
    height: 12,
  },
  barMedium: {
    height: 18,
  },
  barTall: {
    height: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  optionDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 120,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  }
});
