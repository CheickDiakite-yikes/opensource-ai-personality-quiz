
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareerInsights } from "@/utils/big-me/types";

interface BigMeCareerSectionProps {
  data: CareerInsights;
}

const BigMeCareerSection: React.FC<BigMeCareerSectionProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Career Insights</h2>
      
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
          <CardTitle className="text-emerald-700 dark:text-emerald-400">Professional Strengths</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.naturalStrengths.map((strength, index) => (
              <li key={index} className="text-muted-foreground">{strength}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-700 dark:text-blue-400">Workplace Needs</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.workplaceNeeds.map((need, index) => (
              <li key={index} className="text-muted-foreground">{need}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
          <CardTitle className="text-indigo-700 dark:text-indigo-400">Leadership Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.leadershipStyle}</p>
        </CardContent>
      </Card>
      
      <Card className="border-teal-200 dark:border-teal-900">
        <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
          <CardTitle className="text-teal-700 dark:text-teal-400">Ideal Work Environment</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.idealWorkEnvironment}</p>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="text-purple-700 dark:text-purple-400">Career Pathways</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.careerPathways.map((pathway, index) => (
              <li key={index} className="text-muted-foreground">{pathway}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
          <CardTitle className="text-amber-700 dark:text-amber-400">Professional Challenges</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.professionalChallenges.map((challenge, index) => (
              <li key={index} className="text-muted-foreground">{challenge}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-green-700 dark:text-green-400">Potential Roles</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.potentialRoles.map((role, index) => (
              <li key={index} className="text-muted-foreground">{role}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BigMeCareerSection;
