import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';

import { TaggingButton } from '../../../components/TaggingButton';
import { tutor } from '../../../scripts/api/tutor';
import { useChatStore } from '../../../store/chatStore';

export default function TutorChatScreen() {
  const threadId = 'tutor';
  const { threads, addMessage, loadThread } = useChatStore();
  const thread = threads[threadId];
  const [input, setInput] = useState('');

  useEffect(() => {
    loadThread(threadId);
  }, [threadId, loadThread]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    await addMessage(threadId, { role: 'user', content: text });
    const messages = useChatStore.getState().threads[threadId].messages;
    const reply = await tutor(messages);
    await addMessage(threadId, { role: 'assistant', content: reply });
    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={thread?.messages ?? []}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1 }}>
              {item.role}: {item.content}
            </Text>
            <TaggingButton />
          </View>
        )}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type your message"
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 8, padding: 8 }}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

