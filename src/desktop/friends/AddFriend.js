import React, { useState } from 'react';
import { database, user } from '../../state/database';

export default function AddFriendPage() {
  let [friendPublicKey, setFriendPublicKey] = useState('');

  let sendFriendRequest = () => {
    database.user(friendPublicKey).once((friend, key) => {
      if (friend.friendRequestsCertificate && friend.pub)
        database
          .user(friend.pub)
          .get('friendRequests')
          .set(user.is.pub, null, {
            opt: { cert: friend.friendRequestsCertificate },
          });
    });
  };

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <div className="text-lg uppercase font-bold">Add Friend</div>
      <div className="text-sm text-gray-400">
        You can add a friend with their Public Key.
      </div>

      <div className="flex items-center w-full">
        <div className="flex justify-start items-center border-l border-t border-b border-black rounded-tl-md rounded-bl-md bg-gray-800 focus:outline-none px-4 py-2 w-full h-full">
          <input
            type="text"
            placeholder="Enter a Public Key"
            className="flex justify-start items-center bg-gray-800 focus:outline-none w-full"
            onChange={({ target: { value } }) => setFriendPublicKey(value)}
            value={friendPublicKey}
          />
        </div>

        <div className="flex justify-end items-center border-r border-t border-b border-black rounded-tr-md rounded-br-md bg-gray-800 focus:outline-none px-4 py-2 flex-none h-full">
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
    </div>
  );
}
