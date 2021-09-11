import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { sendMessage, useMessages } from '../functions/chatFunctions';
import { database, user } from '../state/database';
import ScrollToBottom from 'react-scroll-to-bottom';
import moment from 'moment';

export default function ChatPage() {
  let history = useHistory();
  let { chat } = useParams();
  let [name, setName] = useState('');
  let [image, setImage] = useState('');
  let [status, setStatus] = useState('');
  let [messages] = useMessages();
  let [message, setMessage] = useState('');
  let messageRef = useRef();

  useEffect(() => {
    database.user(chat).on((data, key) => {
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
          <Link to={`/profile/${chat}`}>
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

      <div className="relative w-screen h-full">
        <div className="absolute bottom-16 top-0 left-0 right-0 overflow-y-auto pb-2">
          <ScrollToBottom className="h-full">
            {messages.length > 0 &&
              messages
                .sort((a, b) => {
                  if (a.time > b.time) return 1;
                  if (a.time < b.time) return -1;

                  return 0;
                })
                .map(
                  ({ from, key, message, read, received, sent, time, type }) =>
                    from === user.is.pub ? (
                      <div class="flex flex-col w-full px-2 pt-1">
                        <div class="ml-auto rounded-md px-2 py-1 border-l border-t border-r border-b border-gray-850 text-md select-text max-w-6xl">
                          {message}
                        </div>
                        <div className="ml-auto mt-1 text-xs">
                          {moment(time).format('LT')}
                        </div>
                      </div>
                    ) : (
                      <div class="flex flex-col w-full px-2 pt-1">
                        <div class="mr-auto rounded-md px-2 py-1 bg-gray-850 shadow-md select-text max-w-6xl">
                          {message}
                        </div>
                        <div className="mr-auto mt-1 text-xs">
                          {moment(time).format('LT')}
                        </div>
                      </div>
                    )
                )}
          </ScrollToBottom>
        </div>

        <div className="absolute left-0 bottom-0 right-0 p-2">
          <div className="flex flex-none items-center w-full h-auto max-h-36 shadow-md rounded-xl bg-gray-900 p-1 space-x-3">
            <div
              ref={messageRef}
              className={`flex w-full h-auto max-h-36 p-3 overflow-y-auto break-all bg-gray-900 text-md focus:outline-none`}
              contentEditable={true}
              placeholder="Type a message..."
              onKeyUp={(event) => {
                if (event.key !== 'Enter') setMessage(event.target.innerText);
              }}
            ></div>

            <div
              className="flex justify-center items-center flex-none w-10 h-10 rounded-full bg-blue-600 text-white cursor-pointer transition duration-150 ease-in-out pl-1 mt-auto mb-1"
              onClick={() => {
                if (message !== '')
                  sendMessage(chat, message, 'text', () => {
                    messageRef.current.innerText = '';
                    setMessage('');
                  });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform rotate-90"
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
        </div>
      </div>
    </div>
  );
}
