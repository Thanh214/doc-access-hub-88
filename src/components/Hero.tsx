
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-70"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
      
      {/* Circle decorations */}
      <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-20 left-[20%] w-72 h-72 rounded-full bg-indigo-100/30 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Access Premium Documents <br />
            <span className="text-primary">For Your Needs</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse through our vast collection of high-quality documents, research papers, and educational materials. Preview for free, download with a subscription.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/documents">
                Browse Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 relative mx-auto max-w-5xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:shadow-xl hover:-translate-y-1 duration-300">
            <div className="aspect-[16/9] bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="bg-primary/10 inline-flex items-center justify-center p-4 rounded-full mb-6">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Discover Thousands of Documents</h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Easily search, preview and download high-quality documents for your research, business, or educational needs.
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -z-10 -top-6 -left-6 w-20 h-20 border-2 border-primary/20 rounded-lg" />
          <div className="absolute -z-10 -bottom-6 -right-6 w-20 h-20 border-2 border-primary/20 rounded-lg" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
