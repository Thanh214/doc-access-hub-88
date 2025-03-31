import { useState, useEffect } from "react";
import { FileText, Plus, Search, RefreshCw, Eye, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import API from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatFileSize, formatDate } from "@/utils/formatters";

interface Document {
  id: number;
  title: string;
  description: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category_id: number | null;
  is_premium: boolean;
  price: number | null;
  download_count: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  parent_id: number | null;
}

const AdminDocuments = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const [documentToView, setDocumentToView] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    category_id: "",
    is_premium: false,
    price: ""
  });

  const [editDocument, setEditDocument] = useState({
    title: "",
    description: "",
    category_id: "",
    is_premium: false,
    price: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const documentsResponse = await API.get("/admin/documents");
      setDocuments(documentsResponse.data);
      
      const categoriesResponse = await API.get("/categories");
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewDocument(prev => ({ ...prev, is_premium: checked }));
  };

  const handleEditCheckboxChange = (checked: boolean) => {
    setEditDocument(prev => ({ ...prev, is_premium: checked }));
  };

  const handleSelectChange = (value: string) => {
    setNewDocument(prev => ({ ...prev, category_id: value }));
  };

  const handleEditSelectChange = (value: string) => {
    setEditDocument(prev => ({ ...prev, category_id: value }));
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn tệp để tải lên",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newDocument.title);
      formData.append("description", newDocument.description);
      formData.append("category_id", newDocument.category_id);
      formData.append("is_premium", String(newDocument.is_premium));
      if (newDocument.is_premium && newDocument.price) {
        formData.append("price", newDocument.price);
      }
      formData.append("file", selectedFile);

      await API.post("/admin/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Thành công",
        description: "Tài liệu đã được tải lên thành công",
      });

      setNewDocument({
        title: "",
        description: "",
        category_id: "",
        is_premium: false,
        price: ""
      });
      setSelectedFile(null);
      setIsAddDialogOpen(false);
      
      fetchData();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Lỗi tải lên",
        description: "Đã xảy ra lỗi khi tải tài liệu lên. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleEditDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentToEdit) return;
    
    try {
      const formData = new FormData();
      formData.append("title", editDocument.title);
      formData.append("description", editDocument.description);
      formData.append("category_id", editDocument.category_id);
      formData.append("is_premium", String(editDocument.is_premium));
      
      if (editDocument.is_premium && editDocument.price) {
        formData.append("price", editDocument.price);
      }
      
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await API.put(`/admin/documents/${documentToEdit.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Thành công",
        description: "Tài liệu đã được cập nhật thành công",
      });

      setSelectedFile(null);
      setIsEditDialogOpen(false);
      setDocumentToEdit(null);
      
      fetchData();
    } catch (error) {
      console.error("Error updating document:", error);
      toast({
        title: "Lỗi cập nhật",
        description: "Đã xảy ra lỗi khi cập nhật tài liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      await API.delete(`/admin/documents/${documentToDelete.id}`);
      
      toast({
        title: "Thành công",
        description: "Tài liệu đã được xóa thành công",
      });

      fetchData();
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Lỗi xóa tài liệu",
        description: "Đã xảy ra lỗi khi xóa tài liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (document: Document) => {
    setDocumentToEdit(document);
    setEditDocument({
      title: document.title,
      description: document.description || "",
      category_id: document.category_id ? String(document.category_id) : "",
      is_premium: document.is_premium,
      price: document.price ? String(document.price) : ""
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (document: Document) => {
    setDocumentToView(document);
    setIsViewDialogOpen(true);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout 
      title="Quản lý tài liệu" 
      description="Quản lý tất cả tài liệu trên hệ thống"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Danh sách tài liệu</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="sr-only">Làm mới</span>
            </Button>
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm tài liệu</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Kích thước</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Lượt tải</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.id}</TableCell>
                          <TableCell className="max-w-[200px] truncate font-medium" title={doc.title}>
                            {doc.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant={doc.is_premium ? "secondary" : "outline"}>
                              {doc.is_premium ? "Premium" : "Miễn phí"}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.category_name || "Chưa phân loại"}</TableCell>
                          <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                          <TableCell>{doc.is_premium ? formatCurrency(doc.price) : "Miễn phí"}</TableCell>
                          <TableCell>{doc.download_count}</TableCell>
                          <TableCell>{formatDate(doc.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openViewDialog(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openEditDialog(doc)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setDocumentToDelete(doc);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center h-32">
                          {searchQuery ? (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <Search className="h-8 w-8 mb-2" />
                              <p>Không tìm thấy tài liệu phù hợp với "{searchQuery}"</p>
                              <Button 
                                variant="link" 
                                onClick={() => setSearchQuery("")}
                                className="mt-1"
                              >
                                Xóa tìm kiếm
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <FileText className="h-8 w-8 mb-2" />
                              <p>Chưa có tài liệu nào</p>
                              <Button 
                                variant="link" 
                                onClick={() => setIsAddDialogOpen(true)}
                                className="mt-1"
                              >
                                Thêm tài liệu mới
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm tài liệu mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDocument}>
              <div className="space-y-4 py-2">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Nhập tiêu đề tài liệu"
                    value={newDocument.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Nhập mô tả tài liệu"
                    value={newDocument.description}
                    onChange={handleFormChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_premium"
                    checked={newDocument.is_premium}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="is_premium" className="cursor-pointer">
                    Tài liệu premium (có phí)
                  </Label>
                </div>
                
                {newDocument.is_premium && (
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="price">Giá (VNĐ)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Nhập giá tài liệu"
                      value={newDocument.price}
                      onChange={handleFormChange}
                      required={newDocument.is_premium}
                    />
                  </div>
                )}
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="file">Tệp tài liệu</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-500">
                      {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm tài liệu</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditDocument}>
              <div className="space-y-4 py-2">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="edit-title">Tiêu đề</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    placeholder="Nhập tiêu đề tài liệu"
                    value={editDocument.title}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="edit-description">Mô tả</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    placeholder="Nhập mô tả tài liệu"
                    value={editDocument.description}
                    onChange={handleEditFormChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="edit-category">Danh mục</Label>
                  <Select 
                    onValueChange={handleEditSelectChange}
                    defaultValue={editDocument.category_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-is_premium"
                    checked={editDocument.is_premium}
                    onCheckedChange={handleEditCheckboxChange}
                  />
                  <Label htmlFor="edit-is_premium" className="cursor-pointer">
                    Tài liệu premium (có phí)
                  </Label>
                </div>
                
                {editDocument.is_premium && (
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="edit-price">Giá (VNĐ)</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      placeholder="Nhập giá tài liệu"
                      value={editDocument.price}
                      onChange={handleEditFormChange}
                      required={editDocument.is_premium}
                    />
                  </div>
                )}
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="edit-file">Tệp tài liệu (tùy chọn)</Label>
                  <Input
                    id="edit-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  {selectedFile ? (
                    <p className="text-xs text-gray-500">
                      File mới: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  ) : documentToEdit && documentToEdit.file_path ? (
                    <p className="text-xs text-gray-500">
                      File hiện tại: {documentToEdit.file_path.split('/').pop()} ({formatFileSize(documentToEdit.file_size)})
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Chưa có file</p>
                  )}
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Chi tiết tài liệu</DialogTitle>
            </DialogHeader>
            {documentToView && (
              <div className="space-y-4">
                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">ID:</div>
                  <div className="col-span-2">{documentToView.id}</div>
                </div>
                
                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Tiêu đề:</div>
                  <div className="col-span-2">{documentToView.title}</div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Mô tả:</div>
                  <div className="col-span-2">{documentToView.description || "Không có mô tả"}</div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Danh mục:</div>
                  <div className="col-span-2">{documentToView.category_name || "Chưa phân loại"}</div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Loại:</div>
                  <div className="col-span-2">
                    <Badge variant={documentToView.is_premium ? "secondary" : "outline"}>
                      {documentToView.is_premium ? "Premium" : "Miễn phí"}
                    </Badge>
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Giá:</div>
                  <div className="col-span-2">
                    {documentToView.is_premium ? formatCurrency(documentToView.price) : "Miễn phí"}
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Định dạng:</div>
                  <div className="col-span-2">{documentToView.file_type}</div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Kích thước:</div>
                  <div className="col-span-2">{formatFileSize(documentToView.file_size)}</div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Lượt tải:</div>
                  <div className="col-span-2">{documentToView.download_count}</div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Ngày tạo:</div>
                  <div className="col-span-2">{formatDate(documentToView.created_at)}</div>
                </div>

                {documentToView.updated_at && (
                  <div className="grid w-full grid-cols-3 gap-4">
                    <div className="col-span-1 font-medium">Ngày cập nhật:</div>
                    <div className="col-span-2">{formatDate(documentToView.updated_at)}</div>
                  </div>
                )}

                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Đường dẫn file:</div>
                  <div className="col-span-2 break-all">
                    {documentToView.file_path || "Không có đường dẫn file"}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Đóng
              </Button>
              {documentToView && (
                <Button 
                  variant="outline" 
                  onClick={() => openEditDialog(documentToView)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa tài liệu</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Bạn có chắc chắn muốn xóa tài liệu "{documentToDelete?.title}"?</p>
              <p className="text-sm text-gray-500 mt-1">Hành động này không thể hoàn tác.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteDocument}>
                Xóa tài liệu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminDocuments;
