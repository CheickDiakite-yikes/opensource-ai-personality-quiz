
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AssessmentQuestion } from "@/utils/types";

interface QuestionCardProps {
  question: AssessmentQuestion;
  selectedOption?: string;
  customResponse?: string;
  onOptionSelect: (option: string) => void;
  onCustomResponseChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  useCustomResponse: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  customResponse,
  onOptionSelect,
  onCustomResponseChange,
  useCustomResponse,
}) => {
  // Animation variants
  const cardVariants = {
    enter: { opacity: 0, x: 100, scale: 0.95 },
    center: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -100, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const optionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <Card className="glass-panel p-6 md:p-8 rounded-xl mb-6 h-full overflow-hidden">
      <motion.div
        key={question.id}
        initial="enter"
        animate="center"
        exit="exit"
        variants={cardVariants}
        className="h-full flex flex-col"
      >
        <h2 className="text-xl font-medium mb-6">
          {question.question}
        </h2>
        
        <div className="flex-1">
          <RadioGroup 
            value={selectedOption} 
            className="space-y-3 mb-6"
            onValueChange={onOptionSelect}
          >
            {question.options.map((option, idx) => (
              <motion.div 
                key={option} 
                className="flex items-start space-x-2"
                variants={optionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: idx * 0.08 }}
              >
                <RadioGroupItem value={option} id={option} className="mt-1" />
                <Label 
                  htmlFor={option} 
                  className="text-base leading-relaxed cursor-pointer"
                >
                  {option}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
          
          {question.allowCustomResponse && (
            <motion.div 
              className="mt-4"
              variants={optionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <Label 
                htmlFor="custom-response" 
                className="block text-base font-medium mb-2"
              >
                Or provide your own response (optional)
              </Label>
              <Textarea 
                id="custom-response"
                placeholder="Write your response here..."
                value={customResponse || ""}
                onChange={onCustomResponseChange}
                className="min-h-[120px]"
                maxLength={300}
              />
              {customResponse && (
                <div className="text-xs text-right mt-1 text-muted-foreground">
                  {customResponse.length}/300 characters
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default QuestionCard;
