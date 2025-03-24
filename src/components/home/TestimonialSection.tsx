
import React from "react";
import { motion } from "framer-motion";
import AnimatedTestimonials from "@/components/testimonials/AnimatedTestimonials";

const TestimonialSection: React.FC = () => {
  // Enhanced testimonials with better images of real people
  const testimonials = [
    {
      quote: "This app helped me understand why I react to situations the way I do. It's been genuinely transformative for my personal growth journey.",
      name: "Sarah K.",
      designation: "Marketing Director",
      imageSrc: "/lovable-uploads/03c0c12c-5bc0-4613-811a-662add832c4f.png" 
    },
    {
      quote: "The personalized growth plan is exactly what I needed to make meaningful changes. Now I can see clear progress in areas I've struggled with for years.",
      name: "Michael T.",
      designation: "Software Engineer",
      imageSrc: "/lovable-uploads/9c15c55d-2498-4c6b-868b-51fecd3b2f3c.png"
    },
    {
      quote: "The assessment was incredibly accurate! I finally feel like I understand myself better and can focus on the right growth areas.",
      name: "Jessica L.",
      designation: "Teacher",
      imageSrc: "/lovable-uploads/94f8c274-1a06-4bde-8383-3a46aea85f20.png"
    }
  ];

  return (
    <div className="py-20 relative z-10">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Others Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have transformed their lives through self-discovery.
          </p>
        </motion.div>
        
        <AnimatedTestimonials 
          testimonials={testimonials} 
          autoplay={true}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default TestimonialSection;
