
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentPreview from "@/components/DocumentPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

// Dữ liệu mẫu cho tài liệu (trong ứng dụng thực tế, điều này sẽ đến từ API)
const documentData = {
  "1": {
    id: "1",
    title: "Nghiên Cứu: Nguyên Tắc Kiến Trúc Hiện Đại",
    description: "Phân tích toàn diện về các nguyên tắc kiến trúc đương đại và ứng dụng của chúng trong thiết kế đô thị. Tài liệu này khám phá những cách tiếp cận sáng tạo đối với kiến trúc bền vững, quy hoạch đô thị và các triết lý thiết kế định hình các thành phố hiện đại.",
    category: "Kiến Trúc",
    thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 50000,
    isFree: false,
    pages: 42,
    fileSize: "3.2 MB",
    dateAdded: "12/05/2023",
    previewContent: `
      <h2>Tóm Tắt</h2>
      <p>Bài nghiên cứu này xem xét các nguyên tắc cơ bản định hình thực tiễn kiến trúc hiện đại, với trọng tâm đặc biệt là tính bền vững, chức năng và các cân nhắc thẩm mỹ. Thông qua các nghiên cứu trường hợp về các công trình đáng kể được xây dựng trong thập kỷ qua, bài viết xác định các mô hình và cách tiếp cận lặp đi lặp lại đặc trưng cho thiết kế đương đại thành công.</p>
      
      <h2>1. Giới Thiệu</h2>
      <p>Kiến trúc đứng như một trong những biểu hiện lâu bền nhất của thành tựu văn hóa và công nghệ của nhân loại. Khi xã hội phát triển, các nguyên tắc hướng dẫn thiết kế kiến trúc và quy hoạch đô thị cũng vậy. Bài viết này khám phá các nguyên tắc chính định nghĩa kiến trúc hiện đại trong thế kỷ 21, xem xét cách các kiến trúc sư đương đại cân bằng giữa các cân nhắc thẩm mỹ với những mối quan tâm thực tế như tính bền vững, khả năng tiếp cận và tích hợp công nghệ.</p>
      
      <h2>2. Phương Pháp Luận</h2>
      <p>Nghiên cứu này sử dụng phương pháp tiếp cận kết hợp, kết hợp phân tích định tính về phê bình kiến trúc với đánh giá định lượng về các số liệu hiệu suất công trình. Mười trường hợp nghiên cứu được chọn dựa trên sự công nhận của họ trong cộng đồng kiến trúc, đa dạng địa lý và hoàn thành trong thập kỷ qua (2010-2020).</p>
      
      <h2>3. Các Nguyên Tắc Chính của Kiến Trúc Hiện Đại</h2>
      <p>Thông qua phân tích của chúng tôi, một số nguyên tắc cốt lõi nổi lên là nền tảng cho thực hành kiến trúc đương đại:</p>
      
      <h3>3.1 Tính Bền Vững</h3>
      <p>Ý thức môi trường có lẽ đã trở thành đặc điểm xác định của kiến trúc hiện đại. Điều này thể hiện qua:</p>
      <ul>
        <li>Hiệu quả năng lượng và giảm dấu chân carbon</li>
        <li>Tích hợp các hệ thống năng lượng tái tạo</li>
        <li>Sử dụng vật liệu bền vững và có nguồn gốc địa phương</li>
        <li>Hệ thống bảo tồn và quản lý nước</li>
      </ul>
      
      <h3>3.2 Tích Hợp Công Nghệ</h3>
      <p>Các tòa nhà hiện đại ngày càng hoạt động như hệ sinh thái công nghệ, với kiến trúc đóng vai trò là khung vật lý cho các hệ thống kỹ thuật số phức tạp:</p>
      <ul>
        <li>Hệ thống quản lý tòa nhà thông minh</li>
        <li>Tích hợp IoT để kiểm soát môi trường</li>
        <li>Kỹ thuật chế tạo kỹ thuật số cho phép tạo ra hình học phức tạp</li>
        <li>Ứng dụng thực tế tăng cường cho quy hoạch không gian</li>
      </ul>
      
      <p>Phần còn lại của bài viết này khám phá những nguyên tắc này chi tiết hơn thông qua các nghiên cứu trường hợp của chúng tôi...</p>
    `,
  },
  "2": {
    id: "2",
    title: "Mẫu Kế Hoạch Kinh Doanh: Hướng Dẫn Khởi Nghiệp",
    description: "Mẫu chi tiết để tạo kế hoạch kinh doanh thuyết phục cho startup với dự báo tài chính. Hướng dẫn toàn diện này bao gồm tất cả các phần cần thiết cho một kế hoạch kinh doanh chuyên nghiệp thu hút nhà đầu tư.",
    category: "Kinh Doanh",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 75000,
    isFree: false,
    pages: 28,
    fileSize: "1.8 MB",
    dateAdded: "25/06/2023",
    previewContent: `
      <h2>Giới Thiệu: Tạo Kế Hoạch Kinh Doanh Hiệu Quả</h2>
      
      <p>Một kế hoạch kinh doanh được soạn thảo tốt đóng vai trò nền tảng cho bất kỳ dự án khởi nghiệp thành công nào. Tài liệu này không chỉ làm rõ tầm nhìn và chiến lược kinh doanh của bạn mà còn đóng vai trò như một công cụ quan trọng để thu hút vốn từ các nhà đầu tư tiềm năng. Mẫu sau đây cung cấp một khuôn khổ toàn diện để phát triển kế hoạch kinh doanh truyền đạt hiệu quả đề xuất giá trị, cơ hội thị trường và chiến lược tăng trưởng của bạn.</p>
      
      <h2>1. Tóm Tắt Điều Hành</h2>
      
      <p>Tóm tắt điều hành cung cấp một tổng quan súc tích về kế hoạch kinh doanh của bạn, làm nổi bật những điểm chính sẽ được trình bày chi tiết trong các phần tiếp theo. Mặc dù xuất hiện đầu tiên trong tài liệu, phần này thường được viết sau cùng để đảm bảo nó phản ánh chính xác các chi tiết toàn diện của kế hoạch của bạn.</p>
      
      <h3>Các Thành Phần Chính:</h3>
      <ul>
        <li>Ý tưởng kinh doanh: Mô tả ngắn gọn về doanh nghiệp của bạn, sản phẩm hoặc dịch vụ được cung cấp và vấn đề chúng giải quyết</li>
        <li>Đề xuất giá trị: Điều gì làm cho sản phẩm của bạn độc đáo trên thị trường</li>
        <li>Thị trường mục tiêu: Tóm tắt về khách hàng lý tưởng của bạn và quy mô thị trường</li>
        <li>Mô hình kinh doanh: Cách bạn sẽ tạo ra doanh thu</li>
        <li>Chiến lược tiếp thị và bán hàng: Cách tiếp cận của bạn để thu hút khách hàng</li>
        <li>Dự báo tài chính: Tổng quan ngắn gọn về doanh thu, chi phí và thời gian sinh lời dự kiến</li>
        <li>Yêu cầu tài trợ: Số vốn cần thiết và cách sử dụng</li>
      </ul>
      
      <h2>2. Mô Tả Công Ty</h2>
      
      <p>Phần này cung cấp một tổng quan chi tiết về công ty của bạn, bao gồm sứ mệnh, tầm nhìn và giá trị cốt lõi. Trình bày mục đích cơ bản của doanh nghiệp và các nguyên tắc hướng dẫn sẽ định hình hoạt động và văn hóa của nó.</p>
      
      <h3>Các Thành Phần Chính:</h3>
      <ul>
        <li>Lịch sử công ty (nếu có)</li>
        <li>Tuyên bố sứ mệnh: Mục đích của doanh nghiệp của bạn</li>
        <li>Tuyên bố tầm nhìn: Khát vọng dài hạn của bạn</li>
        <li>Giá trị cốt lõi: Nguyên tắc chỉ đạo hoạt động kinh doanh của bạn</li>
        <li>Cấu trúc kinh doanh: Cấu trúc pháp lý (LLC, corporation, v.v.)</li>
        <li>Địa điểm và cơ sở vật chất</li>
        <li>Cấu trúc sở hữu</li>
      </ul>
      
      <p>Các phần còn lại bao gồm phân tích thị trường, cấu trúc tổ chức, chi tiết sản phẩm/dịch vụ, chiến lược tiếp thị, dự báo tài chính và phụ lục...</p>
    `,
  },
  "3": {
    id: "3",
    title: "Nhập Môn Khoa Học Máy Tính",
    description: "Học những kiến thức cơ bản về khoa học máy tính với hướng dẫn toàn diện thân thiện với người mới bắt đầu. Hoàn hảo cho học sinh và người tự học muốn xây dựng nền tảng trong lập trình và lý thuyết máy tính.",
    category: "Giáo Dục",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    pages: 120,
    fileSize: "5.4 MB",
    dateAdded: "10/04/2023",
    previewContent: `
      <h2>Chương 1: Giới Thiệu về Điện Toán</h2>
      
      <p>Khoa học máy tính là nghiên cứu về máy tính và hệ thống điện toán, bao gồm cả khía cạnh lý thuyết và thực tế của điện toán. Không giống như kỹ thuật điện, tập trung vào phần cứng, khoa học máy tính chủ yếu liên quan đến phần mềm, thuật toán và nền tảng lý thuyết của thông tin và điện toán.</p>
      
      <h3>1.1 Khoa Học Máy Tính Là Gì?</h3>
      
      <p>Khoa học máy tính có thể được phân loại rộng rãi thành một số lĩnh vực cốt lõi:</p>
      
      <ul>
        <li><strong>Thuật Toán và Cấu Trúc Dữ Liệu:</strong> Nghiên cứu các phương pháp giải quyết vấn đề và tổ chức dữ liệu hiệu quả</li>
        <li><strong>Ngôn Ngữ Lập Trình và Phát Triển Phần Mềm:</strong> Các công cụ và phương pháp được sử dụng để tạo phần mềm</li>
        <li><strong>Kiến Trúc Máy Tính:</strong> Thiết kế và tổ chức của hệ thống máy tính</li>
        <li><strong>Khoa Học Máy Tính Lý Thuyết:</strong> Khía cạnh toán học của điện toán, bao gồm lý thuyết độ phức tạp và ngôn ngữ hình thức</li>
        <li><strong>Trí Tuệ Nhân Tạo:</strong> Tạo ra các hệ thống có thể thực hiện các nhiệm vụ đòi hỏi trí thông minh của con người</li>
        <li><strong>Mạng và Bảo Mật:</strong> Cách máy tính giao tiếp và cách bảo mật thông tin</li>
        <li><strong>Đồ Họa và Điện Toán Trực Quan:</strong> Tạo và thao tác nội dung hình ảnh</li>
        <li><strong>Tương Tác Người-Máy:</strong> Nghiên cứu cách con người tương tác với máy tính</li>
      </ul>
      
      <h3>1.2 Lịch Sử Ngắn của Điện Toán</h3>
      
      <p>Quá trình phát triển của điện toán kéo dài hàng nghìn năm, từ thiết bị tính toán cổ đại đến siêu máy tính hiện đại:</p>
      
      <p><strong>Điện Toán Cổ Đại (3000 TCN - 1800 SCN)</strong></p>
      <ul>
        <li>Bàn tính (khoảng 3000 TCN): Một trong những thiết bị điện toán đầu tiên</li>
        <li>Cơ chế Antikythera (khoảng 100 TCN): Một máy tính tương tự Hy Lạp cổ đại</li>
        <li>Máy tính của Pascal (1642): Máy tính cơ học đầu tiên</li>
        <li>Khung dệt Jacquard (1804): Sử dụng thẻ đục lỗ để tự động hóa các mẫu dệt</li>
      </ul>
      
      <p><strong>Nền Tảng Lý Thuyết (1800s - 1930s)</strong></p>
      <ul>
        <li>Máy Phân Tích của Charles Babbage (1837): Khái niệm hóa máy tính đa năng đầu tiên</li>
        <li>Ghi chú của Ada Lovelace (1843): Bao gồm những gì được coi là thuật toán đầu tiên</li>
        <li>Đại số Boole (1854): Cung cấp cơ sở toán học cho logic kỹ thuật số</li>
        <li>"On Computable Numbers" của Alan Turing (1936): Giới thiệu khái niệm máy Turing</li>
      </ul>
      
      <p>Chương này tiếp tục với sự phát triển của các máy tính điện tử đầu tiên, sự chuyển đổi sang điện toán cá nhân và bối cảnh điện toán hiện đại...</p>
    `,
  },
};

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<any>(null);
  
  useEffect(() => {
    // Giả lập lấy dữ liệu từ API
    setIsLoading(true);
    setTimeout(() => {
      if (id && documentData[id as keyof typeof documentData]) {
        setDocument(documentData[id as keyof typeof documentData]);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  // Tài liệu liên quan (trong ứng dụng thực tế sẽ lấy từ API)
  const relatedDocuments = Object.values(documentData)
    .filter(doc => doc.id !== id)
    .slice(0, 3);
    
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Đang tải tài liệu...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Không Tìm Thấy Tài Liệu</h1>
            <p className="text-muted-foreground mb-8">
              Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
              <Link to="/documents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Duyệt Tài Liệu
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" asChild size="sm">
              <Link to="/documents">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Quay Lại Tài Liệu
              </Link>
            </Button>
          </div>
          
          <DocumentPreview {...document} />
          
          {/* Tài Liệu Liên Quan */}
          {relatedDocuments.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Tài Liệu Liên Quan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <Link to={`/document/${doc.id}`} className="group">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={doc.thumbnail || "/placeholder.svg"} 
                            alt={doc.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentView;
