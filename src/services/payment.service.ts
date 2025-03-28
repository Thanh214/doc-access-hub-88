
import API from './api';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  isPrimary: boolean;
}

export interface SystemBankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  qrCodeUrl?: string;
  instructions?: string;
  isActive: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  paymentType: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'other';
  instructions?: string;
}

export interface Transaction {
  id?: number;
  transactionId: string;
  userId: number;
  amount: number;
  transactionType: 'deposit' | 'purchase' | 'sale' | 'withdrawal' | 'subscription';
  paymentMethod: 'bank_transfer' | 'momo' | 'zalopay' | 'balance' | 'credit_card';
  referenceId?: number;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface BankTransferRequest {
  id?: number;
  userId: number;
  transactionId: string;
  amount: number;
  systemBankAccountId: number;
  referenceCode: string;
  transferNote: string;
  proofImageUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock data for development/demo purposes
// In a real application, this would come from the API
const MOCK_SYSTEM_BANK_ACCOUNTS: SystemBankAccount[] = [
  {
    id: 1,
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountHolder: 'CÔNG TY TNHH TÀI LIỆU TRỰC TUYẾN',
    branch: 'Chi nhánh Hà Nội',
    instructions: 'Vui lòng ghi rõ mã giao dịch trong nội dung chuyển khoản',
    isActive: true
  },
  {
    id: 2,
    bankName: 'Techcombank',
    accountNumber: '0987654321',
    accountHolder: 'CÔNG TY TNHH TÀI LIỆU TRỰC TUYẾN',
    branch: 'Chi nhánh TP.HCM',
    instructions: 'Vui lòng ghi rõ mã giao dịch trong nội dung chuyển khoản',
    isActive: true
  },
  {
    id: 3,
    bankName: 'MB Bank',
    accountNumber: '1122334455',
    accountHolder: 'CÔNG TY TNHH TÀI LIỆU TRỰC TUYẾN',
    branch: 'Chi nhánh Đà Nẵng',
    instructions: 'Vui lòng ghi rõ mã giao dịch trong nội dung chuyển khoản',
    isActive: true
  }
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản đến tài khoản ngân hàng của hệ thống',
    paymentType: 'bank_transfer',
    isActive: true
  },
  {
    id: 2,
    name: 'Ví Momo',
    description: 'Thanh toán qua ứng dụng Ví Momo',
    paymentType: 'e_wallet',
    isActive: true
  },
  {
    id: 3,
    name: 'ZaloPay',
    description: 'Thanh toán qua ứng dụng ZaloPay',
    paymentType: 'e_wallet',
    isActive: true
  },
  {
    id: 4,
    name: 'Thẻ tín dụng/ghi nợ',
    description: 'Thanh toán bằng thẻ Visa, Mastercard, JCB',
    paymentType: 'credit_card',
    isActive: true
  }
];

// Service functions
export const getSystemBankAccounts = async (): Promise<SystemBankAccount[]> => {
  try {
    const response = await API.get('/payment/system-bank-accounts');
    return response.data;
  } catch (error) {
    console.error('Error fetching system bank accounts:', error);
    return MOCK_SYSTEM_BANK_ACCOUNTS; // Fallback to mock data for demo
  }
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await API.get('/payment/methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return MOCK_PAYMENT_METHODS; // Fallback to mock data for demo
  }
};

export const getUserBankAccounts = async (userId: number): Promise<BankAccount[]> => {
  try {
    const response = await API.get(`/users/${userId}/bank-accounts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bank accounts:', error);
    return []; // Empty array as fallback
  }
};

export const createBankTransferRequest = async (
  amount: number,
  systemBankAccountId: number,
  description: string
): Promise<BankTransferRequest> => {
  try {
    const { user } = useAuth();
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const referenceCode = `REF-${Math.floor(Math.random() * 1000000)}`;
    const transferNote = `TAILIEUONLINE NAP${amount / 1000}K ${user.email}`;
    
    // First create the transaction
    const transactionData: Transaction = {
      transactionId,
      userId: user.id,
      amount,
      transactionType: 'deposit',
      paymentMethod: 'bank_transfer',
      description,
      status: 'pending'
    };
    
    // In a real application, this would be a single API call
    // For demo purposes, we'll simulate it
    // await API.post('/transactions', transactionData);
    
    const bankTransferRequest: BankTransferRequest = {
      userId: user.id,
      transactionId,
      amount,
      systemBankAccountId,
      referenceCode,
      transferNote,
      status: 'pending'
    };
    
    // await API.post('/bank-transfer-requests', bankTransferRequest);
    
    // Simulate API response
    return {
      ...bankTransferRequest,
      id: Math.floor(Math.random() * 1000)
    };
  } catch (error) {
    console.error('Error creating bank transfer request:', error);
    throw error;
  }
};

export const verifyBankTransfer = async (
  bankTransferId: number,
  proofImageUrl?: string
): Promise<boolean> => {
  try {
    await API.put(`/bank-transfer-requests/${bankTransferId}`, {
      proofImageUrl,
      status: 'pending' // Set to pending for admin verification
    });
    return true;
  } catch (error) {
    console.error('Error verifying bank transfer:', error);
    return false;
  }
};

export const processDocumentPayment = async (
  documentId: string,
  paymentMethod: 'bank_transfer' | 'momo' | 'zalopay' | 'balance' | 'credit_card',
  bankAccountId?: number
): Promise<any> => {
  try {
    const { user } = useAuth();
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    if (paymentMethod === 'balance') {
      // Process payment directly from balance
      const response = await API.post('/payment/document', {
        documentId,
        paymentMethod,
        transactionId
      });
      
      return response.data;
    } else if (paymentMethod === 'bank_transfer' && bankAccountId) {
      // For bank transfer, create a pending transaction and bank transfer request
      // This would be handled in the backend
      const response = await API.post('/payment/document/bank-transfer', {
        documentId,
        bankAccountId,
        transactionId
      });
      
      return response.data;
    } else {
      // For mobile payment methods (momo, zalopay) or credit card
      // In a real app, this would redirect to the payment provider
      const response = await API.post('/payment/document/external', {
        documentId,
        paymentMethod,
        transactionId
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('Error processing document payment:', error);
    
    // For demo purposes, simulate a successful response
    return {
      success: true,
      documentId,
      paymentMethod,
      transactionId: `TRANS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: 35000,
      date: new Date().toISOString()
    };
  }
};

export const processSubscriptionPayment = async (
  planId: string,
  paymentMethod: 'bank_transfer' | 'momo' | 'zalopay' | 'balance' | 'credit_card',
  bankAccountId?: number
): Promise<any> => {
  try {
    const { user } = useAuth();
    
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }
    
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    if (paymentMethod === 'balance') {
      // Process payment directly from balance
      const response = await API.post('/payment/subscription', {
        planId,
        paymentMethod,
        transactionId
      });
      
      return response.data;
    } else if (paymentMethod === 'bank_transfer' && bankAccountId) {
      // For bank transfer, create a pending transaction and bank transfer request
      // This would be handled in the backend
      const response = await API.post('/payment/subscription/bank-transfer', {
        planId,
        bankAccountId,
        transactionId
      });
      
      return response.data;
    } else {
      // For mobile payment methods (momo, zalopay) or credit card
      // In a real app, this would redirect to the payment provider
      const response = await API.post('/payment/subscription/external', {
        planId,
        paymentMethod,
        transactionId
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('Error processing subscription payment:', error);
    
    // For demo purposes, simulate a successful response
    return {
      success: true,
      subscriptionId: `SUB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      planId,
      paymentMethod,
      transactionId: `TRANS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: 100000,
      date: new Date().toISOString()
    };
  }
};

export const getUserTransactions = async (userId: number, limit = 10): Promise<Transaction[]> => {
  try {
    const response = await API.get(`/users/${userId}/transactions?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return []; // Empty array as fallback
  }
};

export const getTransactionStatus = async (transactionId: string): Promise<string> => {
  try {
    const response = await API.get(`/transactions/${transactionId}/status`);
    return response.data.status;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return 'pending'; // Default status as fallback
  }
};
