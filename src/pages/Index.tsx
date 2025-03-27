
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedDocuments from "@/components/FeaturedDocuments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, Download, Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "High-Quality Documents",
      description: "Access thousands of premium academic, business, and educational documents curated for quality.",
    },
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: "Easy Downloads",
      description: "Subscribe once and download unlimited free documents, or purchase premium documents individually.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Created by Experts",
      description: "All documents are created by field experts and professionals to ensure accuracy and value.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Secure Platform",
      description: "Your data and payments are always secure with our enterprise-grade encryption and protection.",
    },
  ];
  
  const testimonials = [
    {
      name: "Nguyen Minh",
      role: "University Student",
      content: "DocAccess has been essential for my research projects. The quality of documents and ease of access made my academic work much easier.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Tran Linh",
      role: "Business Owner",
      content: "The business templates saved me countless hours. Well worth the subscription for the time saved and professional quality.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Pham Duc",
      role: "Researcher",
      content: "As a researcher, having reliable sources is crucial. DocAccess provides exactly that with their extensive document library.",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <FeaturedDocuments />
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Everything You Need in One Platform
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our document platform is designed to make accessing high-quality materials simple, secure, and affordable.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 p-3 rounded-full bg-primary/10">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-block text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-6">
                    Affordable Plans
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Access Premium Documents?</h2>
                  <p className="text-muted-foreground mb-8">
                    Choose a subscription plan that works for you and get unlimited access to our growing library of free documents. Premium documents available for individual purchase.
                  </p>
                  <Button asChild size="lg" className="w-full md:w-auto">
                    <Link to="/pricing">
                      See Our Pricing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-primary/90 to-primary h-full p-8 md:p-12 flex items-center justify-center">
                  <div className="text-white space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Download className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold">Starting from</h3>
                    </div>
                    <div>
                      <span className="text-5xl font-bold">30.000₫</span>
                      <span className="text-white/90 ml-2">/month</span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        <span>Unlimited free document downloads</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        <span>No download restrictions</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        <span>Access to all free content</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                What Our Users Say
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of satisfied users who rely on our platform for their document needs.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-4">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="italic text-muted-foreground">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper component for the pricing section
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default Index;
