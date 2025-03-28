
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">TàiLiệuVN</h3>
            <p className="text-muted-foreground mb-4">
              Nền tảng truy cập tài liệu chất lượng và tài liệu học thuật hàng đầu.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@tailieuVN.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link 
                  to="/documents" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Duyệt Tài Liệu
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bảng Giá
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tài Khoản Của Tôi
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh Mục</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/documents?category=academic" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bài Báo Học Thuật
                </Link>
              </li>
              <li>
                <Link 
                  to="/documents?category=business" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tài Liệu Kinh Doanh
                </Link>
              </li>
              <li>
                <Link 
                  to="/documents?category=templates" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Mẫu Tài Liệu
                </Link>
              </li>
              <li>
                <Link 
                  to="/documents?category=research" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tài Liệu Nghiên Cứu
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Trung Tâm Trợ Giúp
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Liên Hệ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Điều Khoản Dịch Vụ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính Sách Bảo Mật
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} TàiLiệuVN. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
