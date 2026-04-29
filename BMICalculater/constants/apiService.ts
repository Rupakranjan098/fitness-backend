import BASE_URL from './api';
import { getToken } from './auth';

/** Build headers, injecting the Bearer token if available */
async function buildHeaders(hasBody = false): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (hasBody) headers['Content-Type'] = 'application/json';
  const token = await getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ─── BMI Records ────────────────────────────────────────────

export interface BmiRecord {
  id?: number;
  age: number;
  weight: number;
  height: number;
  bmi_value: number;
  status: string;
  created_at?: string;
}

/** Fetch all BMI records for the authenticated user */
export async function fetchBmiRecords(): Promise<BmiRecord[]> {
  const headers = await buildHeaders();
  const res = await fetch(`${BASE_URL}/bmi-records`, { headers });
  if (!res.ok) throw new Error('Failed to fetch BMI records');
  return res.json();
}

/** Save a new BMI record for the authenticated user */
export async function saveBmiRecord(record: BmiRecord): Promise<BmiRecord> {
  const headers = await buildHeaders(true);
  const res = await fetch(`${BASE_URL}/bmi-records`, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message || 'Failed to save BMI record');
  }
  return res.json();
}

// ─── Nutrition Logs ─────────────────────────────────────────

export interface NutritionLog {
  id?: number;
  calories: number;
  water_intake: number;
  log_date: string; // YYYY-MM-DD
  created_at?: string;
}

/** Fetch all nutrition logs for the authenticated user */
export async function fetchNutritionLogs(): Promise<NutritionLog[]> {
  const headers = await buildHeaders();
  const res = await fetch(`${BASE_URL}/nutrition-logs`, { headers });
  if (!res.ok) throw new Error('Failed to fetch nutrition logs');
  return res.json();
}

/** Save a new nutrition log for the authenticated user */
export async function saveNutritionLog(log: NutritionLog): Promise<NutritionLog> {
  const headers = await buildHeaders(true);
  const res = await fetch(`${BASE_URL}/nutrition-logs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(log),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message || 'Failed to save nutrition log');
  }
  return res.json();
}

// ─── Diet Planning ──────────────────────────────────────────
export interface DietPlanSection {
  title: string;
  items: string[];
  icon: string;
  image?: string;
}

export interface DietPlan {
  name: string;
  calorie_change: string;
  sections: DietPlanSection[];
  tips: string[];
  avoid?: string[];
  color: string;
}

/** Fetch a personalized diet plan based on goal and metrics */
export async function fetchDietPlan(goal: string, weight?: string, height?: string): Promise<DietPlan> {
  const headers = await buildHeaders();
  const url = `${BASE_URL}/diet-plan?goal=${goal}&weight=${encodeURIComponent(weight || '')}&height=${encodeURIComponent(height || '')}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Failed to fetch diet plan');
  return res.json();
}

/** Update user profile details */
export async function updateUserProfile(data: Record<string, any>): Promise<{ message: string; user: any }> {
  const headers = await buildHeaders(true);
  const res = await fetch(`${BASE_URL}/update-profile`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message || 'Failed to update profile');
  }
  return res.json();
}
