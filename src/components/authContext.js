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

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await getUserProfile(uuid);
        if (profile) {
          setUserData(profile);
          setUuid(profile.user_id);
        } else {
          const newUserProfile = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            metadata: {
              creationTime: currentUser.metadata.creationTime,
              lastSignInTime: currentUser.metadata.lastSignInTime,
            },
          };
          const uuid = await setUserProfile(newUserProfile);
          if (uuid) {
            newUserProfile.user_id = uuid;
            setUserData(newUserProfile);
            setUuid(newUserProfile.user_id);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, loading, userData, uuid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
