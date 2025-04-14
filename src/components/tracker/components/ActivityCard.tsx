
import React from "react";
import { Activity, ActivityCategory } from "@/utils/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIcon } from "../utils/categoryUtils";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (id: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onToggleComplete }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const IconComponent = getCategoryIcon(activity.category);
  const isMobile = useIsMobile();
  
  // Helper function to safely determine if we need to show the collapse trigger
  const shouldShowCollapseButton = () => {
    return (
      (Array.isArray(activity.steps) && activity.steps.length > 0) || 
      (typeof activity.benefits === 'string' && activity.benefits.trim() !== '')
    );
  };
  
  // Helper to safely format date
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Unknown date';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };
  
  // Helper to safely parse date from ID or use activity's completion date
  const getDateDisplay = () => {
    // If the activity has a completedAt date, show that for completed activities
    if (activity.completed && activity.completedAt) {
      return `Completed ${formatDate(activity.completedAt)}`;
    }
    
    // If the activity has a createdAt date, use that
    if (activity.createdAt) {
      return `Added ${formatDate(activity.createdAt)}`;
    }
    
    // Fallback
    return `Added recently`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`h-full overflow-hidden ${activity.completed ? 'bg-muted/30' : 'bg-black/80'} backdrop-blur-sm border-white/10`}>
        <CardHeader className={`${isMobile ? 'pb-1 pt-3 px-3' : 'pb-2 pt-5'}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {React.createElement(IconComponent, { 
                className: `${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-amber-500` 
              })}
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium uppercase tracking-wide text-amber-500/90`}>
                {activity.category}
              </span>
              <Badge className={`bg-amber-500/80 hover:bg-amber-500 ml-1 text-black font-semibold ${isMobile ? 'text-[0.65rem] px-1.5' : ''}`}>
                {activity.points} pts
              </Badge>
            </div>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              className={`rounded-full ${activity.completed ? 'text-green-500' : 'text-muted-foreground'}`}
              onClick={() => onToggleComplete(activity.id)}
            >
              {activity.completed ? (
                <CheckCircle className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
              ) : (
                <XCircle className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
              )}
            </Button>
          </div>
          
          <CardTitle className={`mt-2 ${isMobile ? 'text-base' : 'text-2xl'} font-serif ${activity.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
            {activity.title}
          </CardTitle>
        </CardHeader>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardContent className={`${isMobile ? 'px-3 pt-0 pb-1' : 'pt-0 pb-2'}`}>
            <p className={`${isMobile ? 'text-xs' : 'text-base'} leading-relaxed ${activity.completed ? 'text-muted-foreground/70' : 'text-gray-300'}`}>
              {isMobile && activity.description.length > 120 
                ? `${activity.description.substring(0, 120)}...` 
                : activity.description}
            </p>
          </CardContent>
          
          {shouldShowCollapseButton() && (
            <>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-center py-1 my-1 text-muted-foreground"
                  size={isMobile ? "sm" : undefined}
                >
                  {isOpen ? (
                    <ChevronUp className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                  ) : (
                    <ChevronDown className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className={`${isMobile ? 'px-3 pt-0 pb-2' : 'pt-0 pb-4'}`}>
                  {Array.isArray(activity.steps) && activity.steps.length > 0 && (
                    <div className="mt-2">
                      <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-1 text-amber-500/90`}>Steps:</h4>
                      <ol className={`list-decimal list-inside ${isMobile ? 'text-xs' : 'text-sm'} text-gray-300 space-y-1 pl-1`}>
                        {activity.steps.map((step, index) => (
                          <li key={index} className="leading-relaxed">{String(step)}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {activity.benefits && (
                    <div className="mt-3">
                      <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-1 text-amber-500/90`}>Benefits:</h4>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300 leading-relaxed`}>
                        {isMobile && typeof activity.benefits === 'string' && activity.benefits.length > 100 
                          ? `${activity.benefits.substring(0, 100)}...` 
                          : activity.benefits}
                      </p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </>
          )}
          
          <CardFooter className={`py-2 ${isMobile ? 'text-[0.65rem] px-3' : 'text-xs'} text-muted-foreground border-t border-white/5 mt-1`}>
            {getDateDisplay()}
          </CardFooter>
        </Collapsible>
      </Card>
    </motion.div>
  );
};

export default ActivityCard;
