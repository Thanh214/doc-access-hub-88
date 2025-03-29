
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
  isLoggedIn: boolean;
}

export default function ProfileButton({
  userName = "",
  userEmail = "",
  userAvatar = "",
  isLoggedIn = false,
}: ProfileButtonProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Xóa token từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Thông báo đăng xuất thành công
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi tài khoản.",
      variant: "default",
    });
    
    // Chuyển hướng về trang chủ
    navigate("/");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {isLoggedIn ? (
          <Button variant="outline" className="rounded-full h-10 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {userAvatar ? (
                  <AvatarImage src={userAvatar} alt={userName || "User"} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName ? userName.charAt(0).toUpperCase() : <UserRound className="h-4 w-4" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="hidden sm:inline-block text-sm font-medium max-w-[100px] truncate">
                {userName || "Tài khoản"}
              </span>
            </div>
          </Button>
        ) : (
          <Button variant="outline" className="gap-2 h-10 hover:bg-primary/5 border-primary/20 hover:border-primary/50">
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline-block">Tài khoản</span>
          </Button>
        )}
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
              className="text-red-500 focus:text-red-500 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild className="hover:bg-primary/5">
              <Link to="/login" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-primary/5">
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
