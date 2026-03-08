import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, MapPin, Star, Clock, CheckCircle2, LogIn, Tag, Percent, CreditCard, Banknote, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Step = "auth" | "type" | "doctor" | "datetime" | "payment" | "confirm";
type BookingType = "online" | "clinic";
type PaymentMethod = "cash" | "card" | "wallet";

const timeSlots = ["٠٩:٠٠ ص", "٠٩:٣٠ ص", "١٠:٠٠ ص", "١٠:٣٠ ص", "١١:٠٠ ص", "٠٢:٠٠ م", "٠٢:٣٠ م", "٠٣:٠٠ م", "٠٣:٣٠ م", "٠٤:٠٠ م"];

export default function BookingPage() {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>("auth");
  const [bookingType, setBookingType] = useState<BookingType | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Load offer from URL params
  useEffect(() => {
    const offerId = searchParams.get("offer");
    if (offerId) {
      supabase.from("offers").select("*").eq("id", offerId).eq("is_active", true).single().then(({ data }) => {
        if (data) {
          // Check if offer hasn't expired
          if (!data.ends_at || new Date(data.ends_at) > new Date()) {
            setAppliedOffer(data);
            toast.success(`تم تطبيق عرض "${data.title}" — خصم ${data.discount}`);
          } else {
            toast.error("هذا العرض منتهي الصلاحية");
          }
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading) {
      setStep(user ? "type" : "auth");
    }
  }, [authLoading, user]);

  useEffect(() => {
    supabase.from("doctors").select("*").eq("is_active", true).then(({ data }) => {
      setDoctors(data || []);
      setLoadingDoctors(false);
    });
  }, []);

  const getOfferDiscountPercentage = (offer: any) => {
    if (!offer) return 0;

    const numericPercentage = Number(offer.discount_percentage);
    if (Number.isFinite(numericPercentage) && numericPercentage > 0) {
      return Math.min(100, Math.max(0, numericPercentage));
    }

    const normalizedDiscountText = String(offer.discount || "")
      .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString());
    const textMatch = normalizedDiscountText.match(/(\d+(?:\.\d+)?)/);
    const parsedPercentage = textMatch ? Number(textMatch[1]) : 0;

    if (!Number.isFinite(parsedPercentage) || parsedPercentage <= 0) return 0;
    return Math.min(100, Math.max(0, parsedPercentage));
  };

  const appliedDiscountPercentage = getOfferDiscountPercentage(appliedOffer);

  const getDiscountedPrice = (price: number) => {
    if (appliedDiscountPercentage <= 0) return price;
    return Math.round(price * (1 - appliedDiscountPercentage / 100));
  };

  const handleConfirm = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime || !paymentMethod) return;
    setSubmitting(true);

    const selectedDoc = doctors.find((d) => d.id === selectedDoctor);
    const finalAmount = selectedDoc ? getDiscountedPrice(selectedDoc.price) : 0;

    const { data: bookingData, error } = await supabase.from("bookings").insert({
      user_id: user.id,
      doctor_id: selectedDoctor,
      booking_date: selectedDate.toISOString().split("T")[0],
      booking_time: selectedTime,
      type: bookingType || "clinic",
      status: "pending",
      offer_id: appliedOffer?.id || null,
    }).select().single();

    if (error || !bookingData) {
      toast.error("حدث خطأ في الحجز. حاول تاني.");
      setSubmitting(false);
      return;
    }

    // Create mock payment record
    const { error: payError } = await supabase.from("payments").insert({
      booking_id: bookingData.id,
      user_id: user.id,
      amount: finalAmount,
      payment_method: paymentMethod,
      status: paymentMethod === "cash" ? "pending" : "completed",
      card_last4: paymentMethod === "card" ? cardNumber.slice(-4) : "",
      transaction_ref: paymentMethod !== "cash" ? `TXN-${Date.now().toString(36).toUpperCase()}` : "",
    });

    setSubmitting(false);
    if (payError) {
      toast.error("تم الحجز لكن فشل تسجيل الدفع");
    }
    setStep("confirm");
    toast.success("تم الحجز بنجاح! 🎉");
  };

  const allSteps: { key: Step; label: string }[] = [
    { key: "type", label: "نوع الزيارة" },
    { key: "doctor", label: "اختيار الطبيب" },
    { key: "datetime", label: "التاريخ والوقت" },
    { key: "payment", label: "الدفع" },
    { key: "confirm", label: "تأكيد الحجز" },
  ];
  const stepIndex = allSteps.findIndex((s) => s.key === step);

  const filteredDoctors = bookingType
    ? doctors.filter((d) => d.consultation_types?.includes(bookingType))
    : doctors;

  const selectedDoc = doctors.find((d) => d.id === selectedDoctor);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4 md:px-8">
        <div className="container-narrow max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">حجز موعد</h1>
            <p className="text-center text-muted-foreground mb-4">اختار نوع الاستشارة واحجز موعدك بكل سهولة</p>
          </motion.div>

          {/* Applied Offer Banner */}
          {appliedOffer && step !== "confirm" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 glass-card rounded-2xl p-4 border-2 border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Percent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">عرض مُطبّق: {appliedOffer.title}</p>
                    <p className="text-xs text-muted-foreground">خصم {appliedOffer.discount} على الكشف</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => { setAppliedOffer(null); toast.info("تم إزالة العرض"); }}>
                  إزالة العرض
                </Button>
              </div>
            </motion.div>
          )}

          {step === "auth" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-lg mx-auto">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">سجل دخولك الأول</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">عشان تقدر تحجز موعد وتتابع حجوزاتك، لازم تسجل دخولك أو تعمل حساب جديد الأول.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login"><Button className="gradient-hero-bg text-primary-foreground border-0 shadow-lg shadow-primary/25 gap-2 w-full sm:w-auto px-8"><LogIn className="w-4 h-4" />تسجيل الدخول</Button></Link>
                <Link to="/login"><Button variant="outline" className="gap-2 w-full sm:w-auto px-8">إنشاء حساب جديد</Button></Link>
              </div>
            </motion.div>
          )}

          {step !== "auth" && (
            <div className="flex items-center justify-center gap-2 mb-12">
              {allSteps.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <motion.div animate={i <= stepIndex ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.3 }} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all", i <= stepIndex ? "gradient-hero-bg text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground")}>
                    {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </motion.div>
                  <span className={cn("text-sm hidden sm:block", i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground")}>{s.label}</span>
                  {i < allSteps.length - 1 && <div className={cn("w-8 h-0.5 mx-1 transition-all", i < stepIndex ? "bg-primary" : "bg-muted")} />}
                </div>
              ))}
            </div>
          )}

          {step === "type" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-6">
              {[
                { type: "online" as BookingType, icon: Video, title: "استشارة أونلاين", desc: "مكالمة فيديو مع الطبيب من أي مكان" },
                { type: "clinic" as BookingType, icon: MapPin, title: "زيارة العيادة", desc: "زيارة العيادة للكشف المباشر" },
              ].map((opt) => (
                <motion.button key={opt.type} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => { setBookingType(opt.type); setStep("doctor"); }} className="glass-card rounded-2xl p-8 text-right transition-all">
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <opt.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{opt.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {step === "doctor" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {loadingDoctors ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
              ) : (
                filteredDoctors.map((doc, i) => {
                  const originalPrice = doc.price;
                  const discountedPrice = getDiscountedPrice(originalPrice);
                  const hasDiscount = appliedDiscountPercentage > 0 && discountedPrice < originalPrice;
                  return (
                    <motion.button key={doc.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ x: -4 }} onClick={() => { setSelectedDoctor(doc.id); setStep("datetime"); }} className={cn("glass-card rounded-2xl p-5 w-full text-right flex items-center gap-4 transition-all", selectedDoctor === doc.id && "ring-2 ring-primary")}>
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                        {doc.image_url ? <img src={doc.image_url} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover" /> : "👨‍⚕️"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
                        <p className="text-sm text-primary">{doc.specialty}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{doc.location}</span>
                          <span>•</span>
                          {hasDiscount ? (
                            <span className="flex items-center gap-1.5">
                              <span className="line-through text-muted-foreground">{originalPrice}</span>
                              <span className="font-bold text-primary">{discountedPrice} جنيه</span>
                              <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5">-{appliedDiscountPercentage}%</Badge>
                            </span>
                          ) : (
                            <span>{originalPrice} جنيه</span>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-medical-gold text-medical-gold" /><span className="text-sm font-medium">{Number(doc.rating).toFixed(1)}</span></div>
                      </div>
                    </motion.button>
                  );
                })
              )}
              <Button variant="ghost" onClick={() => setStep("type")} className="text-muted-foreground">→ رجوع</Button>
            </motion.div>
          )}

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
                      <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedTime(t)} className={cn("py-2.5 px-3 rounded-xl text-sm font-medium transition-all", selectedTime === t ? "gradient-hero-bg text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80")}>{t}</motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Price Summary */}
              {selectedDoc && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3">ملخص التكلفة</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">سعر الكشف</span>
                      <span className={cn("text-foreground", appliedDiscountPercentage > 0 && "line-through text-muted-foreground")}>{selectedDoc.price} جنيه</span>
                    </div>
                    {appliedDiscountPercentage > 0 && (
                      <>
                        <div className="flex justify-between text-primary">
                          <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />خصم {appliedOffer.title}</span>
                          <span>-{Math.round(selectedDoc.price * appliedDiscountPercentage / 100)} جنيه</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-bold">
                          <span className="text-foreground">الإجمالي</span>
                          <span className="text-primary text-lg">{getDiscountedPrice(selectedDoc.price)} جنيه</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("doctor")} className="text-muted-foreground">→ رجوع</Button>
                <Button onClick={() => setStep("payment")} disabled={!selectedDate || !selectedTime} className="gradient-hero-bg text-primary-foreground border-0 flex-1">
                  متابعة للدفع
                </Button>
              </div>
            </motion.div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-2">اختار طريقة الدفع</h3>
                <p className="text-sm text-muted-foreground mb-5">اختار الطريقة المناسبة لك (نظام تجريبي)</p>
                <div className={cn("grid gap-4", bookingType === "online" ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
                  {[
                    ...(bookingType !== "online" ? [{ method: "cash" as PaymentMethod, icon: Banknote, title: "دفع عند الزيارة", desc: "ادفع كاش في العيادة" }] : []),
                    { method: "card" as PaymentMethod, icon: CreditCard, title: "بطاقة بنكية", desc: "فيزا / ماستركارد" },
                    { method: "wallet" as PaymentMethod, icon: Wallet, title: "محفظة إلكترونية", desc: "فودافون كاش / أورانج" },
                  ].map((opt) => (
                    <motion.button
                      key={opt.method}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod(opt.method)}
                      className={cn(
                        "glass-card rounded-2xl p-5 text-right transition-all border-2",
                        paymentMethod === opt.method ? "border-primary bg-primary/5" : "border-transparent"
                      )}
                    >
                      <opt.icon className={cn("w-7 h-7 mb-3", paymentMethod === opt.method ? "text-primary" : "text-muted-foreground")} />
                      <h4 className="font-display font-semibold text-foreground text-sm">{opt.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Card Form (mock) */}
              {paymentMethod === "card" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />بيانات البطاقة (تجريبي)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-sm mb-1.5">رقم البطاقة</Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="4242 4242 4242 4242"
                        dir="ltr"
                        className="bg-muted/50 text-left tracking-wider"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm mb-1.5">تاريخ الانتهاء</Label>
                        <Input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/[^\d/]/g, "").slice(0, 5))}
                          placeholder="12/28"
                          dir="ltr"
                          className="bg-muted/50 text-left"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm mb-1.5">CVV</Label>
                        <Input
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          dir="ltr"
                          type="password"
                          className="bg-muted/50 text-left"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">🔒 هذا نظام دفع تجريبي — لا يتم خصم أي مبلغ فعلي</p>
                  </div>
                </motion.div>
              )}

              {/* Wallet (mock) */}
              {paymentMethod === "wallet" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />المحفظة الإلكترونية (تجريبي)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">سيتم إرسال رسالة تأكيد لرقم الموبايل المسجل</p>
                  <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">🔒 هذا نظام دفع تجريبي — لا يتم خصم أي مبلغ فعلي</p>
                </motion.div>
              )}

              {/* Payment Summary */}
              {selectedDoc && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3">ملخص الدفع</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">سعر الكشف</span>
                      <span className={cn("text-foreground", appliedDiscountPercentage > 0 && "line-through text-muted-foreground")}>{selectedDoc.price} جنيه</span>
                    </div>
                    {appliedDiscountPercentage > 0 && (
                      <div className="flex justify-between text-primary">
                        <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />خصم {appliedOffer.title}</span>
                        <span>-{Math.round(selectedDoc.price * appliedDiscountPercentage / 100)} جنيه</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span className="text-foreground">المطلوب</span>
                      <span className="text-primary text-lg">{getDiscountedPrice(selectedDoc.price)} جنيه</span>
                    </div>
                    {paymentMethod && (
                      <div className="flex justify-between pt-1">
                        <span className="text-muted-foreground">طريقة الدفع</span>
                        <span className="font-medium text-foreground">
                          {paymentMethod === "cash" ? "دفع عند الزيارة" : paymentMethod === "card" ? "بطاقة بنكية" : "محفظة إلكترونية"}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("datetime")} className="text-muted-foreground">→ رجوع</Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!paymentMethod || submitting || (paymentMethod === "card" && cardNumber.length < 16)}
                  className="gradient-hero-bg text-primary-foreground border-0 flex-1"
                >
                  {submitting ? "جاري الحجز..." : paymentMethod === "cash" ? "تأكيد الحجز" : "ادفع وأكد الحجز"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-full bg-medical-green/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-medical-green" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">تم تأكيد الحجز! 🎉</h2>
              <p className="text-muted-foreground mb-6">تم حجز موعدك بنجاح.</p>
              <div className="bg-muted rounded-xl p-4 space-y-3 text-sm text-right max-w-sm mx-auto">
                <div className="flex justify-between"><span className="text-muted-foreground">نوع الزيارة:</span><span className="font-medium text-foreground">{bookingType === "online" ? "أونلاين" : "زيارة عيادة"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الطبيب:</span><span className="font-medium text-foreground">{selectedDoc?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">التاريخ:</span><span className="font-medium text-foreground">{selectedDate?.toLocaleDateString("ar-EG")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الوقت:</span><span className="font-medium text-foreground">{selectedTime}</span></div>
                {appliedOffer && (
                  <div className="flex justify-between"><span className="text-muted-foreground">العرض:</span><span className="font-medium text-primary">{appliedOffer.title} ({appliedOffer.discount})</span></div>
                )}
                {selectedDoc && appliedDiscountPercentage > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">السعر بعد الخصم:</span><span className="font-bold text-primary">{getDiscountedPrice(selectedDoc.price)} جنيه</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">طريقة الدفع:</span><span className="font-medium text-foreground">{paymentMethod === "cash" ? "دفع عند الزيارة" : paymentMethod === "card" ? "بطاقة بنكية" : "محفظة إلكترونية"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">حالة الدفع:</span><Badge className={paymentMethod === "cash" ? "bg-yellow-500/10 text-yellow-600 border-0" : "bg-medical-green/10 text-medical-green border-0"}>{paymentMethod === "cash" ? "في انتظار الدفع" : "تم الدفع ✓"}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الحالة:</span><Badge className="bg-medical-green/10 text-medical-green border-0">في الانتظار</Badge></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link to="/dashboard"><Button variant="outline" className="gap-2">متابعة حجوزاتي</Button></Link>
                <Button className="gradient-hero-bg text-primary-foreground border-0" onClick={() => { setStep("type"); setBookingType(null); setSelectedDoctor(null); setSelectedDate(undefined); setSelectedTime(null); setAppliedOffer(null); setPaymentMethod(null); setCardNumber(""); setCardExpiry(""); setCardCvv(""); }}>حجز موعد آخر</Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
