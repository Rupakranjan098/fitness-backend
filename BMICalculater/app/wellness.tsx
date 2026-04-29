import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';

export default function WellnessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isVideoModalVisible, setVideoModalVisible] = useState(false);

  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
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
            <Text style={[styles.navTitle, { color: textPrimary }]}>Wellness</Text>
            <View style={{ width: 42 }} />
          </View>

          <View style={styles.header}>
            <LinearGradient colors={[primary, primaryDeep]} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <IconSymbol name="figure.yoga" size={30} color="#ffffff" />
            </LinearGradient>
            <Text style={[styles.title, { color: textPrimary }]}>Mind & Body</Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>Balance your mental focus and physiological recovery mechanisms.</Text>
          </View>

          {/* Core Wellness Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Today's Focus</Text>
          </View>

          {/* Mindful Yoga Card - Hero Design */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => router.push('/yoga-session')}
            style={[styles.heroCard, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}
          >
            <View style={styles.heroImgBox}>
              <Image 
                source={require('../assets/images/yoga-hero.png')} 
                style={styles.heroImg} 
                contentFit="cover"
              />
              <LinearGradient 
                colors={['transparent', isDark ? '#24243e' : '#ffffff']} 
                style={styles.heroGrad} 
              />
            </View>
            
            <View style={styles.heroContent}>
              <View style={styles.heroInfo}>
                <Text style={[styles.heroTitle, { color: textPrimary }]}>Mindful Yoga</Text>
                <Text style={[styles.heroSub, { color: textSecondary }]}>Guided Surya Namaskar Session</Text>
              </View>
              <LinearGradient colors={[primary, primaryDeep]} style={styles.playBtn}>
                <IconSymbol name="play.fill" size={18} color="#ffffff" />
              </LinearGradient>
            </View>
          </TouchableOpacity>

          {/* Quick Sections */}
          <View style={styles.quickGrid}>
            <View style={[styles.quickCard, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
              <IconSymbol name="heart.fill" size={24} color="#ef4444" style={{ marginBottom: 10 }} />
              <Text style={[styles.quickLabel, { color: textPrimary }]}>Heart Rate</Text>
              <Text style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>72 BPM</Text>
            </View>

            <View style={[styles.quickCard, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
              <IconSymbol name="brain.head.profile" size={24} color="#8b5cf6" style={{ marginBottom: 10 }} />
              <Text style={[styles.quickLabel, { color: textPrimary }]}>Focus</Text>
              <Text style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>Meditation</Text>
            </View>
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
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  heroCard: { borderRadius: 32, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6, marginBottom: 24 },
  heroImgBox: { height: 200, width: '100%', position: 'relative' },
  heroImg: { height: '100%', width: '100%' },
  heroGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  heroContent: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 0 },
  heroInfo: { flex: 1 },
  heroTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  heroSub: { fontSize: 13, fontWeight: '500' },
  playBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickCard: { width: '48%', borderRadius: 24, padding: 20, alignItems: 'center' },
  quickLabel: { fontSize: 15, fontWeight: '700' },
});
