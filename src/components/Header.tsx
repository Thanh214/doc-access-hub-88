
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, FileText, Wallet, Book, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProfileButton from "./ProfileButton";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      
      fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserData({
              name: data.user.name,
              email: data.user.email,
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Animation variants
  const headerVariants = {
    initial: { y: -100 },
    animate: { 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      } 
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={headerVariants}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-lg" 
          : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Book className="h-6 w-6 mr-2 text-primary" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-400">
                TàiLiệuVN
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                    location.pathname === "/" ? "text-primary" : "text-foreground"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Trang Chủ</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/documents"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                    location.pathname === "/documents" ? "text-primary" : "text-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Tài Liệu</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/pricing"
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                    location.pathname === "/pricing" ? "text-primary" : "text-foreground"
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Bảng Giá</span>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <ProfileButton 
              isLoggedIn={isLoggedIn}
              userName={userData.name}
              userEmail={userData.email}
            />
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 shadow-sm hover:bg-primary/10 transition-all"
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5 text-primary" />
              <span className="sr-only">Mở menu</span>
            </Button>
            
            <ProfileButton 
              isLoggedIn={isLoggedIn}
              userName={userData.name}
              userEmail={userData.email}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg md:hidden"
          >
            <div className="container mx-auto px-4 pt-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center" onClick={closeMenu}>
                  <Book className="h-6 w-6 mr-2 text-primary" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-400">
                    TàiLiệuVN
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 shadow-sm hover:bg-primary/10 transition-all"
                  onClick={closeMenu}
                >
                  <X className="h-5 w-5 text-primary" />
                  <span className="sr-only">Đóng menu</span>
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                <motion.div variants={menuItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                  <Link
                    to="/"
                    className={`text-lg font-medium transition-colors hover:text-primary flex items-center px-4 py-3 rounded-lg ${
                      location.pathname === "/" ? "text-primary bg-primary/5" : "text-foreground hover:bg-primary/5"
                    }`}
                    onClick={closeMenu}
                  >
                    <Home className="h-5 w-5 mr-3 text-primary" />
                    <span>Trang Chủ</span>
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                  <Link
                    to="/documents"
                    className={`text-lg font-medium transition-colors hover:text-primary flex items-center px-4 py-3 rounded-lg ${
                      location.pathname === "/documents" ? "text-primary bg-primary/5" : "text-foreground hover:bg-primary/5"
                    }`}
                    onClick={closeMenu}
                  >
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <span>Tài Liệu</span>
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                  <Link
                    to="/pricing"
                    className={`text-lg font-medium transition-colors hover:text-primary flex items-center px-4 py-3 rounded-lg ${
                      location.pathname === "/pricing" ? "text-primary bg-primary/5" : "text-foreground hover:bg-primary/5"
                    }`}
                    onClick={closeMenu}
                  >
                    <Wallet className="h-5 w-5 mr-3 text-primary" />
                    <span>Bảng Giá</span>
                  </Link>
                </motion.div>
              </nav>
              
              {!isLoggedIn && (
                <div className="mt-8 flex flex-col space-y-3">
                  <motion.div variants={menuItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-all"
                      onClick={closeMenu}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Đăng Nhập</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={menuItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-primary text-white shadow-md hover:bg-primary/90 transition-all"
                      onClick={closeMenu}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Đăng Ký</span>
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
