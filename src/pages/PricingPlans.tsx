
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Dữ liệu gói đăng ký
  const subscriptionPlans = {
    monthly: [
      {
        title: "Cơ Bản",
        price: 30000,
        duration: "tháng",
        features: [
          "Tải xuống 10 tài liệu miễn phí mỗi tháng",
          "Xem trước tất cả tài liệu",
          "Hỗ trợ cơ bản qua email",
        ],
        popular: false,
      },
      {
        title: "Tiêu Chuẩn",
        price: 60000,
        duration: "tháng",
        features: [
          "Tải xuống không giới hạn tài liệu miễn phí",
          "Giảm 10% khi mua tài liệu cao cấp",
          "Hỗ trợ ưu tiên",
          "Không quảng cáo",
        ],
        popular: true,
      },
      {
        title: "Cao Cấp",
        price: 100000,
        duration: "tháng",
        features: [
          "Tất cả tính năng của gói Tiêu Chuẩn",
          "Giảm 25% khi mua tài liệu cao cấp",
          "5 tài liệu cao cấp miễn phí hàng tháng",
          "Hỗ trợ 24/7",
          "Truy cập sớm vào tài liệu mới",
        ],
        popular: false,
      },
    ],
    yearly: [
      {
        title: "Cơ Bản",
        price: 300000,
        duration: "năm",
        features: [
          "Tải xuống 15 tài liệu miễn phí mỗi tháng",
          "Xem trước tất cả tài liệu",
          "Hỗ trợ cơ bản qua email",
          "Tiết kiệm 17% so với thanh toán hàng tháng",
        ],
        popular: false,
      },
      {
        title: "Tiêu Chuẩn",
        price: 600000,
        duration: "năm",
        features: [
          "Tải xuống không giới hạn tài liệu miễn phí",
          "Giảm 15% khi mua tài liệu cao cấp",
          "Hỗ trợ ưu tiên",
          "Không quảng cáo",
          "Tiết kiệm 17% so với thanh toán hàng tháng",
        ],
        popular: true,
      },
      {
        title: "Cao Cấp",
        price: 990000,
        duration: "năm",
        features: [
          "Tất cả tính năng của gói Tiêu Chuẩn",
          "Giảm 30% khi mua tài liệu cao cấp",
          "7 tài liệu cao cấp miễn phí hàng tháng",
          "Hỗ trợ 24/7",
          "Truy cập sớm vào tài liệu mới",
          "Tiết kiệm 18% so với thanh toán hàng tháng",
        ],
        popular: false,
      },
    ],
  };
  
  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setShowPaymentModal(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Gói Đăng Ký Phù Hợp Với Nhu Cầu Của Bạn
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Chọn gói đăng ký phù hợp và bắt đầu truy cập bộ sưu tập tài liệu đa dạng của chúng tôi ngay hôm nay.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block"
            >
              <Tabs
                defaultValue="monthly"
                onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
                className="bg-muted inline-flex p-1 rounded-lg"
              >
                <TabsList className="bg-transparent grid grid-cols-2 w-[300px]">
                  <TabsTrigger value="monthly">Hàng Tháng</TabsTrigger>
                  <TabsTrigger value="yearly">Hàng Năm</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {billingCycle === "yearly" && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  Tiết kiệm tới 18% với thanh toán hàng năm
                </div>
              )}
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans[billingCycle].map((plan, index) => (
              <SubscriptionCard
                key={`${plan.title}-${billingCycle}`}
                title={plan.title}
                price={plan.price}
                duration={plan.duration}
                features={plan.features}
                popular={plan.popular}
                onSelect={() => handleSelectPlan(plan.title)}
              />
            ))}
          </div>
          
          <motion.div 
            className="mt-20 bg-muted/50 rounded-xl p-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Câu Hỏi Thường Gặp</h2>
              <p className="text-muted-foreground">
                Giải đáp những thắc mắc phổ biến về gói đăng ký của chúng tôi
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Tôi có thể hủy đăng ký bất cứ lúc nào không?</h3>
                <p className="text-muted-foreground">
                  Có, bạn có thể hủy đăng ký của mình bất cứ lúc nào. Khi hủy, bạn vẫn có thể sử dụng gói đăng ký cho đến hết thời hạn thanh toán hiện tại.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tôi có thể nâng cấp hoặc hạ cấp gói đăng ký không?</h3>
                <p className="text-muted-foreground">
                  Có, bạn có thể dễ dàng nâng cấp hoặc hạ cấp gói đăng ký của mình bất cứ lúc nào. Khi nâng cấp, bạn sẽ chỉ phải trả phần chênh lệch cho thời gian còn lại.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tài liệu cao cấp có gì khác biệt so với tài liệu miễn phí?</h3>
                <p className="text-muted-foreground">
                  Tài liệu cao cấp thường là nội dung độc quyền, nghiên cứu chuyên sâu hoặc tài liệu chuyên môn có giá trị cao được tạo bởi các chuyên gia hàng đầu trong lĩnh vực. Chúng cung cấp thông tin chi tiết và chuyên môn hơn so với tài liệu miễn phí.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Làm thế nào để thanh toán?</h3>
                <p className="text-muted-foreground">
                  Chúng tôi chấp nhận thanh toán qua các hình thức phổ biến như Momo, ZaloPay, thẻ tín dụng, và chuyển khoản ngân hàng. Tất cả các giao dịch đều được bảo mật.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">Vẫn Còn Thắc Mắc?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Liên hệ với đội ngũ hỗ trợ của chúng tôi. Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn.
            </p>
            <Button size="lg">Liên Hệ Hỗ Trợ</Button>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      
      {showPaymentModal && (
        <PaymentModal 
          docId="subscription"
          docTitle={`Gói ${selectedPlan} (${billingCycle === "monthly" ? "Hàng Tháng" : "Hàng Năm"})`}
          docPrice={subscriptionPlans[billingCycle].find(plan => plan.title === selectedPlan)?.price || 0}
          isFree={false}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default PricingPlans;
