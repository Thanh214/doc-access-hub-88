
import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckIcon, CreditCard, Building, AlertCircle, Wallet, Loader2, Smartphone, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/services/auth.service";
import { processDocumentPayment, processSubscriptionPayment, getSystemBankAccounts } from "@/services/payment.service";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from 'qrcode.react';
import BankPaymentModal from "./BankPaymentModal";

interface RealPaymentModalProps {
  docId: string;
  docTitle: string;
  docPrice: number;
  isFree: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RealPaymentModal = ({
  docId,
  docTitle,
  docPrice,
  isFree,
  isOpen,
  onClose,
  onSuccess
}: RealPaymentModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"subscription" | "purchase">(
    isFree ? "subscription" : "purchase"
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"bank_transfer" | "momo" | "zalopay" | "balance" | "credit_card">("balance");
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"method" | "processing" | "qrcode" | "complete">("method");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showBankModal, setShowBankModal] = useState(false);
  
  // Check if user has enough balance when component mounts
  useEffect(() => {
    if (!isFree && currentUser?.balance !== undefined) {
      setInsufficientFunds(currentUser.balance < docPrice);
    }
  }, [currentUser, docPrice, isFree]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const subscriptionPlans = [
    { id: "monthly", name: "Cơ Bản", price: 30000, duration: "tháng" },
    { id: "standard", name: "Tiêu Chuẩn", price: 60000, duration: "tháng", savings: "10%" },
    { id: "premium", name: "Cao Cấp", price: 100000, duration: "tháng", savings: "25%" },
  ];
  
  // Calculate remaining balance after purchase
  const calculateRemainingBalance = () => {
    if (!currentUser || currentUser.balance === undefined) return 0;
    return currentUser.balance - docPrice;
  };

  // Get the price of the selected subscription plan
  const getSelectedPlanPrice = () => {
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    return plan ? plan.price : 0;
  };
  
  const handlePayment = async () => {
    // If bank transfer is selected, show the bank payment modal
    if (selectedPaymentMethod === "bank_transfer") {
      setShowBankModal(true);
      return;
    }
    
    setIsProcessing(true);
    setPaymentStep("processing");
    
    try {
      // Handle different payment methods
      if (selectedPaymentMethod === "balance") {
        // Process payment using balance
        const result = isFree 
          ? await processSubscriptionPayment(selectedPlan, "balance")
          : await processDocumentPayment(docId, "balance");
        
        if (result.success) {
          setPaymentData(result);
          setIsPaymentComplete(true);
          setPaymentStep("complete");
          
          toast({
            title: "Thanh Toán Thành Công!",
            description: isFree 
              ? `Bạn đã đăng ký gói ${selectedPlan}. Bạn có thể tải xuống tài liệu miễn phí ngay bây giờ.`
              : `Bạn đã mua "${docTitle}". Bạn có thể tải xuống ngay bây giờ.`,
            variant: "default",
          });
          
          if (onSuccess) {
            onSuccess();
          }
        } else {
          throw new Error("Thanh toán thất bại");
        }
      } else {
        // Show QR code for mobile payment methods
        setPaymentStep("qrcode");
        
        // Simulate payment process for demo purposes
        setTimeout(() => {
          setPaymentData({
            success: true,
            documentId: docId,
            paymentMethod: selectedPaymentMethod,
            transactionId: `TRANS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            amount: isFree ? getSelectedPlanPrice() : docPrice,
            date: new Date().toISOString()
          });
          setIsPaymentComplete(true);
          setPaymentStep("complete");
          
          toast({
            title: "Thanh Toán Thành Công!",
            description: isFree 
              ? `Bạn đã đăng ký gói ${selectedPlan}. Bạn có thể tải xuống tài liệu miễn phí ngay bây giờ.`
              : `Bạn đã mua "${docTitle}". Bạn có thể tải xuống ngay bây giờ.`,
            variant: "default",
          });
          
          if (onSuccess) {
            onSuccess();
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentStep("method");
      
      toast({
        title: "Thanh Toán Thất Bại",
        description: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCloseAfterSuccess = () => {
    onClose();
    
    // If it's a document purchase, navigate to document view
    if (!isFree && docId !== "subscription") {
      navigate(`/document/${docId}`);
    }
  };

  const handleBankPaymentSuccess = () => {
    // This will be called when the bank payment is successful
    setShowBankModal(false);
    
    // Update payment data
    setPaymentData({
      success: true,
      documentId: docId,
      paymentMethod: "bank_transfer",
      transactionId: `TRANS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: isFree ? getSelectedPlanPrice() : docPrice,
      date: new Date().toISOString()
    });
    
    // Update payment step
    setIsPaymentComplete(true);
    setPaymentStep("complete");
    
    toast({
      title: "Yêu Cầu Thanh Toán Đã Được Ghi Nhận!",
      description: "Chúng tôi sẽ xác nhận thanh toán của bạn trong thời gian sớm nhất.",
      variant: "default",
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  // Render payment method selection
  const renderPaymentMethodSelection = () => {
    return (
      <>
        {isFree ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <div className="text-xs text-green-600">Giảm giá {plan.savings}</div>
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

            {currentUser?.balance !== undefined && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Chi Tiết Thanh Toán
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Số dư hiện tại:</span>
                    <span className="font-medium">{formatPrice(currentUser.balance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Giá gói đăng ký:</span>
                    <span className="font-medium">{formatPrice(getSelectedPlanPrice())}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Số dư sau thanh toán:</span>
                    <span>{formatPrice(currentUser.balance - getSelectedPlanPrice())}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Chi Tiết Mua Hàng</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tên tài liệu:</span>
                  <span className="font-medium max-w-[60%] text-right">{docTitle}</span>
                </div>
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

            {currentUser?.balance !== undefined && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Thông Tin Số Dư
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Số dư hiện tại:</span>
                    <span className="font-medium">{formatPrice(currentUser.balance)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Số dư sau thanh toán:</span>
                    <span className={calculateRemainingBalance() < 0 ? "text-red-500" : ""}>
                      {formatPrice(calculateRemainingBalance())}
                    </span>
                  </div>
                </div>
                
                {insufficientFunds && (
                  <div className="mt-2 text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Số dư không đủ. Vui lòng nạp thêm tiền hoặc chọn phương thức thanh toán khác.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Phương Thức Thanh Toán</h4>
            <RadioGroup 
              defaultValue="balance" 
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              onValueChange={(value) => setSelectedPaymentMethod(value as "bank_transfer" | "momo" | "zalopay" | "balance" | "credit_card")}
            >
              {currentUser?.balance !== undefined && (
                <div>
                  <RadioGroupItem 
                    value="balance" 
                    id="balance" 
                    className="sr-only"
                    disabled={insufficientFunds}
                  />
                  <Label
                    htmlFor="balance"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                      selectedPaymentMethod === "balance" ? "border-primary" : ""
                    } ${insufficientFunds ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Wallet className="mb-3 h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">Số Dư</span>
                  </Label>
                </div>
              )}
              
              <div>
                <RadioGroupItem 
                  value="bank_transfer" 
                  id="bank_transfer" 
                  className="sr-only"
                />
                <Label
                  htmlFor="bank_transfer"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    selectedPaymentMethod === "bank_transfer" ? "border-primary" : ""
                  }`}
                >
                  <Building className="mb-3 h-6 w-6 text-blue-700" />
                  <span className="text-sm font-medium">Chuyển khoản</span>
                </Label>
              </div>
              
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
                  <Smartphone className="mb-3 h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">ZaloPay</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="credit_card"
                  id="credit_card"
                  className="sr-only"
                />
                <Label
                  htmlFor="credit_card"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    selectedPaymentMethod === "credit_card" ? "border-primary" : ""
                  }`}
                >
                  <CreditCard className="mb-3 h-6 w-6 text-gray-700" />
                  <span className="text-sm font-medium">Thẻ tín dụng</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </>
    );
  };
  
  // Render QR code for mobile payment
  const renderQRCode = () => {
    return (
      <div className="py-4 flex flex-col items-center">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-medium mb-1">Quét mã QR để thanh toán</h3>
          <p className="text-sm text-muted-foreground">
            Sử dụng ứng dụng {selectedPaymentMethod === "momo" ? "MoMo" : selectedPaymentMethod === "zalopay" ? "ZaloPay" : "Ngân hàng"} để quét mã
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border mb-4">
          <QRCodeSVG
            value={`Demo payment for ${docTitle} with amount ${docPrice}`}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: selectedPaymentMethod === "momo" 
                ? "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" 
                : selectedPaymentMethod === "zalopay"
                ? "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                : "https://upload.wikimedia.org/wikipedia/vi/f/fe/MBBank_logo.png",
              excavate: true,
              width: 40,
              height: 40,
            }}
          />
        </div>
        
        <div className="text-center space-y-2 mb-6">
          <p className="text-xl font-bold">{formatPrice(isFree ? getSelectedPlanPrice() : docPrice)}</p>
          <p className="text-sm text-muted-foreground">
            Thanh toán sẽ tự động được xác nhận sau khi hoàn tất
          </p>
        </div>
        
        <div className="animate-pulse flex items-center justify-center space-x-2 text-sm text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Đang chờ thanh toán...</span>
        </div>
      </div>
    );
  };
  
  // Render payment success screen
  const renderPaymentSuccess = () => {
    return (
      <div className="py-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckIcon className="h-8 w-8 text-green-500" />
        </div>
        
        <h3 className="text-xl font-medium mb-2">Thanh Toán Thành Công!</h3>
        <p className="text-center text-muted-foreground mb-6">
          {isFree 
            ? `Bạn đã đăng ký thành công gói ${
                subscriptionPlans.find(p => p.id === selectedPlan)?.name || selectedPlan
              }.`
            : `Bạn đã mua thành công tài liệu "${docTitle}".`
          }
        </p>
        
        <div className="bg-muted w-full max-w-md p-4 rounded-lg mb-6">
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Mã giao dịch:</dt>
              <dd className="text-sm font-medium">{paymentData?.transactionId || "N/A"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Phương thức:</dt>
              <dd className="text-sm font-medium">
                {selectedPaymentMethod === "balance" ? "Số dư tài khoản" : 
                 selectedPaymentMethod === "momo" ? "MoMo" : 
                 selectedPaymentMethod === "zalopay" ? "ZaloPay" :
                 selectedPaymentMethod === "bank_transfer" ? "Chuyển khoản ngân hàng" :
                 "Thẻ tín dụng/ghi nợ"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Ngày:</dt>
              <dd className="text-sm font-medium">
                {paymentData?.date 
                  ? new Date(paymentData.date).toLocaleDateString('vi-VN')
                  : new Date().toLocaleDateString('vi-VN')
                }
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <dt className="font-medium">Tổng:</dt>
              <dd className="font-bold">{formatPrice(isFree ? getSelectedPlanPrice() : docPrice)}</dd>
            </div>
          </dl>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={handleCloseAfterSuccess}>
            {isFree ? "Quay lại thư viện" : "Xem tài liệu"}
          </Button>
        </div>
      </div>
    );
  };
  
  // Render processing screen
  const renderProcessing = () => {
    return (
      <div className="py-12 flex flex-col items-center">
        <div className="mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Đang xử lý thanh toán</h3>
        <p className="text-center text-muted-foreground">Vui lòng đợi trong giây lát...</p>
      </div>
    );
  };
  
  // Render the appropriate content based on payment step
  const renderContent = () => {
    switch (paymentStep) {
      case "method":
        return renderPaymentMethodSelection();
      case "processing":
        return renderProcessing();
      case "qrcode":
        return renderQRCode();
      case "complete":
        return renderPaymentSuccess();
      default:
        return renderPaymentMethodSelection();
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && !isPaymentComplete && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {paymentStep === "complete" 
                ? "Thanh Toán Hoàn Tất" 
                : isFree 
                  ? "Đăng Ký Để Tải Tài Liệu Miễn Phí" 
                  : `Mua Tài Liệu`}
            </DialogTitle>
            {paymentStep !== "complete" && (
              <DialogDescription>
                {isFree
                  ? "Chọn gói đăng ký để tải xuống không giới hạn tài liệu miễn phí."
                  : `Bạn đang mua tài liệu "${docTitle}" với giá ${formatPrice(docPrice)}.`}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {renderContent()}
          
          {paymentStep === "method" && (
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
                disabled={isProcessing || (selectedPaymentMethod === "balance" && insufficientFunds)}
              >
                {isProcessing ? "Đang xử lý..." : isFree ? "Đăng Ký Ngay" : "Hoàn Tất Mua Hàng"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Bank Payment Modal */}
      {showBankModal && (
        <BankPaymentModal
          isOpen={showBankModal}
          onClose={() => setShowBankModal(false)}
          amount={isFree ? getSelectedPlanPrice() : docPrice}
          title={isFree ? `Đăng ký gói ${subscriptionPlans.find(p => p.id === selectedPlan)?.name || selectedPlan}` : docTitle}
          description={isFree ? "Thanh toán đăng ký gói dịch vụ" : "Thanh toán mua tài liệu"}
          onSuccess={handleBankPaymentSuccess}
        />
      )}
    </>
  );
};

export default RealPaymentModal;
