import React from 'react';
import { Button, Alert } from 'react-native';
import { logEvent } from '../scripts/supabase';

export function TaggingButton() {
  const handlePress = async () => {
    try {
      await logEvent('tag_add', { tag: 'example' });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to log tag event');
    }
  };

  return <Button title="Add Tag" onPress={handlePress} />;
}
