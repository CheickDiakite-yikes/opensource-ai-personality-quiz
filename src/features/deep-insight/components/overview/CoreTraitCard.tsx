
import React from "react";
import { UserCircle2 } from "lucide-react";

interface CoreTraitCardProps {
  title: string;
  value?: string;
}

export const CoreTraitCard: React.FC<CoreTraitCardProps> = ({ title, value }) => {
  return (
    <div className="bg-secondary/20 p-4 rounded-md">
      <h3 className="font-semibold mb-2 flex items-center">
        <div className="bg-primary/20 p-1.5 rounded-full mr-2">
          <UserCircle2 className="h-4 w-4 text-primary" />
        </div>
        {title}
      </h3>
      <p>{value || 'Not available'}</p>
    </div>
  );
};
