import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { getCurrentUser, logout } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

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
                    
                    <div className="flex items-center space-x-2">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-red-500"
                                >
                                    <span>{user.full_name || user.username}</span>
                                    <span className="text-sm text-gray-500">
                                        (Số dư: {user.balance.toLocaleString()}đ)
                                    </span>
                                </button>
                                {isMobileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Thông tin cá nhân
                                        </Link>
                                        <Link
                                            to="/transactions"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Lịch sử giao dịch
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Quản lý hệ thống
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
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
                                {user ? (
                                    <div className="flex flex-col space-y-2">
                                        <div className="text-sm mb-2">
                                            Xin chào, <span className="font-medium">{user.full_name || user.username}</span>
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
