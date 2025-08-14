import { useEffect, useState, createContext } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import 'react-native-reanimated';

import { auth, fetchUserProfile, UserProfile } from '../scripts/firebase';
import { useColorScheme } from '@/hooks/useColorScheme';

export const UserProfileContext = createContext<UserProfile | null>(null);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await fetchUserProfile(user.uid);
        setProfile(data);
        if (data) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } else {
        setProfile(null);
        router.replace('/login');
      }
    });
    return unsubscribe;
  }, [router]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <UserProfileContext.Provider value={profile}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProfileContext.Provider>
  );
}
