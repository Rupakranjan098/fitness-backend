import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Platform, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BASE_URL from '@/constants/api';
import { getToken } from '@/constants/auth';

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [duration, setDuration] = useState(15);
  const [warmup, setWarmup] = useState(true);
  const [cooldown, setCooldown] = useState(true);
  const [cardio, setCardio] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);

  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const accent = '#4ade80'; // Green theme

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
        days_per_week: daysPerWeek,
        session_duration: duration,
        include_warmup: warmup,
        include_cooldown: cooldown,
        include_cardio: cardio
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
        Alert.alert('Success', 'Your training schedule has been saved!');
        router.push('/');
      } else {
        console.log('Failed to save', await response.text());
        router.push('/');
      }
    } catch (error) {
      console.log('Error saving schedule:', error);
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
          <Text style={[styles.title, { color: textPrimary }]}>Your <Text style={{ color: accent }}>Schedule</Text></Text>
          <View style={[styles.decorativeDashContainer, { transform: [{ scaleX: -1 }] }]}>
            <View style={[styles.decorativeDash, { backgroundColor: accent }]} />
            <View style={[styles.decorativeDash, { backgroundColor: accent, height: 8 }]} />
          </View>
        </View>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          We'll fit your workouts to your availability
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Days Per Week */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderLine}>
            <View style={styles.lineWithDot}>
              <View style={[styles.dot, { backgroundColor: accent }]} />
              <View style={[styles.line, { backgroundColor: accent }]} />
            </View>
            <Text style={[styles.sectionLabel, { color: accent }]}>DAYS PER WEEK</Text>
            <View style={styles.lineWithDot}>
              <View style={[styles.line, { backgroundColor: accent }]} />
              <View style={[styles.dot, { backgroundColor: accent }]} />
            </View>
          </View>
          
          <View style={styles.daysContainer}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isSelected = daysPerWeek === day;
              return (
                <View key={day} style={styles.dayWrapper}>
                  {isSelected ? <MaterialCommunityIcons name="menu-up" size={24} color={accent} style={styles.arrowIconTop} /> : <View style={styles.arrowSpacer} />}
                  
                  <TouchableOpacity
                    style={[
                      styles.dayCircle,
                      { backgroundColor: isSelected ? 'transparent' : cardBg },
                      isSelected && { borderColor: accent, shadowColor: accent, shadowOpacity: 0.5, shadowRadius: 15, shadowOffset: { width: 0, height: 0 }, elevation: 10 }
                    ]}
                    onPress={() => setDaysPerWeek(day)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dayText, { color: isSelected ? '#ffffff' : textSecondary }]}>{day}</Text>
                  </TouchableOpacity>
                  
                  {isSelected ? <MaterialCommunityIcons name="menu-down" size={24} color={accent} style={styles.arrowIconBottom} /> : <View style={styles.arrowSpacer} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Minutes Per Session */}
        <View style={[styles.section, styles.minutesCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          {/* Subtle dots background on the sides */}
          <View style={styles.dotsBgLeft}>
            {[...Array(20)].map((_, i) => <View key={`l-${i}`} style={[styles.bgDot, { backgroundColor: accent }]} />)}
          </View>
          <View style={styles.dotsBgRight}>
            {[...Array(20)].map((_, i) => <View key={`r-${i}`} style={[styles.bgDot, { backgroundColor: accent }]} />)}
          </View>

          <View style={styles.minutesHeader}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={accent} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Minutes per session</Text>
          </View>
          
          <View style={styles.durationRow}>
            <Text style={[styles.durationText, { color: accent }]}>{duration}</Text>
            <Text style={[styles.minText, { color: '#ffffff' }]}>min</Text>
          </View>
          
          <Slider
            style={{ width: '100%', height: 40, marginTop: 10 }}
            minimumValue={15}
            maximumValue={90}
            step={5}
            value={duration}
            onValueChange={(val) => setDuration(val)}
            minimumTrackTintColor={accent}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor="#ffffff"
          />
          <View style={styles.sliderLabels}>
            <Text style={{ color: textSecondary, fontSize: 12 }}>15 min</Text>
            <Text style={{ color: textSecondary, fontSize: 12 }}>90 min</Text>
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.togglesContainer}>
          <View style={[styles.toggleRow, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.toggleLeft}>
              <MaterialCommunityIcons name="fire" size={20} color={accent} style={{ marginRight: 12 }} />
              <Text style={[styles.toggleText, { color: textPrimary }]}>Include Warmup</Text>
            </View>
            <Switch
              value={warmup}
              onValueChange={setWarmup}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: accent }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.toggleRow, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.toggleLeft}>
              <MaterialCommunityIcons name="snowflake" size={20} color="#38bdf8" style={{ marginRight: 12 }} />
              <Text style={[styles.toggleText, { color: textPrimary }]}>Include Cooldown</Text>
            </View>
            <Switch
              value={cooldown}
              onValueChange={setCooldown}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: accent }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.toggleRow, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.toggleLeft}>
              <MaterialCommunityIcons name="heart" size={20} color="#fb7185" style={{ marginRight: 12 }} />
              <Text style={[styles.toggleText, { color: textPrimary }]}>Include Cardio</Text>
            </View>
            <Switch
              value={cardio}
              onValueChange={setCardio}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: accent }}
              thumbColor="#ffffff"
            />
          </View>
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
          style={[styles.btn, styles.btnNext, { backgroundColor: accent }, isSaving && { opacity: 0.7 }]}
          onPress={handleNext}
          disabled={isSaving}
        >
          <Text style={[styles.btnText, { color: '#000000', marginRight: 8 }]}>
            {isSaving ? 'Saving...' : 'Next'}
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 12,
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
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  lineWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 1,
    width: 40,
    opacity: 0.6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginHorizontal: 15,
    letterSpacing: 1,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 10,
  },
  dayWrapper: {
    alignItems: 'center',
  },
  arrowSpacer: {
    height: 24,
  },
  arrowIconTop: {
    marginBottom: -6,
  },
  arrowIconBottom: {
    marginTop: -6,
  },
  dayCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
  },
  minutesCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  dotsBgLeft: {
    position: 'absolute',
    left: 20,
    top: 40,
    bottom: 40,
    width: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    opacity: 0.2,
  },
  dotsBgRight: {
    position: 'absolute',
    right: 20,
    top: 40,
    bottom: 40,
    width: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    opacity: 0.2,
  },
  bgDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  minutesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 10,
  },
  durationText: {
    fontSize: 64,
    fontWeight: '800',
    textShadowColor: 'rgba(74, 222, 128, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  minText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 5,
  },
  togglesContainer: {
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
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

