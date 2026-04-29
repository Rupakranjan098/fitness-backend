import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getToken, clearAuth } from '@/constants/auth';
import BASE_URL from '@/constants/api';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch(`${BASE_URL}/me`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          await clearAuth();
          setIsAuthenticated(false);
        }
      } catch (err) {
        // Network error (server might be down)
        // We'll still force login or let them through if we wanted offline mode,
        // but user specifically requested strict login flow.
        await clearAuth();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0c29' }}>
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  // If token is valid with server, go to home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, go to login
  return <Redirect href="/login" />;
}
