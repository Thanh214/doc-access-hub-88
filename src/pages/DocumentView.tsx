
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentPreview from "@/components/DocumentPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

// Sample document data (in a real app, this would come from an API)
const documentData = {
  "1": {
    id: "1",
    title: "Research Paper: Modern Architecture Principles",
    description: "A comprehensive analysis of contemporary architectural principles and their applications in urban design. This document explores innovative approaches to sustainable architecture, urban planning, and design philosophies that shape modern cities.",
    category: "Architecture",
    thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 50000,
    isFree: false,
    pages: 42,
    fileSize: "3.2 MB",
    dateAdded: "2023-05-12",
    previewContent: `
      <h2>Abstract</h2>
      <p>This research paper examines the fundamental principles that define modern architectural practice, with particular emphasis on sustainability, functionality, and aesthetic considerations. Through case studies of significant structures built within the last decade, the paper identifies recurring patterns and approaches that characterize successful contemporary design.</p>
      
      <h2>1. Introduction</h2>
      <p>Architecture stands as one of humanity's most enduring expressions of cultural and technological achievement. As society evolves, so too do the principles that guide architectural design and urban planning. This paper explores the key principles that define modern architecture in the 21st century, examining how contemporary architects balance aesthetic considerations with practical concerns such as sustainability, accessibility, and technological integration.</p>
      
      <h2>2. Methodology</h2>
      <p>This study employs a mixed-methods approach, combining qualitative analysis of architectural criticism with quantitative assessment of building performance metrics. Ten case studies were selected based on their recognition within the architectural community, geographic diversity, and completion within the past decade (2010-2020).</p>
      
      <h2>3. Key Principles of Modern Architecture</h2>
      <p>Through our analysis, several core principles emerge as foundational to contemporary architectural practice:</p>
      
      <h3>3.1 Sustainability</h3>
      <p>Environmental consciousness has become perhaps the defining characteristic of modern architecture. This manifests through:</p>
      <ul>
        <li>Energy efficiency and reduced carbon footprint</li>
        <li>Integration of renewable energy systems</li>
        <li>Use of sustainable and locally-sourced materials</li>
        <li>Water conservation and management systems</li>
      </ul>
      
      <h3>3.2 Technological Integration</h3>
      <p>Modern buildings increasingly function as technological ecosystems, with architecture serving as the physical framework for complex digital systems:</p>
      <ul>
        <li>Smart building management systems</li>
        <li>IoT integration for environmental control</li>
        <li>Digital fabrication techniques enabling complex geometries</li>
        <li>Augmented reality applications for spatial planning</li>
      </ul>
      
      <p>The remainder of this paper explores these principles in greater detail through our case studies...</p>
    `,
  },
  "2": {
    id: "2",
    title: "Business Plan Template: Startup Guide",
    description: "A detailed template for creating a compelling business plan for your startup with financial projections. This comprehensive guide includes all sections needed for a professional business plan that attracts investors.",
    category: "Business",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 75000,
    isFree: false,
    pages: 28,
    fileSize: "1.8 MB",
    dateAdded: "2023-06-25",
    previewContent: `
      <h2>Introduction: Creating an Effective Business Plan</h2>
      
      <p>A well-crafted business plan serves as the foundation for any successful startup venture. This document not only clarifies your business vision and strategy but also serves as a crucial tool for securing funding from potential investors. The following template provides a comprehensive framework for developing a business plan that effectively communicates your value proposition, market opportunity, and growth strategy.</p>
      
      <h2>1. Executive Summary</h2>
      
      <p>The executive summary offers a concise overview of your business plan, highlighting the key points that will be elaborated upon in subsequent sections. Though appearing first in the document, this section is typically written last to ensure it accurately reflects the comprehensive details of your plan.</p>
      
      <h3>Key Components:</h3>
      <ul>
        <li>Business concept: A brief description of your business, the products or services offered, and the problem they solve</li>
        <li>Value proposition: What makes your offering unique in the marketplace</li>
        <li>Target market: A summary of your ideal customer and market size</li>
        <li>Business model: How you will generate revenue</li>
        <li>Marketing and sales strategy: Your approach to customer acquisition</li>
        <li>Financial projections: Brief overview of expected revenues, expenses, and profitability timeline</li>
        <li>Funding requirements: The amount of capital needed and how it will be used</li>
      </ul>
      
      <h2>2. Company Description</h2>
      
      <p>This section provides a detailed overview of your company, including its mission, vision, and core values. Articulate the fundamental purpose of your business and the guiding principles that will shape its operations and culture.</p>
      
      <h3>Key Components:</h3>
      <ul>
        <li>Company history (if applicable)</li>
        <li>Mission statement: The purpose of your business</li>
        <li>Vision statement: Your long-term aspirations</li>
        <li>Core values: The principles that guide your business operations</li>
        <li>Business structure: Legal structure (LLC, corporation, etc.)</li>
        <li>Location and facilities</li>
        <li>Ownership structure</li>
      </ul>
      
      <p>Remaining sections include market analysis, organization structure, product/service details, marketing strategy, financial projections, and appendices...</p>
    `,
  },
  "3": {
    id: "3",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science with this comprehensive beginner-friendly guide. Perfect for students and self-learners looking to build a foundation in programming and computer theory.",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    pages: 120,
    fileSize: "5.4 MB",
    dateAdded: "2023-04-10",
    previewContent: `
      <h2>Chapter 1: Introduction to Computing</h2>
      
      <p>Computer science is the study of computers and computational systems, encompassing both theoretical and practical aspects of computing. Unlike electrical engineering, which focuses on hardware, computer science primarily concerns itself with software, algorithms, and the theoretical foundations of information and computation.</p>
      
      <h3>1.1 What is Computer Science?</h3>
      
      <p>Computer science can be broadly categorized into several core areas:</p>
      
      <ul>
        <li><strong>Algorithms and Data Structures:</strong> The study of methods for solving problems and organizing data efficiently</li>
        <li><strong>Programming Languages and Software Development:</strong> The tools and methodologies used to create software</li>
        <li><strong>Computer Architecture:</strong> The design and organization of computer systems</li>
        <li><strong>Theoretical Computer Science:</strong> Mathematical aspects of computing, including complexity theory and formal languages</li>
        <li><strong>Artificial Intelligence:</strong> Creating systems that can perform tasks requiring human intelligence</li>
        <li><strong>Networks and Security:</strong> How computers communicate and how to secure information</li>
        <li><strong>Graphics and Visual Computing:</strong> Creating and manipulating visual content</li>
        <li><strong>Human-Computer Interaction:</strong> The study of how humans interact with computers</li>
      </ul>
      
      <h3>1.2 A Brief History of Computing</h3>
      
      <p>The evolution of computing spans thousands of years, from ancient calculating devices to modern supercomputers:</p>
      
      <p><strong>Ancient Computing (3000 BCE - 1800 CE)</strong></p>
      <ul>
        <li>The abacus (circa 3000 BCE): One of the earliest computing devices</li>
        <li>The Antikythera mechanism (circa 100 BCE): An ancient Greek analog computer</li>
        <li>Pascal's calculator (1642): The first mechanical calculator</li>
        <li>Jacquard's loom (1804): Used punch cards to automate weaving patterns</li>
      </ul>
      
      <p><strong>Theoretical Foundations (1800s - 1930s)</strong></p>
      <ul>
        <li>Charles Babbage's Analytical Engine (1837): Conceptualized the first general-purpose computer</li>
        <li>Ada Lovelace's notes (1843): Contained what is considered the first algorithm</li>
        <li>Boolean algebra (1854): Provided the mathematical basis for digital logic</li>
        <li>Alan Turing's "On Computable Numbers" (1936): Introduced the concept of the Turing machine</li>
      </ul>
      
      <p>The chapter continues with the development of early electronic computers, the transition to personal computing, and the modern computing landscape...</p>
    `,
  },
};

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<any>(null);
  
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      if (id && documentData[id as keyof typeof documentData]) {
        setDocument(documentData[id as keyof typeof documentData]);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  // Related documents (would come from an API in a real app)
  const relatedDocuments = Object.values(documentData)
    .filter(doc => doc.id !== id)
    .slice(0, 3);
    
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The document you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/documents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Documents
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" asChild size="sm">
              <Link to="/documents">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Documents
              </Link>
            </Button>
          </div>
          
          <DocumentPreview {...document} />
          
          {/* Related Documents */}
          {relatedDocuments.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Documents</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <Link to={`/document/${doc.id}`} className="group">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={doc.thumbnail || "/placeholder.svg"} 
                            alt={doc.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentView;
