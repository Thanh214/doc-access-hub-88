
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/services/auth.service";
import { User, Users, FileText, DollarSign, Package, BarChart3 } from "lucide-react";
import API from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý hệ thống</h1>
          <p className="text-muted-foreground">
            Trang quản lý hệ thống dành cho người quản trị.
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
              <TabsContent value="overview" className="space-y-4">
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
                      <CardTitle className="text-sm font-medium">Gói đang hoạt động</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                      <p className="text-xs text-muted-foreground">Số gói đang hoạt động</p>
                    </CardContent>
                  </Card>
                </div>
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
    </div>
  );
};

export default AdminDashboard;
