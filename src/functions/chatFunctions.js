import { useEffect, useState } from 'react';
import { database, user } from '../state/database';
import moment from 'moment';

let useMessages = () => {
  let [messages, setMessages] = useState([]);

  useEffect(() => {
    database
      .user(user.is.pub)
      .get('messages')
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
    .set(JSON.stringify(messageData), () => {
      database
        .user(chat)
        .get('chatWithCertificate')
        .once(async (certificate, key) => {
          database
            .user(chat)
            .get('messages')
            .set(
              JSON.stringify(messageData),
              (data) => {
                callback();
              },
              { opt: { cert: certificate } }
            );
        });
    });
};

export { useMessages, sendMessage };
