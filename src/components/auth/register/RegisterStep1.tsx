
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailIcon, LockKeyholeIcon, ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";

interface RegisterStep1Props {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onNext: () => void;
}

const RegisterStep1: React.FC<RegisterStep1Props> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onNext
}) => {
  const stepVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={stepVariants}
      key="step1"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-center">Create Your Account</h3>
        <p className="text-muted-foreground text-center text-sm">
          Start your self-discovery journey
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-register">Email</Label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="email-register" 
            type="email" 
            placeholder="hello@example.com" 
            className="pl-10"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-register">Password</Label>
        <div className="relative">
          <LockKeyholeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="password-register" 
            type="password" 
            placeholder="••••••••" 
            className="pl-10"
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
      </div>
      <Button 
        type="button" 
        className="w-full" 
        onClick={onNext} 
        disabled={!email || !password}
      >
        Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default RegisterStep1;
