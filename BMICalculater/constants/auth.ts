import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  bio?: string;
  goal?: string;
  dob?: string;
  nation?: string;
}

/** Save the token and user to secure storage after login/register */
export async function saveAuth(token: string, user: AuthUser): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

/** Retrieve the stored auth token (null if not logged in) */
export async function getToken(): Promise<string | null> {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) return null;
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    console.warn('SecureStore getToken error:', e);
    return null;
  }
}

/** Retrieve the stored user object */
export async function getUser(): Promise<AuthUser | null> {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) return null;
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch (e) {
    console.warn('SecureStore getUser error:', e);
    return null;
  }
}

/** Clear all stored auth data (logout) */
export async function clearAuth(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
