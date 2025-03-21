
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./register/RegisterForm";

interface AuthFormProps {
  onAuth: (type: "login" | "register", data: { 
    email: string; 
    password: string; 
    name?: string;
    age?: number;
    city?: string;
    state?: string;
    gender?: string;
    avatarFile?: File | null;
  }) => void;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth, isLoading }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  const handleLogin = (email: string, password: string) => {
    onAuth("login", { email, password });
  };
  
  const handleRegister = (formData: {
    email: string;
    password: string;
    name: string;
    age?: number;
    city?: string;
    state?: string;
    gender?: string;
    avatarFile?: File | null;
  }) => {
    onAuth("register", formData);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="glass-panel p-8 rounded-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gradient">Who Am I?</h2>
          <p className="text-muted-foreground mt-2">
            Discover your true self through AI-powered insights
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuthForm;
