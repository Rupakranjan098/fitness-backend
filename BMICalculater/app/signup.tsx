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

const GENDER_OPTIONS = [
  { label: '👨  Male', value: 'male' },
  { label: '👩  Female', value: 'female' },
  { label: '⚧  Other', value: 'other' },
];

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const selectedGenderLabel = GENDER_OPTIONS.find(g => g.value === gender)?.label;

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

  const handleSignup = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Missing Field', 'Please enter your email address.');
      return;
    }
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 5 and 120.');
      return;
    }
    if (!gender) {
      Alert.alert('Missing Field', 'Please select your gender.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms Required', 'Please agree to the Terms & Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        age: ageNum,
        gender,
        profile_picture: profileImage,
      };

      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Verify Email',
          data.message || 'OTP sent to your email address.',
          [{ text: 'Continue', onPress: () => router.replace({ pathname: '/otp' as any, params: { email: data.email } }) }]
        );
      } else {
        const errors = data.errors as Record<string, string[]> | undefined;
        const firstMsg = errors
          ? Object.values(errors)[0]?.[0]
          : data.message;
        Alert.alert('Registration Failed', firstMsg || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Connection Error',
        'Could not reach the server. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Dynamic theme values (BLUE Accent to match Login) ──────────
  const bgGradient = isDark
    ? (['#000000', '#0a0a0a', '#111827'] as const)
    : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);
  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const primaryLight = isDark ? 'rgba(96,165,250,0.12)' : '#e0f2fe';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const modalBg = isDark ? '#1e293b' : '#ffffff';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
              <TouchableOpacity onPress={pickImage} style={{ marginTop: -8, marginBottom: 16 }}>
                <Text style={[styles.uploadText, { color: primary }]}>UPLOAD PHOTO</Text>
              </TouchableOpacity>
              <Text style={[styles.title, { color: textPrimary }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: textSecondary }]}>
                Join and start tracking your fitness journey today.
              </Text>
            </View>

            {/* ── Form card ── */}
            <View style={[styles.card, {
              backgroundColor: cardBg,
              borderColor: inputBorder,
              borderWidth: isDark ? 1 : 0,
            }]}>

              {/* Full Name */}
              <Text style={[styles.label, { color: textSecondary }]}>Full Name</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="person.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="e.g. Rupak Ranjan"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholderTextColor={textSecondary}
                />
              </View>

              {/* Email */}
              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Email Address</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="envelope.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={textSecondary}
                />
              </View>

              {/* Age & Gender row */}
              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Age</Text>
                  <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <IconSymbol name="calendar" size={17} color={primary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: textPrimary }]}
                      placeholder="25"
                      value={age}
                      onChangeText={v => setAge(v.replace(/[^0-9]/g, ''))}
                      keyboardType="numeric"
                      maxLength={3}
                      placeholderTextColor={textSecondary}
                    />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Gender</Text>
                  <TouchableOpacity
                    style={[styles.inputRow, { backgroundColor: inputBg, borderColor: gender ? primary : inputBorder }]}
                    onPress={() => setGenderModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <IconSymbol name="person.2.fill" size={17} color={primary} style={styles.inputIcon} />
                    <Text style={[styles.input, { color: gender ? textPrimary : textSecondary, lineHeight: 52 }]} numberOfLines={1}>
                      {selectedGenderLabel ?? 'Select'}
                    </Text>
                    <IconSymbol name="chevron.down" size={14} color={textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password */}
              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Password</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="lock.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={textSecondary}
                />
                <TouchableOpacity onPress={() => setShowPassword(p => !p)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <IconSymbol name={showPassword ? 'eye.fill' : 'eye.slash.fill'} size={17} color={textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Confirm Password</Text>
              <View style={[styles.inputRow, {
                backgroundColor: inputBg,
                borderColor: passwordsMismatch ? '#ef4444' : passwordsMatch ? '#10b981' : inputBorder,
              }]}>
                <IconSymbol name="lock.shield.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholderTextColor={textSecondary}
                />
                <TouchableOpacity onPress={() => setShowConfirm(p => !p)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <IconSymbol name={showConfirm ? 'eye.fill' : 'eye.slash.fill'} size={17} color={textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Terms checkbox */}
              <TouchableOpacity
                style={styles.agreementRow}
                onPress={() => setAgreed(a => !a)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  agreed
                    ? { backgroundColor: primary, borderColor: primary }
                    : { borderColor: inputBorder, backgroundColor: 'transparent' },
                ]}>
                  {agreed && <IconSymbol name="checkmark" size={12} color="#ffffff" />}
                </View>
                <Text style={[styles.agreementText, { color: textSecondary }]}>
                  I agree to the <Text style={{ color: primary, fontWeight: '700' }}>Terms</Text> and <Text style={{ color: primary, fontWeight: '700' }}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Signup button */}
              <TouchableOpacity
                style={[styles.signupBtn, { opacity: loading ? 0.85 : 1 }]}
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[primary, primaryDeep]}
                  style={styles.signupBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <IconSymbol name="person.badge.plus" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={styles.signupBtnText}>Create Account</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

            </View>

            {/* ── Footer ── */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: textSecondary }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={[styles.footerLink, { color: primary }]}>Login</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── Gender Modal ── */}
      <Modal visible={genderModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: modalBg, borderColor: dividerColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>Select Gender</Text>
              <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
                <Text style={[styles.modalDoneText, { color: primary }]}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={GENDER_OPTIONS}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: dividerColor },
                    gender === item.value && { backgroundColor: primaryLight },
                  ]}
                  onPress={() => {
                    setGender(item.value);
                    setGenderModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: textPrimary }]}>{item.label}</Text>
                  {gender === item.value && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={primary} />
                  )}
                </TouchableOpacity>
              )}
            />
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
  scroll: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 48 },
  topNav: { paddingTop: 16, marginBottom: 4 },
  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  header: { alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  avatarWrapper: { position: 'relative' },
  avatarImage: { width: 68, height: 68, borderRadius: 34 },
  editBadge: {
    position: 'absolute', bottom: 15, right: -2, width: 24, height: 24,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#fff'
  },
  uploadText: { fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  logoCircle: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, paddingHorizontal: 20 },
  card: {
    borderRadius: 28, padding: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07, shadowRadius: 16, elevation: 4,
    marginBottom: 24,
  },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, paddingHorizontal: 14,
    height: 52, borderWidth: 1.5,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  rowFields: { flexDirection: 'row' },
  halfField: { flex: 1 },
  agreementRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: 20, marginBottom: 20,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, justifyContent: 'center',
    alignItems: 'center', marginRight: 10, marginTop: 1,
  },
  agreementText: { flex: 1, fontSize: 13, lineHeight: 20 },
  signupBtn: {
    borderRadius: 14, overflow: 'hidden',
    shadowColor: '#65a30d', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 4,
  },
  signupBtnGradient: {
    height: 54, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  signupBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: 40, borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalDoneText: { fontSize: 15, fontWeight: '700' },
  modalItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1,
  },
  modalItemText: { fontSize: 16 },
});
