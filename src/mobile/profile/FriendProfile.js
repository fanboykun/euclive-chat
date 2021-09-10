/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { database } from '../../state/database';

export default function FriendProfilePage({ publicKey }) {
  let [name, setName] = useState('');
  let [about, setAbout] = useState('');
  let [image, setImage] = useState('');

  useEffect(() => {
    database.user(publicKey).on((user, key) => {
      setName(user.userName);
      setAbout(user.userAbout);
      setImage(user.image);
    });

    return () => {};
  }, []);

  return (
    <>
      <div className="flex flex-col w-72 space-y-3 h-auto shadow p-3">
        <div className="flex flex-none justify-center items-center w-60 h-60 bg-black rounded-full p-1">
          <img
            className="object-cover relative rounded-full w-full h-full "
            src={
              image ||
              'https://skyportal.xyz/BADvbV9BumlWmiKc1EOxgNOj-zaRr-_TOlzBw1HQzq6Zdg'
            }
            alt=""
          />
        </div>
        <div className="flex items-center w-full">{name}</div>
      </div>
      <div className="flex flex-col w-72 space-y-2 h-auto shadow p-3">
        <div className="text-blue-600">About</div>
        <div className="flex items-center w-full">{about}</div>
      </div>

      <div className="flex items-center space-x-2 w-72 h-auto shadow p-3 cursor-pointer hover:bg-gray-700 transition duration-500">
        <div className="text-red-600">
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
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <div className="text-red-600">Block</div>
      </div>
    </>
  );
}
