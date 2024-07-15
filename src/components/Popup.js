import React from 'react';
import { auth, googleProvider } from './firebaseConfig';
import './Popup.css';

const Popup = ({ togglePopup }) => {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleProvider);
      console.log('User signed in');
      togglePopup();
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="popup-container">
      <div className="container">
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      </div>
    </div>
  );
};

export default Popup;
