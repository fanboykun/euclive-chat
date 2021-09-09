import React from 'react';

export default function Titlebar({
  title,
  backgroundColor = true,
}) {

  return (
    <div
      className={`flex justify-between items-center w-full h-8 ${
        backgroundColor && 'bg-black'
      }`}
    >
      <div className="flex justify-center items-center text-white px-2 titlebar-nodrag space-x-2">
        <div>{title}</div>
      </div>
    </div>
  );
}
