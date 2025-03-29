import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { 
  getCurrentUser, 
  updateUserProfile, 
  changePassword, 
  updateAvatar, 
  getBalance, 
  addBalance, 
  UserData 
} from "@/services/auth.service";
import { getUserDocuments, Document as DocumentType } from "@/services/document.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Upload, Download, Key, CreditCard, Loader2, Plus, Smartphone, CreditCard as CreditCardIcon, AlertCircle } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }).optional(),
});

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

const balanceFormSchema = z.object({
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Số tiền phải là số dương.",
  }),
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
  const [user, setUser] = useState<UserData | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [showAddBalanceDialog, setShowAddBalanceDialog] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [downloadedDocuments, setDownloadedDocuments] = useState<Document[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"momo" | "zalopay">("momo");

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const balanceForm = useForm<z.infer<typeof balanceFormSchema>>({
    resolver: zodResolver(balanceFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    profileForm.reset({
      name: user.name || "",
      email: user.email || "",
    });

    const fetchBalance = async () => {
      try {
        await getBalance();
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
      } catch (error) {
        console.error("Lỗi khi lấy số dư:", error);
      }
    };

    const fetchDocuments = async () => {
      try {
        const docs = await getUserDocuments();
        const transformedDocs = docs.map(doc => ({
          id: doc.id,
          title: doc.title,
          description: doc.description,
          category: doc.category,
          thumbnail: doc.thumbnail || "/placeholder.svg",
          price: doc.price,
          isFree: doc.isFree !== undefined ? doc.isFree : !doc.is_premium,
          previewAvailable: doc.previewAvailable !== undefined ? doc.previewAvailable : true
        }));
        
        setUploadedDocuments(transformedDocs.filter((_, index) => index % 2 === 0));
        setDownloadedDocuments(transformedDocs.filter((_, index) => index % 2 !== 0));
      } catch (error) {
        console.error("Lỗi khi lấy tài liệu:", error);
      }
    };

    fetchBalance();
    fetchDocuments();
  }, [user, navigate]);

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await updateUserProfile({ name: data.name });
      setUser(getCurrentUser());
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

  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsPasswordLoading(true);
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

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

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsAvatarLoading(true);
      const formData = new FormData();
      formData.append('avatar', files[0]);

      await updateAvatar(formData);
      setUser(getCurrentUser());

      toast({
        title: "Thành công!",
        description: "Ảnh đại diện đã được cập nhật.",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật avatar.",
        variant: "destructive",
      });
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const onBalanceSubmit = async (data: z.infer<typeof balanceFormSchema>) => {
    try {
      setIsBalanceLoading(true);
      const amount = parseFloat(data.amount);
      
      await addBalance(amount);
      setUser(getCurrentUser());

      setShowAddBalanceDialog(false);
      
      balanceForm.reset({
        amount: "",
      });

      toast({
        title: "Thành công!",
        description: `Đã nạp ${amount.toLocaleString('vi-VN')} VNĐ vào tài khoản.`,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Có lỗi xảy ra khi nạp tiền.",
        variant: "destructive",
      });
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return "0 VNĐ";
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getPaymentInfo = (method: "momo" | "zalopay", amount: string) => {
    const amountValue = parseFloat(amount) || 0;
    if (method === "momo") {
      return {
        phoneNumber: "0987654321",
        name: "Tài Liệu App", 
        amount: amountValue,
        message: `Nạp tiền vào tài khoản ${user?.email || ''}`,
        qrCode: "https://chart.googleapis.com/chart?cht=qr&chl=2|99|0987654321|Tai%20Lieu%20App|hello@tailieu.app|0|0|" + amountValue + "&chs=250x250&choe=UTF-8&chld=L|2"
      };
    } else {
      return {
        phoneNumber: "0987123456",
        name: "Tài Liệu App", 
        amount: amountValue,
        message: `Nạp tiền vào tài khoản ${user?.email || ''}`,
        qrCode: "https://chart.googleapis.com/chart?cht=qr&chl=zalopay://0987123456?amount=" + amountValue + "&chs=250x250&choe=UTF-8&chld=L|2"
      };
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
                  <div className="relative">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage 
                        src={user?.avatar ? `http://localhost:5000${user.avatar}` : "https://github.com/shadcn.png"} 
                        alt={user?.name} 
                      />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-3 right-0 rounded-full h-8 w-8"
                      onClick={handleAvatarButtonClick}
                      disabled={isAvatarLoading}
                    >
                      {isAvatarLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <CardTitle>{user?.name || 'Người dùng'}</CardTitle>
                  <CardDescription>{user?.email || 'user@example.com'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div>
                      <span className="font-semibold">Số dư:</span> {formatCurrency(user?.balance)}
                    </div>
                    <Dialog open={showAddBalanceDialog} onOpenChange={setShowAddBalanceDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Nạp tiền
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Nạp tiền vào tài khoản</DialogTitle>
                          <DialogDescription>
                            Chọn phương thức thanh toán và nhập số tiền bạn muốn nạp vào tài khoản.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
                          <div className="space-y-4 py-4">
                            <div>
                              <h4 className="font-medium mb-3">Phương Thức Thanh Toán</h4>
                              <RadioGroup 
                                defaultValue="momo" 
                                className="grid grid-cols-2 gap-4"
                                onValueChange={(value) => setSelectedPaymentMethod(value as "momo" | "zalopay")}
                              >
                                <div>
                                  <RadioGroupItem 
                                    value="momo" 
                                    id="deposit-momo" 
                                    className="sr-only" 
                                  />
                                  <Label
                                    htmlFor="deposit-momo"
                                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                      selectedPaymentMethod === "momo" ? "border-primary" : ""
                                    }`}
                                  >
                                    <Smartphone className="mb-3 h-6 w-6 text-pink-500" />
                                    <span className="text-sm font-medium">Momo</span>
                                  </Label>
                                </div>
                                
                                <div>
                                  <RadioGroupItem
                                    value="zalopay"
                                    id="deposit-zalopay"
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor="deposit-zalopay"
                                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                      selectedPaymentMethod === "zalopay" ? "border-primary" : ""
                                    }`}
                                  >
                                    <CreditCard className="mb-3 h-6 w-6 text-blue-500" />
                                    <span className="text-sm font-medium">ZaloPay</span>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <Form {...balanceForm}>
                              <form onSubmit={balanceForm.handleSubmit(onBalanceSubmit)} className="space-y-4">
                                <FormField
                                  control={balanceForm.control}
                                  name="amount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-left block">Số tiền (VNĐ)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="Nhập số tiền" 
                                          {...field} 
                                          type="number"
                                          min="10000"
                                          step="10000"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                {balanceForm.watch("amount") && (
                                  <div className="mt-4 p-4 border rounded-lg">
                                    <h4 className="font-medium mb-3 text-center">Thông tin chuyển khoản</h4>
                                    <div className="flex flex-col items-center space-y-2 mb-4">
                                      {balanceForm.watch("amount") && (
                                        <img 
                                          src={getPaymentInfo(selectedPaymentMethod, balanceForm.watch("amount")).qrCode} 
                                          alt="QR Code" 
                                          className="w-40 h-40 mb-2" 
                                        />
                                      )}
                                      <p className="text-sm text-center text-muted-foreground">
                                        Quét mã QR bằng ứng dụng {selectedPaymentMethod === "momo" ? "Momo" : "ZaloPay"} 
                                        để thanh toán
                                      </p>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Số điện thoại:</span>
                                        <span>{getPaymentInfo(selectedPaymentMethod, balanceForm.watch("amount")).phoneNumber}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Người nhận:</span>
                                        <span>{getPaymentInfo(selectedPaymentMethod, balanceForm.watch("amount")).name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Số tiền:</span>
                                        <span>{parseFloat(balanceForm.watch("amount") || "0").toLocaleString('vi-VN')} VNĐ</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Nội dung:</span>
                                        <span className="text-right">{getPaymentInfo(selectedPaymentMethod, balanceForm.watch("amount")).message}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 mt-4 flex items-start">
                                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                      <p className="text-xs text-yellow-700">
                                        Sau khi chuyển khoản, hãy nhấp vào nút "Đã thanh toán". Số dư sẽ được cập nhật trong vòng 5 phút.
                                        Nếu không nhận được tiền, vui lòng liên hệ hỗ trợ.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </form>
                            </Form>
                          </div>
                        </ScrollArea>
                        
                        <DialogFooter className="mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddBalanceDialog(false)}
                            disabled={isBalanceLoading}
                            type="button"
                          >
                            Hủy
                          </Button>
                          <Button 
                            onClick={balanceForm.handleSubmit(onBalanceSubmit)}
                            disabled={isBalanceLoading || !balanceForm.watch("amount")}
                          >
                            {isBalanceLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Đã thanh toán
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
