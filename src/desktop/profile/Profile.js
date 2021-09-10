/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { user } from '../../state/database';
import FriendProfilePage from './FriendProfile';
import UserProfilePage from './UserProfile';

export default function ProfilePage() {
  let history = useHistory();
  let { publicKey } = useParams();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center shadow rounded-tl-lg p-3">
        <div className="flex items-center space-x-3">
          <div
            className="text-gray-400 cursor-pointer hover:text-white transition duration-150 ease-in-out"
            onClick={() => history.goBack()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          <div className="flex items-center">
            {publicKey === user.is.pub ? 'Profile' : 'Friend Info'}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full h-full space-y-4 p-4 overflow-y-auto">
        {publicKey === user.is.pub ? (
          <UserProfilePage publicKey={publicKey} />
        ) : (
          <FriendProfilePage publicKey={publicKey} />
        )}
      </div>
    </div>
  );
}
