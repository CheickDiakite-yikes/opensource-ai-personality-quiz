
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonalityTrait } from "@/utils/types";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";

interface TopTraitsTableProps {
  traits: PersonalityTrait[];
}

const TopTraitsTable: React.FC<TopTraitsTableProps> = ({ traits }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    // Mobile layout: Stacked view instead of two columns
    return (
      <div className="space-y-3">
        {traits.map((trait, index) => (
          <Card key={index} className="p-3 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="font-semibold">{trait.trait}</div>
              </div>
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
                {trait.score.toFixed(1)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  // Desktop layout: 5x2 table
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
                  {trait.score.toFixed(1)}
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
                      {rightColumn[index].score.toFixed(1)}
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
