
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileButton from "./ProfileButton";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  
  // Xác định xem người dùng đã đăng nhập hay chưa
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      
      // Lấy thông tin người dùng từ API
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

  // Theo dõi cuộn trang
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

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm" 
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">TàiLiệuVN</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-foreground"
              }`}
            >
              Trang Chủ
            </Link>
            <Link
              to="/documents"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/documents" ? "text-primary" : "text-foreground"
              }`}
            >
              Tài Liệu
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/pricing" ? "text-primary" : "text-foreground"
              }`}
            >
              Bảng Giá
            </Link>
          </nav>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <ProfileButton 
              isLoggedIn={isLoggedIn}
              userName={userData.name}
              userEmail={userData.email}
            />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5" />
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

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container mx-auto px-4 pt-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center" onClick={closeMenu}>
                <span className="text-xl font-bold">TàiLiệuVN</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Đóng menu</span>
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  location.pathname === "/" ? "text-primary" : "text-foreground"
                }`}
                onClick={closeMenu}
              >
                Trang Chủ
              </Link>
              <Link
                to="/documents"
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  location.pathname === "/documents" ? "text-primary" : "text-foreground"
                }`}
                onClick={closeMenu}
              >
                Tài Liệu
              </Link>
              <Link
                to="/pricing"
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  location.pathname === "/pricing" ? "text-primary" : "text-foreground"
                }`}
                onClick={closeMenu}
              >
                Bảng Giá
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
