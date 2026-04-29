import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform, Dimensions, Vibration, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { WorkoutSummary } from '@/components/workout-summary';

const { width } = Dimensions.get('window');
const SWIPE_WIDTH = width - 48;
const HANDLE_SIZE = 64;
const SWIPE_RANGE = SWIPE_WIDTH - HANDLE_SIZE - 8;

export default function YogaSessionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(new Date());

  // Using a high-quality Surya Namaskar placeholder animation
  const suryaNamaskarAnimation = 'https://i.pinimg.com/originals/96/8c/8b/968c8b6b0c6d7f0b7c6c7c6c7c6c7c6c.gif'; // Example yoga animation

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleRun = () => {
    Vibration.vibrate(50);
    setIsRunning(!isRunning);
  };

  const handleFinish = () => {
    Vibration.vibrate([0, 100, 50, 100]);
    if (timerRef.current) clearInterval(timerRef.current);
    const now = new Date();
    const activeCals = Math.floor((seconds / 60) * 8); // ~8 kcal per min for yoga
    setSummaryData({
      type: 'Surya Namaskar',
      duration: seconds,
      activeCalories: activeCals,
      totalCalories: Math.floor(activeCals * 1.1),
      startTime: startTimeRef.current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setShowSummary(true);
    setIsRunning(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Swipe logic for finish
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0 && gesture.dx < SWIPE_RANGE) {
          pan.x.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx >= SWIPE_RANGE * 0.8) {
          Animated.timing(pan.x, { toValue: SWIPE_RANGE, duration: 200, useNativeDriver: false }).start(() => {
            handleFinish();
          });
        } else {
          Animated.spring(pan.x, { toValue: 0, friction: 5, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <Image source={require('../assets/images/yoga-hero.png')} style={styles.heroBackground} contentFit="cover" />
        <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFillObject} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SURYA NAMASKAR</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.sessionContent}>
          <View style={styles.animationContainer}>
             <Image 
                source={{ uri: suryaNamaskarAnimation }} 
                style={styles.yogaAnimation} 
                contentFit="contain"
             />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{formatTime(seconds)}</Text>
              <Text style={styles.statLabel}>DURATION</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{Math.floor((seconds / 60) * 8)}</Text>
              <Text style={styles.statLabel}>KCAL BURNED</Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsSection}>
           <TouchableOpacity style={styles.controlCircle} onPress={toggleRun}>
             <LinearGradient colors={isRunning ? ['#3b82f6', '#2563eb'] : ['#10b981', '#059669']} style={styles.circleGrad}>
                <IconSymbol name={isRunning ? "pause.fill" : "play.fill"} size={32} color="white" />
             </LinearGradient>
           </TouchableOpacity>

           <View style={styles.swipeContainer}>
             <View style={styles.swipeTrack}>
               <Text style={styles.swipePrompt}>SWIPE TO FINISH</Text>
             </View>
             <Animated.View
               style={[styles.swipeHandle, { transform: [{ translateX: pan.x }] }]}
               {...panResponder.panHandlers}
             >
               <IconSymbol name="flag.checkered" size={28} color="black" />
             </Animated.View>
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
  container: { flex: 1, backgroundColor: '#000' },
  heroBackground: { width: '100%', height: '100%', opacity: 0.5 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 2 },

  sessionContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  animationContainer: { width: width - 48, height: 350, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  yogaAnimation: { width: '80%', height: '80%' },

  statsContainer: { flexDirection: 'row', marginTop: 40, width: width - 48, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 32, padding: 24, alignItems: 'center' },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: '900', color: 'white', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: 4 },
  verticalDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },

  controlsSection: { paddingBottom: 60, alignItems: 'center', gap: 30 },
  controlCircle: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', elevation: 5 },
  circleGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  swipeContainer: { width: SWIPE_WIDTH, height: HANDLE_SIZE + 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 40, padding: 4, justifyContent: 'center' },
  swipeTrack: { position: 'absolute', width: '100%', alignItems: 'center' },
  swipePrompt: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 3, opacity: 0.4 },
  swipeHandle: { width: HANDLE_SIZE, height: HANDLE_SIZE, borderRadius: HANDLE_SIZE / 2, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
});
