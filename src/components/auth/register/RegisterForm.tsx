
import React, { useState, useCallback } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";

interface RegisterFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    name: string;
    age?: number;
    city?: string;
    state?: string;
    gender?: string;
    avatarFile?: File | null;
  }) => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [registerStep, setRegisterStep] = useState<number>(1);
  const totalRegisterSteps = 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
      name,
      age: age ? parseInt(age) : undefined,
      city,
      state,
      gender,
      avatarFile
    });
  };

  const handleAvatarChange = useCallback((file: File | null) => {
    setAvatarFile(file);
    
    // Create object URL for preview
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    } else {
      setAvatarPreview(null);
    }
  }, []);

  const nextStep = () => {
    if (registerStep < totalRegisterSteps) {
      setRegisterStep(registerStep + 1);
    }
  };

  const prevStep = () => {
    if (registerStep > 1) {
      setRegisterStep(registerStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (registerStep) {
      case 1:
        return (
          <RegisterStep1
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <RegisterStep2
            name={name}
            age={age}
            gender={gender}
            avatarPreview={avatarPreview}
            onNameChange={setName}
            onAgeChange={setAge}
            onGenderChange={setGender}
            onAvatarChange={handleAvatarChange}
            onPrevious={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <RegisterStep3
            city={city}
            state={state}
            onCityChange={setCity}
            onStateChange={setState}
            onPrevious={prevStep}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderCurrentStep()}
    </form>
  );
};

export default RegisterForm;
