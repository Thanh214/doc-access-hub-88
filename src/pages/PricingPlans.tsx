
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/services/api";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isLoaded, setIsLoaded] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);

    // Fetch subscription plans from the database
    const fetchSubscriptionPlans = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/subscriptions/plans');
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        toast({
          variant: "destructive",
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu gói đăng ký. Sử dụng dữ liệu mặc định.",
        });
        
        // Use default plans if API fails
        setPlans([
          {
            id: "free",
            name: "Miễn phí",
            description: "Dành cho người mới bắt đầu và học sinh, sinh viên",
            price_monthly: 0,
            price_yearly: 0,
            features: [
              "Truy cập tài liệu miễn phí",
              "Tải xuống tối đa 5 tài liệu mỗi tháng",
              "Xem trước tất cả tài liệu premium"
            ],
            highlighted: false
          },
          {
            id: "standard",
            name: "Tiêu chuẩn",
            description: "Dành cho người dùng chuyên nghiệp",
            price_monthly: 99000,
            price_yearly: 999000,
            features: [
              "Truy cập tất cả tài liệu tiêu chuẩn",
              "Tải xuống không giới hạn tài liệu tiêu chuẩn",
              "Xem trước tất cả tài liệu premium",
              "Giảm 20% khi mua tài liệu premium"
            ],
            highlighted: true,
            badge: "Phổ biến nhất"
          },
          {
            id: "premium",
            name: "Cao cấp",
            description: "Dành cho doanh nghiệp và tổ chức",
            price_monthly: 199000,
            price_yearly: 1999000,
            features: [
              "Tất cả tính năng của gói Tiêu chuẩn",
              "Truy cập tất cả tài liệu premium",
              "Tải xuống không giới hạn",
              "Hỗ trợ kỹ thuật ưu tiên",
              "Cập nhật tài liệu mới nhất"
            ],
            highlighted: false
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, [toast]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Chọn Gói Phù Hợp Với Bạn</h1>
            <p className="text-lg text-muted-foreground">
              Nhận quyền truy cập không giới hạn vào kho tài liệu đa dạng với các gói đăng ký linh hoạt
            </p>
          </div>
          
          <div className="flex justify-center mb-10">
            <Tabs
              value={billingPeriod}
              onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")}
              className="bg-muted/50 p-1 rounded-lg"
            >
              <TabsList className="grid grid-cols-2 w-[300px]">
                <TabsTrigger value="monthly">Thanh toán hàng tháng</TabsTrigger>
                <TabsTrigger value="yearly">
                  Thanh toán hàng năm
                  <span className="ml-1.5 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    Tiết kiệm 20%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  custom={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <SubscriptionCard
                    title={plan.name}
                    description={plan.description}
                    price={billingPeriod === "monthly" ? plan.price_monthly : plan.price_yearly}
                    duration={billingPeriod === "monthly" ? "tháng" : "năm"}
                    features={plan.features}
                    highlighted={plan.highlighted}
                    badge={plan.badge}
                    planId={plan.id}
                    onSelect={() => {
                      // Add subscription selection logic here
                      toast({
                        title: "Đã chọn gói",
                        description: `Bạn đã chọn gói ${plan.name}`,
                      });
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-16 bg-muted/30 rounded-2xl p-6 md:p-10 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">So Sánh Các Gói</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-medium">Tính năng</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="px-4 py-4 font-medium text-center">
                        {plan.name}
                        <div className="text-sm font-normal text-muted-foreground">
                          {billingPeriod === "monthly" 
                            ? `${plan.price_monthly.toLocaleString()} đ/tháng` 
                            : `${plan.price_yearly.toLocaleString()} đ/năm`}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4">Tài liệu miễn phí</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="px-4 py-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Tài liệu tiêu chuẩn</td>
                    <td className="px-4 py-4 text-center">
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    </td>
                    {plans.slice(1).map(plan => (
                      <td key={plan.id} className="px-4 py-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Tài liệu cao cấp</td>
                    <td className="px-4 py-4 text-center">
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Check className="mx-auto h-5 w-5 text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Giới hạn tải xuống</td>
                    <td className="px-4 py-4 text-center">
                      5/tháng
                    </td>
                    <td className="px-4 py-4 text-center">
                      Không giới hạn
                    </td>
                    <td className="px-4 py-4 text-center">
                      Không giới hạn
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Hỗ trợ</td>
                    <td className="px-4 py-4 text-center">
                      Email
                    </td>
                    <td className="px-4 py-4 text-center">
                      Email & Chat
                    </td>
                    <td className="px-4 py-4 text-center">
                      Ưu tiên 24/7
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-4">Bạn có câu hỏi về gói đăng ký?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Nếu bạn vẫn không chắc chắn về gói nào phù hợp nhất với nhu cầu của mình, 
              hãy liên hệ với chúng tôi và chúng tôi sẽ giúp bạn lựa chọn.
            </p>
            <Button variant="outline" size="lg">
              Liên hệ hỗ trợ
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPlans;
