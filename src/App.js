/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import AuthenticationPage from './pages/Authentication';
import HomePage from './pages/Home';
import { database, user } from './state/database';
import { getTheme } from './state/theme.slice';

let App = () => {
  let theme = useSelector(getTheme);
  let [isLoggedIn, setIsLoggedIn] = useState(user.is);

  useEffect(() => {
    database.on('auth', async (_) => {
      setIsLoggedIn(user.is);
    });

    window.onbeforeunload = () => {
      database.user(user.is.pub).get('status').put('offline');
      database
        .user(user.is.pub)
        .get('status')
        .on((data, _) => {
          if (data === 'offline') {
            window.send('offlineSet');
          }
        });

      return null;
    };

    return () => {};
  }, []);

  return (
    <Router>
      <div className={theme}>
        <div className="bg-transparent flex-none text-white w-screen h-screen select-none focus:outline-none">
          {isLoggedIn ? <HomePage /> : <AuthenticationPage />}
        </div>
      </div>
    </Router>
  );
};

export default App;
