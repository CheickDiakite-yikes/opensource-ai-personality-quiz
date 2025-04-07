
import React from "react";
import { motion } from "framer-motion";
import AnimatedTestimonials from "@/components/testimonials/AnimatedTestimonials";

const TestimonialSection: React.FC = () => {
  // Enhanced testimonials with images
  const testimonials = [
    {
      quote: "WOW! This is amazing! I honestly wasn't expecting it to be so accurate, it completely nailed my personality. It felt to real and I got some work to do lol, I may or may not be that crazy, haha! Can't wait to see what my friends get.",
      name: "Mikayla Ching",
      designation: "History and Law Student at WSU",
      imageSrc: "/lovable-uploads/c036c5f8-27fb-4951-9e53-8358876ebd49.png"
    },
    {
      quote: "I didn't realize AI could read me so well! Sowai was easy, smooth, and surprisingly gave a very detailed report! It was fascinating to see all the career paths aligned with my personality. Loved it!",
      name: "Tiersen Lenois",
      designation: "Legal Administrative Specialist at Massumi + Consoli",
      imageSrc: "/lovable-uploads/40a30885-9182-4bd4-a8fc-7e4a9cc2503a.png"
    },
    {
      quote: "No one has gotten me like SOWAI, fun little app to learn more about yourself.",
      name: "Dylon Adu-Gyamfi",
      designation: "Business Development Rep",
      imageSrc: "/lovable-uploads/7dbee29b-e195-40e9-9276-aa97e44288fb.png"
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
