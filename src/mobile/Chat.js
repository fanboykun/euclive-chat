import React, { useEffect, useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { database } from '../state/database';

export default function ChatPage() {
  let history = useHistory();
  let { chat, friend } = useParams();
  let [name, setName] = useState('');
  let [image, setImage] = useState('');
  let [status, setStatus] = useState('');

  useEffect(() => {
    database.user(friend).on((data, key) => {
      setName(data.userName || `@${data.alias}`);
      setImage(data.image);
      setStatus(data.status);
    });

    return () => {};
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center shadow p-3">
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
          <Link to={`/profile/${friend}`}>
            <div className="flex items-center space-x-1">
              <div className="relative flex flex-none w-10 h-10 bg-black rounded-full border-l-2 border-t-2 border-r-2 border-b-2 border-black">
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
              <div className="flex items-center text-md text-gray-200">
                {name}
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center w-full h-full space-y-4 p-4 overflow-y-auto"></div>
    </div>
  );
}
