import React from 'react';
import { Button, Alert } from 'react-native';
import { logEvent } from '../scripts/supabase';

export function ReportButton() {
  const handlePress = async () => {
    try {
      await logEvent('report_create', { reportId: Date.now() });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to log report event');
    }
  };

  return <Button title="Create Report" onPress={handlePress} />;
}
