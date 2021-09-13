import 'gun-unset';
import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { database, user } from '../../state/database';
import { generateMessagingCertificate, useFriendRequestsList } from '../../functions/friendsFunctions';

export default function FriendRequestsPage() {
  let [friendRequests, setFriendRequests] = useFriendRequestsList();

  let acceptFriendRequest = (key, publicKey) => {
    database.user(user.is.pub).get('friends').set(publicKey);

    database
      .user(publicKey)
      .get('friendRequestsCertificate')
      .once((certificate, _) => {
        database
          .user(publicKey)
          .get('friends')
          .set(
            user.is.pub,
            () => {
              generateMessagingCertificate();
            },
            { opt: { cert: certificate } }
          );
      });

    database.user(user.is.pub).get('friendRequests').get(key).put(null);
    setFriendRequests((old) => old.filter((request) => request.key !== key));
  };

  let rejectFriendRequest = (key) => {
    database.user(user.is.pub).get('friendRequests').get(key).put(null);
    setFriendRequests((old) => old.filter((request) => request.key !== key));
  };

  return (
    <>
      {friendRequests.length > 0 && (
        <ScrollToBottom className="flex flex-col flex-1 overflow-auto p-2">
          {friendRequests.map(({ alias, status, pub, key }, index) => (
            <div
              key={key}
              className="flex justify-between items-center w-full h-10 border-b border-gray-700 p-2"
            >
              <div className="flex items-center space-x-2">
                <div className="text-md text-gray-400">@{alias}</div>
                <div
                  className={`w-2 h-2 bg-gray-400 rounded-full ${
                    status === 'online' && 'bg-green-600'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full border-l border-t border-r border-b border-gray-700 text-gray-400 hover:text-green-600 cursor-pointer transition duration-150 ease-in-out"
                  onClick={() => acceptFriendRequest(key, pub)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full border-l border-t border-r border-b border-gray-700 text-gray-400 hover:text-red-600 cursor-pointer transition duration-150 ease-in-out"
                  onClick={() => rejectFriendRequest(key)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      )}

      {friendRequests.length === 0 && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex justify-center items-center w-full h-full">
            <div className="flex text-gray-300">
              You have no friend requests.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
