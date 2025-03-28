
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, AlertTriangle, CreditCard, Building, CheckCircle2, Upload, ArrowRight, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/services/auth.service";
import { 
  getSystemBankAccounts, 
  createBankTransferRequest, 
  verifyBankTransfer,
  SystemBankAccount
} from "@/services/payment.service";

interface BankPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description: string;
  onSuccess?: () => void;
}

export const BankPaymentModal = ({
  isOpen,
  onClose,
  amount,
  title,
  description,
  onSuccess
}: BankPaymentModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"bank_selection" | "transfer_details" | "verification" | "complete">("bank_selection");
  const [isLoading, setIsLoading] = useState(false);
  const [systemBanks, setSystemBanks] = useState<SystemBankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [transferCode, setTransferCode] = useState<string>("");
  const [transferNote, setTransferNote] = useState<string>("");
  const [transferDetails, setTransferDetails] = useState<any>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [bankTransferId, setBankTransferId] = useState<number | null>(null);

  // Format currency in VND
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Load system banks when component mounts
  useEffect(() => {
    const loadSystemBanks = async () => {
      try {
        const banks = await getSystemBankAccounts();
        setSystemBanks(banks);
        if (banks.length > 0) {
          setSelectedBankId(banks[0].id);
        }
      } catch (error) {
        console.error("Error loading system banks:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách ngân hàng. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    };

    loadSystemBanks();
  }, [toast]);

  // Copy text to clipboard
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          description: message,
        });
      },
      (err) => {
        console.error("Không thể sao chép: ", err);
      }
    );
  };

  // Handle bank selection and proceed to transfer details
  const handleSelectBank = async () => {
    if (!selectedBankId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ngân hàng để tiếp tục.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a bank transfer request
      const result = await createBankTransferRequest(
        amount,
        selectedBankId,
        description
      );

      setBankTransferId(result.id || null);
      setTransferCode(result.referenceCode);
      setTransferNote(result.transferNote);
      setTransferDetails({
        bankName: systemBanks.find(bank => bank.id === selectedBankId)?.bankName,
        accountNumber: systemBanks.find(bank => bank.id === selectedBankId)?.accountNumber,
        accountHolder: systemBanks.find(bank => bank.id === selectedBankId)?.accountHolder,
        amount: amount,
        referenceCode: result.referenceCode,
        transferNote: result.transferNote
      });

      setStep("transfer_details");
    } catch (error) {
      console.error("Error creating bank transfer request:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo yêu cầu chuyển khoản. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  // Submit verification with proof of payment
  const handleSubmitVerification = async () => {
    if (!bankTransferId) {
      toast({
        title: "Lỗi",
        description: "Thông tin chuyển khoản không hợp lệ.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real application, you would upload the file to your server
      // and then call verifyBankTransfer with the URL
      const uploadedUrl = proofFile ? URL.createObjectURL(proofFile) : undefined;
      
      await verifyBankTransfer(bankTransferId, uploadedUrl);
      
      // In a real app, this would be pending admin verification
      // For demo purposes, we'll simulate a successful verification
      setTimeout(() => {
        setStep("complete");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error verifying bank transfer:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xác minh chuyển khoản. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Handle completion of the payment process
  const handleComplete = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  // Render different steps of the payment process
  const renderContent = () => {
    switch (step) {
      case "bank_selection":
        return (
          <div className="space-y-4 py-2">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Thông tin thanh toán</h4>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Dịch vụ:</span>
                <span className="text-sm font-medium">{title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Mô tả:</span>
                <span className="text-sm">{description}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Số tiền thanh toán:</span>
                <span className="font-bold">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Chọn ngân hàng nhận tiền</h3>
              <RadioGroup 
                value={selectedBankId?.toString()} 
                onValueChange={(value) => setSelectedBankId(parseInt(value))}
                className="grid gap-4"
              >
                {systemBanks.map(bank => (
                  <div key={bank.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={bank.id.toString()} id={`bank-${bank.id}`} className="mt-1" />
                    <div className="grid gap-1.5 w-full">
                      <Label htmlFor={`bank-${bank.id}`} className="font-medium">
                        {bank.bankName}
                      </Label>
                      <Card>
                        <CardContent className="p-3">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Số tài khoản:</span>
                              <span className="font-medium">{bank.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Chủ tài khoản:</span>
                              <span>{bank.accountHolder}</span>
                            </div>
                            {bank.branch && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Chi nhánh:</span>
                                <span>{bank.branch}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case "transfer_details":
        return (
          <div className="space-y-6 py-2">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium mb-1">Thông tin chuyển khoản</h3>
              <p className="text-sm text-muted-foreground">
                Vui lòng chuyển khoản theo thông tin dưới đây
              </p>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {transferDetails?.bankName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Số tài khoản</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{transferDetails?.accountNumber}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(
                        transferDetails?.accountNumber,
                        "Đã sao chép số tài khoản"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Chủ tài khoản</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{transferDetails?.accountHolder}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(
                        transferDetails?.accountHolder,
                        "Đã sao chép tên chủ tài khoản"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Số tiền</div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold">{formatCurrency(transferDetails?.amount)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(
                        transferDetails?.amount.toString(),
                        "Đã sao chép số tiền"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Nội dung chuyển khoản</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-primary">{transferDetails?.transferNote}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(
                        transferDetails?.transferNote,
                        "Đã sao chép nội dung chuyển khoản"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <div className="flex items-start text-xs text-amber-600 space-x-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0" />
                  <span>
                    <strong>Quan trọng:</strong> Vui lòng ghi đúng nội dung chuyển khoản để hệ thống có thể xác nhận giao dịch của bạn.
                  </span>
                </div>
              </CardFooter>
            </Card>

            <div className="flex flex-col items-center space-y-2">
              <Button 
                className="w-full"
                onClick={() => setStep("verification")}
              >
                Tôi đã chuyển khoản
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => setStep("bank_selection")}
              >
                Quay lại chọn ngân hàng khác
              </Button>
            </div>
          </div>
        );

      case "verification":
        return (
          <div className="space-y-6 py-2">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium mb-1">Xác nhận thanh toán</h3>
              <p className="text-sm text-muted-foreground">
                Vui lòng cung cấp ảnh chụp màn hình hoặc biên lai chuyển khoản
              </p>
            </div>

            <div className="border border-dashed border-muted-foreground/50 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Tải lên ảnh biên lai chuyển khoản</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Hỗ trợ JPG, PNG hoặc PDF (tối đa 5MB)
                  </p>
                  
                  <div className="flex items-center justify-center">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button type="button" variant="outline" size="sm">
                        Chọn file
                      </Button>
                    </label>
                  </div>
                  
                  {proofFile && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{proofFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProofFile(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex items-start">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Thời gian xác nhận thanh toán từ 5-15 phút trong giờ hành chính. Ngoài giờ hành chính có thể lâu hơn.
                Nếu sau 24 giờ thanh toán chưa được xác nhận, vui lòng liên hệ với chúng tôi qua email hỗ trợ.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <Button 
                className="w-full"
                onClick={handleSubmitVerification}
                disabled={!proofFile || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Xác nhận thanh toán
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => setStep("transfer_details")}
                disabled={isLoading}
              >
                Quay lại
              </Button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="py-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            
            <h3 className="text-xl font-medium mb-2">Thanh Toán Thành Công!</h3>
            <p className="text-center text-muted-foreground mb-6">
              Yêu cầu thanh toán của bạn đã được ghi nhận. Chúng tôi sẽ xác nhận thanh toán của bạn trong thời gian sớm nhất.
            </p>
            
            <div className="bg-muted w-full max-w-md p-4 rounded-lg mb-6">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Mã giao dịch:</dt>
                  <dd className="text-sm font-medium">{transferCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Ngân hàng:</dt>
                  <dd className="text-sm font-medium">{transferDetails?.bankName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Ngày:</dt>
                  <dd className="text-sm font-medium">
                    {new Date().toLocaleDateString('vi-VN')}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <dt className="font-medium">Tổng:</dt>
                  <dd className="font-bold">{formatCurrency(amount)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleComplete}>
                Hoàn tất
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === "bank_selection" && "Thanh toán qua chuyển khoản ngân hàng"}
            {step === "transfer_details" && "Thông tin chuyển khoản"}
            {step === "verification" && "Xác nhận thanh toán"}
            {step === "complete" && "Thanh toán hoàn tất"}
          </DialogTitle>
          {step === "bank_selection" && (
            <DialogDescription>
              Vui lòng chọn ngân hàng bạn muốn chuyển khoản
            </DialogDescription>
          )}
        </DialogHeader>
        
        {renderContent()}
        
        {step === "bank_selection" && (
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSelectBank}
              disabled={!selectedBankId || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Tiếp tục
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BankPaymentModal;
