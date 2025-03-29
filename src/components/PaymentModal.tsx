
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckIcon, CreditCard, Smartphone, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  docId: string;
  docTitle: string;
  docPrice: number;
  isFree: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal = ({
  docId,
  docTitle,
  docPrice,
  isFree,
  isOpen,
  onClose,
}: PaymentModalProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"subscription" | "purchase">(
    isFree ? "subscription" : "purchase"
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"momo" | "zalopay">("momo");
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const subscriptionPlans = [
    { id: "monthly", name: "1 Tháng", price: 30000, duration: "tháng" },
    { id: "quarterly", name: "3 Tháng", price: 45000, duration: "3 tháng", savings: "50%" },
    { id: "biannual", name: "6 Tháng", price: 60000, duration: "6 tháng", savings: "67%" },
    { id: "annual", name: "12 Tháng", price: 90000, duration: "năm", savings: "75%" },
  ];
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Giả lập xử lý thanh toán
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Thanh Toán Thành Công!",
        description: isFree 
          ? `Bạn đã đăng ký gói ${selectedPlan}. Bạn có thể tải xuống tài liệu miễn phí ngay bây giờ.`
          : `Bạn đã mua "${docTitle}". Bạn có thể tải xuống ngay bây giờ.`,
        variant: "default",
      });
      
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isFree ? "Đăng Ký Để Tải Tài Liệu Miễn Phí" : `Mua Tài Liệu`}
          </DialogTitle>
          <DialogDescription>
            {isFree
              ? "Chọn gói đăng ký để tải xuống không giới hạn tài liệu miễn phí."
              : `Bạn đang mua tài liệu "${docTitle}" với giá ${formatPrice(docPrice)}.`}
          </DialogDescription>
        </DialogHeader>
        
        {isFree ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{plan.name}</span>
                    {selectedPlan === plan.id && (
                      <span className="bg-primary rounded-full p-1">
                        <CheckIcon className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-bold mb-1">{formatPrice(plan.price)}</div>
                  {plan.savings && (
                    <div className="text-xs text-green-600">Tiết kiệm {plan.savings}</div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Lợi Ích Của Gói Đăng Ký</h4>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Tải xuống không giới hạn tài liệu miễn phí</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Không giới hạn nội dung miễn phí</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Hủy bất cứ lúc nào</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Chi Tiết Mua Hàng</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Giá tài liệu:</span>
                  <span className="font-medium">{formatPrice(docPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí giao dịch:</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Tổng:</span>
                  <span>{formatPrice(docPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
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
                  id="momo" 
                  className="sr-only" 
                />
                <Label
                  htmlFor="momo"
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
                  id="zalopay"
                  className="sr-only"
                />
                <Label
                  htmlFor="zalopay"
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
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 flex items-start">
            <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700">
              Đây là bản demo. Không có thanh toán thực tế nào được xử lý. Trong ứng dụng thực tế, 
              bạn sẽ được chuyển hướng đến nhà cung cấp thanh toán đã chọn.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Hủy
          </Button>
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : isFree ? "Đăng Ký Ngay" : "Hoàn Tất Mua Hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
