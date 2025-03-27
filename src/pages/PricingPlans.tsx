
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentModal } from "@/components/PaymentModal";
import { CheckIcon, AlertCircle } from "lucide-react";

const PricingPlans = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };
  
  const monthlyPlans = [
    {
      id: "monthly",
      title: "1 Month Plan",
      price: 30000,
      duration: "month",
      features: [
        "Unlimited free document downloads",
        "Access to all free documents",
        "Preview premium documents",
        "Cancel anytime",
      ],
    },
    {
      id: "quarterly",
      title: "3 Month Plan",
      price: 45000,
      duration: "3 months",
      features: [
        "Unlimited free document downloads",
        "Access to all free documents",
        "Preview premium documents",
        "Priority customer support",
        "Cancel anytime",
      ],
      popular: true,
    },
    {
      id: "biannual",
      title: "6 Month Plan",
      price: 60000,
      duration: "6 months",
      features: [
        "Unlimited free document downloads",
        "Access to all free documents",
        "Preview premium documents",
        "Priority customer support",
        "5% discount on premium documents",
        "Cancel anytime",
      ],
    },
    {
      id: "annual",
      title: "12 Month Plan",
      price: 90000,
      duration: "year",
      features: [
        "Unlimited free document downloads",
        "Access to all free documents",
        "Preview premium documents",
        "Priority customer support",
        "10% discount on premium documents",
        "Cancel anytime",
      ],
    },
  ];
  
  const faqs = [
    {
      question: "What's included in the subscription?",
      answer: "Our subscription gives you unlimited downloads of all free documents in our library. Premium documents are not included in the subscription and must be purchased individually.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You will maintain access until the end of your current billing period.",
    },
    {
      question: "How can I purchase premium documents?",
      answer: "Premium documents can be purchased individually. Simply browse our document library, select a premium document, and proceed to checkout.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept payments through MoMo and ZaloPay. More payment options will be added in the future.",
    },
    {
      question: "Are the downloaded documents editable?",
      answer: "Most documents are provided in PDF format and are not directly editable. Some templates and forms may be available in editable formats like DOCX or XLSX.",
    },
    {
      question: "What if I'm not satisfied with a premium document?",
      answer: "We offer a 7-day refund policy for premium documents if they don't meet your expectations. Contact our customer support for assistance.",
    },
  ];
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground">
              Choose a plan that works for you to access unlimited free documents.
              Premium documents are available for individual purchase.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-muted/50 rounded-lg p-4 max-w-3xl mx-auto mb-10 flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Free & Premium Documents</h3>
              <p className="text-sm text-muted-foreground">
                Our subscription plans only apply to downloading free documents. All free documents can be previewed without a subscription, but downloading requires an active subscription. Premium documents must be purchased individually.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {monthlyPlans.map((plan, index) => (
                <SubscriptionCard
                  key={plan.id}
                  title={plan.title}
                  price={plan.price}
                  duration={plan.duration}
                  features={plan.features}
                  popular={plan.popular}
                  onSelect={() => handleSelectPlan(plan.id)}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Comparison Table */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-center mb-10">Plan Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-6 text-left font-medium text-muted-foreground">Features</th>
                    <th className="py-4 px-6 text-center font-medium">1 Month</th>
                    <th className="py-4 px-6 text-center font-medium bg-primary/5 border-x border-primary/10">3 Months</th>
                    <th className="py-4 px-6 text-center font-medium">6 Months</th>
                    <th className="py-4 px-6 text-center font-medium">12 Months</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-6 text-muted-foreground">Price</td>
                    <td className="py-4 px-6 text-center font-medium">30.000₫</td>
                    <td className="py-4 px-6 text-center font-medium bg-primary/5 border-x border-primary/10">45.000₫</td>
                    <td className="py-4 px-6 text-center font-medium">60.000₫</td>
                    <td className="py-4 px-6 text-center font-medium">90.000₫</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 text-muted-foreground">Free document downloads</td>
                    <td className="py-4 px-6 text-center"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-6 text-center bg-primary/5 border-x border-primary/10"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 text-muted-foreground">Priority support</td>
                    <td className="py-4 px-6 text-center">-</td>
                    <td className="py-4 px-6 text-center bg-primary/5 border-x border-primary/10"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 text-muted-foreground">Premium document discount</td>
                    <td className="py-4 px-6 text-center">-</td>
                    <td className="py-4 px-6 text-center bg-primary/5 border-x border-primary/10">-</td>
                    <td className="py-4 px-6 text-center">5%</td>
                    <td className="py-4 px-6 text-center">10%</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-muted-foreground">Monthly cost (equivalent)</td>
                    <td className="py-4 px-6 text-center">30.000₫</td>
                    <td className="py-4 px-6 text-center font-medium bg-primary/5 border-x border-primary/10">15.000₫</td>
                    <td className="py-4 px-6 text-center">10.000₫</td>
                    <td className="py-4 px-6 text-center">7.500₫</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* FAQs */}
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index} 
                  className="border rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      
      {showPaymentModal && (
        <PaymentModal 
          docId="subscription"
          docTitle={monthlyPlans.find(plan => plan.id === selectedPlan)?.title || "Subscription"}
          docPrice={monthlyPlans.find(plan => plan.id === selectedPlan)?.price || 30000}
          isFree={true}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
      
      <Footer />
    </div>
  );
};

// Helper component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default PricingPlans;
