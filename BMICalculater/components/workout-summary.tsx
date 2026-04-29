import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

interface WorkoutSummaryProps {
  visible: boolean;
  onClose: () => void;
  data: {
    type: string;
    duration: number; // seconds
    distance?: number; // km
    activeCalories: number;
    totalCalories: number;
    avgPace?: string;
    startTime: string; 
    endTime: string;
  };
}

const { width, height } = Dimensions.get('window');

export function WorkoutSummary({ visible, onClose, data }: WorkoutSummaryProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const primary = isDark ? '#60a5fa' : '#0ea5e9';
  const primaryDeep = isDark ? '#1d4ed8' : '#0369a1';
  const textPrimary = '#ffffff';
  const textSecondary = 'rgba(255,255,255,0.6)';
  const cardBg = 'rgba(255,255,255,0.05)';
  const inputBorder = 'rgba(255,255,255,0.1)';
  // Register Gradient
  const bgGradient = ['#0f0c29', '#302b63', '#24243e'] as const;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <SafeAreaView style={styles.safe}>
           <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <View style={[styles.glowBar, { backgroundColor: primary }]} />
              <Text style={styles.completeText}>WORKOUT COMPLETE</Text>
              <Text style={styles.workoutType}>{data.type.toUpperCase()}</Text>
              <Text style={styles.timeLabel}>{data.startTime} — {data.endTime}</Text>
            </View>

            <View style={styles.grid}>
                <SummaryTile 
                    label="DURATION" 
                    value={formatDuration(data.duration)} 
                    icon="clock.fill" 
                    color={primary} 
                />
                <SummaryTile 
                    label="DISTANCE" 
                    value={`${data.distance?.toFixed(2) || '0.00'}`} 
                    unit="KM"
                    icon="figure.run" 
                    color="#4ade80" 
                />
                <SummaryTile 
                    label="ACTIVE KCAL" 
                    value={`${data.activeCalories}`} 
                    unit="KCAL"
                    icon="flame.fill" 
                    color="#fb923c" 
                />
                <SummaryTile 
                    label="AVG PACE" 
                    value={data.avgPace || "0'00\""} 
                    unit="/KM"
                    icon="speed" 
                    color="#a78bfa" 
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
                    <LinearGradient 
                        colors={[primary, primaryDeep]} 
                        style={styles.doneGradient} 
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.doneText}>DONE SECTION</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function SummaryTile({ label, value, unit, icon, color }: { label: string, value: string, unit?: string, icon: string, color: string }) {
    return (
        <View style={styles.tile}>
            <View style={[styles.tileGlow, { backgroundColor: color }]} />
            <View style={styles.tileInner}>
                <View style={[styles.iconBox, { borderColor: color }]}>
                    <IconSymbol name={icon as any} size={18} color={color} />
                </View>
                <Text style={styles.tileLabel}>{label}</Text>
                <View style={styles.valueRow}>
                  <Text style={[styles.tileValue, { color: color }]}>{value}</Text>
                  {unit && <Text style={[styles.tileUnit, { color: color }]}> {unit}</Text>}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  glowBar: { width: 40, height: 4, borderRadius: 2, marginBottom: 16, shadowColor: '#fff', shadowOpacity: 0.5, shadowRadius: 10 },
  completeText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  workoutType: { color: '#ffffff', fontSize: 36, fontWeight: '900', textAlign: 'center' },
  timeLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: '600', marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { 
    width: '47%', 
    height: 150, 
    borderRadius: 24, 
    backgroundColor: 'rgba(255,255,255,0.04)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)', 
    marginBottom: 16,
    overflow: 'hidden'
  },
  tileGlow: { position: 'absolute', top: -40, right: -40, width: 80, height: 80, borderRadius: 40, opacity: 0.1 },
  tileInner: { flex: 1, padding: 20, justifyContent: 'space-between' },
  iconBox: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
  tileLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  tileValue: { fontSize: 24, fontWeight: '900' },
  tileUnit: { fontSize: 12, fontWeight: '700' },
  footer: { marginTop: 40 },
  doneBtn: { borderRadius: 16, overflow: 'hidden', shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  doneGradient: { height: 60, justifyContent: 'center', alignItems: 'center' },
  doneText: { color: '#ffffff', fontWeight: '900', fontSize: 16, letterSpacing: 2 }
});
