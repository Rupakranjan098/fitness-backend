import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  useColorScheme,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardEvent,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { saveNutritionLog, fetchNutritionLogs, fetchDietPlan, DietPlan } from '@/constants/apiService';
import { RunningManLoader } from '@/components/RunningManLoader';

const { width, height } = Dimensions.get('window');

export default function NutritionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [calories, setCalories] = useState(1240);
  const goal = 2000;
  const [isAddVisible, setAddVisible] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [savingLog, setSavingLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{ title: string, desc: string } | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  
  // Input states
  const [weightInput, setWeightInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<'bulk' | 'cut' | 'recomp'>('recomp');

  const todayDate = new Date().toISOString().split('T')[0];
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => {
         scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    (async () => {
      try {
        const logs = await fetchNutritionLogs();
        const todayLog = logs.find((l) => l.log_date === todayDate);
        if (todayLog) setCalories(todayLog.calories);
      } catch { /* Silent fail */ }
    })();

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAddCalories = async () => {
    const val = parseInt(addAmount);
    if (!isNaN(val) && val > 0) {
      const newCal = calories + val;
      setCalories(newCal);
      setAddAmount('');
      setAddVisible(false);
      setSavingLog(true);
      try {
        await saveNutritionLog({ calories: newCal, water_intake: 0, log_date: todayDate });
      } catch { /* Silent fail */ } finally { setSavingLog(false); }
    }
  };

  const handleGeneratePlan = async () => {
    if (!weightInput || !heightInput) return;
    setLoading(true);
    try {
      const plan = await fetchDietPlan(selectedGoal, weightInput, heightInput);
      setDietPlan(plan);
      setRecommendation(null);
    } catch {
      /* Silent fail */
    } finally {
      setLoading(false);
    }
  };

  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const bgGradient = isDark ? (['#000000', '#0a0a0a', '#111827'] as const) : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);

  const progress = Math.min((calories / goal) * 100, 100);

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
              ref={scrollRef}
              contentContainerStyle={styles.scroll} 
              showsVerticalScrollIndicator={false} 
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.topNav}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: inputBg, borderColor: inputBorder, borderWidth: 1 }]} onPress={() => router.back()}>
                  <IconSymbol name="arrow.left" size={18} color={textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.navTitle, { color: textPrimary }]}>Fuel Up</Text>
                <View style={{ width: 42 }} />
              </View>

              <View style={styles.header}>
                <LinearGradient colors={[primary, primaryDeep]} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <IconSymbol name="leaf.fill" size={30} color="#ffffff" />
                </LinearGradient>
                <Text style={[styles.title, { color: textPrimary }]}>Nutrition Engine</Text>
                <Text style={[styles.subtitle, { color: textSecondary }]}>Optimize your metabolic performance with intelligent tracking.</Text>
              </View>

              <View style={[styles.card, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
                <View style={styles.statRow}>
                   <View style={styles.statInfo}>
                      <Text style={[styles.label, { color: textSecondary }]}>Daily Calories</Text>
                      <Text style={[styles.statValue, { color: textPrimary }]}>{calories} <Text style={{ fontSize: 13, color: textSecondary }}>/ {goal} kcal</Text></Text>
                   </View>
                   <TouchableOpacity style={styles.logBtn} onPress={() => setAddVisible(true)}>
                      <LinearGradient colors={[primary, primaryDeep]} style={styles.logBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <Text style={styles.logBtnText}>+ LOG</Text>
                      </LinearGradient>
                   </TouchableOpacity>
                </View>

                <View style={styles.progressContainer}>
                   <View style={[styles.barBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                      <View style={[styles.barFill, { width: `${progress}%`, backgroundColor: progress >= 100 ? '#ef4444' : primary }]} />
                   </View>
                   <Text style={[styles.helper, { color: textSecondary }]}>{goal - calories} kcal remaining</Text>
                </View>
              </View>

              <View style={[styles.card, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0, marginTop: 16 }]}>
                <Text style={[styles.sectionTitle, { color: textPrimary }]}>Smart Diet Plan</Text>
                <Text style={[styles.label, { color: textSecondary, marginTop: 8 }]}>Input metrics for AI analysis</Text>
                
                <View style={styles.inputGrid}>
                   <View style={[styles.inputBox, { backgroundColor: inputBg, borderColor: inputBorder, flex: 1 }]}>
                      <IconSymbol name="scalemass.fill" size={16} color={primary} />
                      <TextInput 
                        style={[styles.input, { color: textPrimary }]} 
                        placeholder="Weight (kg)" 
                        keyboardType="numeric" 
                        placeholderTextColor={textSecondary}
                        value={weightInput}
                        onChangeText={setWeightInput}
                      />
                   </View>
                   <View style={[styles.inputBox, { backgroundColor: inputBg, borderColor: inputBorder, flex: 1 }]}>
                      <IconSymbol name="ruler.fill" size={16} color={primary} />
                      <TextInput 
                        style={[styles.input, { color: textPrimary }]} 
                        placeholder="Height (cm)" 
                        keyboardType="numeric" 
                        placeholderTextColor={textSecondary}
                        value={heightInput}
                        onChangeText={setHeightInput}
                      />
                   </View>
                </View>

                <View style={styles.goalRow}>
                  <TouchableOpacity 
                    style={[styles.goalBtn, selectedGoal === 'bulk' && { backgroundColor: '#f59e0b2a', borderColor: '#f59e0b' }]} 
                    onPress={() => setSelectedGoal('bulk')}
                  >
                    <Text style={[styles.goalBtnText, { color: selectedGoal === 'bulk' ? '#d97706' : textSecondary }]}>BULK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.goalBtn, selectedGoal === 'cut' && { backgroundColor: '#ef44442a', borderColor: '#ef4444' }]} 
                    onPress={() => setSelectedGoal('cut')}
                  >
                    <Text style={[styles.goalBtnText, { color: selectedGoal === 'cut' ? '#dc2626' : textSecondary }]}>CUT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.goalBtn, selectedGoal === 'recomp' && { backgroundColor: '#10b9812a', borderColor: '#10b981' }]} 
                    onPress={() => setSelectedGoal('recomp')}
                  >
                    <Text style={[styles.goalBtnText, { color: selectedGoal === 'recomp' ? '#059669' : textSecondary }]}>RECOMP</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.actionBtn} onPress={handleGeneratePlan} disabled={loading}>
                  <LinearGradient colors={[primary, primaryDeep]} style={styles.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.btnText}>Generate Smart Plan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {dietPlan && (
                <View style={styles.dietContainer}>
                   <View style={[styles.planHeader, { backgroundColor: dietPlan.color }]}>
                      <Text style={styles.planTitle}>{dietPlan.name}</Text>
                      <Text style={styles.planSub}>{dietPlan.calorie_change}</Text>
                   </View>
                   
                   {dietPlan.sections.map((sec, idx) => (
                     <View key={idx} style={[styles.mealCard, { backgroundColor: cardBg, borderColor: inputBorder }]}>
                        {sec.image && (
                          <Image source={{ uri: sec.image }} style={styles.mealImage} />
                        )}
                        <View style={styles.mealContent}>
                          <View style={styles.mealHeaderRow}>
                            <IconSymbol name={sec.icon as any} size={16} color={dietPlan.color} />
                            <Text style={[styles.mealTitle, { color: textPrimary }]}>{sec.title}</Text>
                          </View>
                          {sec.items.map((item, i) => (
                            <Text key={i} style={[styles.mealItem, { color: textSecondary }]}>• {item}</Text>
                          ))}
                        </View>
                     </View>
                   ))}

                   <View style={[styles.tipsCard, { borderColor: dietPlan.color }]}>
                      <Text style={[styles.tipsLabel, { color: dietPlan.color }]}>Expert Tips</Text>
                      {dietPlan.tips.map((tip, i) => (
                        <Text key={i} style={[styles.tipText, { color: textSecondary }]}>✅ {tip}</Text>
                      ))}
                      {dietPlan.avoid && (
                        <View style={{ marginTop: 12 }}>
                           <Text style={[styles.tipsLabel, { color: '#ef4444' }]}>Avoid At All Costs</Text>
                           <Text style={[styles.tipText, { color: textSecondary }]}>❌ {dietPlan.avoid.join(', ')}</Text>
                        </View>
                      )}
                   </View>
                </View>
              )}
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <RunningManLoader visible={loading} message="Analyzing nutrition..." />
      <RunningManLoader visible={savingLog} message="Syncing metabolic log..." />

      <Modal visible={isAddVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', justifyContent: 'flex-end' }}>
              <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: textPrimary }]}>Log Intake</Text>
                  <TouchableOpacity onPress={() => setAddVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Cancel</Text></TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <Text style={[styles.label, { color: textSecondary, alignSelf: 'center', marginBottom: 20 }]}>Calories Consumed (kcal)</Text>
                  <TextInput style={[styles.largeInput, { color: textPrimary }]} placeholder="0" keyboardType="numeric" value={addAmount} onChangeText={setAddAmount} autoFocus placeholderTextColor={textSecondary} />
                  <TouchableOpacity style={styles.saveBtn} onPress={handleAddCalories}>
                    <LinearGradient colors={[primary, primaryDeep]} style={styles.saveGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={styles.saveText}>Save Intake Log</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 250 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 12 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  navTitle: { fontSize: 17, fontWeight: '700' },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: width * 0.07, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, paddingHorizontal: 30 },
  card: { borderRadius: 28, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 4 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  statInfo: { flex: 1 },
  statValue: { fontSize: 26, fontWeight: '900', marginTop: 4 },
  logBtn: { borderRadius: 12, overflow: 'hidden' },
  logBtnGrad: { paddingHorizontal: 18, paddingVertical: 10 },
  logBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  progressContainer: {},
  barBg: { height: 10, borderRadius: 5, overflow: 'hidden', width: '100%' },
  barFill: { height: '100%', borderRadius: 5 },
  helper: { fontSize: 12, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  inputGrid: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 20 },
  inputBox: { height: 52, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  actionBtn: { borderRadius: 16, overflow: 'hidden' },
  btnGrad: { height: 56, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  recBox: { marginTop: 20, padding: 18, borderRadius: 20 },
  recTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  recDesc: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalBody: { padding: 24 },
  largeInput: { fontSize: 52, fontWeight: '900', textAlign: 'center', marginVertical: height * 0.04 },
  saveBtn: { borderRadius: 16, overflow: 'hidden' },
  saveGrad: { height: 58, justifyContent: 'center', alignItems: 'center' },
  saveText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  goalRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  goalBtn: { flex: 1, height: 42, borderRadius: 12, borderWidth: 1.5, borderColor: 'transparent', backgroundColor: 'rgba(0,0,0,0.04)', justifyContent: 'center', alignItems: 'center' },
  goalBtnText: { fontSize: 11, fontWeight: '800' },
  dietContainer: { marginTop: 24, paddingBottom: 20 },
  planHeader: { padding: 18, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  planTitle: { color: '#ffffff', fontSize: 18, fontWeight: '900' },
  planSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700', marginTop: 2 },
  mealCard: { borderBottomWidth: 1.5, flexDirection: 'row', overflow: 'hidden' },
  mealImage: { width: 100, height: '100%', minHeight: 120 },
  mealContent: { flex: 1, padding: 16 },
  mealHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  mealTitle: { fontSize: 15, fontWeight: '800' },
  mealItem: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
  tipsCard: { marginTop: 20, padding: 20, borderRadius: 24, borderLeftWidth: 6, backgroundColor: 'rgba(0,0,0,0.03)' },
  tipsLabel: { fontSize: 15, fontWeight: '900', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  tipText: { fontSize: 14, fontWeight: '600', lineHeight: 22, marginBottom: 4 },
});
