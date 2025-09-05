import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState(null);
  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
