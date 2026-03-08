import { useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Users, Calendar, DollarSign, Stethoscope, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalyticsTabProps {
  bookings: any[];
  doctors: any[];
  profiles: any[];
  prescriptions: any[];
  articles: any[];
  offers: any[];
}

const COLORS = [
  "hsl(142, 71%, 45%)", // green
  "hsl(217, 91%, 60%)", // blue
  "hsl(263, 70%, 50%)", // purple
  "hsl(25, 95%, 53%)",  // orange
  "hsl(348, 83%, 47%)", // red
  "hsl(45, 93%, 47%)",  // yellow
];

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(45, 93%, 47%)",
  confirmed: "hsl(217, 91%, 60%)",
  completed: "hsl(142, 71%, 45%)",
  cancelled: "hsl(348, 83%, 47%)",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "انتظار",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function AnalyticsTab({ bookings, doctors, profiles, prescriptions, articles, offers }: AnalyticsTabProps) {
  // Bookings by status (Pie)
  const bookingsByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status] || COLORS[0],
    }));
  }, [bookings]);

  // Bookings over last 30 days (Bar)
  const bookingsOverTime = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    bookings.forEach((b) => {
      const date = b.booking_date?.slice(0, 10);
      if (date && date in days) days[date]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("ar-EG", { day: "numeric", month: "short" }),
      الحجوزات: count,
    }));
  }, [bookings]);

  // Top doctors by bookings count
  const topDoctors = useMemo(() => {
    const counts: Record<string, { name: string; count: number; revenue: number }> = {};
    bookings.forEach((b) => {
      const docId = b.doctor_id;
      const docName = b.doctors?.name || "غير معروف";
      if (!counts[docId]) counts[docId] = { name: docName, count: 0, revenue: 0 };
      counts[docId].count++;
      const doc = doctors.find((d) => d.id === docId);
      if (doc) counts[docId].revenue += doc.price;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [bookings, doctors]);

  // User registrations over time (Line)
  const userRegistrations = useMemo(() => {
    const months: Record<string, number> = {};
    profiles.forEach((p) => {
      const month = new Date(p.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "short" });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ الشهر: month, المستخدمين: count }));
  }, [profiles]);

  // Specialties distribution
  const specialtyDist = useMemo(() => {
    const counts: Record<string, number> = {};
    doctors.forEach((d) => { counts[d.specialty] = (counts[d.specialty] || 0) + 1; });
    return Object.entries(counts).map(([spec, count]) => ({ name: spec, value: count }));
  }, [doctors]);

  // Revenue estimate
  const totalRevenue = useMemo(() => {
    return bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => {
        const doc = doctors.find((d) => d.id === b.doctor_id);
        return sum + (doc?.price || 0);
      }, 0);
  }, [bookings, doctors]);

  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const conversionRate = bookings.length > 0 ? Math.round((completedBookings / bookings.length) * 100) : 0;

  const statCards = [
    { label: "إجمالي الإيرادات (تقديري)", value: `${totalRevenue.toLocaleString("ar-EG")} جنيه`, icon: DollarSign, color: "text-primary" },
    { label: "معدل الإكمال", value: `${conversionRate}%`, icon: Activity, color: "text-medical-blue" },
    { label: "مستخدمين جدد", value: profiles.length, icon: Users, color: "text-medical-purple" },
    { label: "إجمالي الروشتات", value: prescriptions.length, icon: Stethoscope, color: "text-medical-green" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 text-center">
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <p className="font-display font-bold text-lg text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bookings Over Time */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            الحجوزات آخر 30 يوم
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
                <Bar dataKey="الحجوزات" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-medical-blue" />
            توزيع حالات الحجوزات
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingsByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {bookingsByStatus.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Doctors */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-medical-green" />
            أكثر الأطباء حجوزات
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDoctors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} formatter={(value: number) => [`${value} حجز`, "الحجوزات"]} />
                <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Registrations */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-medical-purple" />
            تسجيلات المستخدمين
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="الشهر" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
                <Line type="monotone" dataKey="المستخدمين" stroke="hsl(263, 70%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Specialty Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-medical-coral" />
            توزيع التخصصات
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={specialtyDist} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {specialtyDist.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            ملخص سريع
          </h3>
          <div className="space-y-4">
            {[
              { label: "أطباء نشطين", value: doctors.filter((d) => d.is_active).length, total: doctors.length },
              { label: "حجوزات اليوم", value: bookings.filter((b) => b.booking_date === new Date().toISOString().slice(0, 10)).length },
              { label: "مقالات منشورة", value: articles.filter((a) => a.is_published).length, total: articles.length },
              { label: "عروض نشطة", value: offers.filter((o) => o.is_active).length, total: offers.length },
              { label: "متوسط سعر الكشف", value: doctors.length > 0 ? `${Math.round(doctors.reduce((s, d) => s + d.price, 0) / doctors.length)} جنيه` : "—" },
              { label: "أعلى تقييم", value: doctors.length > 0 ? `${Math.max(...doctors.map((d) => d.rating))} ⭐` : "—" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-foreground">{item.value}</span>
                  {item.total !== undefined && (
                    <Badge variant="outline" className="text-xs">من {item.total}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
