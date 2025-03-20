
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-primary/10 to-blue-400/10 py-20 relative z-10">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your True Self?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Take the first step toward self-discovery and personal growth today.
          </p>
          <Button 
            size="lg" 
            className="px-10 py-6 h-auto text-lg rounded-full shadow-lg"
            onClick={() => navigate("/assessment")}
          >
            Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;
