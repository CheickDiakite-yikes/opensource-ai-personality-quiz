
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import ShareProfile from "./ShareProfile";

interface ProfileHeaderProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
  isMobile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ analysis, itemVariants, isMobile = false }) => (
  <motion.div 
    variants={itemVariants} 
    className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row justify-between items-center gap-6'} py-4`}
  >
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="relative">
        <Avatar className={`${isMobile ? 'h-16 w-16' : 'h-24 w-24'} border-4 border-primary/20 shadow-lg avatar-glow`}>
          <AvatarImage src="/placeholder.svg" alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-2xl font-semibold text-primary-foreground">
            <User className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Your Profile</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Based on your assessment from {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'recently'}
        </p>
      </div>
    </div>
    
    <div className={`${isMobile ? 'w-full' : ''}`}>
      <ShareProfile analysis={analysis} />
    </div>
  </motion.div>
);

export default ProfileHeader;
