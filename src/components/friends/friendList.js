import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Friend from './friend';

export default function FriendsList({ friends }) {
  return (
    <ScrollToBottom className="flex flex-col flex-1 overflow-auto">
      {friends.map(({ username }) => (
        <Friend username={username} />
      ))}
    </ScrollToBottom>
  );
}
