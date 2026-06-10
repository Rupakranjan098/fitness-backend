import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Appearance,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter, useFocusEffect } from 'expo-router';
import BASE_URL from '@/constants/api';
import { getToken, getUser, saveAuth, AuthUser } from '@/constants/auth';
import { RunningManLoader } from '@/components/RunningManLoader';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [recentWorkout, setRecentWorkout] = useState<any>(null);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/dashboard`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setWaterGlasses(data.hydration);
        setRecentWorkout(data.recent_workout);
        await saveAuth(token, data.user);
      }
    } catch (err) {
      console.log('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Instantly load local user for fast UI update
      getUser().then(localUser => {
        if (localUser) setUser(localUser);
      });
      // Fetch fresh data from API
      fetchUserData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, []);

  const handleHydrationUpdate = async (newAmount: number) => {
    if (newAmount < 0 || newAmount > 20) return;

    // Optimistic UI update
    setWaterGlasses(newAmount);

    try {
      const token = await getToken();
      await fetch(`${BASE_URL}/hydration-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ glasses: newAmount })
      });
    } catch (error) {
      console.log("Error updating hydration:", error);
    }
  };

  const toggleTheme = () => {
    Appearance.setColorScheme(isDark ? 'light' : 'dark');
  };

  // ─── Dynamic theme values (BLUE Accent to match Login/Register) ───
  const bgGradient = isDark
    ? (['#000000', '#0a0a0a', '#111827'] as const)
    : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);
  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />
        <RunningManLoader visible={loading} message="Syncing your progress..." />
      </View>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primary} />
          }
        >

          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: textSecondary }]}>{greeting} 👋</Text>
              <Text style={[styles.userName, { color: textPrimary }]}>{user?.name ? user.name : 'Athlete'}</Text>
            </View>
            <TouchableOpacity style={[styles.headerBtn, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={toggleTheme}>
              <IconSymbol name={isDark ? "sun.max.fill" : "moon.fill"} size={20} color={primary} />
            </TouchableOpacity>
          </View>

          {/* Main Stats Card (Glassmorphic) */}
          <LinearGradient
            colors={[primary, primaryDeep]}
            style={styles.mainStatsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.weight || '0'}kg</Text>
              <Text style={styles.statLabel}>Weight</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.height || '0'}cm</Text>
              <Text style={styles.statLabel}>Height</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.age || '0'}y</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
          </LinearGradient>

          {/* Quick Actions Grid */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Health Metrics</Text>
          </View>

          <View style={styles.grid}>
            <TouchableOpacity style={[styles.gridCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/bmi')}>
              <LinearGradient colors={['#38bdf8', '#65a30d']} style={styles.gridIconBox}>
                <IconSymbol name="plus.app.fill" size={22} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.gridLabel, { color: textPrimary }]}>BMI Calc</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/workouts' as any)}>
              <LinearGradient colors={['#f472b6', '#db2777']} style={styles.gridIconBox}>
                <IconSymbol name="figure.run" size={22} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.gridLabel, { color: textPrimary }]}>Workouts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/nutrition')}>
              <LinearGradient colors={['#4ade80', '#16a34a']} style={styles.gridIconBox}>
                <IconSymbol name="leaf.fill" size={22} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.gridLabel, { color: textPrimary }]}>Nutrition</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/wellness')}>
              <LinearGradient colors={['#a78bfa', '#7c3aed']} style={styles.gridIconBox}>
                <IconSymbol name="figure.yoga" size={22} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.gridLabel, { color: textPrimary }]}>Wellness</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/sleep')}>
              <LinearGradient colors={['#818cf8', '#4f46e5']} style={styles.gridIconBox}>
                <IconSymbol name="moon.fill" size={22} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.gridLabel, { color: textPrimary }]}>Sleep</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/gym' as any)}>
              <LinearGradient colors={['#fb7185', '#e11d48']} style={styles.gridIconBox}>
                <IconSymbol name="figure.strengthtraining.traditional" size={22} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.gridLabel, { color: textPrimary }]}>GYM</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Daily Quick Check</Text>
          </View>

          {/* Hydration Tracker */}
          <View style={[styles.activityCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <LinearGradient colors={['#84cc16', '#2563eb']} style={styles.activityIconBox}>
              <IconSymbol name="drop.fill" size={20} color="#ffffff" />
            </LinearGradient>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityName, { color: textPrimary }]}>Hydration Goal</Text>
              <Text style={[styles.activitySub, { color: textSecondary }]}>{waterGlasses}/8 Glasses consumed</Text>
            </View>
            <View style={styles.waterControls}>
              <TouchableOpacity style={styles.controlBtn} onPress={() => handleHydrationUpdate(waterGlasses - 1)}>
                <IconSymbol name="minus" size={16} color={primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, { backgroundColor: primary }]} onPress={() => handleHydrationUpdate(waterGlasses + 1)}>
                <IconSymbol name="plus" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Workout Tracker */}
          <TouchableOpacity style={[styles.activityCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/outdoor-tracker' as any)}>
            <LinearGradient colors={['#fb7185', '#e11d48']} style={styles.activityIconBox}>
              <IconSymbol name="figure.walk" size={20} color="#ffffff" />
            </LinearGradient>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityName, { color: textPrimary }]}>
                {recentWorkout ? recentWorkout.type : 'Run Session'}
              </Text>
              <Text style={[styles.activitySub, { color: textSecondary }]}>
                {recentWorkout ? `Distance: ${recentWorkout.distance_km}km` : 'Start your morning tracking'}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={18} color={textSecondary} />
          </TouchableOpacity>

          {/* Today's Workout Plan (Links to new UI) */}
          <TouchableOpacity style={[styles.activityCard, { backgroundColor: cardBg, borderColor: cardBorder }]} onPress={() => router.push('/workout-detail' as any)}>
            <LinearGradient colors={['#4ade80', '#16a34a']} style={styles.activityIconBox}>
              <IconSymbol name="bolt.fill" size={20} color="#ffffff" />
            </LinearGradient>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityName, { color: textPrimary }]}>Today's Workout Plan</Text>
              <Text style={[styles.activitySub, { color: textSecondary }]}>Chest, Legs & Core • 28 Min</Text>
            </View>
            <IconSymbol name="chevron.right" size={18} color={textSecondary} />
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 15, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28
  },
  greeting: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  userName: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  headerBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },
  mainStatsCard: {
    borderRadius: 28, padding: 24,
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 30,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 12,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', marginTop: 4 },
  statDivider: { width: 1, height: 35, backgroundColor: 'rgba(255,255,255,0.2)' },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', marginBottom: 20
  },
  gridCard: {
    width: '48%', borderRadius: 24, padding: 16,
    alignItems: 'center', marginBottom: 16,
    borderWidth: 1,
  },
  gridIconBox: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  gridLabel: { fontSize: 14, fontWeight: '700' },
  activityCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 22, padding: 16, marginBottom: 12,
    borderWidth: 1,
  },
  activityIconBox: {
    width: 46, height: 46, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  activitySub: { fontSize: 12, fontWeight: '500' },
  waterControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controlBtn: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
