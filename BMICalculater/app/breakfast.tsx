import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';

export default function BreakfastScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [logged, setLogged] = useState(false);

  const bgColor = isDark ? ['#1e1b4b', '#312e81', '#0f172a'] : ['#fdf4ff', '#fae8ff', '#ffffff'];
  const textColorPrimary = isDark ? '#f8fafc' : '#1f2937';
  const textColorSecondary = isDark ? '#cbd5e1' : '#6b7280';
  const accentColor = '#d946ef'; // fuchsia

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgColor as any} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff' }]} 
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left" size={20} color={textColorPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: textColorPrimary }]}>Today&apos;s Recipe</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }} 
            style={styles.heroImage} 
            contentFit="cover"
          />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColorPrimary }]}>Berry Power Oatmeal</Text>
            <Text style={[styles.subtitle, { color: textColorSecondary }]}>Packed with antioxidants and slow-releasing carbs for morning energy.</Text>
          </View>

          <View style={styles.macrosRow}>
            <View style={[styles.macroBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3e8ff' }]}>
              <Text style={styles.macroValue}>350</Text>
              <Text style={styles.macroLabel}>CAL</Text>
            </View>
            <View style={[styles.macroBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#dcfce7' }]}>
              <Text style={[styles.macroValue, { color: '#16a34a' }]}>12g</Text>
              <Text style={[styles.macroLabel, { color: '#16a34a' }]}>PRO</Text>
            </View>
            <View style={[styles.macroBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fee2e2' }]}>
              <Text style={[styles.macroValue, { color: '#ef4444' }]}>54g</Text>
              <Text style={[styles.macroLabel, { color: '#ef4444' }]}>CARB</Text>
            </View>
            <View style={[styles.macroBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffedd5' }]}>
              <Text style={[styles.macroValue, { color: '#f97316' }]}>8g</Text>
              <Text style={[styles.macroLabel, { color: '#f97316' }]}>FAT</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColorPrimary }]}>Ingredients</Text>
            <Text style={[styles.listItem, { color: textColorSecondary }]}>• 1/2 cup rolled oats</Text>
            <Text style={[styles.listItem, { color: textColorSecondary }]}>• 1 cup almond milk</Text>
            <Text style={[styles.listItem, { color: textColorSecondary }]}>• 1/2 cup mixed berries (blueberries, raspberries)</Text>
            <Text style={[styles.listItem, { color: textColorSecondary }]}>• 1 tbsp chia seeds</Text>
            <Text style={[styles.listItem, { color: textColorSecondary }]}>• 1 tsp honey</Text>
          </View>
          
          <View style={styles.bottomSpace} />
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.logBtn, { backgroundColor: logged ? '#10b981' : accentColor }]}
            onPress={() => setLogged(true)}
            activeOpacity={0.8}
            disabled={logged}
          >
            <IconSymbol name={logged ? "checkmark.circle.fill" : "plus.app.fill"} size={20} color="#ffffff" />
            <Text style={styles.logBtnText}>{logged ? "MEAL LOGGED" : "LOG BREAKFAST"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  
  content: { paddingHorizontal: 24, paddingTop: 10 },
  heroImage: { width: '100%', height: 240, borderRadius: 24, marginBottom: 24 },
  
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  macroBox: { width: '23%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  macroValue: { fontSize: 18, fontWeight: '800', marginBottom: 4, color: '#d946ef' },
  macroLabel: { fontSize: 11, fontWeight: '800', color: '#d946ef' },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  listItem: { fontSize: 16, lineHeight: 28, marginBottom: 4 },
  
  bottomSpace: { height: 100 },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  logBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  logBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
});
