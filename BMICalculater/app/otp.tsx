import React, { useState, useEffect } from 'react';
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
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import BASE_URL from '@/constants/api';
import { saveAuth } from '@/constants/auth';

import { RunningManLoader } from '@/components/RunningManLoader';

export default function OtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        await saveAuth(data.token, data.user);
        Alert.alert('Success 🎉', 'Your email has been verified!', [
          { text: 'Get Started', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Verification Failed', data.message || 'The OTP entered is incorrect or expired.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    setResending(true);
    try {
      const response = await fetch(`${BASE_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert('Success', 'A new OTP has been sent to your email.');
        setTimer(60);
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
      }
    } catch (e) {
      Alert.alert('Error', 'Connection failed.');
    } finally {
      setResending(false);
    }
  };

  const bgGradient = isDark
    ? (['#000000', '#0a0a0a', '#111827'] as const)
    : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);
  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
              <LinearGradient
                colors={[primary, primaryDeep]}
                style={styles.logoCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="envelope.fill" size={30} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.title, { color: textPrimary }]}>Verify Email</Text>
              <Text style={[styles.subtitle, { color: textSecondary }]}>
                We've sent a 6-digit one-time password to{'\n'}
                <Text style={{ fontWeight: '700', color: textPrimary }}>{email}</Text>
              </Text>
            </View>

            {/* ── Form card ── */}
            <View style={[styles.card, {
              backgroundColor: cardBg,
              borderColor: inputBorder,
              borderWidth: isDark ? 1 : 0,
            }]}>
              <Text style={[styles.label, { color: textSecondary }]}>Enter OTP</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="lock.fill" size={17} color={primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textPrimary, letterSpacing: 8, fontSize: 24, textAlign: 'center' }]}
                  placeholder="------"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor={textSecondary}
                />
              </View>

              {/* Verify button */}
              <TouchableOpacity
                style={[styles.verifyBtn, { opacity: loading ? 0.85 : 1 }]}
                onPress={handleVerifyOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[primary, primaryDeep]}
                  style={styles.verifyBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.verifyBtnText}>Verify OTP</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ── Footer ── */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: textSecondary }]}>Didn't receive the email? </Text>
              {timer > 0 ? (
                <Text style={[styles.footerText, { color: textSecondary, fontWeight: '700' }]}>
                  Resend in {timer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
                  {resending ? (
                    <ActivityIndicator size="small" color={primary} />
                  ) : (
                    <Text style={[styles.footerLink, { color: primary }]}>Resend OTP</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={{ marginTop: 24, alignSelf: 'center' }}
              onPress={() => router.replace('/signup')}
            >
              <Text style={[styles.footerText, { color: textSecondary, textDecorationLine: 'underline' }]}>Change Email</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <RunningManLoader visible={loading} message="Verifying Code..." />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 22, justifyContent: 'center', paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21 },
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
    height: 64, borderWidth: 1.5,
  },
  inputIcon: { marginRight: 10, position: 'absolute', left: 20 },
  input: { flex: 1, height: '100%', fontSize: 18 },
  verifyBtn: {
    borderRadius: 14, overflow: 'hidden', marginTop: 24,
    shadowColor: '#65a30d', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 4,
  },
  verifyBtnGradient: {
    height: 54, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  verifyBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: -40,
    paddingBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
