import React, { useRef, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { nanoid } from 'nanoid';

import { tutor } from '../../../scripts/api/tutor';
import { counselor } from '../../../scripts/api/counselor';
import { planner } from '../../../scripts/api/planner';
import { AgentType } from '../../../scripts/api/types';
import { useChatStore, ChatMessage } from '../../../store/chatStore';

const agentClients: Record<AgentType, (msgs: ChatMessage[]) => Promise<string>> = {
  tutor,
  counselor,
  planner,
};

export default function NewChatScreen() {
  const threadIdRef = useRef(nanoid());
  const threadId = threadIdRef.current;
  const [input, setInput] = useState('');

  const appendMessage = useChatStore((state) => state.appendMessage);
  const thread = useChatStore((state) => state.getThreadById(threadId));

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    await appendMessage(threadId, { role: 'user', content: text });

    const current = useChatStore.getState().getThreadById(threadId);
    const agent = current?.agentType;
    if (!agent) return;
    const reply = await agentClients[agent](current.messages);
    await appendMessage(threadId, { role: 'assistant', content: reply });
    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={thread?.messages ?? []}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.role}: {item.content}
          </Text>
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
