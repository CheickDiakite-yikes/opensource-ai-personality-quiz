
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import ShareProfile from "./ShareProfile";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileHeaderProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ analysis, itemVariants }) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      variants={itemVariants} 
      className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row justify-between items-center gap-6'} py-2 md:py-4`}
    >
      <div className={`flex ${isMobile ? 'flex-col items-center text-center w-full' : 'items-center'} gap-4`}>
        <div className="relative">
          <Avatar className={`${isMobile ? 'h-20 w-20' : 'h-24 w-24'} border-4 border-primary/20 shadow-lg avatar-glow mx-auto`}>
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-2xl font-semibold text-primary-foreground">
              <User className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'}`} />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Your Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Based on your assessment from {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'recently'}
          </p>
        </div>
      </div>
      
      <div className={isMobile ? 'w-full' : ''}>
        <ShareProfile analysis={analysis} />
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
