import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedDocuments from "@/components/FeaturedDocuments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, Download, Users, ShieldCheck, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Tài Liệu Chất Lượng Cao",
      description: "Truy cập hàng ngàn tài liệu cao cấp về học thuật, kinh doanh và giáo dục được tuyển chọn kỹ lưỡng.",
    },
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: "Tải Xuống Dễ Dàng",
      description: "Đăng ký một lần và tải xuống không giới hạn tài liệu miễn phí, hoặc mua riêng các tài liệu cao cấp.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Tạo Bởi Chuyên Gia",
      description: "Tất cả tài liệu đều được tạo bởi các chuyên gia và chuyên gia trong lĩnh vực để đảm bảo tính chính xác và giá trị.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Nền Tảng An Toàn",
      description: "Dữ liệu và thanh toán của bạn luôn được bảo mật với mã hóa và bảo vệ cấp doanh nghiệp của chúng tôi.",
    },
  ];
  
  const testimonials = [
    {
      name: "Nguyễn Minh",
      role: "Sinh Viên Đại Học",
      content: "TàiLiệuVN đã trở thành công cụ thiết yếu cho các dự án nghiên cứu của tôi. Chất lượng tài liệu và khả năng truy cập dễ dàng đã giúp công việc học thuật của tôi dễ dàng hơn nhiều.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Trần Linh",
      role: "Chủ Doanh Nghiệp",
      content: "Các mẫu kinh doanh đã giúp tôi tiết kiệm vô số thời gian. Đáng đồng tiền bát gạo cho thời gian tiết kiệm được và chất lượng chuyên nghiệp.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Phạm Đức",
      role: "Nhà Nghiên Cứu",
      content: "Là một nhà nghiên cứu, việc có nguồn tài liệu đáng tin cậy là rất quan trọng. TàiLiệuVN cung cấp chính xác những gì tôi cần với thư viện tài liệu phong phú của họ.",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <FeaturedDocuments />
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Tất Cả Những Gì Bạn Cần Trong Một Nền Tảng
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Nền tảng tài liệu của chúng tôi được thiết kế để giúp truy cập tài liệu chất lượng cao một cách đơn giản, an toàn và giá cả phải chăng.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 p-3 rounded-full bg-primary/10">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-block text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-6">
                    Gói Giá Hợp Lý
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Truy Cập Tài Liệu Cao Cấp?</h2>
                  <p className="text-muted-foreground mb-8">
                    Chọn gói đăng ký phù hợp với bạn và nhận quyền truy cập không giới hạn vào thư viện tài liệu miễn phí đang phát triển của chúng tôi. Tài liệu cao cấp có sẵn để mua riêng.
                  </p>
                  <Button asChild size="lg" className="w-full md:w-auto">
                    <Link to="/pricing">
                      Xem Bảng Giá Của Chúng Tôi
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-primary/90 to-primary h-full p-8 md:p-12 flex flex-col justify-center text-white">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-4">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Tải Xuống Không Giới Hạn</h3>
                        <p className="text-white/80 text-sm">Tất cả tài liệu miễn phí với gói đăng ký</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-4">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Tài Liệu Chất Lượng Cao</h3>
                        <p className="text-white/80 text-sm">Được biên soạn bởi các chuyên gia trong lĩnh vực</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-4">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Hủy Bất Cứ Lúc Nào</h3>
                        <p className="text-white/80 text-sm">Không cam kết dài hạn, hủy khi bạn muốn</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Người Dùng Của Chúng Tôi Nói Gì
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Đây là những gì người dùng nói về trải nghiệm của họ với nền tảng TàiLiệuVN.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
