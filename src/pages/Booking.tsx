import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, MapPin, Star, Clock, CheckCircle2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Step = "auth" | "type" | "doctor" | "datetime" | "confirm";
type BookingType = "online" | "clinic";

const doctors = [
  { id: 1, name: "د. سارة أحمد", specialty: "أمراض القلب", rating: 4.9, slots: 5 },
  { id: 2, name: "د. محمد حسن", specialty: "الأمراض الجلدية", rating: 4.8, slots: 3 },
  { id: 3, name: "د. نور الشريف", specialty: "المخ والأعصاب", rating: 4.9, slots: 7 },
  { id: 4, name: "د. أحمد مصطفى", specialty: "العظام", rating: 4.7, slots: 2 },
  { id: 5, name: "د. فاطمة الزهراء", specialty: "الأسنان", rating: 4.8, slots: 4 },
];

const timeSlots = ["٠٩:٠٠ ص", "٠٩:٣٠ ص", "١٠:٠٠ ص", "١٠:٣٠ ص", "١١:٠٠ ص", "٠٢:٠٠ م", "٠٢:٣٠ م", "٠٣:٠٠ م", "٠٣:٣٠ م", "٠٤:٠٠ م"];

// Simulated auth state - will be replaced with real auth later
const useAuth = () => {
  const isLoggedIn = localStorage.getItem("medicare_logged_in") === "true";
  return { isLoggedIn };
};

export default function BookingPage() {
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState<Step>(isLoggedIn ? "type" : "auth");
  const [bookingType, setBookingType] = useState<BookingType | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const allSteps: { key: Step; label: string }[] = [
    { key: "type", label: "نوع الزيارة" },
    { key: "doctor", label: "اختيار الطبيب" },
    { key: "datetime", label: "التاريخ والوقت" },
    { key: "confirm", label: "تأكيد الحجز" },
  ];

  const stepIndex = allSteps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4 md:px-8">
        <div className="container-narrow max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">حجز موعد</h1>
            <p className="text-center text-muted-foreground mb-10">اختار نوع الاستشارة واحجز موعدك بكل سهولة</p>
          </motion.div>

          {/* Auth Gate */}
          {step === "auth" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-lg mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              >
                <LogIn className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">سجل دخولك الأول</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                عشان تقدر تحجز موعد وتتابع حجوزاتك، لازم تسجل دخولك أو تعمل حساب جديد الأول.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login">
                  <Button className="gradient-hero-bg text-primary-foreground border-0 shadow-lg shadow-primary/25 gap-2 w-full sm:w-auto px-8">
                    <LogIn className="w-4 h-4" />
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto px-8">
                    إنشاء حساب جديد
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Progress - show only when past auth */}
          {step !== "auth" && (
            <div className="flex items-center justify-center gap-2 mb-12">
              {allSteps.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <motion.div
                    animate={i <= stepIndex ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      i <= stepIndex ? "gradient-hero-bg text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </motion.div>
                  <span className={cn("text-sm hidden sm:block", i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground")}>{s.label}</span>
                  {i < allSteps.length - 1 && <div className={cn("w-8 h-0.5 mx-1 transition-all", i < stepIndex ? "bg-primary" : "bg-muted")} />}
                </div>
              ))}
            </div>
          )}

          {/* Step: Type */}
          {step === "type" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-6">
              {[
                { type: "online" as BookingType, icon: Video, title: "استشارة أونلاين", desc: "مكالمة فيديو مع الطبيب من أي مكان" },
                { type: "clinic" as BookingType, icon: MapPin, title: "زيارة العيادة", desc: "زيارة العيادة للكشف المباشر" },
              ].map((opt) => (
                <motion.button
                  key={opt.type}
                  whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setBookingType(opt.type); setStep("doctor"); }}
                  className="glass-card rounded-2xl p-8 text-right transition-all"
                >
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <opt.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{opt.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step: Doctor */}
          {step === "doctor" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {doctors.map((doc, i) => (
                <motion.button
                  key={doc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: -4 }}
                  onClick={() => { setSelectedDoctor(doc.id); setStep("datetime"); }}
                  className={cn("glass-card rounded-2xl p-5 w-full text-right flex items-center gap-4 transition-all", selectedDoctor === doc.id && "ring-2 ring-primary")}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">👨‍⚕️</div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-primary">{doc.specialty}</p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-medical-gold text-medical-gold" />
                      <span className="text-sm font-medium">{doc.rating}</span>
                    </div>
                    <span className="text-xs text-medical-green">{doc.slots} مواعيد</span>
                  </div>
                </motion.button>
              ))}
              <Button variant="ghost" onClick={() => setStep("type")} className="text-muted-foreground">→ رجوع</Button>
            </motion.div>
          )}

          {/* Step: Date & Time */}
          {step === "datetime" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold mb-4 text-foreground">اختار التاريخ</h3>
                <CalendarUI mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date < new Date()} className="pointer-events-auto mx-auto" />
              </div>
              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-semibold mb-4 text-foreground">اختار الوقت</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((t) => (
                      <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedTime(t)}
                        className={cn("py-2.5 px-3 rounded-xl text-sm font-medium transition-all", selectedTime === t ? "gradient-hero-bg text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80")}
                      >{t}</motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("doctor")} className="text-muted-foreground">→ رجوع</Button>
                <Button onClick={() => setStep("confirm")} disabled={!selectedDate || !selectedTime} className="gradient-hero-bg text-primary-foreground border-0 flex-1">متابعة</Button>
              </div>
            </motion.div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-full bg-medical-green/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-medical-green" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">تم تأكيد الحجز! 🎉</h2>
              <p className="text-muted-foreground mb-6">تم حجز موعدك بنجاح. هتوصلك رسالة تأكيد على الموبايل.</p>
              <div className="bg-muted rounded-xl p-4 space-y-3 text-sm text-right max-w-sm mx-auto">
                <div className="flex justify-between"><span className="text-muted-foreground">نوع الزيارة:</span><span className="font-medium text-foreground">{bookingType === "online" ? "أونلاين" : "زيارة عيادة"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الطبيب:</span><span className="font-medium text-foreground">{doctors.find((d) => d.id === selectedDoctor)?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">التاريخ:</span><span className="font-medium text-foreground">{selectedDate?.toLocaleDateString("ar-EG")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الوقت:</span><span className="font-medium text-foreground">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الحالة:</span><Badge className="bg-medical-green/10 text-medical-green border-0">في الانتظار</Badge></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link to="/dashboard">
                  <Button variant="outline" className="gap-2">متابعة حجوزاتي</Button>
                </Link>
                <Button className="gradient-hero-bg text-primary-foreground border-0" onClick={() => { setStep("type"); setBookingType(null); setSelectedDoctor(null); setSelectedDate(undefined); setSelectedTime(null); }}>
                  حجز موعد آخر
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
