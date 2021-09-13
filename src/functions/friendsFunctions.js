import { useEffect, useState } from 'react';
import { database, user } from '../state/database';

import SEA from 'gun/sea';

let useFriendsList = () => {
  let [friends, setFriends] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('friends')
      .on((friends, key) => {
        for (let k in friends) {
          if (friends[k])
            if (friends[k] !== user.is.pub && typeof friends[k] === 'string')
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
          if (friends[k])
            if (friends[k] !== user.is.pub && typeof friends[k] === 'string') {
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
          if (friendRequests[k])
            if (
              friendRequests[k] !== user.is.pub &&
              typeof friendRequests[k] === 'string'
            )
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

let createIfNotCreated = (friendPublicKey, friendMessagingCertificate) => {
  database
    .user(friendPublicKey)
    .get('chats')
    .once((chats, key) => {
      if (!chats)
        database
          .user(friendPublicKey)
          .get('chats')
          .set(
            user.is.pub,
            () => {
              console.log('Chat added to friend.');
            },
            {
              opt: { cert: friendMessagingCertificate },
            }
          );
      for (let c in chats) {
        if (chats[c] !== user.is.pub && typeof chats[c] === 'string') {
          if (chats[c] !== friendPublicKey) {
            database
              .user(friendPublicKey)
              .get('chats')
              .set(
                user.is.pub,
                () => {
                  console.log('Chat added to friend.');
                },
                {
                  opt: { cert: friendMessagingCertificate },
                }
              );
          } else {
            console.log('Chat already created with friend.');
          }
        }
      }
    });
};

let generateChat = async (chatWith) => {
  database
    .user()
    .get('chats')
    .set(chatWith, async () => {
      console.log('Chat added.');

      database
        .user(chatWith)
        .get('messagingCertificate')
        .on((friendMessagingCertificate, key) => {
          if (friendMessagingCertificate)
            createIfNotCreated(chatWith, friendMessagingCertificate);
        });
    });
};

let userHasChatWith = (friendPublicKey, callback) => {
  database
    .user()
    .get('chats')
    .once((chats, key) => {
      if (!chats) callback(false, null);
      for (let c in chats) {
        if (chats[c] !== user.is.pub && typeof chats[c] === 'string') {
          if (chats[c] === friendPublicKey) {
            callback(true, chats[c]);
          } else {
            callback(false, null);
          }
        }
      }
    });
};

let sizeOf = (obj) => {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size - 1;
};

let generateMessagingCertificate = () => {
  database
    .user()
    .get('friends')
    .on(async (friends, key) => {
      let publicKeys = [];

      for (let k in friends) {
        if (friends[k] !== user.is.pub && typeof friends[k] === 'string')
          publicKeys.push(friends[k]);

        if (publicKeys.length === sizeOf(friends) && publicKeys.length > 0) {
          console.log('Generating Messaging Certificate.');

          let chatWithCertificate = await SEA.certify(
            publicKeys,
            [{ '*': 'chats' }, { '*': 'messages' }],
            database.user().pair(),
            null,
            {}
          );

          database.user().get('messagingCertificate').put(chatWithCertificate);
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
  generateMessagingCertificate,
};
