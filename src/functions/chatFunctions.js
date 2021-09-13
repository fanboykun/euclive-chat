/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { database, user } from '../state/database';

let useMessages = (chat) => {
  let [messages, setMessages] = useState([]);

  useEffect(() => {
    database
      .user(user.is.pub)
      .get('messages')
      .get(chat)
      .on((messages, key) => {
        for (let m in messages) {
          try {
            let messageData = JSON.parse(messages[m]);

            setMessages((old) => [
              ...old.filter((o) => o.key !== m),
              { ...messageData, key: m },
            ]);
          } catch {}
        }
      });

    return () => {};
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
    .user()
    .get('messages')
    .get(chat)
    .set(JSON.stringify(messageData), () => {
      database
        .user(chat)
        .get('messagingCertificate')
        .once(async (certificate, key) => {
          console.log('sending message...', certificate);

          database
            .user(chat)
            .get('messages')
            .get(user.is.pub)
            .set(
              JSON.stringify(messageData),
              (data) => {
                console.log('message sent');
                callback();
                console.log(data);
              },
              { opt: { cert: certificate } }
            );
        });
    });
};

export { useMessages, sendMessage };
