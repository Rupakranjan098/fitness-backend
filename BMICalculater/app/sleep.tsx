import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useColorScheme,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GlassCard } from '@/components/glass-card';

export default function SleepScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isLogging, setIsLogging] = useState(false);
  const [sleepInput, setSleepInput] = useState('');
  const [lastSleep, setLastSleep] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSaveSleep = () => {
    const hours = parseFloat(sleepInput);
    if (isNaN(hours) || hours <= 0) return Alert.alert('Error', 'Please enter valid hours.');
    
    setLoading(true);
    setTimeout(() => {
      setLastSleep(hours);
      setLoading(false);
      setIsLogging(false);
      setSleepInput('');
      
      if (hours < 7) {
        Alert.alert('Recovery Incomplete', '7-8 hours of sleep is recommended for optimal health.');
      } else {
        Alert.alert('Goal Reached! 🌙', 'You achieved your recovery goal for the night.');
      }
    }, 800);
  };

  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const bgGradient = isDark ? (['#000000', '#0a0a0a', '#111827'] as const) : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);

  const calculateProgress = () => Math.min((lastSleep / 8) * 100, 100);

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.topNav}>
            <TouchableOpacity style={[styles.backBtn, { backgroundColor: inputBg, borderColor: inputBorder, borderWidth: 1 }]} onPress={() => router.back()}>
              <IconSymbol name="arrow.left" size={18} color={textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.navTitle, { color: textPrimary }]}>Recovery</Text>
            <View style={{ width: 42 }} />
          </View>

          <View style={styles.header}>
            <LinearGradient colors={[primary, primaryDeep]} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <IconSymbol name="moon.fill" size={30} color="#ffffff" />
            </LinearGradient>
            <Text style={[styles.title, { color: textPrimary }]}>Sleep Tracker</Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>Monitor your rest cycles and optimize your physical recovery levels.</Text>
          </View>

          <View style={[styles.card, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
            <View style={styles.statLine}>
              <View style={styles.statInfo}>
                <Text style={[styles.label, { color: textSecondary }]}>Last Night's Rest</Text>
                <Text style={[styles.statValue, { color: textPrimary }]}>{lastSleep > 0 ? `${Math.floor(lastSleep)}h ${Math.round((lastSleep % 1) * 60)}m` : '0h 0m'}</Text>
              </View>
              <TouchableOpacity style={styles.logBtn} onPress={() => setIsLogging(true)}>
                <LinearGradient colors={[primary, primaryDeep]} style={styles.logBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.logBtnText}>+ LOG</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressInner, { width: `${calculateProgress()}%`, backgroundColor: calculateProgress() >= 85 ? '#10b981' : primary }]} />
            </View>
            <Text style={[styles.helperText, { color: textSecondary }]}>Rest Target: 8 Hours</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: textPrimary, marginTop: 32 }]}>Recovery Insights</Text>
          <View style={styles.insightGrid}>
             <View style={[styles.insightCard, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
                <IconSymbol name="bolt.fill" size={20} color="#f59e0b" style={{ marginBottom: 10 }} />
                <Text style={[styles.insightLabel, { color: textPrimary }]}>Readiness</Text>
                <Text style={{ fontSize: 13, color: textSecondary, fontWeight: '600' }}>{lastSleep >= 7 ? 'High' : 'Low'}</Text>
             </View>
             <View style={[styles.insightCard, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
                <IconSymbol name="flame.fill" size={20} color="#ef4444" style={{ marginBottom: 10 }} />
                <Text style={[styles.insightLabel, { color: textPrimary }]}>Metabolism</Text>
                <Text style={{ fontSize: 13, color: textSecondary, fontWeight: '600' }}>Active</Text>
             </View>
          </View>

        </ScrollView>
      </SafeAreaView>

      <Modal visible={isLogging} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', justifyContent: 'flex-end' }}>
            <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textPrimary }]}>Log Recovery</Text>
                <TouchableOpacity onPress={() => setIsLogging(false)}>
                  <Text style={{ color: primary, fontWeight: '700' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={[styles.label, { color: textSecondary, alignSelf: 'center', marginBottom: 20 }]}>Sleep Duration (Hours)</Text>
                <TextInput 
                  style={[styles.largeInput, { color: textPrimary }]} 
                  placeholder="0.0" 
                  keyboardType="numeric" 
                  value={sleepInput} 
                  onChangeText={setSleepInput} 
                  autoFocus 
                  placeholderTextColor={textSecondary} 
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSleep}>
                  <LinearGradient colors={[primary, primaryDeep]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    {loading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.btnText}>Save Recovery Entry</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 40 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 12 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 17, fontWeight: '700' },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, paddingHorizontal: 30 },
  card: { borderRadius: 28, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 4 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 12, textTransform: 'uppercase' },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statInfo: { flex: 1 },
  statValue: { fontSize: 24, fontWeight: '800' },
  logBtn: { borderRadius: 12, overflow: 'hidden' },
  logBtnGradient: { paddingHorizontal: 16, paddingVertical: 10 },
  logBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  progressBar: { height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, width: '100%', overflow: 'hidden' },
  progressInner: { height: '100%', borderRadius: 4 },
  helperText: { fontSize: 12, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  insightGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  insightCard: { width: '48%', borderRadius: 24, padding: 18, alignItems: 'center' },
  insightLabel: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalBody: { padding: 24 },
  largeInput: { fontSize: 48, fontWeight: '800', textAlign: 'center', marginVertical: 30 },
  saveBtn: { borderRadius: 16, overflow: 'hidden' },
  btnGradient: { height: 54, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
