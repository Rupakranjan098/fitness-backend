import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Image,
  useColorScheme,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

// Data for the newly recreated Discover Page
const CATEGORIES = ['All', 'Workouts', 'Nutrition', 'Mindfulness', 'Programs'];

const HERO_COURSE = {
  title: '21-Day Elite Shred',
  description: 'A complete transformation program to lose fat and build lean muscle.',
  level: 'Advanced',
  duration: '3 Weeks',
  image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800&auto=format&fit=crop',
};

const DISCOVER_ITEMS = [
  { id: '1', title: 'Powerlifting Basics', type: 'Workouts', duration: '45 Min', icon: 'figure.strengthtraining.traditional', color: '#f43f5e', route: '/workouts' },
  { id: '2', title: 'Macro Counting 101', type: 'Nutrition', duration: 'Guide', icon: 'leaf.fill', color: '#10b981', route: '/nutrition' },
  { id: '3', title: 'Deep Sleep Recovery', type: 'Mindfulness', duration: 'Audio', icon: 'moon.fill', color: '#8b5cf6', route: '/sleep' },
  { id: '4', title: 'Morning Mobility', type: 'Workouts', duration: '15 Min', icon: 'figure.yoga', color: '#3b82f6', route: '/wellness' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');

  // Theme Config
  const bgGradient = isDark
    ? (['#000000', '#0a0a0a', '#111827'] as const)
    : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);

  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const primary = isDark ? '#84cc16' : '#65a30d';

  return (
    <View style={styles.root}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Discover</Text>
          <TouchableOpacity style={[styles.profileBtn, { backgroundColor: inputBg, borderColor: inputBorder }]}>
            <IconSymbol name="bell.fill" size={18} color={textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={[styles.searchBox, { backgroundColor: inputBg, borderColor: inputBorder }]}>
            <IconSymbol name="magnifyingglass" size={18} color={textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: textPrimary }]}
              placeholder="Search classes, plans, or recipes..."
              placeholderTextColor={textSecondary}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.categoryChip,
                  { backgroundColor: inputBg, borderColor: inputBorder },
                  activeCategory === cat && { backgroundColor: primary, borderColor: primary }
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  { color: textSecondary },
                  activeCategory === cat && { color: '#ffffff' }
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Featured Program</Text>

          <TouchableOpacity style={styles.heroCard} activeOpacity={0.9} onPress={() => router.push('/active-program' as any)}>
            <Image source={{ uri: HERO_COURSE.image }} style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>PRO</Text>
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{HERO_COURSE.title}</Text>
              <Text style={styles.heroSub}>{HERO_COURSE.description}</Text>
              <View style={styles.heroMetaRow}>
                <View style={styles.heroMetaBox}>
                  <IconSymbol name="flame.fill" size={12} color="#f43f5e" />
                  <Text style={styles.heroMetaText}>{HERO_COURSE.level}</Text>
                </View>
                <View style={styles.heroMetaBox}>
                  <IconSymbol name="timer" size={12} color="#38bdf8" />
                  <Text style={styles.heroMetaText}>{HERO_COURSE.duration}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.headerRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary, marginBottom: 0 }]}>Popular Channels</Text>
            <TouchableOpacity><Text style={{ color: primary, fontWeight: '700' }}>See All</Text></TouchableOpacity>
          </View>

          <View style={styles.cardGrid}>
            {DISCOVER_ITEMS.filter(i => activeCategory === 'All' || i.type === activeCategory).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.smallCard, { backgroundColor: inputBg, borderColor: inputBorder }]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.iconWrapper, { backgroundColor: item.color + '20' }]}>
                  <IconSymbol name={item.icon as any} size={22} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.smallCardTitle, { color: textPrimary }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[styles.smallCardMeta, { color: textSecondary }]}>{item.type} • {item.duration}</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  profileBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  scroll: { paddingBottom: 40, paddingTop: 10 },

  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, height: 50, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, height: '100%' },

  categoryScroll: { paddingHorizontal: 22, paddingBottom: 24, gap: 10 },
  categoryChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, borderWidth: 1 },
  categoryText: { fontSize: 14, fontWeight: '700' },

  sectionTitle: { fontSize: 20, fontWeight: '800', marginHorizontal: 22, marginBottom: 16 },

  heroCard: { marginHorizontal: 22, height: 220, borderRadius: 28, overflow: 'hidden', marginBottom: 32, backgroundColor: '#000' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 },
  heroBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#f43f5e', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  heroBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  heroSub: { fontSize: 13, color: '#e2e8f0', lineHeight: 18, marginBottom: 12, opacity: 0.9 },
  heroMetaRow: { flexDirection: 'row', gap: 12 },
  heroMetaBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  heroMetaText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 22, marginBottom: 16 },
  cardGrid: { paddingHorizontal: 22, gap: 12 },

  smallCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1 },
  iconWrapper: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  smallCardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  smallCardMeta: { fontSize: 12, fontWeight: '600' }
});
