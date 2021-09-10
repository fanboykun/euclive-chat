import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link, useHistory } from 'react-router-dom';

import {
  generateChat,
  useFriendsList,
  userHasChatWith,
} from '../../functions/friendsFunctions';

export default function AllFriendsPage() {
  let history = useHistory();
  let [friends] = useFriendsList();

  return (
    <>
      {friends.length > 0 && (
        <ScrollToBottom className="flex flex-col flex-1 overflow-auto h-full p-2">
          {friends
            .sort((a, b) => {
              if (a.userName > b.userName || a.alias > b.alias) return -1;
              if (a.userName < b.userName || a.alias < b.alias) return 1;

              return 0;
            })
            .map(({ alias, image, userName, status, pub }, index) => (
              <div
                key={index}
                className="flex items-center w-full h-16 border-b border-gray-700 p-2 space-x-4 "
              >
                <Link
                  to={`/profile/${pub}`}
                  className="flex w-full items-center space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <div className="relative flex flex-none w-12 h-12 bg-black rounded-full border-l-2 border-t-2 border-r-2 border-b-2 border-black">
                      <img
                        className="object-cover relative rounded-full w-full h-full "
                        src={
                          image ||
                          'https://skyportal.xyz/BADvbV9BumlWmiKc1EOxgNOj-zaRr-_TOlzBw1HQzq6Zdg'
                        }
                        alt=""
                      />
                      <div
                        className={`absolute bottom-0 right-0 border-l-2 border-t-2 border-r-2 border-b-2 border-black w-3 h-3 bg-gray-400 rounded-full ${
                          status === 'online' && 'bg-green-600'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-200 h-auto">
                        {userName}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 h-auto">
                        @{alias}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center space-x-4">
                  <div
                    className="flex justify-center items-center h-10 w-10 text-gray-400 hover:text-blue-600 bg-black rounded-full cursor-pointer"
                    onClick={() => {
                      userHasChatWith(pub, (hasChatWith, data) => {
                        if (hasChatWith) {
                          console.log(data);
                          history.push(`/chat/${data.chat}/${data.friend}`);
                        } else generateChat(pub);
                      });
                    }}
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
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
        </ScrollToBottom>
      )}

      {friends.length === 0 && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex justify-center items-center w-full h-full">
            <div className="flex text-gray-300">You have no friends.</div>
          </div>
        </div>
      )}
    </>
  );
}
