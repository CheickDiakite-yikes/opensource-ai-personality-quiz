
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserIcon, CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import AvatarUpload from "../AvatarUpload";

interface RegisterStep2Props {
  name: string;
  age: string;
  gender: string;
  avatarPreview: string | null;
  onNameChange: (name: string) => void;
  onAgeChange: (age: string) => void;
  onGenderChange: (gender: string) => void;
  onAvatarChange: (file: File | null) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const RegisterStep2: React.FC<RegisterStep2Props> = ({
  name,
  age,
  gender,
  avatarPreview,
  onNameChange,
  onAgeChange,
  onGenderChange,
  onAvatarChange,
  onPrevious,
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
      key="step2"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-center">Tell Us About You</h3>
        <p className="text-muted-foreground text-center text-sm">
          Help us personalize your experience
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <AvatarUpload 
          onImageChange={onAvatarChange} 
          previewUrl={avatarPreview} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="name" 
            type="text" 
            placeholder="John Doe" 
            className="pl-10"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="age" 
            type="number" 
            placeholder="25" 
            className="pl-10"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <div className="pl-2">
          <RadioGroup id="gender" value={gender} onValueChange={onGenderChange} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-binary" id="non-binary" />
              <Label htmlFor="non-binary" className="cursor-pointer">Non-binary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
              <Label htmlFor="prefer-not-to-say" className="cursor-pointer">Prefer not to say</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={onPrevious}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          type="button" 
          className="flex-1" 
          onClick={onNext} 
          disabled={!name}
        >
          Continue <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default RegisterStep2;
