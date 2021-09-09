/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import useUserStatus from '../hooks/userStatus';
import { user } from '../state/database';
import 'gun/sea';

export default function Welcome() {
  let status = useUserStatus(user.is.pub);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center w-auto h-auto text-gray-300">
          <div className="font-bold text-lg">
            Welcome to Lone Wolf, you are {status}.
          </div>
          <div className="w-96 text-center">
            This is a peer-to-peer messaging application, create a new group or
            chat to start messaging people.
          </div>
        </div>
      </div>
    </div>
  );
}
