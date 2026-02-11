import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../../../services/UserService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = userService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await userService.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    logout,
    // Expose service methods for components to use
    signInWithEmail: userService.signInWithEmail.bind(userService),
    signUpWithEmail: userService.signUpWithEmail.bind(userService),
    signInWithGoogle: userService.signInWithGoogle.bind(userService),
    getUserProfile: userService.getUserProfile.bind(userService),
    updateUserProfile: userService.updateUserProfile.bind(userService),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
