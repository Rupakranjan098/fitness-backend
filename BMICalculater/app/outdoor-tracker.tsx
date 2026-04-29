import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform, Dimensions, Vibration, Animated, PanResponder } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { WorkoutSummary } from '@/components/workout-summary';

const { width, height } = Dimensions.get('window');
const SWIPE_WIDTH = width - 44;
const HANDLE_SIZE = 64;
const SWIPE_RANGE = SWIPE_WIDTH - HANDLE_SIZE - 6;

const ACTIVITY_IMAGES: Record<string, any> = {
  'outdoor run': require('../assets/images/run-hero.png'),
  'outdoor walk': require('../assets/images/walk-hero.png'),
  'outdoor cycle': require('../assets/images/cycle-hero.png'),
  'hiking': require('../assets/images/hiking-hero.png'),
  'default': require('../assets/images/run-hero.png'),
};

export default function OutdoorTrackerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const type = params.type || 'Outdoor Run';
  const primary = '#84cc16'; 
  const primaryDeep = '#4d7c0f';

  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(new Date());
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
        const speedMap: Record<string, number> = {
          'outdoor walk': 0.0015,
          'outdoor run': 0.003,
          'outdoor cycle': 0.006,
          'hiking': 0.001,
        };
        const increment = speedMap[type.toLowerCase()] || 0.002;
        setDistance(d => d + increment);
      }, 1000);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      pulseAnim.setValue(1);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, type]);

  const toggleRun = () => {
    Vibration.vibrate(50);
    setIsRunning(!isRunning);
  };

  const handleFinish = () => {
    Vibration.vibrate([0, 100, 50, 100]);
    if (timerRef.current) clearInterval(timerRef.current);
    const now = new Date();
    const activeCals = Math.floor(distance * 65);
    setSummaryData({
      type: type,
      duration: seconds,
      distance: distance,
      activeCalories: activeCals,
      totalCalories: Math.floor(activeCals * 1.25),
      avgPace: distance > 0 ? formatPace((seconds / 60) / distance) : "0'00\"/KM",
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

  const formatPace = (paceDec: number) => {
    const mins = Math.floor(paceDec);
    const secs = Math.floor((paceDec - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"/KM`;
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => { if (gesture.dx > 0 && gesture.dx < SWIPE_RANGE) pan.x.setValue(gesture.dx); },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx >= SWIPE_RANGE * 0.8) {
          Animated.timing(pan.x, { toValue: SWIPE_RANGE, duration: 200, useNativeDriver: false }).start(() => handleFinish());
        } else {
          Animated.spring(pan.x, { toValue: 0, friction: 6, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const activityImage = ACTIVITY_IMAGES[type.toLowerCase()] || ACTIVITY_IMAGES['default'];
  const bgGradient = ['#000000', '#0a0a0a', '#111827'] as const;

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />
      
      <View style={StyleSheet.absoluteFillObject}>
        <Image source={activityImage} style={styles.heroBg} contentFit="cover" />
        <LinearGradient colors={['rgba(15, 12, 41, 0.4)', 'rgba(15, 12, 41, 0.95)']} style={StyleSheet.absoluteFillObject} />
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{type.toUpperCase()}</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.dashboard}>
          <Text style={styles.trackingLabel}>TRACKING PERFORMANCE</Text>
          
          <Animated.View style={[styles.timerBox, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            <View style={[styles.timerGlow, { backgroundColor: primary }]} />
          </Animated.View>

          <View style={styles.statsRow}>
            <View style={styles.statPod}>
              <View style={[styles.podIcon, { borderColor: primary }]}><IconSymbol name="timer" size={14} color={primary} /></View>
              <Text style={styles.podVal}>{distance.toFixed(2)}</Text>
              <Text style={styles.podLabel}>DISTANCE (KM)</Text>
              <View style={[styles.podGlow, { backgroundColor: primary }]} />
            </View>

            <View style={styles.statPod}>
              <View style={[styles.podIcon, { borderColor: '#fb923c' }]}><IconSymbol name="flame.fill" size={14} color="#fb923c" /></View>
              <Text style={styles.podVal}>{Math.floor(distance * 65)}</Text>
              <Text style={styles.podLabel}>CALORIES (KCAL)</Text>
              <View style={[styles.podGlow, { backgroundColor: '#fb923c' }]} />
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.pauseBtn} onPress={toggleRun} activeOpacity={0.85}>
            <LinearGradient colors={isRunning ? ['#ef4444', '#b91c1c'] : ['#22c55e', '#16a34a']} style={styles.pauseGradient}>
              <IconSymbol name={isRunning ? "pause.fill" : "play.fill"} size={26} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.swipeBox}>
             <View style={styles.swipeInner}>
                <Text style={styles.swipeText}>SWIPE TO FINISH SESSION</Text>
             </View>
             <Animated.View 
                style={[styles.handle, { transform: [{ translateX: pan.x }], backgroundColor: primary }]}
                {...panResponder.panHandlers}
             >
                <IconSymbol name="flag.checkered" size={24} color="#ffffff" />
             </Animated.View>
          </View>
        </View>
      </SafeAreaView>

      {summaryData && (
        <WorkoutSummary
          visible={showSummary}
          onClose={() => { setShowSummary(false); router.back(); }}
          data={summaryData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  heroBg: { width: '100%', height: '100%', opacity: 0.4 },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  navTitle: { color: '#ffffff', fontSize: 13, fontWeight: '900', letterSpacing: 3 },
  dashboard: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 22 },
  trackingLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  timerBox: { height: height * 0.18, width: '100%', justifyContent: 'center', alignItems: 'center' },
  timerText: { 
    color: '#ffffff', 
    fontSize: width * 0.28, 
    fontWeight: '900', 
    fontVariant: ['tabular-nums'],
    letterSpacing: -2 
  },
  timerGlow: { position: 'absolute', width: width * 0.6, height: 60, opacity: 0.1, borderRadius: 100 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: height * 0.05, width: '100%' },
  statPod: { 
    flex: 1, 
    minHeight: height * 0.15, 
    borderRadius: 28, 
    backgroundColor: 'rgba(255,255,255,0.04)', 
    padding: width * 0.05, 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)', 
    overflow: 'hidden' 
  },
  podIcon: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.03)' },
  podVal: { color: '#ffffff', fontSize: width * 0.09, fontWeight: '900' },
  podLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginTop: 2 },
  podGlow: { position: 'absolute', top: -30, right: -30, width: 60, height: 60, borderRadius: 30, opacity: 0.1 },
  controls: { paddingBottom: height * 0.05, alignItems: 'center', gap: 28 },
  pauseBtn: { width: 70, height: 70, borderRadius: 35, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  pauseGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  swipeBox: { width: SWIPE_WIDTH, height: 68, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 34, padding: 3, justifyContent: 'center' },
  swipeInner: { position: 'absolute', width: '100%', alignItems: 'center' },
  swipeText: { color: '#ffffff', fontSize: 11, fontWeight: '800', opacity: 0.3, letterSpacing: 2 },
  handle: { width: 62, height: 62, borderRadius: 31, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
});
