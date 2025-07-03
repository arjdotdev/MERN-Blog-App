import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  login: (jwt: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});
console.log("AuthContext", AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    // 1️⃣ initialize from localStorage if present
    return localStorage.getItem("token");
  });

  // 2️⃣ Persist token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      console.log("first useEffect run");
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  // useEffect is for the change of token by login and logout

  const login = (jwt: string) => {
    setToken(jwt);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Custom hook for easy consumption
export const useAuth = () => useContext(AuthContext);
