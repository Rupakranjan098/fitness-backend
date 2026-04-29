import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { WorkoutSummary } from '@/components/workout-summary';

const { width } = Dimensions.get('window');

export default function ActiveProgramScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title: string, duration: string, calories: string, color: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const title = params.title || 'Workout Session';
  const durationStr = params.duration || '30 min';
  const calories = params.calories || '250 kcal';
  const targetColor = params.color || '#ec4899';

  const totalMinutes = parseInt(durationStr.replace(/\D/g, '') || '30', 10);
  const totalSeconds = totalMinutes * 60;

  const [countdown, setCountdown] = useState<number | null>(3);
  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(new Date());

  useEffect(() => {
    // Initial Countdown
    const countTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev > 1) return prev - 1;
        clearInterval(countTimer);
        setIsRunning(true);
        startMainTimer();
        return null;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(countTimer);
    };
  }, []);

  const startMainTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePauseResume = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      startMainTimer();
    }
  };

  const handleFinish = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const now = new Date();
    const durationPlayed = totalSeconds - timeLeft;
    
    setSummaryData({
      type: title,
      duration: durationPlayed,
      activeCalories: parseInt(calories.replace(/\D/g, '') || '250', 10),
      totalCalories: Math.floor(parseInt(calories.replace(/\D/g, '') || '250', 10) * 1.25),
      startTime: startTimeRef.current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    
    setShowSummary(true);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const bgColor = isDark ? ['#0f172a', '#020617'] : ['#fce7f3', '#ffffff'];
  const textColor = isDark ? '#f8fafc' : '#1f2937';

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgColor as any} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <IconSymbol name="arrow.left" size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
            <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
           {countdown !== null ? (
             <View style={styles.centerBox}>
               <Text style={[styles.prepareText, { color: targetColor }]}>PREPARE</Text>
               <Text style={[styles.countdownText, { color: textColor }]}>{countdown}</Text>
             </View>
           ) : (
             <View style={styles.timerContainer}>
                <View style={styles.statsRow}>
                    <View style={styles.statLine}>
                        <IconSymbol name="flame.fill" size={16} color="#fb7185" />
                        <Text style={styles.statLabel}>Burn</Text>
                        <Text style={[styles.statValue, { color: textColor }]}>{calories}</Text>
                    </View>
                    <View style={styles.statLine}>
                        <IconSymbol name="clock.fill" size={16} color="#38bdf8" />
                        <Text style={styles.statLabel}>Goal</Text>
                        <Text style={[styles.statValue, { color: textColor }]}>{durationStr}</Text>
                    </View>
                </View>

                <View style={styles.progressCircleContainer}>
                    {/* Visual Progress Bar (linear in this case for simplicity but styled premium) */}
                    <View style={styles.timerDisplay}>
                        <Text style={[styles.timerValue, { color: textColor }]}>{formatTime(timeLeft)}</Text>
                        <Text style={styles.timeRemaining}>REMAINING</Text>
                    </View>
                </View>

                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: targetColor }]} />
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity 
                        style={[styles.controlBtn, isRunning ? styles.pauseBtn : styles.resumeBtn]} 
                        onPress={handlePauseResume}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.controlText}>{isRunning ? 'PAUSE' : 'RESUME'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.finishBtn} 
                        onPress={handleFinish}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.finishText}>FINISH</Text>
                    </TouchableOpacity>
                </View>
             </View>
           )}
        </View>
      </SafeAreaView>

      {summaryData && (
        <WorkoutSummary 
          visible={showSummary} 
          onClose={() => {
              setShowSummary(false);
              router.back();
          }} 
          data={summaryData} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  centerBox: { alignItems: 'center' },
  prepareText: { fontSize: 24, fontWeight: '900', letterSpacing: 4, marginBottom: 20 },
  countdownText: { fontSize: 140, fontWeight: '900' },
  
  timerContainer: { width: '100%', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 40, marginBottom: 60 },
  statLine: { alignItems: 'flex-start' },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  
  progressCircleContainer: { width: 280, height: 280, borderRadius: 140, borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 60 },
  timerDisplay: { alignItems: 'center' },
  timerValue: { fontSize: 84, fontWeight: '200', fontVariant: ['tabular-nums'] },
  timeRemaining: { fontSize: 14, fontWeight: '800', color: '#64748b', letterSpacing: 2 },
  
  progressBarBg: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, marginBottom: 80, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  
  controls: { flexDirection: 'row', width: '100%', gap: 16 },
  controlBtn: { flex: 1, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  resumeBtn: { backgroundColor: '#10b981' },
  pauseBtn: { backgroundColor: 'white' },
  controlText: { fontWeight: '800', color: 'black' },
  finishBtn: { flex: 1, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  finishText: { fontWeight: '800', color: '#ef4444' }
});
