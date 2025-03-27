
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
    { id: "monthly", name: "1 Month", price: 30000, duration: "month" },
    { id: "quarterly", name: "3 Months", price: 45000, duration: "3 months", savings: "50%" },
    { id: "biannual", name: "6 Months", price: 60000, duration: "6 months", savings: "67%" },
    { id: "annual", name: "12 Months", price: 90000, duration: "year", savings: "75%" },
  ];
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Payment Successful!",
        description: isFree 
          ? `You've subscribed to the ${selectedPlan} plan. You can now download free documents.`
          : `You've purchased "${docTitle}". You can now download it.`,
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
            {isFree ? "Subscribe to Download Free Documents" : `Purchase Document`}
          </DialogTitle>
          <DialogDescription>
            {isFree
              ? "Choose a subscription plan to download unlimited free documents."
              : `You are about to purchase "${docTitle}" for ${formatPrice(docPrice)}.`}
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
                    <div className="text-xs text-green-600">Save {plan.savings}</div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Subscription Benefits</h4>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Unlimited downloads of free documents</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>No restrictions on free content</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Purchase Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Document price:</span>
                  <span className="font-medium">{formatPrice(docPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Transaction fee:</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatPrice(docPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Payment Method</h4>
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
              This is a demo. No actual payment will be processed. In a real implementation, 
              you would be redirected to the selected payment provider.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : isFree ? "Subscribe Now" : "Complete Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
