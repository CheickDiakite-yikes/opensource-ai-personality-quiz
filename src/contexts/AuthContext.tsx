
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { uploadAvatar } from "@/utils/avatarUtils";

type UserMetadata = {
  age?: number;
  city?: string;
  state?: string;
  gender?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (
    email: string, 
    password: string, 
    name?: string, 
    metadata?: UserMetadata,
    avatarFile?: File | null
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up the auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        if (event === 'SIGNED_OUT') {
          // Clear user and session data on sign out
          setSession(null);
          setUser(null);
        } else {
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Got existing session:", existingSession?.user?.id);
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    name?: string, 
    metadata?: UserMetadata,
    avatarFile?: File | null
  ) => {
    try {
      setIsLoading(true);
      
      // Prepare user metadata
      const userData = {
        name: name || email.split('@')[0],
        ...metadata
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        throw error;
      }

      // If user was created and they provided an avatar, upload it
      if (data.user && avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile, data.user.id);
        
        if (avatarUrl) {
          // Update the profile with the avatar URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Error updating profile with avatar:", updateError);
          }
        }
      }

      toast.success("Welcome to your self-discovery journey! Please check your email for verification.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error creating account");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Explicitly set the user and session data
      setUser(data.user);
      setSession(data.session);

      toast.success("Welcome back to your self-discovery journey!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error logging in");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Explicitly clear user and session
      setUser(null);
      setSession(null);

      navigate("/auth");
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
    session,
    isLoading,
    signUp,
    signIn,
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
