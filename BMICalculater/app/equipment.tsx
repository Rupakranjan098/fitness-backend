import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BASE_URL from '@/constants/api';
import { getToken } from '@/constants/auth';

export default function EquipmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fitnessLevel = params.fitnessLevel;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [trainingLocation, setTrainingLocation] = useState<'Home' | 'Gym'>('Home');
  const [equipmentType, setEquipmentType] = useState<'Body Weight Only' | 'I Have Equipment'>('I Have Equipment');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const accent = '#4ade80';

  const EQUIPMENT_LIST = [
    { id: 'dumbbells', title: 'Dumbbells', desc: 'Adjustable or fixed-weight pairs', image: require('@/assets/images/equipment/dumbbells.png') },
    { id: 'barbell', title: 'Barbell', desc: 'Olympic bar, EZ curl & plates', image: require('@/assets/images/equipment/barbell.png') },
    { id: 'kettlebell', title: 'Kettlebell', desc: 'Cast iron or competition bells', image: require('@/assets/images/equipment/kettlebell.png') },
    { id: 'cable', title: 'Cable Machine', desc: 'Adjustable pulley station', image: require('@/assets/images/equipment/cable.png') },
    { id: 'machines', title: 'Machines', desc: 'Selectorized weight stacks', image: require('@/assets/images/equipment/machines.png') },
  ];

  const toggleEquipment = (id: string) => {
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Saved locally', 'Equipment preferences updated!');
        router.push('/');
        return;
      }

      const response = await fetch(`${BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fitness_level: fitnessLevel,
          training_location: trainingLocation,
          equipment_type: equipmentType,
          equipment: selectedEquipment
        })
      });

      if (response.ok) {
        Alert.alert('Success', 'Your training preferences have been saved!');
        router.push('/');
      } else {
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
        <View style={styles.titleContainer}>
          <View style={styles.decorativeDashContainer}>
            <View style={[styles.decorativeDash, { backgroundColor: accent }]} />
            <View style={[styles.decorativeDash, { backgroundColor: accent, height: 8 }]} />
          </View>
          <Text style={[styles.title, { color: textPrimary }]}>Your <Text style={{ color: accent }}>Equipment</Text></Text>
          <View style={[styles.decorativeDashContainer, { transform: [{ scaleX: -1 }] }]}>
            <View style={[styles.decorativeDash, { backgroundColor: accent }]} />
            <View style={[styles.decorativeDash, { backgroundColor: accent, height: 8 }]} />
          </View>
        </View>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          We'll only suggest exercises that fit your setup
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>Where do you train?</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, trainingLocation === 'Home' ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: 'transparent' }]}
              onPress={() => setTrainingLocation('Home')}
            >
              <Text style={[styles.toggleText, { color: textPrimary }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, trainingLocation === 'Gym' ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: 'transparent' }]}
              onPress={() => setTrainingLocation('Gym')}
            >
              <Text style={[styles.toggleText, { color: textPrimary }]}>Gym</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>Equipment</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, equipmentType === 'Body Weight Only' ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: 'transparent' }]}
              onPress={() => setEquipmentType('Body Weight Only')}
            >
              <Text style={[styles.toggleText, { color: textPrimary }]}>Body Weight Only</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, equipmentType === 'I Have Equipment' ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: 'transparent' }]}
              onPress={() => setEquipmentType('I Have Equipment')}
            >
              <Text style={[styles.toggleText, { color: textPrimary }]}>I Have Equipment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {equipmentType === 'I Have Equipment' ? (
          <View style={styles.equipmentList}>
            {EQUIPMENT_LIST.map((item) => {
              const isSelected = selectedEquipment.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.equipmentCard,
                    { backgroundColor: cardBg, borderColor: isSelected ? accent : cardBorder },
                    isSelected && { borderWidth: 1.5 }
                  ]}
                  onPress={() => toggleEquipment(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, isSelected && { backgroundColor: 'rgba(74, 222, 128, 0.2)' }]}>
                    <Image source={item.image} style={{ width: 48, height: 48, borderRadius: 14 }} resizeMode="cover" />
                  </View>
                  <View style={styles.equipmentText}>
                     <Text style={[styles.equipmentTitle, { color: textPrimary }]}>{item.title}</Text>
                     <Text style={[styles.equipmentDesc, { color: textSecondary }]}>{item.desc}</Text>
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
        ) : (
          <View style={styles.bodyWeightContainer}>
            <LinearGradient
              colors={['rgba(74, 222, 128, 0.15)', 'rgba(22, 163, 74, 0.05)']}
              style={[styles.bodyWeightCard, { borderColor: isDark ? 'rgba(74, 222, 128, 0.3)' : 'rgba(74, 222, 128, 0.6)' }]}
            >
              <View style={styles.bodyWeightIconWrapper}>
                <Image source={require('@/assets/images/equipment/bodyweight.png')} style={styles.bodyWeightImage} resizeMode="cover" />
              </View>
              <Text style={[styles.bodyWeightTitle, { color: accent }]}>Pure Calisthenics</Text>
              <Text style={[styles.bodyWeightText, { color: textPrimary }]}>
                No gym? No problem.{'\n'}Your body is your best tool.
              </Text>
            </LinearGradient>
          </View>
        )}
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
          style={[styles.btn, styles.btnNext, { backgroundColor: accent }, isSaving && { opacity: 0.7 }]}
          onPress={() => {
            // We'll pass the state forward instead of saving here
            router.push({
              pathname: '/concerns',
              params: {
                fitnessLevel,
                trainingLocation,
                equipmentType,
                equipment: JSON.stringify(selectedEquipment)
              }
            });
          }}
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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bodyWeightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  bodyWeightCard: {
    width: '100%',
    padding: 30,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
  },
  bodyWeightIconWrapper: {
    padding: 4,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 40,
    marginBottom: 20,
  },
  bodyWeightImage: {
    width: 140,
    height: 140,
    borderRadius: 36,
  },
  bodyWeightTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bodyWeightText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    opacity: 0.9,
  },
  equipmentList: {
    gap: 12,
  },
  equipmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  equipmentText: {
    flex: 1,
  },
  equipmentTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  equipmentDesc: {
    fontSize: 13,
  },
  checkIcon: {
    marginLeft: 10,
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
