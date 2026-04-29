import React, { useState, useEffect, useCallback } from 'react';
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
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  useWindowDimensions
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';
import { getUser, clearAuth, getToken, saveAuth } from '@/constants/auth';
import BASE_URL from '@/constants/api';
import { RunningManLoader } from '@/components/RunningManLoader';

const GENDER_OPTIONS = [
  { label: 'Male', icon: '👨', value: 'male' },
  { label: 'Female', icon: '👩', value: 'female' },
  { label: 'Other', icon: '⚧', value: 'other' },
];

const COUNTRY_FLAGS = [
  { label: '🇺🇸  USA', value: 'US' },
  { label: '🇬🇧  UK', value: 'UK' },
  { label: '🇨🇦  Canada', value: 'CA' },
  { label: '🇦🇺  Australia', value: 'AU' },
  { label: '🇮🇳  India', value: 'IN' },
  { label: '🇯🇵  Japan', value: 'JP' },
];

const GOAL_OPTIONS = [
  { label: 'Lose Weight', icon: '🔥', value: 'lose_weight' },
  { label: 'Gain Muscle', icon: '💪', value: 'gain_muscle' },
  { label: 'Stay Fit', icon: '🏃', value: 'stay_fit' },
  { label: 'Improve Endurance', icon: '🤺', value: 'improve_endurance' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [gender, setGender] = useState('');
  const [nation, setNation] = useState('US');
  const [dob, setDob] = useState<Date | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [nationModalVisible, setNationModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [tempDob, setTempDob] = useState<Date>(new Date(2000, 0, 1));

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const user = await getUser();
      if (user) {
        setName(user.name || '');
        setPhone(user.phone || '');
        setGender(user.gender || '');
        if (user.dob) setDob(new Date(user.dob));
        setNation(user.nation || 'US');
        setHeight(user.height ? user.height.toString() : '');
        setWeight(user.weight ? user.weight.toString() : '');
        setAge(user.age ? user.age.toString() : '');
        setGoal(user.goal || '');
      }
    } catch (e) {
      console.warn('Fetch profile error:', e);
    } finally {
      setFetching(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setDatePickerVisible(false);
      if (selectedDate) setDob(selectedDate);
    } else if (selectedDate) {
      setTempDob(selectedDate);
    }
  };

  const confirmIosDate = () => {
    setDob(tempDob);
    setDatePickerVisible(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => { await clearAuth(); router.replace('/login'); } },
    ]);
  };

  const handleUpdate = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Name is required');
    
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No auth token found');

      const response = await fetch(`${BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          gender,
          dob: dob ? dob.toISOString().split('T')[0] : null,
          nation,
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          age: age ? parseInt(age, 10) : null,
          goal
        })
      });

      const result = await response.json();
      if (response.ok) {
        // Update local storage
        await saveAuth(token, result.user);
        Alert.alert('Profile Updated 🎉', 'Your changes have been saved successfully.');
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared Theme (Matched exactly with Register/Login) ──────────
  const primary = isDark ? '#84cc16' : '#65a30d';
  const primaryDeep = isDark ? '#4d7c0f' : '#3f6212';
  const textPrimary = isDark ? '#f1f5f9' : '#111827';
  const textSecondary = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const bgGradient = isDark 
    ? (['#000000', '#0a0a0a', '#111827'] as const) 
    : (['#f8fafc', '#f1f5f9', '#e2e8f0'] as const);

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
              <Text style={[styles.stepText, { color: primary }]}>Step 2 of 3</Text>
            </View>

            <View style={styles.header}>
              <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage} activeOpacity={0.85}>
                <View style={[styles.avatarCircle, { backgroundColor: isDark ? 'rgba(96,165,250,0.15)' : '#e0f2fe', borderColor: primary }]}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarImg} />
                  ) : (
                    <IconSymbol name="person.fill" size={38} color={primary} />
                  )}
                </View>
                <LinearGradient colors={[primary, primaryDeep]} style={styles.editIconBadge}>
                  <IconSymbol name="camera.fill" size={12} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
              <Text style={[styles.title, { color: textPrimary }]}>Profile Update</Text>
              <Text style={[styles.subtitle, { color: textSecondary }]}>Keep your details up to date for better accuracy.</Text>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg, borderColor: inputBorder, borderWidth: isDark ? 1 : 0 }]}>
              <Text style={[styles.label, { color: textSecondary }]}>Full Name</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <IconSymbol name="person.fill" size={17} color={primary} style={styles.inputInnerIcon} />
                <TextInput style={[styles.input, { color: textPrimary }]} value={name} onChangeText={setName} placeholder="Your Name" placeholderTextColor={textSecondary} />
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Phone Number</Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <TouchableOpacity style={styles.nationSelect} onPress={() => setNationModalVisible(true)}>
                  <Text style={{ fontSize: 16 }}>{COUNTRY_FLAGS.find(c => c.value === nation)?.label.split(' ')[0] || ''}</Text>
                  <IconSymbol name="chevron.down" size={12} color={textSecondary} />
                </TouchableOpacity>
                <View style={[styles.vDivider, { backgroundColor: inputBorder }]} />
                <TextInput style={[styles.input, { color: textPrimary }]} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" placeholderTextColor={textSecondary} />
              </View>

              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Age</Text>
                  <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <IconSymbol name="calendar" size={16} color={primary} style={styles.inputInnerIcon} />
                    <TextInput style={[styles.input, { color: textPrimary }]} value={age} onChangeText={setAge} placeholder="25" keyboardType="numeric" placeholderTextColor={textSecondary} />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Gender</Text>
                  <TouchableOpacity style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => setGenderModalVisible(true)}>
                    <Text style={[styles.input, { color: gender ? textPrimary : textSecondary, lineHeight: 52 }]}>
                      {gender ? GENDER_OPTIONS.find(g => g.value === gender)?.label : 'Select'}
                    </Text>
                    <IconSymbol name="chevron.down" size={14} color={textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Date of Birth</Text>
              <TouchableOpacity style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => { if (dob) setTempDob(dob); setDatePickerVisible(true); }}>
                <IconSymbol name="calendar" size={17} color={primary} style={styles.inputInnerIcon} />
                <Text style={[styles.input, { color: dob ? textPrimary : textSecondary, lineHeight: 52 }]}>{dob ? dob.toLocaleDateString() : 'Select Birth Date'}</Text>
              </TouchableOpacity>

              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Height (cm)</Text>
                  <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <TextInput style={[styles.input, { color: textPrimary }]} value={height} onChangeText={setHeight} placeholder="175" keyboardType="numeric" placeholderTextColor={textSecondary} />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Weight (kg)</Text>
                  <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <TextInput style={[styles.input, { color: textPrimary }]} value={weight} onChangeText={setWeight} placeholder="70" keyboardType="numeric" placeholderTextColor={textSecondary} />
                  </View>
                </View>
              </View>



              <Text style={[styles.label, { color: textSecondary, marginTop: 14 }]}>Fitness Goal</Text>
              <TouchableOpacity style={[styles.inputRow, { backgroundColor: inputBg, borderColor: inputBorder }]} onPress={() => setGoalModalVisible(true)}>
                <IconSymbol name="target" size={17} color={primary} style={styles.inputInnerIcon} />
                <Text style={[styles.input, { color: goal ? textPrimary : textSecondary, lineHeight: 52 }]}>
                  {goal ? GOAL_OPTIONS.find(g => g.value === goal)?.label : 'Select your fitness goal'}
                </Text>
                <IconSymbol name="chevron.down" size={14} color={textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} disabled={loading}>
                <LinearGradient colors={[primary, primaryDeep]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.btnText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out Account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <RunningManLoader visible={fetching} message="Fetching your profile..." />
      <RunningManLoader visible={loading} message="Saving changes..." />

      <Modal visible={nationModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>Select Country</Text>
              <TouchableOpacity onPress={() => setNationModalVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Done</Text></TouchableOpacity>
            </View>
            <FlatList data={COUNTRY_FLAGS} keyExtractor={item => item.value} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setNation(item.value); setNationModalVisible(false); }}>
                <Text style={{ fontSize: 16, color: textPrimary }}>{item.label}</Text>
                {nation === item.value ? <IconSymbol name="checkmark.circle.fill" size={20} color={primary} /> : null}
              </TouchableOpacity>
            )} />
          </View>
        </View>
      </Modal>

      <Modal visible={datePickerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setDatePickerVisible(false)} />
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>Select Birth Date</Text>
              <TouchableOpacity onPress={confirmIosDate}>
                <Text style={{ color: primary, fontWeight: '700' }}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingBottom: 24, paddingHorizontal: 12 }}>
              <DateTimePicker
                value={tempDob}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
                textColor={isDark ? '#ffffff' : '#000000'}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={genderModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={{ flex: 1 }} />
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>Select Gender</Text>
              <TouchableOpacity onPress={() => setGenderModalVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Done</Text></TouchableOpacity>
            </View>
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
          <View style={{ flex: 1 }} />
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>Fitness Goal</Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}><Text style={{ color: primary, fontWeight: '700' }}>Close</Text></TouchableOpacity>
            </View>
            <FlatList data={GOAL_OPTIONS} keyExtractor={item => item.value} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal(item.value); setGoalModalVisible(false); }}>
                <Text style={{ fontSize: 16, color: textPrimary }}>{item.icon}  {item.label}</Text>
                {goal === item.value ? <IconSymbol name="checkmark.circle.fill" size={20} color={primary} /> : null}
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
  stepText: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  header: { alignItems: 'center', marginBottom: 28 },
  avatarWrapper: { position: 'relative', marginBottom: 18 },
  avatarCircle: { width: 94, height: 94, borderRadius: 47, borderWidth: 2.5, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  editIconBadge: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ffffff' },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21, paddingHorizontal: 30 },
  card: { borderRadius: 28, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 4 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1.5 },
  inputInnerIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  nationSelect: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vDivider: { width: 1.5, height: 24, marginHorizontal: 10 },
  rowFields: { flexDirection: 'row' },
  halfField: { flex: 1 },
  updateBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 24 },
  btnGradient: { height: 54, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  signOutBtn: { alignSelf: 'center', marginTop: 20 },
  signOutText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
});
