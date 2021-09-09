import React, { useState, useEffect } from 'react';
import { database } from '../../state/database';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './message';

export default function MessageList() {
  let [messages, setMessages] = useState([]);

  useEffect(() => {
    database
      .get('messages')
      .map()
      .once((data, _) => {
        if (data)
          setMessages((old) => [
            ...old,
            { username: data.username, content: data.content },
          ]);
      });

    return () => {};
  }, []);

  return (
    <ScrollToBottom className="flex flex-col flex-1 overflow-auto">
      {messages.map(({ content, username }) => (
        <Message username={username} content={content} />
      ))}
    </ScrollToBottom>
  );
}
