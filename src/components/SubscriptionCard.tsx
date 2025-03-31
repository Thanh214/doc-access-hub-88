
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";

interface SubscriptionCardProps {
  title: string;
  description?: string;
  price: number;
  duration: string;
  billingPeriod?: "monthly" | "yearly";
  features: string[];
  popular?: boolean;
  highlighted?: boolean;
  badge?: string;
  planId?: string;
  onSelect: () => void;
}

const SubscriptionCard = ({
  title,
  description,
  price,
  duration,
  features,
  popular = false,
  highlighted = false,
  badge,
  planId,
  onSelect,
}: SubscriptionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card 
        className={`relative overflow-hidden transition-transform duration-300 h-full flex flex-col ${
          isHovered ? "translate-y-[-8px] shadow-lg" : ""
        } ${popular || highlighted ? "border-primary shadow-md" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {(badge || popular) && (
          <div className="absolute top-5 right-0 bg-primary text-white text-xs px-3 py-1 rounded-l-full shadow-sm">
            {badge || "Phổ Biến Nhất"}
          </div>
        )}
        
        <CardHeader className="pb-4">
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{description || "Tải xuống tài liệu miễn phí"}</p>
        </CardHeader>
        
        <CardContent className="flex-grow pb-6">
          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{formatCurrency(price)}</span>
              <span className="text-muted-foreground ml-2">/{duration}</span>
            </div>
          </div>
          
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                <span className="text-muted-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            className={`w-full ${popular || highlighted ? "" : "bg-secondary text-primary hover:bg-secondary/80"}`}
            variant={(popular || highlighted) ? "default" : "outline"}
            onClick={onSelect}
          >
            Đăng Ký Ngay
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SubscriptionCard;
