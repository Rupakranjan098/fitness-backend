import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';

export default function RunTrackerScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0); // in km
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
        setDistance(d => d + 0.003); // fake GPS distance bump
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleRun = () => setIsRunning(!isRunning);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const bgColor = isDark ? ['#0f172a', '#020617'] : ['#f8fafc', '#f1f5f9', '#e2e8f0'];
  const textColorPrimary = isDark ? '#f8fafc' : '#1f2937';
  const textColorSecondary = isDark ? '#94a3b8' : '#6b7280';
  const accentColor = '#65a30d';

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgColor as any} style={StyleSheet.absoluteFillObject} />
      
      {/* Mock Map Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <Image 
          source={{ uri: "https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" }} 
          style={styles.mapMock} 
          contentFit="cover"
        />
        <LinearGradient 
          colors={isDark ? ['transparent', '#0f172a', '#020617'] : ['transparent', 'rgba(240,249,255,0.8)', '#ffffff']} 
          style={StyleSheet.absoluteFillObject}
          locations={[0, 0.4, 0.8]}
        />
      </View>

      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : '#ffffff' }]} 
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left" size={20} color={textColorPrimary} />
          </TouchableOpacity>
          <View style={[styles.gpsBadge, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : '#ffffff' }]}>
            <IconSymbol name="location.fill" size={14} color="#10b981" />
            <Text style={[styles.gpsText, { color: textColorPrimary }]}>GPS Signal Good</Text>
          </View>
        </View>

        <View style={styles.dashboard}>
          <Text style={[styles.durationLabel, { color: textColorSecondary }]}>DURATION</Text>
          <Text style={[styles.timeText, { color: textColorPrimary }]}>{formatTime(seconds)}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: textColorPrimary }]}>{distance.toFixed(2)}</Text>
              <Text style={[styles.statLabel, { color: textColorSecondary }]}>KM</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: textColorPrimary }]}>{(distance > 0 ? (seconds / 60) / distance : 0).toFixed(1)}</Text>
              <Text style={[styles.statLabel, { color: textColorSecondary }]}>MIN/KM</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: textColorPrimary }]}>{Math.floor(distance * 65)}</Text>
              <Text style={[styles.statLabel, { color: textColorSecondary }]}>KCAL</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: isRunning ? '#ef4444' : accentColor }]} 
            onPress={toggleRun}
            activeOpacity={0.8}
          >
            <IconSymbol name={isRunning ? "pause.fill" : "play.fill"} size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapMock: { width: '100%', height: '100%', opacity: 0.6 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 30 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  gpsBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6 },
  gpsText: { fontSize: 13, fontWeight: '700' },
  
  dashboard: { paddingHorizontal: 32, paddingBottom: 60, alignItems: 'center' },
  durationLabel: { fontSize: 14, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  timeText: { fontSize: 80, fontWeight: '300', fontVariant: ['tabular-nums'], marginBottom: 40 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 50 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  divider: { width: 1, height: '100%' },
  
  actionBtn: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }
});
