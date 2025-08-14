import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth, fetchUserProfile } from '../../scripts/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigateAfterLogin = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const profile = await fetchUserProfile(user.uid);
    if (profile) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await navigateAfterLogin();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await navigateAfterLogin();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Sign In" onPress={handleEmailLogin} />
      <View style={styles.separator} />
      <Button title="Sign In with Google" onPress={handleGoogleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
  separator: {
    height: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});
