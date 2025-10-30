import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { addUserToFirestore } from "../firebaseUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let userData;
        if (userSnap.exists()) {
          userData = userSnap.data();
        } else {
          userData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email,
            accountType: "student",
            profile: null,
          };
          await addUserToFirestore(userData); 
        }

        const flattenedUser = {
          id: firebaseUser.uid,
          name: userData.name || "",
          email: firebaseUser.email,
          accountType: userData.accountType || "student",
          profile: userData.profile || null,
        };

        setUser(flattenedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(flattenedUser));
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
      {authReady ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
