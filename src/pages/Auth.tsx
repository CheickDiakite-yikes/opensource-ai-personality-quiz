
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import PageTransition from "@/components/ui/PageTransition";
import { toast } from "sonner";

const Auth: React.FC = () => {
  const { signIn, signUp, isLoading } = useAuth();
  
  const handleAuth = (
    type: "login" | "register", 
    formData: { 
      email: string; 
      password: string; 
      name?: string;
      age?: number;
      city?: string;
      state?: string;
      gender?: string;
      avatarFile?: File | null;
    }
  ) => {
    if (type === "login") {
      signIn(formData.email, formData.password);
    } else {
      if (!formData.name) {
        toast.error("Please provide your name");
        return;
      }
      
      // Call signUp with all collected user data
      signUp(
        formData.email, 
        formData.password, 
        formData.name,
        {
          age: formData.age,
          city: formData.city,
          state: formData.state,
          gender: formData.gender,
        },
        formData.avatarFile
      );
    }
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto py-12 px-4 min-h-screen flex flex-col justify-center">
        <AuthForm onAuth={handleAuth} isLoading={isLoading} />
      </div>
    </PageTransition>
  );
};

export default Auth;
