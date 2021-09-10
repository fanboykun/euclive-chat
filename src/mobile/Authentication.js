import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { user } from '../state/database';
import { setUserPublicKey } from '../state/user.slice';

export default function MobileAuthenticationPage() {
  let dispatch = useDispatch();
  let [error, setError] = useState('');
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [loggingIn, setLoggingIn] = useState(true);

  let login = () => {
    user.auth(username, password, ({ err, soul }) => {
      if (err) setError(err);
      else {
        dispatch(setUserPublicKey(soul));
      }
    });
  };

  let register = () => {
    user.create(username, password, ({ err }) => {
      if (err) setError(err);
      else {
        login();
      }
    });
  };

  return loggingIn ? (
    <div className="flex flex-col bg-black w-full h-full">
      {/* <Titlebar title="Lone Wolf" maximizeBtn={false} backgroundColor={false} /> */}

      <div className="flex flex-col justify-center items-center h-full w-full">
        <div className="flex flex-col justify-center items-center py-5 px-10 w-full">
          <div>Welcome to Lone Wolf.</div>
          <div className="text-gray-400">Please authenticate to proceed.</div>
          {error !== '' && <div className="text-red-600">{error}</div>}
        </div>
        <div className="flex flex-col justify-center items-center py-4 px-4 w-full space-y-4">
          <input
            className="flex justify-start items-center shadow rounded-md bg-gray-800 px-2 py-2 focus:outline-none placeholder-gray-500 text-blue-600"
            type="text"
            placeholder="Your username."
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
          <input
            className="flex justify-start items-center shadow rounded-md bg-gray-800 px-2 py-2 focus:outline-none placeholder-gray-500 text-blue-600"
            type="password"
            placeholder="Your password."
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center items-center py-4 px-4 w-full space-y-4">
          <div
            className="flex justify-center items-center px-6 py-2 rounded-md bg-blue-600 cursor-pointer"
            onClick={() => login()}
          >
            Login
          </div>
          <div className="text-sm">
            Don't have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setLoggingIn(false)}
            >
              Register.
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col bg-black w-full h-full">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <div className="flex flex-col justify-center items-center py-5 px-10 w-full">
          <div>Welcome to Lone Wolf.</div>
          <div className="text-gray-400">Please authenticate to proceed.</div>
          {error !== '' && <div className="text-red-600">{error}</div>}
        </div>
        <div className="flex flex-col justify-center items-center py-4 px-4 w-full space-y-4">
          <input
            className="flex justify-start items-center shadow rounded-md bg-gray-800 px-2 py-2 focus:outline-none placeholder-gray-500 text-blue-600"
            type="text"
            placeholder="Your username."
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
          />
          <input
            className="flex justify-start items-center shadow rounded-md bg-gray-800 px-2 py-2 focus:outline-none placeholder-gray-500 text-blue-600"
            type="password"
            placeholder="Your password."
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </div>
        <div className="flex flex-col justify-center items-center py-4 px-4 w-full space-y-4">
          <div
            className="flex justify-center items-center px-6 py-2 rounded-md bg-blue-600 cursor-pointer"
            onClick={() => register()}
          >
            Register
          </div>
          <div className="text-sm">
            Already have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setLoggingIn(true)}
            >
              Login.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
