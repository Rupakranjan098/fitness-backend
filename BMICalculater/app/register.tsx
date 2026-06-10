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
  ActivityIndicator,
  Modal,
  FlatList,
  useColorScheme,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import BASE_URL from '@/constants/api';
import { saveAuth } from '@/constants/auth';
import { RunningManLoader } from '@/components/RunningManLoader';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male', icon: '👨' },
  { label: 'Female', value: 'female', icon: '👩' },
  { label: 'Other', value: 'other', icon: '⚧' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const GOAL_OPTIONS = [
    { label: 'Lose Weight', value: 'lose_weight', icon: '🔥' },
    { label: 'Gain Muscle', value: 'gain_muscle', icon: '💪' },
    { label: 'Stay Fit', value: 'stay_fit', icon: '🏃' },
    { label: 'Improve Endurance', value: 'endurance', icon: '🧗' },
  ];

  const selectedGender = GENDER_OPTIONS.find(g => g.value === gender);
  const selectedGoal = GOAL_OPTIONS.find(g => g.value === goal);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setProfileImage(`data:image/png;base64,${result.assets[0].base64}`);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) return Alert.alert('Missing Field', 'Please enter your full name.');
    if (!email.trim()) return Alert.alert('Missing Field', 'Please enter your email address.');
    if (!phone.trim()) return Alert.alert('Missing Field', 'Please enter your phone number.');
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 120) return Alert.alert('Invalid Age', 'Please enter a valid age (5-120).');
    if (!gender) return Alert.alert('Missing Field', 'Please select your gender.');
    if (!height) return Alert.alert('Missing Field', 'Please enter your height.');
    if (!weight) return Alert.alert('Missing Field', 'Please enter your weight.');
    if (!goal) return Alert.alert('Missing Field', 'Please select your fitness goal.');
    if (password.length < 6) return Alert.alert('Weak Password', 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return Alert.alert('Password Mismatch', 'Passwords do not match.');
    if (!agreed) return Alert.alert('Terms Required', 'Please agree to the Terms & Privacy Policy.');

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          age: ageNum,
          gender,
          height: parseFloat(height),
          weight: parseFloat(weight),
          goal,
          profile_picture: profileImage
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert(
          'Verify Email',
          data.message || 'OTP sent to your email address.',
          [{ text: 'Continue', onPress: () => router.replace({ pathname: '/otp' as any, params: { email: data.email || email.trim().toLowerCase() } }) }]
        );
      } else {
        const errors = data.errors as Record<string, string[]> | undefined;
        const firstMsg = errors ? Object.values(errors)[0]?.[0] : data.message;
        Alert.alert('Registration Failed', firstMsg || 'Error creating account.');
      }
    } catch {
      Alert.alert('Connection Error', 'Could not reach the server.');
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

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            <View style={styles.header}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.9} style={styles.avatarWrapper}>
                <LinearGradient colors={[primary, primaryDeep]} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                  ) : (
                    <IconSymbol name="person.badge.plus" size={30} color="#ffffff" />
                  )}
                </LinearGradient>
                <View style={[styles.editBadge, { backgroundColor: primary }]}>
                  <IconSymbol name="camera.fill" size={12} color="#ffffff" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage} style={{ marginTop: -8, marginBottom: 12 }}>
                <Text style={[styles.uploadText, { color: primary }]}>UPLOAD PHOTO</Text>
              </TouchableOpacity>
              <Text style={[styles.title, { color: textPrimary }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: textSecondary }]}>Complete the form to start your fitness journey.</Text>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>

              <Text style={[styles.label, { color: textSecondary }]}>Full Name</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="person.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Name" value={name} onChangeText={setName} placeholderTextColor={textSecondary} />
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Email Address</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="envelope.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor={textSecondary} />
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Phone Number</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="phone.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={textSecondary} />
              </View>

              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Age</Text>
                  <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <IconSymbol name="calendar" size={17} color={primary} style={styles.inputIcon} />
                    <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Age" value={age} onChangeText={v => setAge(v.replace(/[^0-9]/g, ''))} keyboardType="numeric" maxLength={3} placeholderTextColor={textSecondary} />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Gender</Text>
                  <TouchableOpacity style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => setGenderModalVisible(true)}>
                    <Text style={[styles.input, { color: gender ? textPrimary : textSecondary, lineHeight: 52 }]}>{selectedGender ? selectedGender.label : 'Select'}</Text>
                    <IconSymbol name="chevron.down" size={14} color={textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Height (cm)</Text>
                  <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <IconSymbol name="ruler.fill" size={17} color={primary} style={styles.inputIcon} />
                    <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Height" value={height} onChangeText={v => setHeight(v.replace(/[^0-9.]/g, ''))} keyboardType="numeric" maxLength={5} placeholderTextColor={textSecondary} />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Weight (kg)</Text>
                  <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <IconSymbol name="scalemass.fill" size={17} color={primary} style={styles.inputIcon} />
                    <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Weight" value={weight} onChangeText={v => setWeight(v.replace(/[^0-9.]/g, ''))} keyboardType="numeric" maxLength={5} placeholderTextColor={textSecondary} />
                  </View>
                </View>
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Fitness Goal</Text>
              <TouchableOpacity style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => setGoalModalVisible(true)}>
                <IconSymbol name="target" size={17} color={primary} style={styles.inputIcon} />
                <Text style={[styles.input, { color: goal ? textPrimary : textSecondary, lineHeight: 52 }]}>{selectedGoal ? selectedGoal.label : 'Select your fitness goal'}</Text>
                <IconSymbol name="chevron.down" size={14} color={textSecondary} />
              </TouchableOpacity>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Password</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="lock.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor={textSecondary} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><IconSymbol name={showPassword ? 'eye.fill' : 'eye.slash.fill'} size={17} color={textSecondary} /></TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Confirm Password</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: confirmPassword.length > 0 ? (passwordsMatch ? '#10b981' : '#ef4444') : inputBorder }]}>
                <IconSymbol name="lock.shield.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: textPrimary }]} placeholder="Re-enter" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirm} placeholderTextColor={textSecondary} />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}><IconSymbol name={showConfirm ? 'eye.fill' : 'eye.slash.fill'} size={17} color={textSecondary} /></TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.agreementRow} onPress={() => setAgreed(!agreed)}>
                <View style={[styles.checkbox, { borderColor: inputBorder }, agreed && { backgroundColor: primary, borderColor: primary }]}>
                  {agreed ? <IconSymbol name="checkmark" size={12} color="#ffffff" /> : null}
                </View>
                <Text style={[styles.agreementText, { color: textSecondary }]}>
                  <Text>I agree to the </Text>
                  <Text style={{ color: primary, fontWeight: '700' }}>Terms</Text>
                  <Text> and </Text>
                  <Text style={{ color: primary, fontWeight: '700' }}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
                <LinearGradient colors={[primary, primaryDeep]} style={styles.registerBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.registerBtnText}>Create Account</Text>}
                </LinearGradient>
              </TouchableOpacity>

            </View>

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: textSecondary }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}><Text style={[styles.footerLink, { color: primary }]}>Login</Text></TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal visible={genderModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: textPrimary }]}>Gender</Text><TouchableOpacity onPress={() => setGenderModalVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Close</Text></TouchableOpacity></View>
            <FlatList data={GENDER_OPTIONS} keyExtractor={item => item.value} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setGender(item.value); setGenderModalVisible(false); }}>
                <Text style={{ fontSize: 16, color: textPrimary }}>{item.icon}  {item.label}</Text>
                {gender === item.value ? <IconSymbol name="checkmark.circle.fill" size={20} color={primary} /> : null}
              </TouchableOpacity>
            )} />
          </View>
        </View>
      </Modal>

      <Modal visible={goalModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: textPrimary }]}>Fitness Goal</Text><TouchableOpacity onPress={() => setGoalModalVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Close</Text></TouchableOpacity></View>
            <FlatList data={GOAL_OPTIONS} keyExtractor={item => item.value} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal(item.value); setGoalModalVisible(false); }}>
                <Text style={{ fontSize: 16, color: textPrimary }}>{item.icon}  {item.label}</Text>
                {goal === item.value ? <IconSymbol name="checkmark.circle.fill" size={20} color={primary} /> : null}
              </TouchableOpacity>
            )} />
          </View>
        </View>
      </Modal>
      <RunningManLoader visible={loading} message="Creating Account..." />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 48 },
  topNav: { paddingTop: 16, marginBottom: 4 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  avatarWrapper: { position: 'relative' },
  avatarImage: { width: 68, height: 68, borderRadius: 34 },
  editBadge: { position: 'absolute', bottom: 15, right: -2, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  uploadText: { fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  logoCircle: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, paddingHorizontal: 20 },
  card: { borderRadius: 28, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 4, marginBottom: 24 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1.5 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  rowFields: { flexDirection: 'row' },
  halfField: { flex: 1 },
  agreementRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 1 },
  agreementText: { flex: 1, fontSize: 13, lineHeight: 20 },
  registerBtn: { borderRadius: 14, overflow: 'hidden' },
  registerBtnGradient: { height: 54, justifyContent: 'center', alignItems: 'center' },
  registerBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
});
