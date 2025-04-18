
import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to our App</h1>
        <p className="text-xl mb-8">Your journey starts here.</p>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
