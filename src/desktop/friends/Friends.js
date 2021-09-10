import React, { useState } from 'react';
import { Route } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import { user } from '../../state/database';
import AddFriendPage from './AddFriend';
import AllFriendsPage from './AllFriends';
import FriendRequestsPage from './FriendRequests';
import OnlineFriendsPage from './OnlineFriends';

export default function FriendsPage() {
  let history = useHistory();
  let [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center shadow rounded-tl-lg p-3">
        <div className="flex items-center space-x-3">
          <div
            className="text-gray-400 cursor-pointer hover:text-white transition duration-150 ease-in-out"
            onClick={() => history.push('/')}
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
          <div className="flex items-center space-x-2 border-r border-gray-700 pr-3">
            <div>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>Friends</div>
          </div>
          <div className="flex items-center space-x-5">
            <Link to="/friends">
              <div className="text-gray-400 cursor-pointer hover:text-white transition duration-150 ease-in-out">
                Online
              </div>
            </Link>
            <Link to="/friends/all">
              <div className="text-gray-400 cursor-pointer hover:text-white transition duration-150 ease-in-out">
                All
              </div>
            </Link>
            <Link to="/friends/requests">
              <div className="text-gray-400 cursor-pointer hover:text-white transition duration-150 ease-in-out">
                Requests
              </div>
            </Link>
            <Link to="/friends/add">
              <div className="text-gray-400 cursor-pointer hover:text-white transition duration-150 ease-in-out">
                Add Friend
              </div>
            </Link>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-3">
          <div
            className="flex items-center space-x-2"
            onClick={() => {
              navigator.clipboard.writeText(user.is.pub);

              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <div className="text-gray-400 cursor-pointer hover:text-white transition duration-150 ease-in-out">
              Copy Public Key
            </div>
            <div
              className={
                copied
                  ? 'text-green-400 transition duration-500 ease-in-out'
                  : 'text-gray-400 transition duration-500 ease-in-out'
              }
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-full">
        <Route path="/friends" exact component={OnlineFriendsPage} />
        <Route path="/friends/all" exact component={AllFriendsPage} />
        <Route path="/friends/requests" exact component={FriendRequestsPage} />
        <Route path="/friends/add" exact component={AddFriendPage} />
      </div>
    </div>
  );
}
