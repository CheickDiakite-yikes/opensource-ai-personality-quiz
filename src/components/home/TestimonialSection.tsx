
import React from "react";
import { motion } from "framer-motion";
import AnimatedTestimonials from "@/components/testimonials/AnimatedTestimonials";

const TestimonialSection: React.FC = () => {
  // Enhanced testimonials with images
  const testimonials = [
    {
      quote: "This app helped me understand why I react to situations the way I do. It's been genuinely transformative for my personal growth journey.",
      name: "Sarah K.",
      designation: "Marketing Director",
      imageSrc: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80"
    },
    {
      quote: "No one has gotten me like SOWAI, fun little app to learn more about yourself.",
      name: "Dylon Adu-Gyamfi",
      designation: "Business Development Rep",
      imageSrc: "/lovable-uploads/7dbee29b-e195-40e9-9276-aa97e44288fb.png"
    },
    {
      quote: "The assessment was incredibly accurate! I finally feel like I understand myself better and can focus on the right growth areas.",
      name: "Jessica L.",
      designation: "Teacher",
      imageSrc: "/lovable-uploads/935925a4-6895-4fd1-ab6d-38c6112194cc.png"
    }
  ];

  return (
    <div className="py-20 relative z-10 ghibli-banner">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ghibli-title">What Others Say</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
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
