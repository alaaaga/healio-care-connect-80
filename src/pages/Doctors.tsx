import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Calendar, Search, MapPin, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const specialties = ["الكل", "القلب", "الجلدية", "المخ والأعصاب", "العظام", "الأسنان", "العيون", "الأطفال", "النساء والتوليد"];

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("الكل");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await supabase.from("doctors").select("*").eq("is_active", true).order("rating", { ascending: false });
      setDoctors(data || []);
      setLoading(false);
    };
    fetchDoctors();

    // Realtime updates
    const channel = supabase
      .channel('doctors-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doctors' }, async () => {
        const { data } = await supabase.from("doctors").select("*").eq("is_active", true).order("rating", { ascending: false });
        setDoctors(data || []);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch = d.name.includes(search) || d.specialty.includes(search);
    const matchSpecialty = activeSpecialty === "الكل" || d.specialty === activeSpecialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">أطباؤنا المتخصصون</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">نخبة من أفضل الأطباء المعتمدين في جميع التخصصات الطبية</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="ابحث عن طبيب أو تخصص..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-12 rounded-xl" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-2 mb-10">
            {specialties.map((s) => (
              <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveSpecialty(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSpecialty === s ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {s}
              </motion.button>
            ))}
          </motion.div>

          <p className="text-sm text-muted-foreground mb-6">عرض {filtered.length} طبيب</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((doc, i) => (
                  <motion.div key={doc.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="glass-card rounded-2xl p-6 group">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shrink-0">
                        {doc.image_url ? <img src={doc.image_url} alt={doc.name} className="w-full h-full rounded-2xl object-cover" /> : "👨‍⚕️"}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-foreground">{doc.name}</h3>
                        <Badge variant="secondary" className="mt-1 text-xs">{doc.specialty}</Badge>
                      </div>
                      <span className="w-3 h-3 rounded-full bg-medical-green animate-pulse-soft shrink-0 mt-1" />
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      {doc.bio && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary shrink-0" />
                          <span className="line-clamp-1">{doc.bio}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>{doc.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-medical-gold text-medical-gold" />
                        <span className="text-sm font-bold text-foreground">{Number(doc.rating).toFixed(1)}</span>
                      </div>
                      <span className="font-display font-bold text-primary">{doc.price} جنيه</span>
                    </div>

                    <Link to="/booking">
                      <Button className="w-full gradient-hero-bg text-primary-foreground border-0 gap-2">
                        <Calendar className="w-4 h-4" />احجز موعد
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
