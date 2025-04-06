
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
  return (
    <div className="bg-gradient-to-r from-primary/10 to-blue-400/10 py-20 relative z-10">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-950">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {description}
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="px-10 py-6 h-auto text-lg rounded-full shadow-lg flex items-center justify-center"
              onClick={onAction}
            >
              <span>{buttonText}</span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;
