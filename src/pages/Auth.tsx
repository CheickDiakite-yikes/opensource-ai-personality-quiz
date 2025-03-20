
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import PageTransition from "@/components/ui/PageTransition";

const Auth: React.FC = () => {
  const { signIn, signUp, isLoading } = useAuth();
  
  const handleAuth = (type: "login" | "register", formData: { email: string; password: string; name?: string }) => {
    if (type === "login") {
      signIn(formData.email, formData.password);
    } else {
      signUp(formData.email, formData.password, formData.name);
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
