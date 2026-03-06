import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, User, LogOut, Bell, CheckCircle2, XCircle, AlertCircle, Timer, Users, Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "في الانتظار", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: AlertCircle },
  confirmed: { label: "مؤكد", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  completed: { label: "مكتمل", color: "bg-medical-green/10 text-medical-green border-medical-green/20", icon: CheckCircle2 },
  cancelled: { label: "ملغي", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [{ data: bookingsData }, { data: notifsData }, { data: prescData }] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, doctors(name, specialty)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("prescriptions")
          .select("*, doctors(name, specialty)")
          .eq("patient_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      setBookings(bookingsData || []);
      setNotifications(notifsData || []);
      setPrescriptions(prescData || []);
      setLoadingData(false);
    };
    fetchData();

    // Realtime: listen for new notifications
    const notifChannel = supabase
      .channel('user-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new as any, ...prev]);
        toast.info((payload.new as any).message);
      })
      .subscribe();

    // Realtime: listen for booking updates
    const bookingChannel = supabase
      .channel('user-bookings')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `user_id=eq.${user.id}`,
      }, async (payload) => {
        const updated = payload.new as any;
        // Fetch doctor info for the updated booking
        const { data: docData } = await supabase.from("doctors").select("name, specialty").eq("id", updated.doctor_id).single();
        setBookings((prev) => prev.map((b) => b.id === updated.id ? { ...updated, doctors: docData } : b));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
      supabase.removeChannel(bookingChannel);
    };
  }, [user]);

  const cancelBooking = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (!error) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
      toast.success("تم إلغاء الحجز");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 md:px-8 container-narrow">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "pending");
  const pastBookings = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  أهلاً {profile?.full_name || user.email}! 👋
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
                <Button variant="outline" onClick={signOut} className="gap-2 text-muted-foreground">
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
              { label: "إجمالي الزيارات", value: bookings.filter((b) => b.status === "completed").length.toString(), icon: CheckCircle2, color: "text-medical-green" },
              { label: "إشعارات جديدة", value: notifications.filter((n) => !n.is_read).length.toString(), icon: Bell, color: "text-medical-coral" },
              { label: "إجمالي الحجوزات", value: bookings.length.toString(), icon: User, color: "text-medical-purple" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="glass-card rounded-2xl p-4 text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="font-display font-bold text-lg text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Queue Tracker */}
          {activeBookings.some((b) => b.queue_position) && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-8 glass-card rounded-2xl p-6 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-display font-bold text-foreground">متابعة الطابور</h3>
                  <p className="text-xs text-muted-foreground">حالة موعدك الحالي في العيادة</p>
                </div>
              </div>
              {activeBookings.filter((b) => b.queue_position).map((booking) => (
                <div key={booking.id} className="bg-muted/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{booking.doctors?.name} - {booking.doctors?.specialty}</p>
                    <p className="text-sm text-muted-foreground">{booking.booking_date} | {booking.booking_time}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <motion.p animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="font-display text-3xl font-bold text-primary">
                        {booking.queue_position}
                      </motion.p>
                      <p className="text-xs text-muted-foreground">قدامك</p>
                    </div>
                    {booking.estimated_wait && (
                      <div className="text-center flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-foreground text-sm">{booking.estimated_wait}</p>
                          <p className="text-xs text-muted-foreground">وقت الانتظار</p>
                        </div>
                      </div>
                    )}
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
                  <Calendar className="w-4 h-4" />حجوزاتي
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Bell className="w-4 h-4" />الإشعارات
                  {notifications.filter((n) => !n.is_read).length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {notifications.filter((n) => !n.is_read).length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Pill className="w-4 h-4" />روشتاتي
                </TabsTrigger>
                <TabsTrigger value="profile" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <User className="w-4 h-4" />بياناتي
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookings">
                {loadingData ? (
                  <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display font-bold text-foreground mb-2">مافيش حجوزات لسه</h3>
                    <p className="text-muted-foreground mb-4">احجز أول موعد مع أفضل الأطباء</p>
                    <Link to="/booking"><Button className="gradient-hero-bg text-primary-foreground border-0">احجز الآن</Button></Link>
                  </div>
                ) : (
                  <>
                    {activeBookings.length > 0 && (
                      <div className="mb-8">
                        <h3 className="font-display font-semibold text-foreground mb-4">الحجوزات القادمة</h3>
                        <div className="space-y-3">
                          <AnimatePresence>
                            {activeBookings.map((booking, i) => {
                              const config = statusConfig[booking.status];
                              const StatusIcon = config.icon;
                              return (
                                <motion.div key={booking.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">👨‍⚕️</div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">{booking.doctors?.name}</h4>
                                    <p className="text-sm text-primary">{booking.doctors?.specialty}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.booking_date}</span>
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.booking_time}</span>
                                      <Badge variant="outline" className="text-xs">{booking.type === "online" ? "أونلاين" : "عيادة"}</Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`${config.color} border gap-1`}><StatusIcon className="w-3 h-3" />{config.label}</Badge>
                                    <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => cancelBooking(booking.id)}>إلغاء</Button>
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
                              <motion.div key={booking.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 opacity-70">
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">👨‍⚕️</div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground">{booking.doctors?.name}</h4>
                                  <p className="text-sm text-muted-foreground">{booking.doctors?.specialty}</p>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span>{booking.booking_date}</span><span>{booking.booking_time}</span>
                                  </div>
                                </div>
                                <Badge className={`${config.color} border gap-1`}><StatusIcon className="w-3 h-3" />{config.label}</Badge>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="notifications">
                {notifications.length === 0 ? (
                  <div className="text-center py-16">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display font-bold text-foreground mb-2">مافيش إشعارات</h3>
                  </div>
                ) : (
                  <div className="space-y-1 mb-4">
                    {notifications.filter((n) => !n.is_read).length > 0 && (
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={async () => {
                        await supabase.from("notifications").update({ is_read: true }).eq("user_id", user!.id).eq("is_read", false);
                        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                      }}>تعليم الكل كمقروء</Button>
                    )}
                  </div>
                )}
                {notifications.length > 0 && (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {notifications.map((notif, i) => {
                        const typeIcon = notif.type === 'success' ? CheckCircle2 : notif.type === 'error' ? XCircle : Bell;
                        const TypeIcon = typeIcon;
                        const typeColor = notif.type === 'success' ? 'text-medical-green' : notif.type === 'error' ? 'text-destructive' : 'text-primary';
                        return (
                          <motion.div key={notif.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                            className={`glass-card rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${!notif.is_read ? "border-r-4 border-r-primary" : "opacity-60"}`}
                            onClick={async () => {
                              if (!notif.is_read) {
                                await supabase.from("notifications").update({ is_read: true }).eq("id", notif.id);
                                setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, is_read: true } : n));
                              }
                            }}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notif.is_read ? "bg-primary/10" : "bg-muted"}`}>
                              <TypeIcon className={`w-4 h-4 ${!notif.is_read ? typeColor : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(notif.created_at).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="prescriptions">
                {prescriptions.length === 0 ? (
                  <div className="text-center py-16">
                    <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display font-bold text-foreground mb-2">مافيش روشتات</h3>
                    <p className="text-muted-foreground">الروشتات هتظهر هنا بعد زيارة الطبيب</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((pr, i) => (
                      <motion.div key={pr.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-medical-green/10 flex items-center justify-center">
                            <Pill className="w-5 h-5 text-medical-green" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{pr.doctors?.name}</h4>
                            <p className="text-xs text-muted-foreground">{new Date(pr.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</p>
                          </div>
                        </div>
                        {pr.diagnosis && (
                          <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">التشخيص</p>
                            <p className="text-sm font-medium text-foreground">{pr.diagnosis}</p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">الأدوية</p>
                          {(Array.isArray(pr.medications) ? pr.medications : []).map((m: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                              <Badge variant="outline" className="text-xs shrink-0">{m.name}</Badge>
                              {m.dosage && <span className="text-xs text-muted-foreground">{m.dosage}</span>}
                              {m.instructions && <span className="text-xs text-foreground">• {m.instructions}</span>}
                            </div>
                          ))}
                        </div>
                        {pr.notes && (
                          <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">ملاحظات</p>
                            <p className="text-sm text-foreground">{pr.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="profile">
                <div className="glass-card rounded-2xl p-6 max-w-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl gradient-hero-bg flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">{profile?.full_name || "مستخدم"}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "البريد الإلكتروني", value: user.email || "" },
                      { label: "رقم الموبايل", value: profile?.phone || "غير محدد" },
                      { label: "تاريخ الاشتراك", value: new Date(user.created_at).toLocaleDateString("ar-EG") },
                    ].map((field) => (
                      <div key={field.label} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground">{field.label}</span>
                        <span className="text-sm font-medium text-foreground" dir="ltr">{field.value}</span>
                      </div>
                    ))}
                  </div>
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
