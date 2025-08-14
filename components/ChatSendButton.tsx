import React from 'react';
import { Button, Alert } from 'react-native';
import { logEvent } from '@/scripts/supabase';

export function ChatSendButton() {
  const handlePress = async () => {
    try {
      await logEvent('chat_send', { message: 'Hello' });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to log chat event');
    }
  };

  return <Button title="Send Chat" onPress={handlePress} />;
}
