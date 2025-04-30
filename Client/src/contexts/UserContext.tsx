import { createContext, useContext, useState, ReactNode } from "react";

type UserContextType = {
  username: string;
  isLobbyAdmin: boolean;
  setUsername: (name: string) => void;
  setIsLobbyAdmin: (isAdmin: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");
  const [isLobbyAdmin, setIsLobbyAdmin] = useState(false);

  return (
    <UserContext.Provider
      value={{ username, setUsername, isLobbyAdmin, setIsLobbyAdmin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
