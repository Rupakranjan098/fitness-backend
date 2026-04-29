import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Modal,
  FlatList,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Picker } from '@react-native-picker/picker';
import { saveBmiRecord } from '@/constants/apiService';
import { RunningManLoader } from '@/components/RunningManLoader';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male', icon: '👨' },
  { label: 'Female', value: 'female', icon: 'female' },
  { label: 'Other', value: 'other', icon: '⚧' },
];

export default function BMIScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  
  const [bmiValue, setBmiValue] = useState<string | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [isAgeVisible, setAgeVisible] = useState(false);
  const [isGenderVisible, setGenderVisible] = useState(false);

  const calculateBMI = async () => {
    const weightNum = parseFloat(weight);
    let heightMeters = 0;

    if (!age || !gender) return Alert.alert('Error', 'Please enter your age and select your gender.');
    if (heightUnit === 'cm') {
      if (!weight || !height) return Alert.alert('Error', 'Please enter weight and height.');
      heightMeters = parseFloat(height) / 100;
    } else {
      if (!weight || (!heightFt && !heightIn)) return Alert.alert('Error', 'Please enter height (ft/in).');
      heightMeters = (parseFloat(heightFt || '0') * 12 + parseFloat(heightIn || '0')) * 0.0254;
    }

    if (weightNum > 0 && heightMeters > 0) {
      const bmi = weightNum / (heightMeters * heightMeters);
      const bmiFixed = bmi.toFixed(1);
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi >= 18.5 && bmi <= 24.9) category = 'Normal weight';
      else if (bmi >= 25 && bmi <= 29.9) category = 'Overweight';
      else category = 'Obese';

      setBmiValue(bmiFixed);
      setBmiCategory(category);

      setSaving(true);
      try {
        await saveBmiRecord({
          age: parseInt(age),
          weight: weightNum,
          height: parseFloat(heightUnit === 'cm' ? height : ((parseFloat(heightFt || '0') * 12 + parseFloat(heightIn || '0')) * 2.54).toFixed(1)),
          bmi_value: parseFloat(bmiFixed),
          status: category,
        });
      } catch { /* Silent fail */ } finally { setSaving(false); }
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

  const getCategoryColor = (cat: string) => {
    if (cat === 'Normal weight') return '#10b981';
    if (cat === 'Overweight') return '#f59e0b';
    if (cat === 'Obese') return '#ef4444';
    return '#65a30d';
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            <View style={styles.topNav}>
              <TouchableOpacity style={[styles.backBtn, { backgroundColor: inputBg, borderColor: inputBorder, borderWidth: 1 }]} onPress={() => router.back()}>
                <IconSymbol name="arrow.left" size={18} color={textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.navTitle, { color: textPrimary }]}>BMI Calculator</Text>
              <View style={{ width: 42 }} />
            </View>

            <View style={styles.header}>
              <LinearGradient colors={[primary, primaryDeep]} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <IconSymbol name="scalemass.fill" size={30} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.title, { color: textPrimary }]}>Check Your Metrics</Text>
              <Text style={[styles.subtitle, { color: textSecondary }]}>Calculate your Body Mass Index for personal health tracking.</Text>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
              
              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary }]}>Age</Text>
                  <TouchableOpacity style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => setAgeVisible(true)}>
                    <IconSymbol name="calendar" size={17} color={primary} style={styles.inputInnerIcon} />
                    <Text style={[styles.input, { color: age ? textPrimary : textSecondary, lineHeight: 52 }]}>{age || '25'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary }]}>Gender</Text>
                  <TouchableOpacity style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => setGenderVisible(true)}>
                    <IconSymbol name="person.2.fill" size={17} color={primary} style={styles.inputInnerIcon} />
                    <Text style={[styles.input, { color: gender ? textPrimary : textSecondary, lineHeight: 52 }]}>{gender || 'Select'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Height</Text>
              <View style={styles.unitToggleRow}>
                <View style={[styles.inputRow, { flex: 1, backgroundColor: inputBg, borderColor: inputBorder }]}>
                  <IconSymbol name="ruler.fill" size={17} color={primary} style={styles.inputInnerIcon} />
                  {heightUnit === 'cm' ? (
                    <TextInput style={[styles.input, { color: textPrimary }]} placeholder="175 cm" value={height} onChangeText={setHeight} keyboardType="numeric" placeholderTextColor={textSecondary} />
                  ) : (
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <TextInput style={[styles.input, { textAlign: 'center' }]} placeholder="Ft" value={heightFt} onChangeText={setHeightFt} keyboardType="numeric" />
                      <TextInput style={[styles.input, { textAlign: 'center' }]} placeholder="In" value={heightIn} onChangeText={setHeightIn} keyboardType="numeric" />
                    </View>
                  )}
                </View>
                <TouchableOpacity style={[styles.unitBtn, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => setHeightUnit(heightUnit === 'cm' ? 'ft' : 'cm')}>
                  <Text style={{ color: primary, fontWeight: '700' }}>{heightUnit.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Weight (kg)</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="scalemass.fill" size={17} color={primary} style={styles.inputInnerIcon} />
                <TextInput style={[styles.input, { color: textPrimary }]} placeholder="70 kg" value={weight} onChangeText={setWeight} keyboardType="numeric" placeholderTextColor={textSecondary} />
              </View>

              <TouchableOpacity style={styles.calcBtn} onPress={calculateBMI} disabled={saving}>
                <LinearGradient colors={[primary, primaryDeep]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.btnText}>Calculate BMI</Text>
                </LinearGradient>
              </TouchableOpacity>

              {bmiValue && (
                <View style={[styles.resultArea, { borderTopColor: inputBorder }]}>
                  <Text style={[styles.resultLabel, { color: textSecondary }]}>YOUR RESULT</Text>
                  <Text style={[styles.bmiValue, { color: textPrimary }]}>{bmiValue}</Text>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(bmiCategory) }]}>
                    <Text style={styles.categoryText}>{bmiCategory.toUpperCase()}</Text>
                  </View>
                </View>
              )}

            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <RunningManLoader visible={saving} message="Analyzing metrics..." />

      {/* Age Picker */}
      <Modal visible={isAgeVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: textPrimary }]}>Select Age</Text><TouchableOpacity onPress={() => setAgeVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Done</Text></TouchableOpacity></View>
            <Picker selectedValue={age || '25'} onValueChange={v => setAge(v)} itemStyle={{ color: textPrimary }}>
              {Array.from({ length: 100 }, (_, i) => (i + 5).toString()).map(a => <Picker.Item key={a} label={a} value={a} />)}
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Gender Picker */}
      <Modal visible={isGenderVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: textPrimary }]}>Select Gender</Text><TouchableOpacity onPress={() => setGenderVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Done</Text></TouchableOpacity></View>
            <FlatList data={GENDER_OPTIONS} keyExtractor={item => item.value} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setGender(item.value); setGenderVisible(false); }}>
                <Text style={{ fontSize: 16, color: textPrimary }}>{item.icon}  {item.label}</Text>
                {gender === item.value ? <IconSymbol name="checkmark.circle.fill" size={20} color={primary} /> : null}
              </TouchableOpacity>
            )} />
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 40 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 12 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 17, fontWeight: '700' },
  header: { alignItems: 'center', marginBottom: 28 },
  logoCircle: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, paddingHorizontal: 30 },
  card: { borderRadius: 28, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 4 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1.5 },
  inputInnerIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  rowFields: { flexDirection: 'row' },
  halfField: { flex: 1 },
  unitToggleRow: { flexDirection: 'row', gap: 10 },
  unitBtn: { width: 56, height: 52, borderRadius: 14, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  calcBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 24 },
  btnGradient: { height: 54, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  resultArea: { marginTop: 24, paddingTop: 24, borderTopWidth: 1, alignItems: 'center' },
  resultLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  bmiValue: { fontSize: 48, fontWeight: '900', marginBottom: 12 },
  categoryBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  categoryText: { color: '#ffffff', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
});
