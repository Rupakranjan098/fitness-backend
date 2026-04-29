import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { WorkoutSummary } from '@/components/workout-summary';

// This screen represents the active exercise session with a countdown, timer, and controls for pausing/resuming and finishing the workout. It also includes an animation demonstrating the exercise being performed. The design is modern and clean, with dynamic theming based on the user's color scheme preference.
export default function ActiveExerciseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string, title: string, duration: string, calories: string, icon: string, color: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const title = params.title || 'Exercise';
  const durationStr = params.duration || '5 min';
  const calories = params.calories || '50 kcal';
  const targetColor = params.color || (isDark ? '#65a30d' : '#0284c7');
  const icon = (params.icon || 'flame.fill') as any;

  // Animation source for training demonstration
  const animationSource = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzM5ZTQ0MGI3MGJhZGNmOTJlNGIwNjBhYTUzZWUyNmU5ODRkZTkzNCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7Tqus8PZtBqZ1w9i/giphy.gif"; // Using placeholder GIF as muscle training animation

  // Extract base minutes
  const totalMinutes = parseInt(durationStr.replace(/\D/g, '') || '5', 10);
  const totalSeconds = totalMinutes * 60;

  // Timer states
  const [countdown, setCountdown] = useState<number | null>(3);
  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(new Date());

  useEffect(() => {
    // Initial Countdown logic
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev > 1) return prev - 1;
        
        // Start main timer
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(true);
        startMainTimer();
        return null; // hide countdown
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startMainTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
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
      if (timeLeft > 0) {
        setIsRunning(true);
        startMainTimer();
      }
    }
  };

  const handleFinish = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const now = new Date();
    const durationPlayed = totalSeconds - timeLeft;
    
    setSummaryData({
      type: title,
      duration: durationPlayed,
      activeCalories: parseInt(calories.replace(/\D/g, '') || '50', 10),
      totalCalories: Math.floor(parseInt(calories.replace(/\D/g, '') || '50', 10) * 1.3),
      startTime: startTimeRef.current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    
    setShowSummary(true);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Theming colors
  const bgColor = isDark ? ['#0f172a', '#020617'] : ['#f8fafc', '#f1f5f9', '#e2e8f0'];
  const textColorPrimary = isDark ? '#f8fafc' : '#1f2937';
  const textColorSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgColor as any} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={[styles.backBtn, { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent'
            }]} 
            onPress={handleFinish}
          >
            <IconSymbol name="arrow.left" size={isDark ? 24 : 20} color={textColorPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.animationContainer}>
            <Image 
              source={{ uri: animationSource }} 
              style={styles.animationImage} 
              contentFit="cover" 
              transition={500}
            />
          </View>
          
          <Text style={[styles.title, { color: textColorPrimary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: textColorSecondary }]}>{calories} • High Intensity</Text>

          <View style={styles.timerContainer}>
            {countdown !== null ? (
              <View style={styles.countdownBox}>
                <Text style={[styles.getReadyText, { color: targetColor }]}>GET READY</Text>
                <Text style={[styles.countdownText, { color: textColorPrimary }]}>{countdown}</Text>
              </View>
            ) : (
              <View style={styles.mainTimerBox}>
                <View style={[styles.statusBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#dcfce7', borderWidth: isDark ? 1 : 0, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent' }]}>
                  {isDark && <View style={[styles.statusDot, !isRunning && { backgroundColor: '#fbbf24' }]} />}
                  <Text style={[styles.timerLabel, { color: isDark ? (isRunning ? '#cbd5e1' : '#fbbf24') : '#16a34a' }]}>
                    {timeLeft === 0 ? 'COMPLETED' : (isRunning ? 'IN PROGRESS' : 'PAUSED')}
                  </Text>
                </View>

                <Text style={[styles.timerValue, { color: textColorPrimary, opacity: timeLeft === 0 ? 0.3 : 1 }]}>
                  {formatTime(timeLeft)}
                </Text>
                
                {/* Progress bar visually */}
                <View style={styles.progressBarBg}>
                   <View style={[styles.progressBarFill, { backgroundColor: targetColor, width: `${progressPercent}%` }]} />
                </View>

                {timeLeft > 0 ? (
                  <View style={styles.timerControls}>
                    <TouchableOpacity 
                      style={[styles.controlBtn, isRunning ? (isDark ? styles.pauseBtnDark : styles.pauseBtnLight) : styles.resumeBtn]} 
                      onPress={handlePauseResume}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.controlBtnText, isRunning && isDark && { color: '#0f172a' }]}>
                        {isRunning ? 'PAUSE' : 'RESUME'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.controlBtn, isDark ? styles.stopBtnDark : styles.stopBtnLight]} 
                      onPress={handleFinish}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.controlBtnText, isDark ? { color: '#ef4444' } : { color: '#ffffff' }]}>FINISH</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.timerControls}>
                    <TouchableOpacity 
                      style={[styles.controlBtn, { backgroundColor: targetColor, width: '100%' }]} 
                      onPress={handleFinish}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.controlBtnText, { color: '#ffffff' }]}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
          
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
  topNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 10 : 30 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  
  content: { flex: 1, paddingHorizontal: 24, alignItems: 'center', paddingTop: 10 },
  animationContainer: { width: '100%', height: 220, borderRadius: 24, overflow: 'hidden', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5, backgroundColor: '#f1f5f9' },
  animationImage: { width: '100%', height: '100%' },
  headerIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  title: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 8, letterSpacing: -1 },
  subtitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 40 },
  
  timerContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  
  countdownBox: { alignItems: 'center' },
  getReadyText: { fontSize: 24, fontWeight: '900', letterSpacing: 4, marginBottom: 20 },
  countdownText: { fontSize: 140, fontWeight: '900', fontVariant: ['tabular-nums'] },
  
  mainTimerBox: { width: '100%', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 30 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  timerLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  timerValue: { fontSize: 84, fontWeight: '300', fontVariant: ['tabular-nums'], marginBottom: 30 },
  
  progressBarBg: { width: '100%', height: 8, backgroundColor: 'rgba(150,150,150,0.2)', borderRadius: 4, marginBottom: 50, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  
  timerControls: { flexDirection: 'row', width: '100%', gap: 16 },
  controlBtn: { flex: 1, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  resumeBtn: { backgroundColor: '#10b981' },
  pauseBtnDark: { backgroundColor: '#f8fafc' },
  pauseBtnLight: { backgroundColor: '#f59e0b' },
  stopBtnDark: { backgroundColor: 'transparent', borderColor: 'rgba(239, 68, 68, 0.3)' },
  stopBtnLight: { backgroundColor: '#ef4444' },
  controlBtnText: { fontWeight: '800', fontSize: 14, color: '#ffffff', letterSpacing: 1 },
});
