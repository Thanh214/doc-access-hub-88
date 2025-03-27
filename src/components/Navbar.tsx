
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Menu, X, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold text-gradient transition-all duration-300 hover:opacity-80"
        >
          TàiLiệuVN
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
            >
              Trang Chủ
            </Link>
            <Link 
              to="/documents" 
              className={`text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/documents' ? 'text-primary font-medium' : ''}`}
            >
              Tài Liệu
            </Link>
            <Link 
              to="/pricing" 
              className={`text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/pricing' ? 'text-primary font-medium' : ''}`}
            >
              Bảng Giá
            </Link>
          </nav>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Tìm kiếm tài liệu..." 
              className="pl-9 w-64 bg-muted/50 border-none transition-all focus:w-80"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {location.pathname !== '/login' && location.pathname !== '/register' && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4 mr-1" />
                    Đăng Nhập
                  </Link>
                </Button>
                
                <Button variant="default" asChild>
                  <Link to="/register">Đăng Ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <button 
          className="md:hidden text-foreground/90"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-full left-0 right-0 bg-background border-b animate-fade-in"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Tìm kiếm tài liệu..." 
                className="pl-9 w-full bg-muted/50 border-none"
              />
            </div>
            
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`text-foreground/90 hover:text-primary transition-colors py-2 ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang Chủ
              </Link>
              <Link 
                to="/documents" 
                className={`text-foreground/90 hover:text-primary transition-colors py-2 ${location.pathname === '/documents' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tài Liệu
              </Link>
              <Link 
                to="/pricing" 
                className={`text-foreground/90 hover:text-primary transition-colors py-2 ${location.pathname === '/pricing' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bảng Giá
              </Link>
              
              <div className="pt-2 border-t">
                {location.pathname !== '/login' && location.pathname !== '/register' && (
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link 
                        to="/login" 
                        className="flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Đăng Nhập
                      </Link>
                    </Button>
                    
                    <Button variant="default" asChild>
                      <Link 
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng Ký
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
