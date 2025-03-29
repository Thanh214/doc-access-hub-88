
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogIn, FileText, Wallet, Home } from "lucide-react";
import { motion } from "framer-motion";
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

interface User {
  id: number;
  username: string;
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
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
            >
              <Home className="h-4 w-4" />
              <span>Trang Chủ</span>
            </Link>
            <Link 
              to="/documents" 
              className={`flex items-center space-x-1 text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/documents' ? 'text-primary font-medium' : ''}`}
            >
              <FileText className="h-4 w-4" />
              <span>Tài Liệu</span>
            </Link>
            <Link 
              to="/pricing" 
              className={`flex items-center space-x-1 text-foreground/90 hover:text-primary transition-colors ${location.pathname === '/pricing' ? 'text-primary font-medium' : ''}`}
            >
              <Wallet className="h-4 w-4" />
              <span>Bảng Giá</span>
            </Link>
          </nav>
        </div>
        
        {/* User menu - Desktop */}
        <div className="hidden md:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full h-10 px-4 flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-white">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user.full_name || user.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.balance?.toLocaleString()}đ
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Thông tin cá nhân</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/transactions">Lịch sử giao dịch</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Quản lý hệ thống</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4 mr-1" />
                  Đăng Nhập
                </Link>
              </Button>
              
              <Button variant="default" asChild>
                <Link to="/register">Đăng Ký</Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          {user && (
            <span className="text-sm mr-2">{user.balance?.toLocaleString()}đ</span>
          )}
          <button 
            className="text-foreground/90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`flex items-center text-foreground/90 hover:text-primary transition-colors py-2 ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Trang Chủ
              </Link>
              <Link 
                to="/documents" 
                className={`flex items-center text-foreground/90 hover:text-primary transition-colors py-2 ${location.pathname === '/documents' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Tài Liệu
              </Link>
              <Link 
                to="/pricing" 
                className={`flex items-center text-foreground/90 hover:text-primary transition-colors py-2 ${location.pathname === '/pricing' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Bảng Giá
              </Link>
              
              <div className="pt-2 border-t">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-primary text-white">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name || user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Button variant="outline" asChild className="justify-start">
                      <Link to="/profile" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Thông tin cá nhân
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="justify-start">
                      <Link to="/transactions" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Wallet className="h-4 w-4 mr-2" />
                        Lịch sử giao dịch
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start text-red-500" onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}>
                      <LogIn className="h-4 w-4 mr-2" />
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
