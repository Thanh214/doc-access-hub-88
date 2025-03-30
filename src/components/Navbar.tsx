
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogIn, FileText, Wallet, Home, Book, UserPlus, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from '../utils/format';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  balance: number;
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

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
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin profile:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống.",
    });
    navigate('/login');
  };

  const navbarVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 20
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-lg py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold text-primary hover:scale-105 transition-all duration-300"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Book className="h-6 w-6 mr-2 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-400">
              TàiLiệuVN
            </span>
          </motion.div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/" 
                className={`flex items-center space-x-1 text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
              >
                <Home className="h-4 w-4" />
                <span>Trang Chủ</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/documents" 
                className={`flex items-center space-x-1 text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/documents' ? 'text-primary font-medium' : ''}`}
              >
                <FileText className="h-4 w-4" />
                <span>Tài Liệu</span>
              </Link>
            </motion.div>
            
            {!isAdmin && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  to="/pricing" 
                  className={`flex items-center space-x-1 text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/pricing' ? 'text-primary font-medium' : ''}`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Bảng Giá</span>
                </Link>
              </motion.div>
            )}
          </nav>
        </div>
        
        {/* User menu - Desktop */}
        <div className="hidden md:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full h-10 px-4 flex items-center gap-2 hover:bg-primary/10 hover:border-primary transition-all duration-300">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-white">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user.full_name || user.email}</span>
                    {!isAdmin && (
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(user.balance)}
                      </span>
                    )}
                    {isAdmin && (
                      <span className="text-xs text-emerald-600 font-medium">
                        Quản trị viên
                      </span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 shadow-lg border border-primary/10 animate-in slide-in-from-top-5 fade-in-20" align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {!isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/transactions" className="cursor-pointer flex items-center">
                        <Wallet className="mr-2 h-4 w-4 text-primary" />
                        <span>Lịch sử giao dịch</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <SlidersHorizontal className="mr-2 h-4 w-4 text-emerald-600" />
                        <span>Quản lý hệ thống</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-50">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" asChild className="hover:bg-primary/10 transition-all">
                  <Link to="/login" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4 mr-1 text-primary" />
                    <span>Đăng Nhập</span>
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="default" asChild className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                  <Link to="/register" className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4 mr-1" />
                    <span>Đăng Ký</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          {user && !isAdmin && (
            <span className="text-sm mr-2 font-medium text-primary">{formatCurrency(user.balance)}</span>
          )}
          <button 
            className="text-foreground/90 bg-white/80 p-2 rounded-full shadow-sm hover:bg-primary/10 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMobileMenuOpen ? 
              <X className="h-5 w-5 text-primary" /> : 
              <Menu className="h-5 w-5 text-primary" />
            }
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-primary/10 shadow-lg rounded-b-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              <nav className="flex flex-col space-y-4">
                <motion.div 
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                >
                  <Link 
                    to="/" 
                    className={`flex items-center text-foreground/90 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5 ${location.pathname === '/' ? 'text-primary font-medium bg-primary/5' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5 mr-3 text-primary" />
                    <span>Trang Chủ</span>
                  </Link>
                </motion.div>
                
                <motion.div 
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  <Link 
                    to="/documents" 
                    className={`flex items-center text-foreground/90 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5 ${location.pathname === '/documents' ? 'text-primary font-medium bg-primary/5' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <span>Tài Liệu</span>
                  </Link>
                </motion.div>
                
                {!isAdmin && (
                  <motion.div 
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <Link 
                      to="/pricing" 
                      className={`flex items-center text-foreground/90 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5 ${location.pathname === '/pricing' ? 'text-primary font-medium bg-primary/5' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Wallet className="h-5 w-5 mr-3 text-primary" />
                      <span>Bảng Giá</span>
                    </Link>
                  </motion.div>
                )}
                
                <div className="pt-4 mt-4 border-t border-primary/10">
                  {user ? (
                    <div className="flex flex-col space-y-3">
                      <motion.div 
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                        className="flex items-center mb-3 p-3 bg-primary/5 rounded-lg"
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-primary text-white">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-primary">{user.full_name || user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                          {isAdmin && <div className="text-xs text-emerald-600 font-medium mt-1">Quản trị viên</div>}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5 }}
                      >
                        <Link 
                          to="/profile" 
                          className="flex items-center py-2 px-3 rounded-lg hover:bg-primary/5 text-foreground/90 hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3 text-primary" />
                          <span>Thông tin cá nhân</span>
                        </Link>
                      </motion.div>
                      
                      {!isAdmin && (
                        <motion.div 
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.6 }}
                        >
                          <Link 
                            to="/transactions" 
                            className="flex items-center py-2 px-3 rounded-lg hover:bg-primary/5 text-foreground/90 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Wallet className="h-5 w-5 mr-3 text-primary" />
                            <span>Lịch sử giao dịch</span>
                          </Link>
                        </motion.div>
                      )}
                      
                      {isAdmin && (
                        <motion.div 
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.6 }}
                        >
                          <Link 
                            to="/admin" 
                            className="flex items-center py-2 px-3 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <SlidersHorizontal className="h-5 w-5 mr-3 text-emerald-600" />
                            <span>Quản lý hệ thống</span>
                          </Link>
                        </motion.div>
                      )}
                      
                      <motion.div 
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.7 }}
                      >
                        <button 
                          className="flex w-full items-center py-2 px-3 rounded-lg hover:bg-red-50 text-red-500 transition-colors" 
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogIn className="h-5 w-5 mr-3" />
                          <span>Đăng Xuất</span>
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <motion.div 
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                      >
                        <Link 
                          to="/login" 
                          className="flex w-full items-center py-3 px-4 rounded-lg bg-white text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <LogIn className="h-5 w-5 mr-3" />
                          <span>Đăng Nhập</span>
                        </Link>
                      </motion.div>
                      
                      <motion.div 
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5 }}
                      >
                        <Link 
                          to="/register"
                          className="flex w-full items-center py-3 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserPlus className="h-5 w-5 mr-3" />
                          <span>Đăng Ký</span>
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
