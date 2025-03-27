
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DocumentCard from "./DocumentCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Dummy data for documents
const documents = [
  {
    id: "1",
    title: "Research Paper: Modern Architecture Principles",
    description: "A comprehensive analysis of contemporary architectural principles and their applications in urban design.",
    category: "Architecture",
    thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 50000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "2",
    title: "Business Plan Template: Startup Guide",
    description: "A detailed template for creating a compelling business plan for your startup with financial projections.",
    category: "Business",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 75000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "3",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science with this comprehensive beginner-friendly guide.",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
  {
    id: "4",
    title: "Market Analysis: Renewable Energy Sector",
    description: "In-depth analysis of the renewable energy market trends, opportunities and forecasts for 2023-2030.",
    category: "Market Research",
    thumbnail: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 120000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "5",
    title: "Legal Contract Templates Bundle",
    description: "A collection of essential legal templates for various business needs and transactions.",
    category: "Legal",
    thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 90000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "6",
    title: "Beginner's Guide to Digital Marketing",
    description: "Learn the essentials of digital marketing strategies, social media, and SEO optimization.",
    category: "Marketing",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
];

const FeaturedDocuments = () => {
  const [visibleDocuments, setVisibleDocuments] = useState(documents.slice(0, 3));
  const [isShowingAll, setIsShowingAll] = useState(false);
  
  const toggleDocuments = () => {
    if (isShowingAll) {
      setVisibleDocuments(documents.slice(0, 3));
    } else {
      setVisibleDocuments(documents);
    }
    setIsShowingAll(!isShowingAll);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Documents</h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore our selection of premium and free documents curated for your needs.
            </p>
          </div>
          
          <Link 
            to="/documents" 
            className="mt-4 md:mt-0 text-primary hover:text-primary/80 transition-colors flex items-center"
          >
            Browse all documents
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {visibleDocuments.map((doc) => (
            <motion.div key={doc.id} variants={item}>
              <DocumentCard {...doc} />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            onClick={toggleDocuments}
            className="rounded-full px-6"
          >
            {isShowingAll ? "Show Less" : "Show More"}
            <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${isShowingAll ? "rotate-90" : ""}`} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDocuments;
