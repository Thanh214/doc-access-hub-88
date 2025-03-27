
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/DocumentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, FileText } from "lucide-react";

// Dummy data for documents
const allDocuments = [
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
  {
    id: "7",
    title: "Project Management Methodology Overview",
    description: "Compare different project management methodologies to find the best approach for your team.",
    category: "Business",
    thumbnail: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 65000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "8",
    title: "Introduction to Data Science with Python",
    description: "A beginner's guide to data analysis and visualization using Python and popular libraries.",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
  {
    id: "9",
    title: "UI/UX Design Principles and Best Practices",
    description: "Comprehensive guide to creating effective, user-friendly digital interfaces with modern design principles.",
    category: "Design",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 80000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "10",
    title: "Financial Planning for Small Businesses",
    description: "Essential financial planning templates and guides for small business owners and entrepreneurs.",
    category: "Finance",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 95000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "11",
    title: "Healthcare Administration Guide",
    description: "Comprehensive resource for healthcare management professionals covering regulations and best practices.",
    category: "Healthcare",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 110000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "12",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to start building your own websites.",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
];

const categories = [
  "All Categories",
  "Architecture",
  "Business",
  "Design",
  "Education",
  "Finance",
  "Healthcare",
  "Legal",
  "Marketing",
  "Market Research",
];

const DocumentBrowser = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [documents, setDocuments] = useState(allDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState(allDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [documentType, setDocumentType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    // Filter documents based on search term, category, and document type
    let filtered = allDocuments;
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }
    
    if (documentType === "free") {
      filtered = filtered.filter(doc => doc.isFree);
    } else if (documentType === "premium") {
      filtered = filtered.filter(doc => !doc.isFree);
    }
    
    // Sort documents
    if (sortOrder === "newest") {
      // In a real app, this would sort by date added
      filtered = [...filtered];
    } else if (sortOrder === "oldest") {
      // In a real app, this would sort by date added in reverse
      filtered = [...filtered].reverse();
    } else if (sortOrder === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCategory, documentType, sortOrder]);
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Document Library</h1>
              <p className="text-muted-foreground">
                Browse our collection of free and premium documents
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="md:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>
              
              <Select 
                defaultValue="newest" 
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:block ${isFilterOpen ? "block" : "hidden"}`}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Search Documents</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Document Type</h3>
                  <Tabs 
                    defaultValue="all" 
                    className="w-full"
                    onValueChange={(value) => setDocumentType(value)}
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                      <TabsTrigger value="free" className="flex-1">Free</TabsTrigger>
                      <TabsTrigger value="premium" className="flex-1">Premium</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div 
                        key={category}
                        className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                          category === selectedCategory
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/60"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Documents Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {filteredDocuments.length} documents
                </p>
                
                {selectedCategory !== "All Categories" && (
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {selectedCategory}
                    <button 
                      className="ml-1 hover:text-primary"
                      onClick={() => setSelectedCategory("All Categories")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
              
              {filteredDocuments.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <DocumentCard {...doc} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    We couldn't find any documents matching your search criteria. Try adjusting your filters or search term.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Categories");
                      setDocumentType("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentBrowser;
