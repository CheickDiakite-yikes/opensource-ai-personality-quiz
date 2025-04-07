import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onAction?: () => void;
}
const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to Discover Your True Self?",
  description = "Take the first step toward self-discovery and personal growth today.",
  buttonText = "Start Assessment",
  onAction
}) => {
  return <div className="relative overflow-hidden py-20 z-10">
      {/* Ghibli-inspired background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/80 to-amber-50/80 ghibli-paper-texture"></div>
      
      {/* Floating elements */}
      <motion.div className="absolute top-10 left-[15%] opacity-60 text-primary/50" animate={{
      y: [0, -15, 0],
      x: [0, 5, 0]
    }} transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }}>
        <Cloud size={40} />
      </motion.div>
      
      <motion.div className="absolute bottom-10 right-[10%] opacity-60 text-primary/50" animate={{
      y: [0, -10, 0],
      x: [0, -5, 0]
    }} transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1.5
    }}>
        <Cloud size={30} />
      </motion.div>
      
      <motion.div className="absolute top-1/2 right-[20%] opacity-50 text-primary/40" animate={{
      x: [0, 10, 0],
      rotate: [0, 5, 0]
    }} transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut"
    }}>
        <Wind size={35} />
      </motion.div>
      
      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 text-center relative">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true,
        margin: "-100px"
      }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-900">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {description}
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="ghibli-btn-enhanced px-10 py-6 h-auto text-lg" onClick={onAction}>
              <span>{buttonText}</span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative border at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-contain bg-repeat-x opacity-70" style={{
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='20' viewBox='0 0 60 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 10 Q10 5 15 10 Q20 15 25 10 Q30 5 35 10 Q40 15 45 10 Q50 5 55 10' stroke='%2372926c' stroke-width='2' fill='none' /%3E%3C/svg%3E\")"
    }}>
      </div>
    </div>;
};
export default CTASection;