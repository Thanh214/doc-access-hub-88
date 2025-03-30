
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { PaintBucket, FileText, LayoutDashboard, BellRing, Shield, Database } from 'lucide-react';

interface ThemeColor {
  name: string;
  primary: string;
  accent: string;
  background: string;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [siteName, setSiteName] = useState<string>('TàiLiệuVN');
  const [siteDescription, setSiteDescription] = useState<string>('Hệ thống quản lý tài liệu trực tuyến');
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [defaultTheme, setDefaultTheme] = useState<string>('emerald');
  
  const themeColors: ThemeColor[] = [
    { name: 'emerald', primary: 'bg-emerald-500', accent: 'bg-teal-400', background: 'bg-emerald-50' },
    { name: 'purple', primary: 'bg-purple-500', accent: 'bg-violet-400', background: 'bg-purple-50' },
    { name: 'blue', primary: 'bg-blue-500', accent: 'bg-sky-400', background: 'bg-blue-50' },
    { name: 'amber', primary: 'bg-amber-500', accent: 'bg-yellow-400', background: 'bg-amber-50' },
    { name: 'red', primary: 'bg-red-500', accent: 'bg-rose-400', background: 'bg-red-50' },
  ];

  const handleSaveGeneral = () => {
    toast({
      title: "Lưu thành công",
      description: "Thông tin chung đã được cập nhật",
    });
  };

  const handleSaveAppearance = () => {
    toast({
      title: "Lưu thành công",
      description: "Giao diện đã được cập nhật",
    });
  };

  const handleToggleMaintenance = () => {
    setMaintenanceMode(!maintenanceMode);
    toast({
      title: maintenanceMode ? "Tắt chế độ bảo trì" : "Bật chế độ bảo trì",
      description: maintenanceMode ? "Trang web đã hoạt động bình thường" : "Trang web đã chuyển sang chế độ bảo trì",
    });
  };

  return (
    <AdminLayout title="Cài đặt hệ thống" description="Quản lý cấu hình và tùy chỉnh hệ thống">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Thông tin chung</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" />
            <span>Giao diện</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Hệ thống</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Thông tin trang web</CardTitle>
                <CardDescription>Cấu hình thông tin cơ bản của trang web</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên trang web</Label>
                  <Input 
                    id="siteName" 
                    value={siteName} 
                    onChange={(e) => setSiteName(e.target.value)} 
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Mô tả trang web</Label>
                  <Input 
                    id="siteDescription" 
                    value={siteDescription} 
                    onChange={(e) => setSiteDescription(e.target.value)} 
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificationsEnabled">Bật thông báo</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="notificationsEnabled" 
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                    <Label htmlFor="notificationsEnabled">
                      {notificationsEnabled ? 'Đã bật' : 'Đã tắt'}
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneral}>Lưu thay đổi</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tùy chỉnh giao diện</CardTitle>
                <CardDescription>Thay đổi màu sắc và phong cách hiển thị</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Màu chủ đạo</Label>
                  <div className="grid grid-cols-5 gap-4 pt-2">
                    {themeColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setDefaultTheme(color.name)}
                        className={`h-12 rounded-md border-2 transition-all ${defaultTheme === color.name ? 'border-black scale-110' : 'border-transparent hover:scale-105'} flex flex-col overflow-hidden`}
                      >
                        <div className={`h-2/3 ${color.primary}`}></div>
                        <div className={`h-1/3 ${color.accent}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontStyle">Kiểu chữ</Label>
                  <Select defaultValue="system">
                    <SelectTrigger id="fontStyle" className="max-w-md">
                      <SelectValue placeholder="Chọn kiểu chữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Mặc định hệ thống</SelectItem>
                      <SelectItem value="sans">Sans-serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="mono">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Bo góc</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="borderRadius" className="max-w-md">
                      <SelectValue placeholder="Chọn kiểu bo góc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Nhỏ</SelectItem>
                      <SelectItem value="medium">Vừa</SelectItem>
                      <SelectItem value="large">Lớn</SelectItem>
                      <SelectItem value="full">Tròn đầy đủ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="animationPreference">Hiệu ứng chuyển động</Label>
                  <Select defaultValue="reduced">
                    <SelectTrigger id="animationPreference" className="max-w-md">
                      <SelectValue placeholder="Tùy chỉnh hiệu ứng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Đầy đủ</SelectItem>
                      <SelectItem value="reduced">Giảm nhẹ</SelectItem>
                      <SelectItem value="none">Không hiệu ứng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAppearance}>Áp dụng giao diện</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="system">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
                <CardDescription>Quản lý các cài đặt nâng cao của hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMode">Chế độ bảo trì</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="maintenanceMode" 
                      checked={maintenanceMode}
                      onCheckedChange={handleToggleMaintenance}
                    />
                    <Label htmlFor="maintenanceMode" className={maintenanceMode ? 'text-amber-500 font-medium' : ''}>
                      {maintenanceMode ? 'Đang bảo trì' : 'Hoạt động bình thường'}
                    </Label>
                  </div>
                  {maintenanceMode && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Khi bật chế độ này, người dùng sẽ không thể truy cập trang web.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cacheTimeout">Thời gian lưu cache</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="cacheTimeout" className="max-w-md">
                      <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 phút</SelectItem>
                      <SelectItem value="30">30 phút</SelectItem>
                      <SelectItem value="60">1 giờ</SelectItem>
                      <SelectItem value="1440">24 giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Tần suất sao lưu dữ liệu</Label>
                  <Select defaultValue="7">
                    <SelectTrigger id="backupFrequency" className="max-w-md">
                      <SelectValue placeholder="Chọn tần suất" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Hàng ngày</SelectItem>
                      <SelectItem value="7">Hàng tuần</SelectItem>
                      <SelectItem value="30">Hàng tháng</SelectItem>
                      <SelectItem value="manual">Thủ công</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Xóa tất cả cache</Button>
                <Button variant="default">Sao lưu dữ liệu</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
