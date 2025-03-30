
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users, fileText, barChart3, logOut, userCog, home } from "lucide-react";
import { getCurrentUser } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      toast({
        title: "Quyền truy cập bị từ chối",
        description: "Bạn không có quyền truy cập vào trang quản lý.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Admin TàiLiệuVN</h2>
        </div>
        <nav className="mt-2">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <barChart3 className="h-5 w-5 mr-3 text-gray-500" />
                <span>Tổng quan</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <users className="h-5 w-5 mr-3 text-gray-500" />
                <span>Người dùng</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/documents"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <fileText className="h-5 w-5 mr-3 text-gray-500" />
                <span>Tài liệu</span>
              </Link>
            </li>
            <li className="mt-auto">
              <Link
                to="/"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <home className="h-5 w-5 mr-3 text-gray-500" />
                <span>Về trang chủ</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-6 py-3 text-red-600 hover:bg-gray-100"
              >
                <logOut className="h-5 w-5 mr-3" />
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <h1 className="text-xl font-bold">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
