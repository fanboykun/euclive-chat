import { useEffect, useState } from 'react';
import { database, user } from '../state/database';

let useFriendsList = () => {
  let [friends, setFriends] = useState([]);

  useEffect(() => {
    database.user().get('friends').on((friends, key) => {
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
    database.user().get('friends').on((friends, key) => {
      for (let k in friends) {
        if (friends[k] !== user.is.pub && friends[k] !== null)
          database.user(friends[k]).on((friend, key) => {
            setFriends((old) => [
              ...old.filter((o) => o.pub !== friend.pub && friend.status === 'online'),
              { ...friend, key: k },
            ]);
          });
      }
    });

    return () => {};
  }, []);

  return [friends, setFriends];
};

let useFriendRequestsList = () => {
  let [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    database.user().get('friendRequests').on((friendRequests, key) => {
      for (let k in friendRequests) {
        if (friendRequests[k] !== user.is.pub && friendRequests[k] !== null)
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

export { useFriendsList, useOnlineFriendsList, useFriendRequestsList };
