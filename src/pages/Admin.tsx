import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users, Calendar, FileText, Stethoscope, TrendingUp, CheckCircle2, Clock, XCircle,
  Plus, Trash2, Edit, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Doctor form
  const [docForm, setDocForm] = useState({ name: "", specialty: "", location: "", price: 0, bio: "" });
  const [docDialogOpen, setDocDialogOpen] = useState(false);

  // Article form
  const [artForm, setArtForm] = useState({ title: "", content: "", excerpt: "", category: "عام", author: "فريق ميديكير" });
  const [artDialogOpen, setArtDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
      toast.error("مش مسموحلك تدخل هنا");
    }
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const fetchAll = async () => {
      const [{ data: d }, { data: b }, { data: a }, { data: p }] = await Promise.all([
        supabase.from("doctors").select("*").order("created_at", { ascending: false }),
        supabase.from("bookings").select("*, doctors(name, specialty), profiles(full_name)").order("created_at", { ascending: false }),
        supabase.from("articles").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      setDoctors(d || []);
      setBookings(b || []);
      setArticles(a || []);
      setProfiles(p || []);
      setLoadingData(false);
    };
    fetchAll();
  }, [user, isAdmin]);

  const addDoctor = async () => {
    const { error } = await supabase.from("doctors").insert({ ...docForm, is_active: true, consultation_types: ["clinic", "online"] });
    if (!error) {
      toast.success("تم إضافة الطبيب");
      setDocDialogOpen(false);
      setDocForm({ name: "", specialty: "", location: "", price: 0, bio: "" });
      const { data } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
      setDoctors(data || []);
    } else toast.error("حدث خطأ");
  };

  const deleteDoctor = async (id: string) => {
    await supabase.from("doctors").delete().eq("id", id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    toast.success("تم حذف الطبيب");
  };

  const addArticle = async () => {
    const { error } = await supabase.from("articles").insert({ ...artForm, is_published: true });
    if (!error) {
      toast.success("تم إضافة المقال");
      setArtDialogOpen(false);
      setArtForm({ title: "", content: "", excerpt: "", category: "عام", author: "فريق ميديكير" });
      const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
      setArticles(data || []);
    } else toast.error("حدث خطأ");
  };

  const deleteArticle = async (id: string) => {
    await supabase.from("articles").delete().eq("id", id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    toast.success("تم حذف المقال");
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success("تم تحديث حالة الحجز");
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 md:px-8 container-narrow">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "إجمالي الأطباء", value: doctors.length, icon: Stethoscope, color: "text-primary" },
    { label: "إجمالي الحجوزات", value: bookings.length, icon: Calendar, color: "text-medical-blue" },
    { label: "المقالات", value: articles.length, icon: FileText, color: "text-medical-purple" },
    { label: "المستخدمين", value: profiles.length, icon: Users, color: "text-medical-green" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600",
      confirmed: "bg-primary/10 text-primary",
      completed: "bg-medical-green/10 text-medical-green",
      cancelled: "bg-destructive/10 text-destructive",
    };
    const labels: Record<string, string> = { pending: "انتظار", confirmed: "مؤكد", completed: "مكتمل", cancelled: "ملغي" };
    return <Badge className={`${map[status] || ""} border-0`}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-medical-coral/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-medical-coral" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">لوحة تحكم الأدمن</h1>
                <p className="text-muted-foreground text-sm">إدارة شاملة للنظام</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl p-4 text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="font-display font-bold text-lg text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-6 flex-wrap">
              <TabsTrigger value="overview" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"><TrendingUp className="w-4 h-4" />نظرة عامة</TabsTrigger>
              <TabsTrigger value="doctors" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Stethoscope className="w-4 h-4" />الأطباء</TabsTrigger>
              <TabsTrigger value="bookings" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Calendar className="w-4 h-4" />الحجوزات</TabsTrigger>
              <TabsTrigger value="articles" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"><FileText className="w-4 h-4" />المقالات</TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Users className="w-4 h-4" />المستخدمين</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">آخر الحجوزات</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{b.profiles?.full_name || "مستخدم"}</p>
                          <p className="text-xs text-muted-foreground">{b.doctors?.name} • {b.booking_date}</p>
                        </div>
                        {statusBadge(b.status)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">إحصائيات الحجوزات</h3>
                  <div className="space-y-4">
                    {[
                      { label: "في الانتظار", count: bookings.filter((b) => b.status === "pending").length, icon: Clock, color: "text-yellow-600" },
                      { label: "مؤكدة", count: bookings.filter((b) => b.status === "confirmed").length, icon: CheckCircle2, color: "text-primary" },
                      { label: "مكتملة", count: bookings.filter((b) => b.status === "completed").length, icon: CheckCircle2, color: "text-medical-green" },
                      { label: "ملغية", count: bookings.filter((b) => b.status === "cancelled").length, icon: XCircle, color: "text-destructive" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <s.icon className={`w-4 h-4 ${s.color}`} />
                          <span className="text-sm text-foreground">{s.label}</span>
                        </div>
                        <span className="font-display font-bold text-foreground">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Doctors */}
            <TabsContent value="doctors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-foreground">إدارة الأطباء</h3>
                <Dialog open={docDialogOpen} onOpenChange={setDocDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-hero-bg text-primary-foreground border-0 gap-2"><Plus className="w-4 h-4" />إضافة طبيب</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle className="font-display">إضافة طبيب جديد</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div><Label>الاسم</Label><Input value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} /></div>
                      <div><Label>التخصص</Label><Input value={docForm.specialty} onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })} /></div>
                      <div><Label>الموقع</Label><Input value={docForm.location} onChange={(e) => setDocForm({ ...docForm, location: e.target.value })} /></div>
                      <div><Label>السعر (جنيه)</Label><Input type="number" value={docForm.price} onChange={(e) => setDocForm({ ...docForm, price: Number(e.target.value) })} /></div>
                      <div><Label>نبذة</Label><Textarea value={docForm.bio} onChange={(e) => setDocForm({ ...docForm, bio: e.target.value })} /></div>
                      <Button onClick={addDoctor} className="w-full gradient-hero-bg text-primary-foreground border-0">إضافة</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead className="text-right">الاسم</TableHead><TableHead className="text-right">التخصص</TableHead><TableHead className="text-right">الموقع</TableHead><TableHead className="text-right">السعر</TableHead><TableHead className="text-right">التقييم</TableHead><TableHead className="text-right">إجراءات</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.specialty}</TableCell>
                        <TableCell>{doc.location}</TableCell>
                        <TableCell>{doc.price} جنيه</TableCell>
                        <TableCell>{Number(doc.rating).toFixed(1)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteDoctor(doc.id)}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Bookings */}
            <TabsContent value="bookings">
              <h3 className="font-display font-bold text-foreground mb-4">إدارة الحجوزات</h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead className="text-right">المريض</TableHead><TableHead className="text-right">الطبيب</TableHead><TableHead className="text-right">التاريخ</TableHead><TableHead className="text-right">النوع</TableHead><TableHead className="text-right">الحالة</TableHead><TableHead className="text-right">إجراءات</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.profiles?.full_name || "مستخدم"}</TableCell>
                        <TableCell>{b.doctors?.name}</TableCell>
                        <TableCell>{b.booking_date} {b.booking_time}</TableCell>
                        <TableCell>{b.type === "online" ? "أونلاين" : "عيادة"}</TableCell>
                        <TableCell>{statusBadge(b.status)}</TableCell>
                        <TableCell>
                          <Select value={b.status} onValueChange={(val) => updateBookingStatus(b.id, val)}>
                            <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">انتظار</SelectItem>
                              <SelectItem value="confirmed">تأكيد</SelectItem>
                              <SelectItem value="completed">مكتمل</SelectItem>
                              <SelectItem value="cancelled">إلغاء</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Articles */}
            <TabsContent value="articles">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-foreground">إدارة المقالات</h3>
                <Dialog open={artDialogOpen} onOpenChange={setArtDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-hero-bg text-primary-foreground border-0 gap-2"><Plus className="w-4 h-4" />إضافة مقال</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle className="font-display">إضافة مقال جديد</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div><Label>العنوان</Label><Input value={artForm.title} onChange={(e) => setArtForm({ ...artForm, title: e.target.value })} /></div>
                      <div><Label>الملخص</Label><Input value={artForm.excerpt} onChange={(e) => setArtForm({ ...artForm, excerpt: e.target.value })} /></div>
                      <div><Label>التصنيف</Label><Input value={artForm.category} onChange={(e) => setArtForm({ ...artForm, category: e.target.value })} /></div>
                      <div><Label>الكاتب</Label><Input value={artForm.author} onChange={(e) => setArtForm({ ...artForm, author: e.target.value })} /></div>
                      <div><Label>المحتوى</Label><Textarea rows={5} value={artForm.content} onChange={(e) => setArtForm({ ...artForm, content: e.target.value })} /></div>
                      <Button onClick={addArticle} className="w-full gradient-hero-bg text-primary-foreground border-0">إضافة</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead className="text-right">العنوان</TableHead><TableHead className="text-right">التصنيف</TableHead><TableHead className="text-right">الكاتب</TableHead><TableHead className="text-right">التاريخ</TableHead><TableHead className="text-right">إجراءات</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{a.title}</TableCell>
                        <TableCell><Badge variant="outline">{a.category}</Badge></TableCell>
                        <TableCell>{a.author}</TableCell>
                        <TableCell>{new Date(a.created_at).toLocaleDateString("ar-EG")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteArticle(a.id)}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users">
              <h3 className="font-display font-bold text-foreground mb-4">المستخدمين المسجلين</h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead className="text-right">الاسم</TableHead><TableHead className="text-right">الموبايل</TableHead><TableHead className="text-right">تاريخ التسجيل</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.full_name || "غير محدد"}</TableCell>
                        <TableCell dir="ltr">{p.phone || "—"}</TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString("ar-EG")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
