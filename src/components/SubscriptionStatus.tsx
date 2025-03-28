
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentSubscription } from "@/services/auth.service";
import { SubscriptionData } from "@/services/auth.service";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SubscriptionStatusProps {
  onUpgrade?: () => void;
}

const SubscriptionStatus = ({ onUpgrade }: SubscriptionStatusProps) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);
  const [usagePercentage, setUsagePercentage] = useState({ downloads: 0, uploads: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getCurrentSubscription();
        setSubscription(data);
        
        if (data && data.end_date) {
          const endDate = new Date(data.end_date);
          const today = new Date();
          const diffTime = endDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(diffDays > 0 ? diffDays : 0);
          
          // Sample usage data - in a real app this would come from the backend
          setUsagePercentage({
            downloads: Math.floor(Math.random() * 100),
            uploads: Math.floor(Math.random() * 100)
          });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/pricing');
    }
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!subscription) {
    return (
      <Card className="w-full border-dashed border-2">
        <CardHeader>
          <CardTitle>Bạn chưa có gói đăng ký</CardTitle>
          <CardDescription>
            Nâng cấp ngay để truy cập tất cả tài liệu và tính năng cao cấp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>Bạn đang sử dụng tài khoản miễn phí với các tính năng hạn chế</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpgrade} className="w-full">
            Xem các gói đăng ký
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full overflow-hidden">
      <div className="bg-primary h-2"></div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Gói {subscription.plan_name}</span>
              <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                {subscription.status === 'active' ? 'Đang kích hoạt' : 'Hết hạn'}
              </Badge>
            </CardTitle>
            <CardDescription>
              {subscription.status === 'active' 
                ? `Gói đăng ký của bạn còn ${daysLeft} ngày` 
                : 'Gói đăng ký của bạn đã hết hạn'}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleUpgrade}>
            {subscription.status === 'active' ? 'Nâng cấp' : 'Gia hạn'} 
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Thời hạn còn lại</span>
              <span className="font-medium">{daysLeft} ngày</span>
            </div>
            <Progress value={(daysLeft / 30) * 100} className="h-2" />
          </div>
          
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Tải xuống</span>
                <span className="text-xs text-muted-foreground">
                  Đã dùng {usagePercentage.downloads}%
                </span>
              </div>
              <Progress value={usagePercentage.downloads} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                Bạn có thể tải xuống tối đa {subscription.downloads_limit} tài liệu mỗi tháng
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Tải lên</span>
                <span className="text-xs text-muted-foreground">
                  Đã dùng {usagePercentage.uploads}%
                </span>
              </div>
              <Progress value={usagePercentage.uploads} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                Bạn có thể tải lên tối đa {subscription.uploads_limit} tài liệu mỗi tháng
              </p>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
            <h4 className="text-sm font-medium mb-2">Đặc quyền của gói {subscription.plan_name}</h4>
            <ul className="space-y-2">
              <li className="flex items-start text-xs">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Tải xuống {subscription.downloads_limit} tài liệu mỗi tháng</span>
              </li>
              <li className="flex items-start text-xs">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Tải lên {subscription.uploads_limit} tài liệu mỗi tháng</span>
              </li>
              <li className="flex items-start text-xs">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Đặt giá tối đa {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subscription.max_document_price)} cho mỗi tài liệu</span>
              </li>
              <li className="flex items-start text-xs">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Giảm 10% khi mua tài liệu cao cấp</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
