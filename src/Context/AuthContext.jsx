import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import LoadingOverlay from "../Components/LoadingOverlay";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {

          const publicRef = doc(db, "users", firebaseUser.uid, "publicProfile", "data");
          const privateRef = doc(db, "users", firebaseUser.uid, "privateProfile", "data");

          const [publicSnap, privateSnap] = await Promise.all([getDoc(publicRef), getDoc(privateRef)]);

        
          if (!publicSnap.exists() && !privateSnap.exists()) {
            const defaultPublic = {
              name: firebaseUser.displayName || "",
              reviewScore: 0,
              accountType: "student",
              skills: [],
            };
            const defaultPrivate = {
              email: firebaseUser.email,
            };

            await Promise.all([
              setDoc(publicRef, defaultPublic),
              setDoc(privateRef, defaultPrivate),
            ]);

            const newUser = {
              id: firebaseUser.uid,
              name: defaultPublic.name,
              email: firebaseUser.email,
              accountType: defaultPublic.accountType,
              publicProfile: defaultPublic,
              privateProfile: defaultPrivate,
            };

            setUser(newUser);
            localStorage.setItem("loggedInUser", JSON.stringify(newUser));
          } else {
            const publicData = publicSnap.exists() ? publicSnap.data() : {};
            const privateData = privateSnap.exists() ? privateSnap.data() : {};

            const flattenedUser = {
              id: firebaseUser.uid,
              name: publicData.name || "",
              email: firebaseUser.email,
              accountType: publicData.accountType || "student",
              publicProfile: publicData,
              privateProfile: privateData,
            };

            setUser(flattenedUser);
            localStorage.setItem("loggedInUser", JSON.stringify(flattenedUser));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        localStorage.removeItem("loggedInUser");
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <AuthContext.Provider value={{ user, authReady, login, logout }}>
      {authReady ? children : <LoadingOverlay text="Preparing your experience..." />}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
