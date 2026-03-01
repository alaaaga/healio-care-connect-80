import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Ambulance, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactInfo = [
  { icon: Phone, label: "التليفون", value: "01012345678", sublabel: "متاح من ٩ ص - ١٠ م" },
  { icon: Mail, label: "البريد الإلكتروني", value: "info@medicare-eg.com", sublabel: "رد خلال ٢٤ ساعة" },
  { icon: MapPin, label: "العنوان", value: "١٢٣ شارع التحرير، الدقي، الجيزة", sublabel: "بجانب مترو الدقي" },
  { icon: Clock, label: "مواعيد العمل", value: "السبت - الخميس: ٩ ص - ١٠ م", sublabel: "الجمعة: ٢ م - ٨ م" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("تم إرسال رسالتك بنجاح! هنرد عليك في أقرب وقت.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="container-narrow">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">تواصل معنا</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">عندك سؤال أو محتاج مساعدة؟ فريقنا موجود لخدمتك. ابعتلنا رسالة وهنرد عليك في أسرع وقت.</p>
          </motion.div>

          {/* Emergency Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12 rounded-2xl overflow-hidden"
          >
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center shrink-0"
                >
                  <Ambulance className="w-8 h-8 text-destructive" />
                </motion.div>
                <div className="flex-1 text-center md:text-right">
                  <h2 className="font-display text-xl font-bold text-destructive mb-1 flex items-center justify-center md:justify-start gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    خط الطوارئ - ٢٤ ساعة
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">في حالة الطوارئ الطبية، اتصل فوراً. فريقنا الطبي متاح على مدار الساعة لمساعدتك.</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <a href="tel:01099887766" className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-semibold text-sm hover:bg-destructive/90 transition-colors">
                      <Phone className="w-4 h-4" />
                      01099887766
                    </a>
                    <a href="tel:123" className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive/20 text-destructive rounded-xl font-semibold text-sm hover:bg-destructive/30 transition-colors">
                      <Phone className="w-4 h-4" />
                      الإسعاف: 123
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-5 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">{info.label}</h3>
                <p className="text-sm text-foreground font-medium" dir="ltr">{info.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{info.sublabel}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">ابعتلنا رسالة</h2>
                    <p className="text-xs text-muted-foreground">وهنرد عليك في أقرب وقت</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-1.5 block">الاسم</Label>
                      <Input placeholder="محمد أحمد" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl" required />
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5 block">الموبايل</Label>
                      <Input placeholder="01012345678" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-11 rounded-xl" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">البريد الإلكتروني</Label>
                    <Input type="email" placeholder="example@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-11 rounded-xl" dir="ltr" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">الموضوع</Label>
                    <Input placeholder="استفسار عن حجز موعد" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="h-11 rounded-xl" required />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">الرسالة</Label>
                    <Textarea placeholder="اكتب رسالتك هنا..." rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="rounded-xl resize-none" required />
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button type="submit" disabled={sending} className="w-full h-12 gradient-hero-bg text-primary-foreground border-0 text-base font-semibold shadow-lg shadow-primary/25 gap-2">
                      {sending ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass-card rounded-2xl overflow-hidden h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.7!2d31.2!3d30.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzI0LjAiTiAzMcKwMTInMDAuMCJF!5e0!3m2!1sar!2seg!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 400 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع ميديكير"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
