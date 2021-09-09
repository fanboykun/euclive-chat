import { render } from 'solid-js/web';

import './index.css';
import App from './App';

render(App, document.getElementById('root'));

import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

