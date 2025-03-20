
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AssessmentQuestion, QuestionCategory } from "@/utils/types";

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

  // Category color mapping
  const getCategoryColor = (category: QuestionCategory): string => {
    const categoryColors: Record<QuestionCategory, string> = {
      [QuestionCategory.PersonalityTraits]: "from-blue-600/20 to-blue-800/20",
      [QuestionCategory.EmotionalIntelligence]: "from-pink-600/20 to-pink-800/20",
      [QuestionCategory.CognitivePatterns]: "from-purple-600/20 to-purple-800/20",
      [QuestionCategory.ValueSystems]: "from-amber-600/20 to-amber-800/20",
      [QuestionCategory.Motivation]: "from-green-600/20 to-green-800/20",
      [QuestionCategory.Resilience]: "from-cyan-600/20 to-cyan-800/20",
      [QuestionCategory.SocialInteraction]: "from-indigo-600/20 to-indigo-800/20",
      [QuestionCategory.DecisionMaking]: "from-orange-600/20 to-orange-800/20",
      [QuestionCategory.Creativity]: "from-violet-600/20 to-violet-800/20",
      [QuestionCategory.Leadership]: "from-red-600/20 to-red-800/20",
    };
    
    return categoryColors[category];
  };
  
  // Format category name for display
  const formatCategoryName = (category: QuestionCategory): string => {
    // Add spaces before capital letters and capitalize first letter
    return category
      .replace(/([A-Z])/g, ' $1')
      .trim();
  };

  return (
    <Card className={`glass-panel p-6 md:p-8 rounded-xl mb-6 h-full overflow-hidden bg-gradient-to-br ${getCategoryColor(question.category)}`}>
      <motion.div
        key={question.id}
        initial="enter"
        animate="center"
        exit="exit"
        variants={cardVariants}
        className="h-full flex flex-col"
      >
        <div className="mb-4">
          <Badge variant="outline" className="mb-3 bg-black/10 dark:bg-white/10 backdrop-blur-sm">
            {formatCategoryName(question.category)}
          </Badge>
          <h2 className="text-xl font-medium">
            {question.question}
          </h2>
        </div>
        
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
              className="mt-6"
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
                className="min-h-[120px] bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:bg-white/70 dark:focus:bg-black/30 transition-colors"
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
