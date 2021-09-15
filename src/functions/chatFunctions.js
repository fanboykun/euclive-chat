/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { clear, get } from '../services/messaging';
import { database, user } from '../state/database';

let useMessages = () => {
  let [messages, setMessages] = useState([]);

  useEffect(() => {
    get().subscribe((messages) => setMessages(messages));

    return () => {
      clear();
    };
  }, []);

  return [messages, setMessages];
};

let sendMessage = (chat, message, type, callback = () => {}) => {
  let messageData = {
    message,
    from: database.user().pair().pub,
    time: new Date(),
    read: false,
    received: false,
    sent: true,
    type,
  };

  database
    .get(chat)
    .get('messages')
    .get(user.is.pub)
    .set(JSON.stringify(messageData));

  database
    .get(chat)
    .get('latestMessage')
    .get(user.is.pub)
    .put(JSON.stringify(messageData));

  database
    .get(user.is.pub)
    .get('messages')
    .get(chat)
    .set(JSON.stringify(messageData), () => {
      callback();
    });

  database
    .get(user.is.pub)
    .get('latestMessage')
    .get(chat)
    .put(JSON.stringify(messageData));
};

export { useMessages, sendMessage };
