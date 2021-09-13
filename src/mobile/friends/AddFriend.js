import React, { useState } from 'react';
import { database, user } from '../../state/database';

export default function AddFriendPage() {
  let [friendPublicKey, setFriendPublicKey] = useState('');
  let [infoMessage, setInfoMessage] = useState('');

  let sendIfNotSent = (certificate) => {
    database
      .user(friendPublicKey)
      .get('friendRequests')
      .once((chats, key) => {
        if (!chats)
          database
            .user(friendPublicKey)
            .get('friendRequests')
            .set(
              user.is.pub,
              () => {
                setFriendPublicKey('');
                setInfoMessage('Friend Request sent.');
              },
              {
                opt: { cert: certificate },
              }
            );
        for (let c in chats) {
          if (chats[c] !== user.is.pub && typeof chats[c] === 'string') {
            if (chats[c] === friendPublicKey) {
              setFriendPublicKey('');
              setInfoMessage('Friend Request already sent.');
            } else {
              database
                .user(friendPublicKey)
                .get('friendRequests')
                .set(
                  user.is.pub,
                  () => {
                    setFriendPublicKey('');
                    setInfoMessage('Friend Request sent.');
                  },
                  {
                    opt: { cert: certificate },
                  }
                );
            }
          }
        }
      });
  };

  let sendFriendRequest = () => {
    database
      .user(friendPublicKey)
      .get('friendRequestsCertificate')
      .on((friendRequestsCertificate, key) => {
        if (friendRequestsCertificate) sendIfNotSent(friendRequestsCertificate);
      });
  };

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <div className="text-lg uppercase font-bold">Add Friend</div>
      <div className="text-sm text-gray-400">
        You can add a friend with their Public Key.
      </div>

      <div className="flex flex-col w-full h-auto space-y-2">
        {infoMessage !== '' && (
          <div className="w-full h-full bg-blue-100 text-blue-600 rounded-lg p-2">
            {infoMessage}
          </div>
        )}

        <div className="flex justify-start items-center border-l border-t border-r border-b border-black rounded-tl-md rounded-bl-md bg-gray-800 focus:outline-none px-4 py-2 w-full h-full">
          <input
            type="text"
            placeholder="Enter a Public Key"
            className="flex justify-start items-center bg-gray-800 focus:outline-none w-full"
            onChange={({ target: { value } }) => setFriendPublicKey(value)}
            value={friendPublicKey}
          />
        </div>

        <div
          className="flex justify-center items-center px-6 py-2 text-sm rounded-md bg-blue-600 cursor-pointer w-full"
          onClick={() => {
            if (friendPublicKey !== '') sendFriendRequest();
          }}
        >
          Send Friend Request
        </div>
      </div>
    </div>
  );
}
