import React, { useEffect, useState } from 'react';

export default function Titlebar({
  title,
  minimizeBtn = true,
  maximizeBtn = true,
  closeBtn = true,
  backgroundColor = true,
}) {
  let [maximized, setMaximized] = useState(false);

  useEffect(() => {
    window.on('toggledMaximize', setMaximized);
  }, []);

  let handleMinimize = () => {
    window.send('minimize');
  };
  let handleMaximizeToggle = () => {
    window.send('toggleMaximize');
  };
  let handleClose = () => {
    window.send('close');
  };

  return (
    <div
      className={`flex justify-between items-center rounded-t-lg w-full h-8 ${
        backgroundColor && 'bg-black'
      } titlebar-drag ${maximized && 'titlebar-nodrag'}`}
    >
      <div className="flex justify-center items-center text-white px-2 titlebar-nodrag space-x-2">
        <div>{title}</div>
      </div>
      <div className="flex justify-center items-center text-white h-full titlebar-nodrag">
        {minimizeBtn && (
          <div
            className="flex justify-center items-center w-8 h-8 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            onClick={handleMinimize}
          >
            <svg
              viewBox="0 0 11 11"
              className="h-2 w-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M11 4.399V5.5H0V4.399h11z"
                fill="#ffffff"
              />
            </svg>
          </div>
        )}
        {maximizeBtn && (
          <div
            className={`flex justify-center items-center w-8 h-8 hover:bg-gray-700 transition-colors duration-200 cursor-pointer`}
            onClick={handleMaximizeToggle}
          >
            <svg
              viewBox="0 0 11 11"
              className="h-2 w-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              {!maximized ? (
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z"
                  fill="#ffffff"
                />
              ) : (
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z"
                  fill="#ffffff"
                />
              )}
            </svg>
          </div>
        )}
        {closeBtn && (
          <div
            className="flex justify-center items-center w-8 h-8 hover:bg-red-700 transition-colors duration-200 cursor-pointer rounded-tr-lg"
            onClick={handleClose}
          >
            <svg
              viewBox="0 0 11 11"
              className="h-2 w-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"
                fill="#ffffff"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
