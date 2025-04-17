
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRightCircle, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DeepInsight: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Deep Insight Assessment</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover profound insights into your cognitive patterns, emotional architecture, and interpersonal dynamics with our advanced assessment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Take the Assessment</CardTitle>
            <CardDescription>
              Answer a series of thought-provoking questions to reveal your unique psychological patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This comprehensive assessment takes approximately 10-15 minutes to complete and will provide you with detailed insights into your personality traits, cognitive style, and emotional intelligence.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/deep-insight/quiz")} className="w-full">
              Begin Assessment <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <History className="h-8 w-8 text-primary mb-2" />
            <CardTitle>View Your History</CardTitle>
            <CardDescription>
              Access your previous assessment results and track your development over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Review all your saved analyses to see patterns in your responses and track how your personality insights evolve over time. Compare results from different periods to understand your growth journey.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate("/deep-insight/history")} 
              variant="outline" 
              className="w-full"
            >
              View History <History className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">About Deep Insight</h2>
        <p className="text-muted-foreground">
          The Deep Insight assessment goes beyond surface-level personality traits to analyze the underlying patterns that shape your thinking, emotional responses, and relationships. Using advanced psychometric principles, this assessment provides nuanced insights that can help you understand yourself more deeply and make more informed decisions about personal growth, career choices, and relationships.
        </p>
      </div>
    </div>
  );
};

export default DeepInsight;
