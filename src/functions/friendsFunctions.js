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
          if (typeof chats[c] === 'string') {
            let chatInfo = JSON.parse(chats[c]);

            console.log(chatInfo)

            database.user(chatInfo.friend).on((friend, key) => {
              setChats((old) => [
                ...old.filter((o) => o.pub !== chatInfo.chat),
                { pub: chatInfo.chat, friend, key: c },
              ]);
            });
          }
        }
      });

    return () => {};
  }, []);

  return [chats, setChats];
};

let generateChat = async (chatWith) => {
  sessionStorage.setItem(
    'actualUser',
    JSON.stringify({
      epriv: user.pair().epriv,
      priv: user.pair().priv,
      epub: user.pair().epub,
      pub: user.pair().pub,
    })
  );

  let chat = await SEA.pair();

  let certificate = await SEA.certify(
    [chatWith, user.is.pub],
    [{ '*': 'messages' }],
    chat,
    null,
    {}
  );

  let actualUser = JSON.parse(sessionStorage.getItem('actualUser'));

  setTimeout(() => {
    database.user().auth(chat, async () => {
      let chatInfo = JSON.stringify({
        chat: database.user().pair().pub,
        friend: chatWith,
      });

      let chatInfoFriend = JSON.stringify({
        chat: database.user().pair().pub,
        friend: actualUser.pub,
      });

      database.user().get('certificates').put(certificate);

      setTimeout(() => {
        database.user().auth(actualUser, async ({ err }) => {
          if (err) console.log(err);
          else {
            sessionStorage.setItem('actualUser', null);

            database
              .user()
              .get('chats')
              .set(chatInfo, async () => {
                console.log('Chat added.');

                let friendChatWithCertificate = await database
                  .user(chatWith)
                  .get('chatWithCertificate')
                  .then();

                database
                  .user(chatWith)
                  .get('chats')
                  .set(
                    chatInfoFriend,
                    () => {
                      console.log('Chat added to friend.');
                    },
                    {
                      opt: { cert: friendChatWithCertificate },
                    }
                  );
              });
          }
        });
      }, 200);
    });
  }, 200);
};

let userHasChatWith = (friendPublicKey, callback) => {
  console.log(friendPublicKey);
  database
    .user()
    .get('chats')
    .once((chats, key) => {
      if (!chats) callback(false, null);
      for (let c in chats) {
        if (typeof chats[c] === 'string') {
          console.log(chats[c]);

          let chatInfo = JSON.parse(chats[c]);

          if (chatInfo.friend === friendPublicKey) callback(true, chatInfo);
          else callback(false, null);
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
