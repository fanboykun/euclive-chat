import React from 'react';
import useUserStatus from '../../hooks/userStatus';

export default function Message({ username, content }) {
  let status = useUserStatus(username);

  return (
    <div className="flex flex-col p-2">
      <div className="w-full h-auto p-2 bg-gray-800 shadow">{content}</div>
      <div className="text-blue-500">
        @{username} | {status}
      </div>
    </div>
  );
}
