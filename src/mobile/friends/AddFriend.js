import React, { useState } from 'react';
import { database, user } from '../../state/database';

export default function MobileAddFriendPage() {
  let [friendPublicKey, setFriendPublicKey] = useState('');

  let sendFriendRequest = () => {
    database
      .user(friendPublicKey)
      .get('friendRequestsCertificate')
      .once((friendRequestsCertificate, key) => {
        console.log(friendRequestsCertificate);
        if (friendRequestsCertificate)
          database
            .user(friendPublicKey)
            .get('friendRequests')
            .set(user.is.pub, () => setFriendPublicKey(''), {
              opt: { cert: friendRequestsCertificate },
            });
      });
  };

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <div className="text-lg uppercase font-bold">Add Friend</div>
      <div className="text-sm text-gray-400">
        You can add a friend with their Public Key.
      </div>

      <div className="flex flex-col space-y-4 mt-10">
        <div className="flex justify-start items-center mt-10 bg-gray-800 focus:outline-none px-4 py-2 w-full border-l border-t border-r border-b border-black rounded-md">
          <input
            type="text"
            placeholder="Enter a Public Key"
            className="flex justify-start items-center bg-gray-800 focus:outline-none w-full"
            onChange={({ target: { value } }) => setFriendPublicKey(value)}
            value={friendPublicKey}
          />
        </div>

        <div className="flex items-center bg-gray-800 focus:outline-none py-2 flex-none">
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
