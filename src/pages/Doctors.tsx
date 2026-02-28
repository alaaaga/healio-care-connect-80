import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Calendar, Search, MapPin, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const specialties = ["الكل", "القلب", "الجلدية", "المخ والأعصاب", "العظام", "الأسنان", "العيون", "الأطفال", "النساء والتوليد"];

const allDoctors = [
  { id: 1, name: "د. سارة أحمد", specialty: "القلب", rating: 4.9, reviews: 124, slots: 5, emoji: "👩‍⚕️", experience: "١٢ سنة", location: "المعادي، القاهرة", price: "٥٠٠ جنيه", available: true },
  { id: 2, name: "د. محمد حسن", specialty: "الجلدية", rating: 4.8, reviews: 98, slots: 3, emoji: "👨‍⚕️", experience: "٨ سنوات", location: "الدقي، الجيزة", price: "٤٠٠ جنيه", available: true },
  { id: 3, name: "د. نور الشريف", specialty: "المخ والأعصاب", rating: 4.9, reviews: 156, slots: 7, emoji: "👩‍⚕️", experience: "١٥ سنة", location: "مصر الجديدة، القاهرة", price: "٦٠٠ جنيه", available: true },
  { id: 4, name: "د. أحمد مصطفى", specialty: "العظام", rating: 4.7, reviews: 87, slots: 2, emoji: "👨‍⚕️", experience: "١٠ سنوات", location: "المهندسين، الجيزة", price: "٤٥٠ جنيه", available: true },
  { id: 5, name: "د. فاطمة الزهراء", specialty: "الأسنان", rating: 4.8, reviews: 210, slots: 4, emoji: "👩‍⚕️", experience: "٩ سنوات", location: "الزمالك، القاهرة", price: "٣٥٠ جنيه", available: true },
  { id: 6, name: "د. كريم عبدالرحمن", specialty: "العيون", rating: 4.6, reviews: 65, slots: 6, emoji: "👨‍⚕️", experience: "٧ سنوات", location: "شبرا، القاهرة", price: "٣٠٠ جنيه", available: false },
  { id: 7, name: "د. هند السعيد", specialty: "الأطفال", rating: 4.9, reviews: 189, slots: 3, emoji: "👩‍⚕️", experience: "١١ سنة", location: "مدينة نصر، القاهرة", price: "٤٠٠ جنيه", available: true },
  { id: 8, name: "د. عمرو خالد", specialty: "القلب", rating: 4.8, reviews: 145, slots: 1, emoji: "👨‍⚕️", experience: "٢٠ سنة", location: "جاردن سيتي، القاهرة", price: "٧٠٠ جنيه", available: true },
  { id: 9, name: "د. ياسمين نبيل", specialty: "النساء والتوليد", rating: 4.9, reviews: 230, slots: 5, emoji: "👩‍⚕️", experience: "١٤ سنة", location: "التجمع الخامس، القاهرة", price: "٥٥٠ جنيه", available: true },
];

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("الكل");

  const filtered = allDoctors.filter((d) => {
    const matchSearch = d.name.includes(search) || d.specialty.includes(search);
    const matchSpecialty = activeSpecialty === "الكل" || d.specialty === activeSpecialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="container-narrow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              أطباؤنا المتخصصون
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              أكثر من ٢٠٠ طبيب متخصص ومعتمد في جميع التخصصات الطبية في مصر
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن طبيب أو تخصص..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 h-12 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Specialties */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {specialties.map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSpecialty(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSpecialty === s
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
              </motion.button>
            ))}
          </motion.div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            عرض {filtered.length} طبيب
          </p>

          {/* Doctors Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass-card rounded-2xl p-6 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shrink-0"
                    >
                      {doc.emoji}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground">{doc.name}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs">{doc.specialty}</Badge>
                    </div>
                    {doc.available ? (
                      <span className="w-3 h-3 rounded-full bg-medical-green animate-pulse-soft shrink-0 mt-1" />
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-muted-foreground/30 shrink-0 mt-1" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span>{doc.experience} خبرة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{doc.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{doc.slots} مواعيد متاحة اليوم</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-medical-gold text-medical-gold" />
                      <span className="text-sm font-bold text-foreground">{doc.rating}</span>
                      <span className="text-xs text-muted-foreground">({doc.reviews} تقييم)</span>
                    </div>
                    <span className="font-display font-bold text-primary">{doc.price}</span>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full gradient-hero-bg text-primary-foreground border-0 gap-2">
                      <Calendar className="w-4 h-4" />
                      احجز موعد
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
