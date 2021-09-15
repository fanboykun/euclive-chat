import SEA from 'gun/sea';
import { useEffect, useState } from 'react';
import { getLatest, loadLatest } from '../services/chats';
import { load } from '../services/messaging';
import { database, user } from '../state/database';

let useFriendsList = () => {
  let [friends, setFriends] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('friends')
      .on(
        (friends, key) => {
          let list = [];

          for (let k in friends) {
            if (friends[k])
              if (friends[k] !== user.is.pub && typeof friends[k] === 'string')
                list.push(friends[k]);
          }

          list.forEach((item, index) => {
            database.user(item).on((friend, key) => {
              setFriends((old) => [
                ...old.filter((o) => o.pub !== friend.pub),
                { ...friend, key: index },
              ]);
            });
          });
        },
        { change: true }
      );

    return () => {
      setFriends([]);
    };
  }, []);

  return [friends, setFriends];
};

let useOnlineFriendsList = () => {
  let [friends, setFriends] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('friends')
      .on(
        (friends, key) => {
          let list = [];

          for (let k in friends) {
            if (friends[k])
              if (
                friends[k] !== user.is.pub &&
                typeof friends[k] === 'string'
              ) {
                list.push(friends[k]);
              }
          }

          list.forEach((item, index) =>
            database.user(item).on((friend, key) => {
              if (friend.status === 'online')
                setFriends((old) => [
                  ...old.filter((o) => o.pub !== friend.pub),
                  { ...friend, key: index },
                ]);
            })
          );
        },
        { change: true }
      );

    return () => {
      setFriends([]);
    };
  }, []);

  return [friends, setFriends];
};

let useFriendRequestsList = () => {
  let [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    database
      .user()
      .get('friendRequests')
      .on(
        (friendRequests, key) => {
          let list = [];

          for (let k in friendRequests) {
            if (friendRequests[k])
              if (
                friendRequests[k] !== user.is.pub &&
                typeof friendRequests[k] === 'string'
              )
                list.push(friendRequests[k]);
          }

          list.forEach((item, index) =>
            database.user(item).on((request, key) => {
              setFriendRequests((old) => [
                ...old.filter((o) => o.pub !== request.pub),
                { ...request, key: index },
              ]);
            })
          );
        },
        { change: true }
      );

    return () => {
      setFriendRequests([]);
    };
  }, []);

  return [friendRequests, setFriendRequests];
};

let useChatsList = () => {
  let [chats, setChats] = useState([]);
  let [count, setCount] = useState(0);

  useEffect(() => {
    database
      .user()
      .get('chats')
      .on((chats, key) => {
        setCount((c) => c++);

        let chatKeys = [];

        for (let c in chats) {
          chatKeys.push(chats[c]);
        }

        chatKeys.forEach((key) => {
          database.user(key).on((friend) => {
            if (friend) {
              setChats((old) => [
                ...old.filter((o) => o.pub !== friend.pub),
                {
                  pub: friend.pub,
                  friend,
                  key,
                },
              ]);

              database
                .get(user.is.pub)
                .get('latestMessage')
                .get(friend.pub)
                .on((message) => {
                  try {
                    let latestMessage = JSON.parse(message);
                    setChats((old) => [
                      ...old.filter((o) => o.pub !== friend.pub),
                      {
                        pub: friend.pub,
                        friend,
                        latestMessage,
                        key,
                      },
                    ]);
                  } catch {}
                });
            }
          });
        });
      });
  }, []);

  useEffect(() => {
    console.log(`chats set: ${count} times`);
  }, [count]);

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

let generateMessagingCertificate = () => {
  database
    .user()
    .get('friends')
    .on(
      async (friends, key) => {
        let publicKeys = [];

        for (let k in friends) {
          if (friends[k] !== user.is.pub && typeof friends[k] === 'string')
            publicKeys.push(friends[k]);
        }

        console.log('Generating Messaging Certificate.');

        let chatWithCertificate = await SEA.certify(
          publicKeys,
          [{ '*': 'chats' }, { '*': 'messages' }],
          database.user().pair(),
          null,
          {}
        );

        console.log(chatWithCertificate);

        database.user().get('messagingCertificate').put(chatWithCertificate);
      },
      { change: true }
    );
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
