
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentPreview from "@/components/DocumentPreview";
import { getDocumentById, getMockFreeDocuments, getMockPremiumDocuments } from "@/services/document.service";
import { useToast } from "@/hooks/use-toast";

const DocumentDemo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        let doc;
        
        // Try to get real data first
        try {
          doc = await getDocumentById(id);
        } catch (err) {
          console.log("Using mock data for demo");
          // For demo, grab from mock data
          const allMockDocs = [...getMockFreeDocuments(), ...getMockPremiumDocuments()];
          doc = allMockDocs.find(d => d.id === id);
          
          if (!doc) {
            throw new Error("Document not found");
          }
        }
        
        setDocument(doc);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Không thể tải tài liệu. Vui lòng thử lại sau.");
        
        toast({
          title: "Lỗi",
          description: "Không thể tải tài liệu. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocument();
  }, [id, toast]);
  
  // Generate demo preview content based on document type
  const generatePreviewContent = (doc: any) => {
    if (doc.isFree) {
      return `
        <h2>Nội dung xem trước cho "${doc.title}"</h2>
        <p>Đây là tài liệu miễn phí mà bạn có thể tải xuống sau khi đăng ký.</p>
        <p>${doc.description}</p>
        <h3>Mục lục</h3>
        <ol>
          <li>Giới thiệu về ${doc.category}</li>
          <li>Các khái niệm cơ bản</li>
          <li>Tài liệu tham khảo</li>
          <li>Bài tập thực hành</li>
          <li>Trắc nghiệm kiến thức</li>
        </ol>
        <p>Tài liệu này được tải lên bởi quản trị viên và được phép phân phối miễn phí cho mục đích giáo dục.</p>
        <p>Số trang: ${10 + Math.floor(Math.random() * 40)}</p>
        <p>Định dạng: PDF</p>
        <p>Ngôn ngữ: Tiếng Việt</p>
      `;
    } else {
      return `
        <h2>Nội dung xem trước cho "${doc.title}"</h2>
        <p>Đây là phần xem trước của tài liệu cao cấp. Để xem toàn bộ nội dung, vui lòng mua tài liệu này.</p>
        <p>${doc.description}</p>
        <h3>Mục lục</h3>
        <ol>
          <li>Giới thiệu về ${doc.category}</li>
          <li>Phân tích chuyên sâu</li>
          <li>Nghiên cứu tình huống</li>
          <li>Các phương pháp tiên tiến</li>
          <li>Tài liệu tham khảo chuyên ngành</li>
          <li>Bài tập và giải pháp</li>
        </ol>
        <p>Tài liệu này được biên soạn bởi các chuyên gia hàng đầu trong lĩnh vực ${doc.category}.</p>
        <p>Đây chỉ là phần xem trước. Nội dung đầy đủ bao gồm ${3 + Math.floor(Math.random() * 5)} chương với ${20 + Math.floor(Math.random() * 100)} trang.</p>
        <p><em>Phần còn lại của tài liệu chỉ có sẵn khi mua.</em></p>
      `;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Tài liệu không tồn tại</h1>
            <p className="text-muted-foreground mb-8">
              Tài liệu này không tồn tại hoặc đã bị xóa.
            </p>
            <button 
              onClick={() => navigate('/documents')} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Quay lại thư viện
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <DocumentPreview
            id={document.id}
            title={document.title}
            description={document.description}
            category={document.category}
            thumbnail={document.thumbnail}
            previewContent={generatePreviewContent(document)}
            price={document.price}
            isFree={document.isFree || !document.is_premium}
            pages={20 + Math.floor(Math.random() * 100)}
            fileSize={`${1 + Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 99)} MB`}
            dateAdded={document.created_at || "2023-05-15"}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentDemo;
