import { useEffect, useState } from 'react';
import { database, user } from '../state/database';

import { SEA } from 'gun';

let useFriendsList = () => {
  let [friends, setFriends] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('friends')
      .on((friends, key) => {
        for (let k in friends) {
          if (friends[k] !== user.is.pub && friends[k] !== null)
            database.user(friends[k]).on((friend, key) => {
              setFriends((old) => [
                ...old.filter((o) => o.pub !== friend.pub),
                { ...friend, key: k },
              ]);
            });
        }
      });

    return () => {};
  }, []);

  return [friends, setFriends];
};

let useOnlineFriendsList = () => {
  let [friends, setFriends] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('friends')
      .on(async (friends, key) => {
        for (let k in friends) {
          if (friends[k] !== user.is.pub && friends[k] !== null) {
            database.user(friends[k]).on((friend, key) => {
              setFriends((old) => [
                ...old.filter(
                  (o) => o.pub !== friend.pub && o.status === 'online'
                ),
                { ...friend, key: k },
              ]);
            });
          }
        }
      });

    return () => {};
  }, []);

  return [friends, setFriends];
};

let useFriendRequestsList = () => {
  let [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('friendRequests')
      .on((friendRequests, key) => {
        for (let k in friendRequests) {
          if (friendRequests[k] !== null)
            if (friendRequests[k] !== user.is.pub)
              database.user(friendRequests[k]).on((request, key) => {
                setFriendRequests((old) => [
                  ...old.filter((o) => o.pub !== request.pub),
                  { ...request, key: k },
                ]);
              });
        }
      });

    return () => {};
  }, []);

  return [friendRequests, setFriendRequests];
};

let useChatsList = () => {
  let [chats, setChats] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('chats')
      .on((chats, key) => {
        for (let c in chats) {
          database.user(chats[c]).on((friend, key) => {
            setChats((old) => [
              ...old.filter((o) => o.pub !== chats[c]),
              { pub: chats[c], friend, key: c },
            ]);
          });
        }
      });

    return () => {};
  }, []);

  return [chats, setChats];
};

let generateChat = async (chatWith) => {
  database
    .user()
    .get('chats')
    .set(chatWith, async () => {
      console.log('Chat added.');

      let friendChatWithCertificate = await database
        .user(chatWith)
        .get('chatWithCertificate')
        .then();

      database
        .user(chatWith)
        .get('chats')
        .set(
          user.is.pub,
          () => {
            console.log('Chat added to friend.');
          },
          {
            opt: { cert: friendChatWithCertificate },
          }
        );
    });
};

let userHasChatWith = (friendPublicKey, callback) => {
  database
    .user()
    .get('chats')
    .once((chats, key) => {
      if (!chats) callback(false, null);
      for (let c in chats) {
        if (chats[c] === friendPublicKey) callback(true, chats[c]);
        else {
          try {
            if (JSON.parse(chats[c]) instanceof Object) return;
            else callback(false, null);
          } catch {}
        }
      }
    });
};

export {
  useFriendsList,
  useOnlineFriendsList,
  useFriendRequestsList,
  useChatsList,
  userHasChatWith,
  generateChat,
};
