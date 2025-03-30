
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, BarChart3, LogOut, Home } from "lucide-react";
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
    <div className="min-h-screen flex bg-green-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-green-100">
        <div className="p-6 bg-green-600 text-white">
          <h2 className="text-xl font-bold">Admin TàiLiệuVN</h2>
        </div>
        <nav className="mt-2">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-100"
              >
                <BarChart3 className="h-5 w-5 mr-3 text-green-600" />
                <span>Tổng quan</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/documents"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-100"
              >
                <FileText className="h-5 w-5 mr-3 text-green-600" />
                <span>Tài liệu</span>
              </Link>
            </li>
            <li className="mt-auto">
              <Link
                to="/documents"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-100"
              >
                <FileText className="h-5 w-5 mr-3 text-green-600" />
                <span>Xem trang tài liệu</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-6 py-3 text-red-600 hover:bg-green-100"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 border-b border-green-100">
          <h1 className="text-xl font-bold text-green-800">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
