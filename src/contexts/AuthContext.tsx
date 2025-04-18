
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name?: string;
};

type UserProfile = {
  age?: number;
  city?: string;
  state?: string;
  gender?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, profile?: UserProfile, avatarFile?: File | null) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock authentication
      setUser({ id: '1', email });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "Error logging in");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, profile?: UserProfile, avatarFile?: File | null) => {
    try {
      setIsLoading(true);
      // Mock signup
      setUser({ id: '1', email, name });
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.message || "Error creating account");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
