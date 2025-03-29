
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, updateUserProfile, changePassword } from "@/services/auth.service";
import { getUserDocuments } from "@/services/document.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Upload, Download, Key, CreditCard, Loader2 } from "lucide-react";

// Định nghĩa schema cho form thông tin cá nhân
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }).optional(),
});

// Định nghĩa schema cho form đổi mật khẩu
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Mật khẩu hiện tại phải có ít nhất 6 ký tự.",
  }),
  newPassword: z.string().min(6, {
    message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp với mật khẩu mới.",
  path: ["confirmPassword"],
});

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  previewAvailable: boolean;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [downloadedDocuments, setDownloadedDocuments] = useState<Document[]>([]);

  // Khởi tạo form cho thông tin cá nhân
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Khởi tạo form cho đổi mật khẩu
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    if (!user) {
      navigate("/login");
      return;
    }

    // Cập nhật giá trị form khi user thay đổi
    profileForm.reset({
      name: user.name || "",
      email: user.email || "",
    });

    // Lấy danh sách tài liệu của người dùng
    const fetchDocuments = async () => {
      try {
        // Trong thực tế, bạn sẽ cần API endpoint để lấy tài liệu đã tải lên và đã tải xuống
        const docs = await getUserDocuments();
        // Giả lập phân loại tài liệu, trong thực tế sẽ có endpoint riêng
        setUploadedDocuments(docs.filter((_, index) => index % 2 === 0));
        setDownloadedDocuments(docs.filter((_, index) => index % 2 !== 0));
      } catch (error) {
        console.error("Lỗi khi lấy tài liệu:", error);
      }
    };

    fetchDocuments();
  }, [user, navigate]);

  // Xử lý cập nhật thông tin cá nhân
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await updateUserProfile({ name: data.name });
      setUser(getCurrentUser()); // Cập nhật thông tin người dùng trong state

      toast({
        title: "Thành công!",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đổi mật khẩu
  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsPasswordLoading(true);
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Reset form sau khi đổi mật khẩu thành công
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Thành công!",
        description: "Mật khẩu đã được cập nhật.",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Thông tin cá nhân</h1>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div>
                      <span className="font-semibold">Số dư:</span> 0 VNĐ
                    </div>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Nạp tiền
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Hồ sơ
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-1">
                    <Key className="h-4 w-4" /> Bảo mật
                  </TabsTrigger>
                  <TabsTrigger value="uploads" className="flex items-center gap-1">
                    <Upload className="h-4 w-4" /> Tải lên
                  </TabsTrigger>
                  <TabsTrigger value="downloads" className="flex items-center gap-1">
                    <Download className="h-4 w-4" /> Tải xuống
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin cá nhân</CardTitle>
                      <CardDescription>
                        Cập nhật thông tin cá nhân của bạn tại đây.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Họ và tên</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nhập họ và tên" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="example@example.com" 
                                    {...field} 
                                    disabled 
                                    className="bg-muted"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div>
                            <Label htmlFor="avatar">Ảnh đại diện</Label>
                            <div className="flex items-center gap-4 mt-2">
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt={user?.name} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <Input id="avatar" type="file" className="flex-1" />
                            </div>
                          </div>
                          
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu thay đổi
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bảo mật</CardTitle>
                      <CardDescription>
                        Thay đổi mật khẩu của bạn tại đây.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mật khẩu hiện tại</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" disabled={isPasswordLoading}>
                            {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Đổi mật khẩu
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="uploads">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tài liệu đã tải lên</CardTitle>
                      <CardDescription>
                        Quản lý các tài liệu bạn đã tải lên hệ thống.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {uploadedDocuments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {uploadedDocuments.map((doc) => (
                            <Card key={doc.id}>
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">{doc.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground mb-2">
                                  {doc.description.substring(0, 100)}...
                                </p>
                                <div className="text-sm text-muted-foreground">
                                  Danh mục: {doc.category}
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 flex justify-between">
                                <Button variant="outline" size="sm">
                                  Chỉnh sửa
                                </Button>
                                <Button variant="destructive" size="sm">
                                  Xóa
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">
                            Bạn chưa tải lên tài liệu nào.
                          </p>
                          <Button className="mt-4">
                            <Upload className="h-4 w-4 mr-2" />
                            Tải lên tài liệu
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="downloads">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tài liệu đã tải xuống</CardTitle>
                      <CardDescription>
                        Danh sách các tài liệu bạn đã tải xuống.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {downloadedDocuments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {downloadedDocuments.map((doc) => (
                            <Card key={doc.id}>
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">{doc.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground mb-2">
                                  {doc.description.substring(0, 100)}...
                                </p>
                                <div className="text-sm text-muted-foreground">
                                  Danh mục: {doc.category}
                                </div>
                              </CardContent>
                              <CardFooter className="p-4">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Download className="h-4 w-4 mr-2" />
                                  Tải xuống lại
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">
                            Bạn chưa tải xuống tài liệu nào.
                          </p>
                          <Button asChild className="mt-4">
                            <a href="/documents">Khám phá tài liệu</a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
