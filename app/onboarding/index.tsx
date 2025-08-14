import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, writeUserProfile, UserProfile } from '../../scripts/firebase';

export default function OnboardingScreen() {
  const [grade, setGrade] = useState('');
  const [desiredSchool, setDesiredSchool] = useState('');
  const [personality, setPersonality] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const profile: UserProfile = { grade, desiredSchool, personality };
    await writeUserProfile(user.uid, profile);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Grade</Text>
      <TextInput
        style={styles.input}
        value={grade}
        onChangeText={setGrade}
        placeholder="e.g. 3rd"
      />
      <Text style={styles.label}>Desired School</Text>
      <TextInput
        style={styles.input}
        value={desiredSchool}
        onChangeText={setDesiredSchool}
        placeholder="School name"
      />
      <Text style={styles.label}>Personality</Text>
      <TextInput
        style={styles.input}
        value={personality}
        onChangeText={setPersonality}
        placeholder="Result"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
});
