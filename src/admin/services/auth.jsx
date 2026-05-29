import { createContext, useContext, useState, useEffect } from "react";
import { adminLogin, adminLogout } from "@admin/services/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("admin-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await adminLogin({ email, password });
    const mockUser = { id: "admin", name: "Admin TK", email, role: "admin" };
    localStorage.setItem("admin-user", JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch {
      // Local logout should still clear the admin session if the API is unavailable.
    }
    localStorage.removeItem("admin-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
