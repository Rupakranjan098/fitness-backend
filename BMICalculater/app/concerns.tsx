import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BASE_URL from '@/constants/api';
import { getToken } from '@/constants/auth';

export default function ConcernsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const accent = '#4ade80'; // Main app theme (Green)
  const danger = '#fb7185'; // Semantic color for concerns (Rose)

  const CONCERNS = [
    { id: 'knee', title: 'Knee' },
    { id: 'shoulder', title: 'Shoulder' },
    { id: 'lower_back', title: 'Lower Back' },
    { id: 'wrist', title: 'Wrist' },
    { id: 'ankle', title: 'Ankle' },
    { id: 'hip', title: 'Hip' },
    { id: 'neck', title: 'Neck' },
    { id: 'elbow', title: 'Elbow' },
  ];

  const toggleConcern = (id: string) => {
    if (id === 'none') {
      setSelectedConcerns(['none']);
      return;
    }
    
    setSelectedConcerns(prev => {
      const withoutNone = prev.filter(item => item !== 'none');
      if (withoutNone.includes(id)) {
        return withoutNone.filter(item => item !== id);
      } else {
        return [...withoutNone, id];
      }
    });
  };

  const handleNext = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Saved locally', 'Preferences updated!');
        router.push('/');
        return;
      }

      const equipmentStr = Array.isArray(params.equipment) 
        ? params.equipment[0] 
        : params.equipment;
        
      const parsedEquipment = equipmentStr ? JSON.parse(equipmentStr) : [];

      const payload = {
        fitness_level: params.fitnessLevel,
        training_location: params.trainingLocation,
        equipment_type: params.equipmentType,
        equipment: parsedEquipment,
        areas_of_concern: selectedConcerns
      };

      const response = await fetch(`${BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Alert.alert('Success', 'Your training preferences have been saved!');
        router.push('/');
      } else {
        console.log('Failed to save', await response.text());
        router.push('/');
      }
    } catch (error) {
      console.log('Error saving preferences:', error);
      router.push('/');
    } finally {
      setIsSaving(false);
    }
  };

  const isNone = selectedConcerns.includes('none');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: isDark ? '#000000' : '#f8fafc' }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.decorativeDashContainer}>
            <View style={[styles.decorativeDash, { backgroundColor: accent }]} />
            <View style={[styles.decorativeDash, { backgroundColor: accent, height: 8 }]} />
          </View>
          <Text style={[styles.title, { color: textPrimary }]}>Areas of <Text style={{ color: accent }}>Concern?</Text></Text>
          <View style={[styles.decorativeDashContainer, { transform: [{ scaleX: -1 }] }]}>
            <View style={[styles.decorativeDash, { backgroundColor: accent }]} />
            <View style={[styles.decorativeDash, { backgroundColor: accent, height: 8 }]} />
          </View>
        </View>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          We'll choose exercises that are gentler on these areas
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity
          style={[styles.noneCardWrapper]}
          onPress={() => toggleConcern('none')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isNone ? ['rgba(74, 222, 128, 0.2)', 'rgba(22, 163, 74, 0.05)'] : [cardBg, cardBg]}
            style={[styles.noneCard, { borderColor: isNone ? accent : cardBorder, borderWidth: isNone ? 2 : 1 }]}
          >
            <View style={[styles.iconWrapper, { backgroundColor: isNone ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.05)' }]}>
              <MaterialCommunityIcons 
                name={isNone ? "shield-check" : "shield-outline"} 
                size={24} 
                color={isNone ? accent : textSecondary} 
              />
            </View>
            <Text style={[styles.noneCardTitle, { color: isNone ? accent : textPrimary }]}>
              None — I'm all good
            </Text>
            {isNone && <MaterialCommunityIcons name="check-circle" size={24} color={accent} style={styles.checkIcon} />}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.grid}>
          {CONCERNS.map((item) => {
            const isSelected = selectedConcerns.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.gridCardWrapper}
                onPress={() => toggleConcern(item.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? ['rgba(251, 113, 133, 0.2)', 'rgba(225, 29, 72, 0.05)'] : [cardBg, cardBg]}
                  style={[styles.gridCard, { borderColor: isSelected ? danger : cardBorder, borderWidth: isSelected ? 2 : 1 }]}
                >
                  <View style={[styles.dot, { backgroundColor: isSelected ? danger : textSecondary, opacity: isSelected ? 1 : 0.2, transform: [{ scale: isSelected ? 1.5 : 1 }] }]} />
                  <Text style={[styles.cardTitle, { color: isSelected ? danger : textPrimary }]}>
                    {item.title}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnBack, { borderColor: accent }]}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={textPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.btnText, { color: textPrimary }]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnNext, { backgroundColor: accent }, (isSaving || selectedConcerns.length === 0) && { opacity: 0.5 }]}
          onPress={() => {
            router.push({
              pathname: '/schedule',
              params: {
                ...params,
                areas_of_concern: JSON.stringify(selectedConcerns)
              }
            });
          }}
          disabled={isSaving || selectedConcerns.length === 0}
        >
          <Text style={[styles.btnText, { color: '#000000', marginRight: 8 }]}>
            Next
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
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
  },
  noneCardWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  noneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  noneCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCardWrapper: {
    width: '48%',
  },
  gridCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    borderRadius: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 24,
    right: 24,
    backgroundColor: 'transparent',
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
