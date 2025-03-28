
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  UserRound,
  Settings,
  LogOut,
  FileText,
  Heart,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileButtonProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userBalance?: number;
  isLoggedIn: boolean;
}

export default function ProfileButton({
  userName = "",
  userEmail = "",
  userAvatar = "",
  userBalance = 0,
  isLoggedIn = false,
}: ProfileButtonProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Xóa token từ localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Thông báo đăng xuất thành công
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi tài khoản.",
      variant: "default",
    });
    
    // Chuyển hướng về trang chủ
    navigate("/");
  };

  // Hàm định dạng số dư thành định dạng tiền tệ Việt Nam
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  // Tạo URL đầy đủ cho avatar (chỉ khi có giá trị và bắt đầu bằng /)
  const getAvatarUrl = () => {
    if (!userAvatar) return "";
    if (userAvatar.startsWith('/')) {
      return `http://localhost:5000${userAvatar}`;
    }
    return userAvatar;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-1 rounded-full">
          <Avatar className="h-9 w-9 border border-primary/10 hover:border-primary/30 transition-colors">
            {getAvatarUrl() ? (
              <AvatarImage src={getAvatarUrl()} alt={userName || "User"} />
            ) : (
              <AvatarFallback className="bg-secondary text-primary">
                {userName ? userName.charAt(0).toUpperCase() : <UserRound className="h-5 w-5" />}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
                {userBalance !== undefined && (
                  <p className="text-xs leading-none text-emerald-600 font-medium mt-1">
                    {formatCurrency(userBalance)}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Tài khoản</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/documents/purchased" className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Tài liệu đã mua</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/favorites" className="cursor-pointer">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Yêu thích</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wallet" className="cursor-pointer">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Ví của tôi</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/login" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/register" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Đăng ký</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
