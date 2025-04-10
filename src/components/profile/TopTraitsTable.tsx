
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonalityTrait } from "@/utils/types";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useViewport } from "@/hooks/use-mobile";

interface TopTraitsTableProps {
  traits: PersonalityTrait[];
}

const TopTraitsTable: React.FC<TopTraitsTableProps> = ({ traits }) => {
  const isMobile = useIsMobile();
  const { width } = useViewport();
  
  // Use a more specific check for very small screens
  const isVerySmallScreen = width < 380;
  
  // Helper function to format trait scores consistently
  const formatTraitScore = (score: number): number => {
    // If score is already between 0 and 10, use it directly
    if (score > 0 && score <= 10) {
      return Math.round(score);
    }
    // If score is between 0 and 1, scale to 0-10
    else if (score >= 0 && score <= 1) {
      return Math.round(score * 10);
    }
    // If score is greater than 10 (e.g., 0-100 scale), convert to 0-10
    else if (score > 10) {
      return Math.round((score / 100) * 10);
    }
    return Math.round(score);
  };
  
  if (isMobile) {
    // Single column layout for mobile
    return (
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`w-[28px] ${isVerySmallScreen ? 'text-xs' : ''}`}>Rank</TableHead>
              <TableHead className={isVerySmallScreen ? 'text-xs' : ''}>Trait</TableHead>
              <TableHead className={`text-right w-[50px] ${isVerySmallScreen ? 'text-xs' : ''}`}>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {traits.map((trait, index) => (
              <TableRow key={index} className="hover-lift">
                <TableCell className={`font-medium py-1.5 ${isVerySmallScreen ? 'text-xs px-1' : 'py-2'}`}>
                  {index + 1}
                </TableCell>
                <TableCell className={`${isVerySmallScreen ? 'text-xs px-2 py-1.5' : 'py-2'}`}>
                  <div className={`font-semibold ${isVerySmallScreen ? 'text-xs' : ''}`}>{trait.trait}</div>
                </TableCell>
                <TableCell className={`text-right ${isVerySmallScreen ? 'text-xs px-1 py-1.5' : 'py-2'}`}>
                  <div className={`inline-flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold ${isVerySmallScreen ? 'text-xs h-5 w-5' : 'text-sm h-7 w-7'}`}>
                    {formatTraitScore(trait.score)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  // Desktop layout with two columns
  const leftColumn = traits.slice(0, 5);
  const rightColumn = traits.slice(5, 10);
  
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Trait</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Trait</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leftColumn.map((trait, index) => (
            <TableRow key={index} className="hover-lift">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="font-semibold">{trait.trait}</div>
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
                  {formatTraitScore(trait.score)}
                </div>
              </TableCell>
              
              {/* Right column cells, only if there's a trait at this index */}
              {rightColumn[index] ? (
                <>
                  <TableCell className="font-medium">{index + 6}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{rightColumn[index].trait}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {formatTraitScore(rightColumn[index].score)}
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopTraitsTable;
