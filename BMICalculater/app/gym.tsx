import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function GymScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const accent = '#4ade80';

  // Custom Icon component for levels
  const LevelIcon = ({ level, isSelected }: { level: string, isSelected: boolean }) => {
    if (level === 'Beginner') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: isSelected ? 'rgba(74, 222, 128, 0.2)' : 'rgba(132, 204, 22, 0.15)' }]}>
          <IconSymbol name="figure.walk" size={24} color={isSelected ? accent : "#84cc16"} />
        </View>
      );
    } else if (level === 'Intermediate') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: isSelected ? 'rgba(74, 222, 128, 0.2)' : 'rgba(59, 130, 246, 0.15)' }]}>
          <IconSymbol name="figure.run" size={24} color={isSelected ? accent : "#3b82f6"} />
        </View>
      );
    } else {
      return (
        <View style={[styles.iconContainer, { backgroundColor: isSelected ? 'rgba(74, 222, 128, 0.2)' : 'rgba(234, 179, 8, 0.15)' }]}>
          <IconSymbol name="flame.fill" size={24} color={isSelected ? accent : "#eab308"} />
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
        <View style={styles.titleContainer}>
          <View style={styles.decorativeDashContainer}>
            <View style={[styles.decorativeDash, { backgroundColor: accent }]} />
            <View style={[styles.decorativeDash, { backgroundColor: accent, height: 8 }]} />
          </View>
          <Text style={[styles.title, { color: textPrimary }]}>Fitness <Text style={{ color: accent }}>Level</Text></Text>
          <View style={[styles.decorativeDashContainer, { transform: [{ scaleX: -1 }] }]}>
            <View style={[styles.decorativeDash, { backgroundColor: accent }]} />
            <View style={[styles.decorativeDash, { backgroundColor: accent, height: 8 }]} />
          </View>
        </View>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          This affects weight recommendations and exercise selection
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.optionCard,
                { backgroundColor: cardBg, borderColor: isSelected ? accent : cardBorder },
                isSelected && { borderWidth: 2 }
              ]}
              onPress={() => setSelectedLevel(level.id)}
              activeOpacity={0.7}
            >
              <LevelIcon level={level.id} isSelected={isSelected} />
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: textPrimary }]}>{level.title}</Text>
                <Text style={[styles.optionDesc, { color: textSecondary }]}>{level.description}</Text>
              </View>
              {isSelected && (
                <View style={styles.checkIcon}>
                  <MaterialCommunityIcons name="check-circle" size={24} color={accent} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnBack, { borderColor: accent }]}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={textPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.btnText, { color: textPrimary }]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnNext, { backgroundColor: accent }, !selectedLevel && { opacity: 0.5 }]}
          onPress={() => {
            if (selectedLevel) {
              router.push({ pathname: '/equipment', params: { fitnessLevel: selectedLevel } });
            }
          }}
          disabled={!selectedLevel}
        >
          <Text style={[styles.btnText, { color: '#000000', marginRight: 8 }]}>Next</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#000000" />
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  decorativeDashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    transform: [{ skewX: '-20deg' }],
  },
  decorativeDash: {
    width: 6,
    height: 12,
    borderRadius: 2,
    opacity: 0.8,
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
  checkIcon: {
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    gap: 16,
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnBack: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  btnNext: {
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
