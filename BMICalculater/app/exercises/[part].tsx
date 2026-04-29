import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';

// Mock data for exercises categorized by body part
const EXERCISES_DB: Record<string, { id: string, title: string, duration: string, calories: string, level: string, icon: any, color: string }[]> = {
  Chest: [
    { id: 'c1', title: 'Push-ups', duration: '5 min', calories: '40 kcal', level: 'Beginner', icon: 'flame.fill', color: '#ef4444' },
    { id: 'c2', title: 'Dumbbell Bench Press', duration: '12 min', calories: '120 kcal', level: 'Intermediate', icon: 'shield.fill', color: '#3b82f6' },
    { id: 'c3', title: 'Chest Flyes', duration: '10 min', calories: '90 kcal', level: 'Intermediate', icon: 'star.fill', color: '#eab308' },
  ],
  Back: [
    { id: 'b1', title: 'Pull-ups', duration: '8 min', calories: '75 kcal', level: 'Advanced', icon: 'shield.fill', color: '#8b5cf6' },
    { id: 'b2', title: 'Barbell Rows', duration: '15 min', calories: '150 kcal', level: 'Intermediate', icon: 'bolt.fill', color: '#ec4899' },
    { id: 'b3', title: 'Lat Pulldowns', duration: '10 min', calories: '95 kcal', level: 'Beginner', icon: 'figure.run', color: '#65a30d' },
  ],
  Legs: [
    { id: 'l1', title: 'Squats', duration: '15 min', calories: '180 kcal', level: 'Intermediate', icon: 'bolt.fill', color: '#10b981' },
    { id: 'l2', title: 'Lunges', duration: '10 min', calories: '100 kcal', level: 'Beginner', icon: 'figure.walk', color: '#f59e0b' },
    { id: 'l3', title: 'Leg Press', duration: '12 min', calories: '140 kcal', level: 'Intermediate', icon: 'shield.fill', color: '#8b5cf6' },
  ],
  Arms: [
    { id: 'a1', title: 'Bicep Curls', duration: '10 min', calories: '80 kcal', level: 'Beginner', icon: 'bolt.fill', color: '#65a30d' },
    { id: 'a2', title: 'Tricep Dips', duration: '8 min', calories: '70 kcal', level: 'Intermediate', icon: 'shield.fill', color: '#ec4899' },
    { id: 'a3', title: 'Hammer Curls', duration: '10 min', calories: '85 kcal', level: 'Intermediate', icon: 'star.fill', color: '#eab308' },
  ],
  Core: [
    { id: 'co1', title: 'Planks', duration: '5 min', calories: '50 kcal', level: 'Beginner', icon: 'shield.fill', color: '#10b981' },
    { id: 'co2', title: 'Russian Twists', duration: '8 min', calories: '80 kcal', level: 'Intermediate', icon: 'flame.fill', color: '#ef4444' },
    { id: 'co3', title: 'Leg Raises', duration: '10 min', calories: '90 kcal', level: 'Intermediate', icon: 'bolt.fill', color: '#3b82f6' },
  ],
  Shoulders: [
    { id: 's1', title: 'Overhead Press', duration: '12 min', calories: '110 kcal', level: 'Intermediate', icon: 'bolt.fill', color: '#ec4899' },
    { id: 's2', title: 'Lateral Raises', duration: '8 min', calories: '60 kcal', level: 'Beginner', icon: 'shield.fill', color: '#65a30d' },
    { id: 's3', title: 'Front Raises', duration: '8 min', calories: '60 kcal', level: 'Beginner', icon: 'star.fill', color: '#f59e0b' },
  ],
};

