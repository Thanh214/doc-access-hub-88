import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { User, Users, FileText, DollarSign, Package, BarChart3, ArrowDown, ArrowUp, DownloadCloud } from "lucide-react";
import API from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/services/auth.service";
import AdminLayout from "@/components/AdminLayout";

// Types
interface Transaction {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  balance: number;
  created_at: string;
}

interface Document {
  id: number;
  title: string;
  description: string;
  is_premium: boolean;
  price: number;
  download_count: number;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalDocuments: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalDeposits: number;
  totalPurchases: number;
  totalDownloads: number;
}

interface TransactionSummary {
  typeSummary: Array<{
    type: string;
    count: number;
    total: number;
  }>;
  dailySummary: Array<{
    date: string;
    type: string;
    count: number;
    total: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDocuments: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalDeposits: 0,
    totalPurchases: 0,
    totalDownloads: 0
  });
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary>({
    typeSummary: [],
    dailySummary: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      toast({
        title: "Quyền truy cập bị từ chối",
        description: "Bạn không có quyền truy cập vào trang quản lý.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats
        const statsResponse = await API.get("/admin/stats");
        setStats(statsResponse.data);

        // Fetch users
        const usersResponse = await API.get("/admin/users");
        setUsers(usersResponse.data);

        // Fetch transactions
        const transactionsResponse = await API.get("/admin/transactions");
        setTransactions(transactionsResponse.data);

        // Fetch documents
        const documentsResponse = await API.get("/admin/documents");
        setDocuments(documentsResponse.data);

        try {
          // Fetch transaction summary - wrapped in try/catch to handle errors specifically for this call
          const summaryResponse = await API.get("/admin/transaction-summary");
          setTransactionSummary(summaryResponse.data);
        } catch (error) {
          console.error("Error fetching transaction summary:", error);
          // Set empty data if this specific endpoint fails
          setTransactionSummary({
            typeSummary: [],
            dailySummary: []
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Đã xảy ra lỗi khi tải dữ liệu quản lý. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) {
      return "0đ";
    }
    return amount.toLocaleString("vi-VN") + "đ";
  };

  // Prepare chart data
  const prepareChartData = () => {
    const typeSummary = transactionSummary.typeSummary.map(item => ({
      type: item.type === 'deposit' ? 'Nạp tiền' : 
            item.type === 'purchase' ? 'Mua tài liệu' : 
            item.type === 'subscription' ? 'Đăng ký gói' : item.type,
      value: item.total
    }));

    let dailyData: any[] = [];
    if (transactionSummary.dailySummary.length) {
      // Group by date first
      const groupedByDate = transactionSummary.dailySummary.reduce((acc, curr) => {
        const date = curr.date;
        if (!acc[date]) {
          acc[date] = {};
        }
        
        const type = curr.type === 'deposit' ? 'Nạp tiền' : 
                     curr.type === 'purchase' ? 'Mua tài liệu' : 
                     curr.type === 'subscription' ? 'Đăng ký gói' : curr.type;
        
        acc[date][type] = curr.total;
        return acc;
      }, {} as Record<string, Record<string, number>>);
      
      // Convert to array format for chart
      dailyData = Object.entries(groupedByDate).map(([date, data]) => {
        return {
          date: new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}),
          ...data
        };
      });
      
      // Sort by date (newest first)
      dailyData.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
    }

    return { typeSummary, dailyData };
  };

  const chartData = prepareChartData();

  return (
    <AdminLayout title="Quản lý hệ thống" description="Bảng điều khiển quản trị viên">
      <div className="flex flex-col space-y-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline-block">Tổng quan</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline-block">Người dùng</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline-block">Tài liệu</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline-block">Giao dịch</span>
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">Người dùng đã đăng ký</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng tài liệu</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                      <p className="text-xs text-muted-foreground">Tài liệu trong hệ thống</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                      <p className="text-xs text-muted-foreground">Tổng doanh thu từ tài liệu</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lượt tải</CardTitle>
                      <DownloadCloud className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalDownloads}</div>
                      <p className="text-xs text-muted-foreground">Tổng lượt tải tài liệu</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thống kê giao dịch theo loại</CardTitle>
                      <CardDescription>
                        Tổng số tiền theo loại giao dịch
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.typeSummary}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.typeSummary.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Giao dịch 7 ngày gần đây</CardTitle>
                      <CardDescription>
                        Thống kê giao dịch theo ngày
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.dailyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis tickFormatter={(value) => value.toLocaleString('vi-VN')} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          {chartData.dailyData[0] && Object.keys(chartData.dailyData[0])
                            .filter(key => key !== 'date')
                            .map((key, index) => (
                              <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tổng quan tài chính</CardTitle>
                    <CardDescription>
                      Chi tiết thu nhập và chi tiêu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="rounded-full bg-green-100 p-2 mr-3">
                            <ArrowUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-green-600 font-medium">Tổng tiền nạp</p>
                            <p className="text-xl font-bold">{formatCurrency(stats.totalDeposits)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="rounded-full bg-blue-100 p-2 mr-3">
                            <ArrowDown className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Tổng tiền mua tài liệu</p>
                            <p className="text-xl font-bold">{formatCurrency(stats.totalPurchases)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="rounded-full bg-purple-100 p-2 mr-3">
                            <Package className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Gói đang hoạt động</p>
                            <p className="text-xl font-bold">{stats.activeSubscriptions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quản lý người dùng</CardTitle>
                    <CardDescription>
                      Danh sách tất cả người dùng trong hệ thống.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Họ tên</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Vai trò</TableHead>
                          <TableHead>Số dư</TableHead>
                          <TableHead>Ngày tạo</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.full_name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                                  {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(user.balance || 0)}</TableCell>
                              <TableCell>{formatDate(user.created_at)}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  Chi tiết
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">
                              Không có dữ liệu người dùng
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quản lý tài liệu</CardTitle>
                    <CardDescription>
                      Danh sách tất cả tài liệu trong hệ thống.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Tiêu đề</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead>Giá</TableHead>
                          <TableHead>Lượt tải</TableHead>
                          <TableHead>Ngày tạo</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.length > 0 ? (
                          documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.id}</TableCell>
                              <TableCell>{doc.title}</TableCell>
                              <TableCell>
                                <Badge variant={doc.is_premium ? "secondary" : "outline"}>
                                  {doc.is_premium ? "Premium" : "Miễn phí"}
                                </Badge>
                              </TableCell>
                              <TableCell>{doc.is_premium ? formatCurrency(doc.price) : "Miễn phí"}</TableCell>
                              <TableCell>{doc.download_count}</TableCell>
                              <TableCell>{formatDate(doc.created_at)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    Chi tiết
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">
                              Không có dữ liệu tài liệu
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quản lý giao dịch</CardTitle>
                    <CardDescription>
                      Danh sách tất cả giao dịch trong hệ thống.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Người dùng</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead>Số tiền</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Mô tả</TableHead>
                          <TableHead>Ngày tạo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length > 0 ? (
                          transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.id}</TableCell>
                              <TableCell>{transaction.user_id}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.type === "deposit" ? "success" : "secondary"}>
                                  {transaction.type === "deposit"
                                    ? "Nạp tiền"
                                    : transaction.type === "purchase"
                                    ? "Mua tài liệu"
                                    : transaction.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.status === "completed" ? "outline" : "destructive"}>
                                  {transaction.status === "completed" ? "Hoàn thành" : transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={transaction.description}>
                                {transaction.description}
                              </TableCell>
                              <TableCell>{formatDate(transaction.created_at)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">
                              Không có dữ liệu giao dịch
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
