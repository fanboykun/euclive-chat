/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Route, Link } from 'react-router-dom';
import Titlebar from '../components/titlebar';
import Welcome from '../components/welcome';
import { database, generateCertificate, user } from '../state/database';
import FriendsPage from './friends/Friends';

import 'gun/lib/shim';
import ProfilePage from './profile/Profile';

export default function HomePage() {
  let [pub, setPub] = useState('');
  let [name, setName] = useState('');
  let [alias, setAlias] = useState('');
  let [image, setImage] = useState('');
  let [status, setStatus] = useState('');

  useEffect(() => {
    database
      .user()
      .get('friendRequestsCertificate')
      .once((certificate, _) => {
        if (!certificate) {
          generateCertificate(user);
        }
      });
    return () => {};
  }, []);

  useEffect(() => {
    let userData = database.user();

    userData.open((user) => {
      if (user.pub) setPub(user.pub);
      if (user.userName) setName(user.userName);
      if (user.alias) setAlias(user.alias);
      if (user.image) setImage(user.image);
      if (user.status) setStatus(user.status);
    });

    userData.get('status').put('online');

    return () => {};
  }, []);

  return (
    <div className="flex flex-col bg-black rounded-lg w-full h-full">
      <Titlebar title="Lone Wolf" />
      <div className="flex w-full h-full overflow-y-hidden">
        <div className="flex flex-col flex-none w-72">
          <div className="flex flex-col w-full h-full"></div>
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
        </div>
      </div>
    </div>
  );
}
