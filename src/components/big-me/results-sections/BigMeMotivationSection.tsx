
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MotivationalProfile } from "@/utils/big-me/types";

interface BigMeMotivationSectionProps {
  data: MotivationalProfile;
}

const BigMeMotivationSection: React.FC<BigMeMotivationSectionProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Motivational Profile</h2>
      
      <Card className="border-violet-200 dark:border-violet-900">
        <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
          <CardTitle className="text-violet-700 dark:text-violet-400">Primary Drivers</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.primaryDrivers.map((driver, index) => (
              <li key={index} className="text-muted-foreground">{driver}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
          <CardTitle className="text-indigo-700 dark:text-indigo-400">Secondary Drivers</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.secondaryDrivers.map((driver, index) => (
              <li key={index} className="text-muted-foreground">{driver}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-rose-200 dark:border-rose-900">
        <CardHeader className="bg-rose-50 dark:bg-rose-900/20">
          <CardTitle className="text-rose-700 dark:text-rose-400">Inhibitors</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.inhibitors.map((inhibitor, index) => (
              <li key={index} className="text-muted-foreground">{inhibitor}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-700 dark:text-blue-400">Core Values</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.values.map((value, index) => (
              <li key={index} className="text-muted-foreground">{value}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
          <CardTitle className="text-emerald-700 dark:text-emerald-400">Aspirations</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.aspirations}</p>
        </CardContent>
      </Card>
      
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
          <CardTitle className="text-amber-700 dark:text-amber-400">Fear Patterns</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.fearPatterns}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BigMeMotivationSection;
