import React, { useState } from 'react';

import { database, user } from '../../state/database';

export default function MessageBar() {
  let [message, setMessage] = useState('');
  return (
    <div className="flex flex-2 w-full p-2 space-x-2">
      <input
        className="flex justify-start items-center shadow rounded-md bg-gray-800 px-2 py-2 focus:outline-none placeholder-gray-500 text-blue-600 w-full"
        type="text"
        placeholder="Type a message."
        value={message}
        onChange={(evt) => setMessage(evt.target.value)}
        onKeyDown={(evt) => {
          if (evt.key.toLowerCase() === 'enter') {
            database
              .get('messages')
              .set({ content: message, username: user.is });
            setMessage('');
          }
        }}
      />

      <div
        className="flex justify-center items-center p-2 rounded-full bg-blue-600 cursor-pointer"
        onClick={() => {
          database.get('messages').set({ content: message, username: user.is });

          setMessage('');
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transform rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </div>
    </div>
  );
}
