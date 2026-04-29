import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GlassCard } from '@/components/glass-card';

export default function WorkoutsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const bgGradient = isDark ? (['#000000', '#0a0a0a', '#111827'] as const) : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.topNav}>
            <TouchableOpacity style={[styles.backBtn, { backgroundColor: inputBg, borderColor: inputBorder, borderWidth: 1 }]} onPress={() => router.back()}>
              <IconSymbol name="arrow.left" size={18} color={textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.navTitle, { color: textPrimary }]}>Core Fitness</Text>
            <View style={{ width: 42 }} />
          </View>

          <View style={styles.header}>
            <LinearGradient colors={[primary, primaryDeep]} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <IconSymbol name="figure.run" size={30} color="#ffffff" />
            </LinearGradient>
            <Text style={[styles.title, { color: textPrimary }]}>Outdoor Session</Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>Select your preferred training category to start your session.</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Categories</Text>
          </View>

          <View style={styles.activitySection}>
            <GlassCard
              title="Outdoor Run"
              icon="figure.run"
              image={require('../assets/images/run-hero.png')}
              accentColor={primary}
              onPress={() => router.push({ pathname: '/outdoor-tracker', params: { type: 'Outdoor Run' } })}
            />

            <GlassCard
              title="Outdoor Walk"
              icon="figure.walk"
              image={require('../assets/images/walk-hero.png')}
              accentColor="#10b981"
              onPress={() => router.push({ pathname: '/outdoor-tracker', params: { type: 'Outdoor Walk' } })}
            />

            <GlassCard
              title="Outdoor Cycle"
              icon="figure.outdoor.cycle"
              image={require('../assets/images/cycle-hero.png')}
              accentColor="#ec4899"
              onPress={() => router.push({ pathname: '/outdoor-tracker', params: { type: 'Outdoor Cycle' } })}
            />

            <GlassCard
              title="Hiking Adventure"
              icon="figure.hiking"
              image={require('../assets/images/hiking-hero.png')}
              accentColor="#f59e0b"
              onPress={() => router.push({ pathname: '/outdoor-tracker', params: { type: 'Hiking' } })}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
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
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  activitySection: { marginBottom: 32 },
});
