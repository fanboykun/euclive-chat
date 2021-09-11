/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Route, Link } from 'react-router-dom';
import Titlebar from '../components/titlebar';
import Welcome from '../components/welcome';
import { database, generateCertificate, user } from '../state/database';
import { SEA } from 'gun';
import FriendsPage from './friends/Friends';
import ProfilePage from './profile/Profile';
import { useChatsList } from '../functions/friendsFunctions';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatPage from './Chat';

export default function HomePage() {
  let [pub, setPub] = useState('');
  let [name, setName] = useState('');
  let [alias, setAlias] = useState('');
  let [image, setImage] = useState('');
  let [status, setStatus] = useState('');
  let [chats] = useChatsList();

  useEffect(() => {
    database
      .user()
      .get('friendRequestsCertificate')
      .once((certificate, _) => {
        if (!certificate) {
          generateCertificate(user);
        }
      });

    let sizeOf = (obj) => {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size - 1;
    };

    database
      .user()
      .get('friends')
      .on(async (friends, key) => {
        let publicKeys = [];

        for (let k in friends) {
          if (friends[k] !== user.is.pub && typeof friends[k] === 'string')
            publicKeys.push(friends[k]);

          if (publicKeys.length === sizeOf(friends) && publicKeys.length > 0) {
            console.log('Generating chatWithCertificate.');

            let chatWithCertificate = await SEA.certify(
              publicKeys,
              [{ '*': 'chats' }],
              database.user().pair(),
              null,
              {}
            );

            database.user().get('chatWithCertificate').put(chatWithCertificate);
          }
        }
      });
    return () => {};
  }, []);

  useEffect(() => {
    let userData = database.user();

    userData.on((data, key) => {
      if (data.pub) setPub(data.pub);
      if (data.userName) setName(data.userName);
      if (data.alias) setAlias(data.alias);
      if (data.image) setImage(data.image);
      if (data.status) setStatus(data.status);
    });

    userData.get('status').put('online');

    return () => {};
  }, []);

  return (
    <div className="flex flex-col bg-black w-full h-full">
      <Titlebar title="Lone Wolf" />
      <div className="flex w-full h-full overflow-y-hidden">
        <div className="flex flex-col flex-none w-72">
          <div className="flex flex-col w-full h-full">
            {chats.length > 0 && (
              <ScrollToBottom className="flex flex-col flex-1 overflow-auto h-full p-2">
                {chats.map(
                  (
                    {
                      friend: {
                        alias,
                        image,
                        userName,
                        status,
                        pub: friendPub,
                      },
                      pub: chatPub,
                    },
                    index
                  ) => (
                    <Link
                      key={index}
                      to={`/chat/${chatPub}/${friendPub}`}
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
                            {userName || `@${alias}`}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 h-auto">
                            Area under construction, beware!
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </ScrollToBottom>
            )}

            {chats.length === 0 && (
              <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="flex justify-center items-center w-full h-full">
                  <div className="flex text-gray-300">You have no chats.</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-full h-12 bg-gray-800 rounded-bl-lg">
            <div className="flex justify-between items-center w-full h-full bg-black rounded-bl-lg rounded-br-xl p-2 border-t border-gray-900">
              <Link to={`/profile/${pub}`}>
                <div className="flex items-center space-x-1">
                  <div className="relative flex flex-none w-10 h-10 bg-black rounded-full p-1">
                    <img
                      className="object-cover relative rounded-full w-full h-full "
                      src={
                        image ||
                        'https://skyportal.xyz/BADvbV9BumlWmiKc1EOxgNOj-zaRr-_TOlzBw1HQzq6Zdg'
                      }
                      alt=""
                    />
                    <div
                      className={`absolute bottom-1 right-1 border-l-2 border-t-2 border-r-2 border-b-2 border-black w-3 h-3 bg-gray-400 rounded-full ${
                        status === 'online' && 'bg-green-600'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-xs text-gray-200 h-auto">
                      {name}
                    </div>
                    <div className="flex items-center text-xs text-gray-400 h-auto">
                      @{alias}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex items-center space-x-2">
                <Link to="/friends">
                  <div className="flex justify-center items-center w-6 h-6 rounded-full text-gray-400 hover:text-blue-600 cursor-pointer transition duration-150 ease-in-out">
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
                </Link>
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full text-gray-400 hover:text-red-600 cursor-pointer transition duration-150 ease-in-out"
                  onClick={() => user.leave()}
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow h-full bg-gray-800 rounded-tl-xl rounded-br-lg">
          <Route path="/" exact component={() => <Welcome />} />
          <Route
            path="/friends"
            render={({ match: { url } }) => <FriendsPage url={url} />}
          />
          <Route path="/profile/:publicKey" component={ProfilePage} />
          <Route path="/chat/:chat/:friend" component={ChatPage} />
        </div>
      </div>
    </div>
  );
}
