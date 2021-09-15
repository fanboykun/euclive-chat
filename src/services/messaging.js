import { Subject } from 'rxjs';
import { database, user } from '../state/database';

let subject = new Subject();

let update = (messages) => subject.next(messages);
let clear = () => subject.next();
let get = () => subject.asObservable();

let load = (chat) => {
  database
    .get(user.is.pub)
    .get('messages')
    .get(chat)
    .on(
      (messages) => {
        let list = [];

        for (let m in messages) {
          try {
            list.push(JSON.parse(messages[m]));
          } catch {}
        }

        update(list);
      },
      { change: true }
    );
};

export { update, clear, get, load };
