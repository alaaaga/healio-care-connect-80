import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, User, LogOut, Heart, Bell, FileText,
  ChevronLeft, Users, CheckCircle2, XCircle, AlertCircle, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockUser = {
  name: "محمد أحمد",
  email: "mohamed@example.com",
  phone: "01012345678",
  joinDate: "يناير ٢٠٢٦",
};

const mockBookings = [
  { id: 1, doctor: "د. سارة أحمد", specialty: "أمراض القلب", date: "٥ مارس ٢٠٢٦", time: "١٠:٠٠ ص", type: "عيادة", status: "confirmed", queuePosition: 3, estimatedWait: "٤٥ دقيقة" },
  { id: 2, doctor: "د. محمد حسن", specialty: "الأمراض الجلدية", date: "١٢ مارس ٢٠٢٦", time: "٠٢:٣٠ م", type: "أونلاين", status: "pending", queuePosition: null, estimatedWait: null },
  { id: 3, doctor: "د. نور الشريف", specialty: "المخ والأعصاب", date: "٢٠ فبراير ٢٠٢٦", time: "١١:٠٠ ص", type: "عيادة", status: "completed", queuePosition: null, estimatedWait: null },
  { id: 4, doctor: "د. فاطمة الزهراء", specialty: "الأسنان", date: "١٥ فبراير ٢٠٢٦", time: "٠٣:٠٠ م", type: "عيادة", status: "cancelled", queuePosition: null, estimatedWait: null },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "في الانتظار", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: AlertCircle },
  confirmed: { label: "مؤكد", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  completed: { label: "مكتمل", color: "bg-medical-green/10 text-medical-green border-medical-green/20", icon: CheckCircle2 },
  cancelled: { label: "ملغي", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

const notifications = [
  { id: 1, text: "تم تأكيد موعدك مع د. سارة أحمد يوم ٥ مارس", time: "منذ ساعة", read: false },
  { id: 2, text: "تذكير: موعدك بكرة مع د. محمد حسن الساعة ٢:٣٠ م", time: "منذ ٣ ساعات", read: false },
  { id: 3, text: "د. نور الشريف أضاف تقرير الكشف بتاعك", time: "منذ يومين", read: true },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");

  const activeBookings = mockBookings.filter((b) => b.status === "confirmed" || b.status === "pending");
  const pastBookings = mockBookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="container-narrow">
          {/* Welcome Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  أهلاً {mockUser.name}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">تابع مواعيدك وتفاصيل حجوزاتك من هنا</p>
              </div>
              <div className="flex gap-2">
                <Link to="/booking">
                  <Button className="gradient-hero-bg text-primary-foreground border-0 shadow-lg shadow-primary/25 gap-2">
                    <Calendar className="w-4 h-4" />
                    حجز موعد جديد
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => navigate("/login")} className="gap-2 text-muted-foreground">
                  <LogOut className="w-4 h-4" />
                  خروج
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "حجوزات قادمة", value: activeBookings.length.toString(), icon: Calendar, color: "text-primary" },
              { label: "إجمالي الزيارات", value: mockBookings.filter((b) => b.status === "completed").length.toString(), icon: CheckCircle2, color: "text-medical-green" },
              { label: "إشعارات جديدة", value: notifications.filter((n) => !n.read).length.toString(), icon: Bell, color: "text-medical-coral" },
              { label: "عضو منذ", value: mockUser.joinDate, icon: User, color: "text-medical-purple" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="font-display font-bold text-lg text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Queue Tracker */}
          {activeBookings.some((b) => b.queuePosition) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 glass-card rounded-2xl p-6 border-2 border-primary/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                >
                  <Users className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-display font-bold text-foreground">متابعة الطابور</h3>
                  <p className="text-xs text-muted-foreground">حالة موعدك الحالي في العيادة</p>
                </div>
              </div>
              {activeBookings.filter((b) => b.queuePosition).map((booking) => (
                <div key={booking.id} className="bg-muted/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{booking.doctor} - {booking.specialty}</p>
                    <p className="text-sm text-muted-foreground">{booking.date} | {booking.time}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <motion.p
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="font-display text-3xl font-bold text-primary"
                      >
                        {booking.queuePosition}
                      </motion.p>
                      <p className="text-xs text-muted-foreground">قدامك</p>
                    </div>
                    <div className="text-center flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{booking.estimatedWait}</p>
                        <p className="text-xs text-muted-foreground">وقت الانتظار المتوقع</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-6">
                <TabsTrigger value="bookings" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Calendar className="w-4 h-4" />
                  حجوزاتي
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Bell className="w-4 h-4" />
                  الإشعارات
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="profile" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <User className="w-4 h-4" />
                  بياناتي
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookings">
                {activeBookings.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-display font-semibold text-foreground mb-4">الحجوزات القادمة</h3>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {activeBookings.map((booking, i) => {
                          const config = statusConfig[booking.status];
                          const StatusIcon = config.icon;
                          return (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">👨‍⚕️</div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{booking.doctor}</h4>
                                <p className="text-sm text-primary">{booking.specialty}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.date}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.time}</span>
                                  <Badge variant="outline" className="text-xs">{booking.type}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${config.color} border gap-1`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {config.label}
                                </Badge>
                                <Button variant="ghost" size="sm" className="text-destructive text-xs">إلغاء</Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {pastBookings.length > 0 && (
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-4">السجل السابق</h3>
                    <div className="space-y-3">
                      {pastBookings.map((booking, i) => {
                        const config = statusConfig[booking.status];
                        const StatusIcon = config.icon;
                        return (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 opacity-70"
                          >
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">👨‍⚕️</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{booking.doctor}</h4>
                              <p className="text-sm text-muted-foreground">{booking.specialty}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span>{booking.date}</span>
                                <span>{booking.time}</span>
                              </div>
                            </div>
                            <Badge className={`${config.color} border gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notifications">
                <div className="space-y-3">
                  {notifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`glass-card rounded-xl p-4 flex items-start gap-3 ${!notif.read ? "border-r-4 border-r-primary" : "opacity-60"}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? "bg-primary/10" : "bg-muted"}`}>
                        <Bell className={`w-4 h-4 ${!notif.read ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{notif.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="profile">
                <div className="glass-card rounded-2xl p-6 max-w-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl gradient-hero-bg flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">{mockUser.name}</h3>
                      <p className="text-sm text-muted-foreground">عضو منذ {mockUser.joinDate}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "البريد الإلكتروني", value: mockUser.email },
                      { label: "رقم الموبايل", value: mockUser.phone },
                      { label: "تاريخ الاشتراك", value: mockUser.joinDate },
                    ].map((field) => (
                      <div key={field.label} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground">{field.label}</span>
                        <span className="text-sm font-medium text-foreground" dir="ltr">{field.value}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6">تعديل البيانات</Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
