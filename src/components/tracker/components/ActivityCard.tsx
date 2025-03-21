
import React from "react";
import { Activity, ActivityCategory } from "@/utils/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIcon } from "../utils/categoryUtils";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (id: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onToggleComplete }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const IconComponent = getCategoryIcon(activity.category);
  
  // Helper function to safely determine if we need to show the collapse trigger
  const shouldShowCollapseButton = () => {
    return (
      (Array.isArray(activity.steps) && activity.steps.length > 0) || 
      (typeof activity.benefits === 'string' && activity.benefits.trim() !== '')
    );
  };
  
  // Helper to safely parse date from ID or use current date as fallback
  const getDateFromId = () => {
    if (!activity.id.includes('-')) {
      return new Date().toLocaleDateString();
    }
    
    try {
      const timestampPart = activity.id.split('-')[1];
      if (!timestampPart) return new Date().toLocaleDateString();
      
      // Convert the string to a number safely
      const timestamp = Number(timestampPart);
      if (isNaN(timestamp)) return new Date().toLocaleDateString();
      
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      console.error("Error parsing date from ID:", error);
      return new Date().toLocaleDateString();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden ${activity.completed ? 'bg-muted/50' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {React.createElement(IconComponent, { className: "h-4 w-4 text-primary" })}
                <Badge variant="outline" className="font-normal">
                  {activity.category}
                </Badge>
                <Badge className="bg-amber-500/80 hover:bg-amber-500">
                  {activity.points} pts
                </Badge>
              </div>
              <CardTitle className={`mt-2 text-lg ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                {activity.title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${activity.completed ? 'text-green-500' : 'text-muted-foreground'}`}
              onClick={() => onToggleComplete(activity.id)}
            >
              {activity.completed ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardContent className="pb-2">
            <CardDescription className={activity.completed ? 'text-muted-foreground/70' : ''}>
              {activity.description}
            </CardDescription>
          </CardContent>
          
          {shouldShowCollapseButton() && (
            <>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full flex items-center justify-center py-0">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {Array.isArray(activity.steps) && activity.steps.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-2">Steps:</h4>
                      <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                        {activity.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {activity.benefits && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                      <p className="text-sm text-muted-foreground">{activity.benefits}</p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </>
          )}
          
          <CardFooter className="py-2 text-xs text-muted-foreground">
            Added {getDateFromId()}
          </CardFooter>
        </Collapsible>
      </Card>
    </motion.div>
  );
};

export default ActivityCard;
