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
  ActivityIndicator,
  ScrollView,
  Keyboard,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import BASE_URL from '@/constants/api';
import { saveAuth } from '@/constants/auth';
import { RunningManLoader } from '@/components/RunningManLoader';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Success — persist token + user then go to app
        await saveAuth(data.token, data.user);
        router.replace('/(tabs)');
      } else if (response.status === 403 && data.verified === false) {
        // 📧 Unverified email — redirect to OTP screen
        Alert.alert('Verify Email', data.message, [
          { text: 'Verify Now', onPress: () => router.push({ pathname: '/otp', params: { email: data.email } }) }
        ]);
      } else {
        // ❌ Extract the clearest error message from Laravel's response
        const errors = data.errors as Record<string, string[]> | undefined;
        if (errors) {
          const firstError = Object.values(errors).flat()[0];
          setErrorMsg(firstError || data.message || 'Login failed. Please try again.');
        } else {
          setErrorMsg(data.message || 'Invalid email or password. Please try again.');
        }
      }
    } catch (err) {
      setErrorMsg('Could not connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Dynamic theme values ────────────────────────────────────
  const bgGradient = isDark
    ? (['#000000', '#0a0a0a', '#111827'] as const)
    : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);
  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#1f2937';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const cardShadow = isDark ? 'transparent' : '#bae6fd';

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Header ── */}
            <View style={styles.header}>
              <View style={styles.logoImageContainer}>
                <Image
                  source={require('@/assets/images/evofit-logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.title, { color: textPrimary }]}>Welcome Back 👋</Text>
              <Text style={[styles.subtitle, { color: textSecondary }]}>
                Sign in to continue your fitness journey.
              </Text>
            </View>

            {/* ── Card ── */}
            <View style={[styles.card, {
              backgroundColor: cardBg,
              shadowColor: cardShadow,
              borderColor: inputBorder,
              borderWidth: isDark ? 1 : 0,
            }]}>

              {/* Email */}
              <Text style={[styles.label, { color: textSecondary }]}>EMAIL ADDRESS</Text>
              <View style={[
                styles.inputRow,
                { backgroundColor: inputBg, borderColor: inputBorder },
              ]}>
                <IconSymbol name="envelope.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={t => { setEmail(t); setErrorMsg(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  placeholderTextColor={textSecondary}
                />
              </View>

              {/* Password */}
              <Text style={[styles.label, { color: textSecondary, marginTop: 16 }]}>PASSWORD</Text>
              <View style={[
                styles.inputRow,
                { backgroundColor: inputBg, borderColor: inputBorder },
              ]}>
                <IconSymbol name="lock.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={t => { setPassword(t); setErrorMsg(''); }}
                  secureTextEntry={secureText}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  placeholderTextColor={textSecondary}
                />
                <TouchableOpacity
                  onPress={() => setSecureText(s => !s)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconSymbol
                    name={secureText ? 'eye.slash.fill' : 'eye.fill'}
                    size={17}
                    color={textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot password */}
              <View style={styles.forgotRow}>
                <Text style={[styles.forgotText, { color: primary }]}>Forgot Password?</Text>
              </View>

              {/* Inline error message */}
              {!!errorMsg && (
                <View style={[styles.errorBox, { backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2', borderColor: 'rgba(239,68,68,0.3)' }]}>
                  <IconSymbol name="exclamationmark.circle.fill" size={15} color="#ef4444" style={{ marginRight: 8 }} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* Login button */}
              <TouchableOpacity
                style={[styles.loginBtn, { opacity: loading ? 0.85 : 1 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[primary, primaryDeep]}
                  style={styles.loginBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <IconSymbol name="arrow.right.circle.fill" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={styles.loginBtnText}>Login</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
                <Text style={[styles.dividerText, { color: textSecondary }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
              </View>

              {/* Register button */}
              <TouchableOpacity
                style={[styles.registerBtn, {
                  borderColor: primary,
                  borderWidth: 1.5,
                  backgroundColor: isDark ? 'rgba(132,204,22,0.06)' : '#f7fee7',
                }]}
                onPress={() => router.push('/register' as any)}
                activeOpacity={0.8}
              >
                <IconSymbol name="person.badge.plus" size={17} color={primary} style={{ marginRight: 8 }} />
                <Text style={[styles.registerBtnText, { color: primary }]}>Create an Account</Text>
              </TouchableOpacity>

            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <RunningManLoader visible={loading} message="Signing you in..." />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64, // Matches the register page's layout vibe 
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  logoImageContainer: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1.5,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  loginBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#65a30d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 8,
  },
  loginBtnGradient: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  registerBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: -20,
    paddingBottom: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
