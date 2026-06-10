import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BASE_URL from '@/constants/api';
import { getToken } from '@/constants/auth';

export default function GoalsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';

  const GOALS = [
    { 
      id: 'lose_weight', 
      title: 'Lose Weight', 
      desc: 'Burn fat and get lean',
      icon: 'fire',
      colors: ['#f43f5e', '#be123c'] as const
    },
    { 
      id: 'build_muscle', 
      title: 'Build Muscle', 
      desc: 'Increase size and strength',
      icon: 'arm-flex',
      colors: ['#3b82f6', '#1d4ed8'] as const
    },
    { 
      id: 'get_fitter', 
      title: 'Get Fitter', 
      desc: 'Tone up and feel healthier',
      icon: 'heart-pulse',
      colors: ['#10b981', '#047857'] as const
    },
    { 
      id: 'improve_endurance', 
      title: 'Improve Endurance', 
      desc: 'Boost stamina and energy',
      icon: 'run-fast',
      colors: ['#f59e0b', '#b45309'] as const
    },
  ];

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
      
      const concernsStr = Array.isArray(params.areas_of_concern)
        ? params.areas_of_concern[0]
        : params.areas_of_concern;
        
      const parsedConcerns = concernsStr ? JSON.parse(concernsStr) : [];

      const payload = {
        fitness_level: params.fitnessLevel,
        training_location: params.trainingLocation,
        equipment_type: params.equipmentType,
        equipment: parsedEquipment,
        areas_of_concern: parsedConcerns,
        goal: selectedGoal
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

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: isDark ? '#000000' : '#f8fafc' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textPrimary }]}>What is your main goal?</Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          This helps us personalize your entire journey
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {GOALS.map((item) => {
            const isSelected = selectedGoal === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.goalCard,
                  { backgroundColor: cardBg, borderColor: isSelected ? item.colors[0] : cardBorder },
                  isSelected && { borderWidth: 2 }
                ]}
                onPress={() => setSelectedGoal(item.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? item.colors : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={styles.iconBox}
                >
                  <MaterialCommunityIcons 
                    name={item.icon as any} 
                    size={32} 
                    color={isSelected ? '#ffffff' : textSecondary} 
                  />
                </LinearGradient>
                <Text style={[styles.cardTitle, { color: isSelected ? item.colors[0] : textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.cardDesc, { color: textSecondary }]}>
                  {item.desc}
                </Text>
                
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <MaterialCommunityIcons name="check-circle" size={24} color={item.colors[0]} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: '#eab308' }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.btnText, { color: '#eab308' }]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#3b82f6' }, (isSaving || !selectedGoal) && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={isSaving || !selectedGoal}
        >
          <Text style={[styles.btnText, { color: '#ffffff' }]}>
            {isSaving ? 'Saving...' : 'Finish'}
          </Text>
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  grid: {
    gap: 16,
  },
  goalCard: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  checkIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 24,
    right: 24,
    backgroundColor: 'transparent',
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
