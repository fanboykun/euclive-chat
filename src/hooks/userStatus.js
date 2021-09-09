/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { database } from '../state/database';

import 'gun/sea';

export default function useUserStatus(publicKey) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    database.user(publicKey).get('status').once(setIsOnline);
  }, []);

  return isOnline;
}
