
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, BarChart3, LogOut, Home, Users, Settings } from "lucide-react";
import { getCurrentUser } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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

  const sidebarAnimation = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemAnimation = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex bg-emerald-50">
      {/* Admin Sidebar */}
      <motion.div 
        className="w-64 bg-white shadow-lg rounded-r-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={sidebarAnimation}
      >
        <div className="p-6 border-b border-emerald-100">
          <h2 className="text-xl font-bold text-emerald-600">Admin TàiLiệuVN</h2>
          <p className="text-sm text-emerald-500 mt-1">Quản lý hệ thống</p>
        </div>
        <nav className="mt-4">
          <ul className="space-y-1 px-2">
            <motion.li variants={itemAnimation}>
              <Link
                to="/admin"
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"
              >
                <BarChart3 className="h-5 w-5 mr-3 text-emerald-500" />
                <span>Tổng quan</span>
              </Link>
            </motion.li>
            <motion.li variants={itemAnimation}>
              <Link
                to="/admin/documents"
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"
              >
                <FileText className="h-5 w-5 mr-3 text-emerald-500" />
                <span>Tài liệu</span>
              </Link>
            </motion.li>
            <motion.li variants={itemAnimation}>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"
              >
                <Users className="h-5 w-5 mr-3 text-emerald-500" />
                <span>Người dùng</span>
              </Link>
            </motion.li>
            <motion.li variants={itemAnimation}>
              <Link
                to="/admin/settings"
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"
              >
                <Settings className="h-5 w-5 mr-3 text-emerald-500" />
                <span>Cài đặt</span>
              </Link>
            </motion.li>
            <div className="pt-4 mt-4 border-t border-emerald-100">
              <motion.li variants={itemAnimation}>
                <Link
                  to="/"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"
                >
                  <Home className="h-5 w-5 mr-3 text-emerald-500" />
                  <span>Về trang chủ</span>
                </Link>
              </motion.li>
              <motion.li variants={itemAnimation}>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Đăng xuất</span>
                </button>
              </motion.li>
            </div>
          </ul>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <motion.header 
          className="bg-white shadow-sm px-6 py-4 m-4 rounded-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-xl font-bold text-emerald-800">{title}</h1>
          {description && <p className="text-sm text-emerald-600 mt-1">{description}</p>}
        </motion.header>
        <motion.main 
          className="flex-1 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
