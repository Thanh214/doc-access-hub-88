
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  balance: number;
  created_at: string;
}

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile form
  const [fullName, setFullName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchUserProfile();
  }, [navigate]);
  
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserProfile(response.data);
      setFullName(response.data.full_name || '');
    } catch (error) {
      console.error('Lỗi khi lấy thông tin profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        { full_name: fullName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast({
        title: "Thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
      
      // Refresh user profile
      fetchUserProfile();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp với mật khẩu xác nhận');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được thay đổi thành công",
      });
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      
      const errorMessage = error.response?.data?.message || "Không thể đổi mật khẩu. Vui lòng thử lại sau.";
      setPasswordError(errorMessage);
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Thông tin tài khoản</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {userProfile?.full_name 
                      ? userProfile.full_name.charAt(0).toUpperCase() 
                      : userProfile?.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{userProfile?.full_name || userProfile?.email}</h2>
                <p className="text-muted-foreground mb-4">{userProfile?.email}</p>
                <div className="bg-muted py-1 px-3 rounded-full text-sm">
                  {userProfile?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </div>
                <div className="w-full mt-6 pt-6 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Ngày đăng ký:</span>
                    <span>{userProfile?.created_at ? formatDate(userProfile.created_at) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số dư:</span>
                    <span className="font-medium">{userProfile?.balance?.toLocaleString()}đ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <Tabs defaultValue="profile">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="profile" className="flex-1">Thông tin cá nhân</TabsTrigger>
                  <TabsTrigger value="security" className="flex-1">Bảo mật</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <form onSubmit={handleUpdateProfile}>
                      <CardHeader>
                        <CardTitle>Thông tin cá nhân</CardTitle>
                        <CardDescription>
                          Cập nhật thông tin cá nhân của bạn
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={userProfile?.email || ''} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Họ và tên</Label>
                          <Input 
                            id="fullName" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nhập họ và tên"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <form onSubmit={handleChangePassword}>
                      <CardHeader>
                        <CardTitle>Đổi mật khẩu</CardTitle>
                        <CardDescription>
                          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                          <Input 
                            id="currentPassword" 
                            type="password"
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Mật khẩu mới</Label>
                          <Input 
                            id="newPassword" 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                          />
                        </div>
                        
                        {passwordError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {passwordError}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
