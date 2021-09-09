import React from 'react';
import useUserStatus from '../../hooks/userStatus';

export default function Friend({ username }) {
  let status = useUserStatus(username);
  return (
    <div className="flex flex-col p-2">
      <div className="text-blue-500">
        @{username} | {status}
      </div>
    </div>
  );
}
