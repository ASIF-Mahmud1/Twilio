import React from 'react';
import './App.css';
import SyncApp from './SyncApp';

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Sync Users Queue</h1>
      </header>
      <main>
        <SyncApp />
      </main>
      <footer>
        <p>
          Made with{' '}
          <span role="img" aria-label="React">
            ⚛️
          </span>{' '}
          by <a href="https://www.linkedin.com/in/asif-mahmud-337945178/">Asif</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
/*
https://www.twilio.com/blog/share-online-status-express-react-twilio-sync
*/