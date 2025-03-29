
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowUpRight, Clock, ArrowDownRight, Wallet, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Transaction {
  id: number;
  type: 'deposit' | 'purchase' | 'subscription';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchTransactionsAndBalance();
  }, [navigate]);
  
  const fetchTransactionsAndBalance = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [txResponse, balanceResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/transactions/history', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/transactions/balance', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setTransactions(txResponse.data);
      setBalance(balanceResponse.data.balance);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử giao dịch:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu giao dịch. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeposit = async () => {
    try {
      const amount = parseInt(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập số tiền hợp lệ",
          variant: "destructive",
        });
        return;
      }
      
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/transactions/deposit',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast({
        title: "Thành công",
        description: `Đã nạp thành công ${amount.toLocaleString()}đ vào tài khoản`,
      });
      
      // Refresh data
      fetchTransactionsAndBalance();
      setDepositAmount('');
    } catch (error) {
      console.error('Lỗi khi nạp tiền:', error);
      toast({
        title: "Lỗi",
        description: "Không thể nạp tiền. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="text-green-500" />;
      case 'purchase':
        return <ArrowDownRight className="text-red-500" />;
      case 'subscription':
        return <Clock className="text-blue-500" />;
      default:
        return <AlertCircle className="text-yellow-500" />;
    }
  };
  
  const getTransactionText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Nạp tiền';
      case 'purchase':
        return 'Mua tài liệu';
      case 'subscription':
        return 'Đăng ký gói';
      default:
        return 'Giao dịch';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Quản lý Tài chính</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-primary/90 to-primary text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-white/90">Số dư hiện tại</h3>
                    <Wallet className="h-5 w-5 text-white/80" />
                  </div>
                  <p className="text-3xl font-bold">{balance.toLocaleString()}đ</p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>Nạp tiền vào tài khoản</CardTitle>
                  <CardDescription>
                    Nạp tiền vào tài khoản để mua tài liệu hoặc đăng ký gói dịch vụ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="amount">Số tiền</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Nhập số tiền cần nạp"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button>Nạp tiền</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận nạp tiền</AlertDialogTitle>
                            <AlertDialogDescription>
                              {depositAmount ? (
                                <>Bạn có chắc chắn muốn nạp <strong>{parseInt(depositAmount).toLocaleString()}đ</strong> vào tài khoản?</>
                              ) : (
                                'Vui lòng nhập số tiền cần nạp.'
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeposit} disabled={!depositAmount}>Xác nhận</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Lịch sử giao dịch</h2>
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="deposit">Nạp tiền</TabsTrigger>
                  <TabsTrigger value="purchase">Mua tài liệu</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <TransactionList 
                  transactions={transactions}
                  isLoading={isLoading}
                  formatDate={formatDate}
                  getTransactionIcon={getTransactionIcon}
                  getTransactionText={getTransactionText}
                />
              </TabsContent>
              <TabsContent value="deposit">
                <TransactionList 
                  transactions={transactions.filter(tx => tx.type === 'deposit')}
                  isLoading={isLoading}
                  formatDate={formatDate}
                  getTransactionIcon={getTransactionIcon}
                  getTransactionText={getTransactionText}
                />
              </TabsContent>
              <TabsContent value="purchase">
                <TransactionList 
                  transactions={transactions.filter(tx => tx.type === 'purchase')}
                  isLoading={isLoading}
                  formatDate={formatDate}
                  getTransactionIcon={getTransactionIcon}
                  getTransactionText={getTransactionText}
                />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  formatDate: (date: string) => string;
  getTransactionIcon: (type: string) => React.ReactNode;
  getTransactionText: (type: string) => string;
}

const TransactionList = ({ 
  transactions,
  isLoading,
  formatDate,
  getTransactionIcon,
  getTransactionText
}: TransactionListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium mb-1">Chưa có giao dịch nào</h3>
        <p className="text-muted-foreground">Lịch sử giao dịch của bạn sẽ hiển thị ở đây</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium">{getTransactionText(transaction.type)}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString()}đ
                  </div>
                  <div className="text-xs px-2 py-0.5 rounded-full inline-block mt-1 
                    ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}"
                  >
                    {transaction.status === 'completed' ? 'Hoàn thành' : 
                     transaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                  </div>
                </div>
              </div>
              {transaction.description && (
                <div className="mt-2 text-sm text-muted-foreground">{transaction.description}</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Transactions;
