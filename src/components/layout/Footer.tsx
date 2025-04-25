
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-4 border-t text-center text-sm text-muted-foreground">
      <div className="container">
        <p>© {new Date().getFullYear()} Who Am I - AI Personality Analysis</p>
      </div>
    </footer>
  );
};

export default Footer;
