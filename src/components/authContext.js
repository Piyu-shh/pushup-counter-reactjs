// src/context/AuthContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './signInConfig';
import { getUserProfile, setUserProfile } from './getAndPost';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [uuid, setUuid] = useState(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      const idToken = await currentUser.getIdToken();
      const response = await fetch('https://pushup-counter-backend.onrender.com/login/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.auth_token);

        const profile = await getUserProfile();
        if (profile) {
          setUserData(profile);
          setUuid(profile.user_id);
        } else {
          const newUserProfile = {
            gender: 'Male', // Default or fetched data
            dob: new Date().toISOString(), // Default or fetched data
            height_feet: 5, // Default or fetched data
            height_inches: 8, // Default or fetched data
            weight: 70, // Default or fetched data
            weight_unit: 'kg', // Default or fetched data
            user_id: data.userid // Assuming this is required
          };
          const uuid = await setUserProfile(newUserProfile);
          if (uuid) {
            newUserProfile.user_id = uuid;
            setUserData(newUserProfile);
            setUuid(newUserProfile.user_id);
          }
        }
      } else {
        console.error('Failed to login', response.statusText);
      }
    } catch (error) {
      console.error('Error verifying ID token', error);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem('auth_token');
    setUser(null);
    setUserData(null);
    setUuid(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const response = await fetch('http://localhost:8000/login/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_token: idToken }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth_token', data.auth_token);

            const profile = await getUserProfile();
            if (profile) {
              setUserData(profile);
              setUuid(profile.user_id);
            } else {
              // Handle the case where profile does not exist, if needed
            }
          } else {
            console.error('Failed to login', response.statusText);
          }
        } catch (error) {
          console.error('Error verifying ID token', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('auth_token');
    const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, loading, userData, uuid, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
