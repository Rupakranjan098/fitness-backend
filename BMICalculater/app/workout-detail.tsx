import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg = isDark ? '#000000' : '#f8fafc';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  
  // App Theme color (Green)
  const accent = '#4ade80';

  const WARMUP_EXERCISES = [
    { id: '1', title: 'Inchworm', time: '30s', icon: 'human-handsdown' },
    { id: '2', title: 'Ankle Circles', time: '20s', icon: 'human' },
    { id: '3', title: 'Calf Raises', time: '20s', icon: 'human-male-height' },
  ];

  const WORKOUT_EXERCISES = [
    { id: '1', title: 'Incline Push-up', sets: '4 sets', reps: '12 reps', icon: 'human-handsup' },
    { id: '2', title: 'Forward Lunge', sets: '3 sets', reps: '14 reps / side', icon: 'human-male' },
    { id: '3', title: 'Bench Hip Extension', sets: '3 sets', reps: '18 reps', icon: 'human-handsdown' },
    { id: '4', title: 'Air Bike', sets: '3 sets', reps: '17 reps', icon: 'bike' },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Workout 1</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Block */}
        <View style={styles.titleBlock}>
          <Text style={[styles.mainTitle, { color: textPrimary }]}>Chest, Legs & Core</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            Day 1 of 2 • Weight Loss • ~28 min
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="lightning-bolt" size={16} color={textSecondary} />
              <Text style={[styles.statText, { color: textSecondary }]}>4 Exercises</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={textSecondary} />
              <Text style={[styles.statText, { color: textSecondary }]}>28 Min</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={16} color={textSecondary} />
              <Text style={[styles.statText, { color: textSecondary }]}>121 Cal</Text>
            </View>
          </View>
        </View>

        {/* WARMUP SECTION */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="fire" size={22} color="#f97316" style={{ marginRight: 8 }} />
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Warmup</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2 min</Text>
            </View>
          </View>
          <Text style={[styles.cardSubtitle, { color: textSecondary }]}>3 movements • 2 rounds <MaterialCommunityIcons name="chevron-down" size={14} /></Text>

          <View style={styles.exerciseList}>
            {WARMUP_EXERCISES.map((item, index) => (
              <View key={item.id} style={styles.exerciseItem}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={30} color={textPrimary} />
                </View>
                <Text style={[styles.exerciseTitle, { color: textSecondary }]}>{item.title}</Text>
                <Text style={[styles.exerciseValue, { color: textSecondary }]}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* DIVIDER: WORKOUT */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: cardBorder }]} />
          <Text style={[styles.dividerText, { color: textSecondary }]}>WORKOUT</Text>
          <View style={[styles.dividerLine, { backgroundColor: cardBorder }]} />
        </View>

        {/* WORKOUT SECTION */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.exerciseList}>
            {WORKOUT_EXERCISES.map((item, index) => (
              <View key={item.id} style={styles.workoutItemContainer}>
                {index !== WORKOUT_EXERCISES.length - 1 && (
                  <View style={[styles.connectingLine, { backgroundColor: cardBorder }]} />
                )}
                <View style={styles.workoutItem}>
                  <View style={[styles.iconBoxLarge, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={40} color={textPrimary} />
                  </View>
                  <View style={styles.workoutTextContainer}>
                    <Text style={[styles.workoutTitle, { color: textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.workoutSubtitle, { color: textSecondary }]}>
                      {item.sets} • {item.reps}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="dots-horizontal" size={20} color={textSecondary} />
                </View>
                {index !== WORKOUT_EXERCISES.length - 1 && <View style={[styles.itemSeparator, { backgroundColor: cardBorder }]} />}
              </View>
            ))}
          </View>
        </View>

        {/* DIVIDER: RECOVERY */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: cardBorder }]} />
          <Text style={[styles.dividerText, { color: textSecondary }]}>RECOVERY</Text>
          <View style={[styles.dividerLine, { backgroundColor: cardBorder }]} />
        </View>

        {/* COOLDOWN SECTION */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="snowflake" size={22} color="#38bdf8" style={{ marginRight: 8 }} />
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Cooldown</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Text style={[styles.badgeText, { color: '#38bdf8' }]}>1 min</Text>
            </View>
          </View>
          <Text style={[styles.cardSubtitle, { color: textSecondary, marginTop: 12 }]}>2 stretches <MaterialCommunityIcons name="chevron-right" size={14} /></Text>
        </View>

      </ScrollView>

      {/* Start Workout Button - Styled like Schedule Next Button with App Theme */}
      <View style={[styles.footer, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(248,250,252,0.8)' }]}>
        <TouchableOpacity 
          style={[styles.btnNext, { backgroundColor: accent }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, { color: '#000000', marginRight: 8 }]}>Start Workout</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Fake Tab Bar (Optional, to match design exactly if requested) */}
      <View style={[styles.tabBar, { backgroundColor: isDark ? '#111' : '#fff', borderTopColor: cardBorder }]}>
        <View style={styles.tabItem}>
          <View style={styles.activeTabIndicator}>
            <MaterialCommunityIcons name="white-balance-sunny" size={24} color="#eab308" />
          </View>
          <Text style={[styles.tabLabel, { color: '#eab308' }]}>Today</Text>
        </View>
        <View style={styles.tabItem}>
          <MaterialCommunityIcons name="dumbbell" size={24} color={textSecondary} />
          <Text style={[styles.tabLabel, { color: textSecondary }]}>Workout</Text>
        </View>
        <View style={styles.tabItem}>
          <MaterialCommunityIcons name="chart-line-variant" size={24} color={textSecondary} />
          <Text style={[styles.tabLabel, { color: textSecondary }]}>Progress</Text>
        </View>
        <View style={styles.tabItem}>
          <MaterialCommunityIcons name="cog" size={24} color={textSecondary} />
          <Text style={[styles.tabLabel, { color: textSecondary }]}>Settings</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 160, // Space for fixed button + fake tabs
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
  },
  exerciseList: {
    gap: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  exerciseValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  workoutItemContainer: {
    position: 'relative',
  },
  connectingLine: {
    position: 'absolute',
    left: 32,
    top: 64,
    bottom: -16,
    width: 2,
    zIndex: 0,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  iconBoxLarge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutTextContainer: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
  },
  itemSeparator: {
    height: 1,
    marginLeft: 80,
    marginTop: 16,
    marginBottom: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 80, // Above the fake tab bar
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  btnNext: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  activeTabIndicator: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  }
});
