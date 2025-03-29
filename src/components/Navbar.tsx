import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { getCurrentUser, logout } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const navItems = [
    { label: "Trang Chủ", href: "/" },
    { label: "Thư Viện", href: "/documents" },
    { label: "Bảng Giá", href: "/pricing" },
  ];

  
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
  
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống.",
    });
    navigate("/");
  };
  
  
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
            {navItems.map(item => (
              <Link 
                key={item.href} 
                to={item.href} 
                className={`text-foreground/90 hover:text-primary transition-colors ${location.pathname === item.href ? 'text-primary font-medium' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm mr-2">
                  Xin chào, <Link to="/profile" className="font-medium hover:underline">{currentUser.name}</Link>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                  <LogOut className="h-4 w-4 mr-1" />
                  Đăng Xuất
                </Button>
              </div>
            ) : (
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
      
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-full left-0 right-0 bg-background border-b animate-fade-in"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map(item => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={`text-foreground/90 hover:text-primary transition-colors py-2 ${location.pathname === item.href ? 'text-primary font-medium' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-2 border-t">
                {currentUser ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm mb-2">
                      Xin chào, <span className="font-medium">{currentUser.name}</span>
                    </div>
                    <Button variant="outline" asChild className="justify-start">
                      <Link to="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Thông tin cá nhân
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng Xuất
                    </Button>
                  </div>
                ) : (
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
