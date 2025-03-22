
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import ShareProfile from "./ShareProfile";

interface ProfileHeaderProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ analysis, itemVariants }) => (
  <motion.div 
    variants={itemVariants} 
    className="flex flex-col md:flex-row justify-between items-center gap-6 py-4"
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg avatar-glow">
          <AvatarImage src="/placeholder.svg" alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-2xl font-semibold text-primary-foreground">
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Based on your assessment from {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'recently'}</p>
      </div>
    </div>
    
    <ShareProfile analysis={analysis} />
  </motion.div>
);

export default ProfileHeader;
