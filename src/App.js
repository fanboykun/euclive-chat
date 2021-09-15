/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import MobileHomePage from './mobile/Home';
import MobileAuthenticationPage from './mobile/Authentication';
import AuthenticationPage from './desktop/Authentication';
import HomePage from './desktop/Home';
import { database, user } from './state/database';
import { getTheme } from './state/theme.slice';

let App = () => {
  let theme = useSelector(getTheme);
  let [isLoggedIn, setIsLoggedIn] = useState(user.is);

  useEffect(() => {
    database.on('auth', async (_) => {
      setIsLoggedIn(user.is);
    });

    return () => {};
  }, []);

  useEffect(() => {
    window.addEventListener('blur', setOfflineStatus);
    window.addEventListener('focus', setOnlineStatus);
    window.addEventListener('unload', setOfflineStatus);

    return () => {
      window.removeEventListener('blur', setOfflineStatus);
      window.removeEventListener('unload', setOfflineStatus);
      window.removeEventListener('focus', setOnlineStatus);
    };
  }, []);

  let setOnlineStatus = async () => {
    if (user.is) {
      database.user().get('status').put('online');
    }
  }

  let setOfflineStatus = async () => {
    if (user.is) {
      database.user().get('status').put('offline');
    }
  };

  return (
    <Router>
      <div className={theme}>
        <div className="bg-transparent flex-none text-white w-screen h-screen select-none focus:outline-none">
          {isLoggedIn ? (
            <>
              <BrowserView viewClassName="w-screen h-screen">
                <HomePage />
              </BrowserView>
              <MobileView viewClassName="w-screen h-screen">
                <MobileHomePage />
              </MobileView>
            </>
          ) : (
            <>
              <BrowserView viewClassName="w-screen h-screen">
                <AuthenticationPage />
              </BrowserView>
              <MobileView viewClassName="w-screen h-screen">
                <MobileAuthenticationPage />
              </MobileView>
            </>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