export default function ExercisesScreen() {
  const router = useRouter();
  const { part } = useLocalSearchParams<{ part: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Prevent undefined
  const targetPart = part || 'Chest';
  const exercisesList = EXERCISES_DB[targetPart] || [];

  const animationSource = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzM5ZTQ0MGI3MGJhZGNmOTJlNGIwNjBhYTUzZWUyNmU5ODRkZTkzNCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7Tqus8PZtBqZ1w9i/giphy.gif";

  const bgColor = isDark ? ['#0f172a', '#020617'] : ['#f8fafc', '#f1f5f9', '#e2e8f0'];
  const textColorPrimary = isDark ? '#f8fafc' : '#1f2937';
  const textColorSecondary = isDark ? '#94a3b8' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.05)' : 'transparent';
  const accentColor = isDark ? '#65a30d' : '#0284c7';

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgColor as any} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={[styles.backBtn, { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent'
            }]} 
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left" size={isDark ? 24 : 20} color={textColorPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: isDark ? '#94a3b8' : '#1f2937' }]}>{targetPart}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: textColorPrimary }]}>Target: {targetPart}</Text>
            <Text style={[styles.subtitle, { color: textColorSecondary }]}>
              {exercisesList.length} Exercises found. Build your {targetPart.toLowerCase()} muscles.
            </Text>

            <View style={styles.animationContainer}>
              <Image 
                source={{ uri: animationSource }} 
                style={styles.animationImage} 
                contentFit="cover" 
                transition={500}
              />
            </View>

            <TouchableOpacity 
              style={[styles.startAllBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.8}
              onPress={() => {
                const firstEx = exercisesList[0];
                if (firstEx) {
                  router.push({
                    pathname: '/active-exercise' as any,
                    params: {
                      id: firstEx.id,
                      title: firstEx.title,
                      duration: firstEx.duration,
                      calories: firstEx.calories,
                      icon: firstEx.icon,
                      color: firstEx.color
                    }
                  });
                }
              }}
            >
              <IconSymbol name="play.fill" size={20} color="#ffffff" />
              <Text style={styles.startAllText}>START WORKOUT</Text>
            </TouchableOpacity>
          </View>

          {exercisesList.map((exercise, index) => (
            <TouchableOpacity 
              key={exercise.id} 
              style={[styles.exerciseCard, { 
                backgroundColor: cardBg, 
                borderColor: cardBorder,
                borderWidth: isDark ? 1 : 0,
                shadowOpacity: isDark ? 0 : 0.05,
              }]}
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: '/active-exercise' as any,
                params: {
                  id: exercise.id,
                  title: exercise.title,
                  duration: exercise.duration, // e.g. "5 min"
                  calories: exercise.calories,
                  icon: exercise.icon,
                  color: exercise.color
                }
              })}
            >
              <View style={[styles.iconContainer, { backgroundColor: isDark ? `${exercise.color}20` : `${exercise.color}15` }]}>
                <IconSymbol name={exercise.icon} size={28} color={exercise.color} />
              </View>
              
              <View style={styles.exerciseDetails}>
                <Text style={[styles.exerciseTitle, { color: textColorPrimary }]}>{exercise.title}</Text>
                
                <View style={styles.metaRow}>
                   <View style={styles.metaBadge}>
                     <IconSymbol name="clock.fill" size={12} color={textColorSecondary} />
                     <Text style={[styles.metaText, { color: textColorSecondary }]}>{exercise.duration}</Text>
                   </View>
                   <View style={styles.metaBadge}>
                     <IconSymbol name="flame.fill" size={12} color="#ef4444" />
                     <Text style={[styles.metaText, { color: textColorSecondary }]}>{exercise.calories}</Text>
                   </View>
                </View>
              </View>
              
              <View style={[styles.startBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9' }]}>
                 <Text style={[styles.startBtnText, { color: textColorPrimary }]}>START</Text>
              </View>
            </TouchableOpacity>
          ))}
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  headerContainer: { marginTop: 16, marginBottom: 32 },
  title: { fontSize: 36, fontWeight: '900', marginBottom: 8, letterSpacing: -1 },
  subtitle: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  
  animationContainer: { width: '100%', height: 200, borderRadius: 24, overflow: 'hidden', marginTop: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, backgroundColor: '#f1f5f9' },
  animationImage: { width: '100%', height: '100%' },
  
  startAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  startAllText: { color: '#ffffff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  
  exerciseCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
  iconContainer: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  exerciseDetails: { flex: 1, justifyContent: 'center' },
  exerciseTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, fontWeight: '600' },
  
  startBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  startBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
});
