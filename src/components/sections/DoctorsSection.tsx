import { motion } from "framer-motion";
import { Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const doctors = [
  { name: "د. سارة أحمد", specialty: "أمراض القلب", rating: 4.9, reviews: 124, slots: 5, emoji: "👩‍⚕️" },
  { name: "د. محمد حسن", specialty: "الأمراض الجلدية", rating: 4.8, reviews: 98, slots: 3, emoji: "👨‍⚕️" },
  { name: "د. نور الشريف", specialty: "المخ والأعصاب", rating: 4.9, reviews: 156, slots: 7, emoji: "👩‍⚕️" },
  { name: "د. أحمد مصطفى", specialty: "العظام", rating: 4.7, reviews: 87, slots: 2, emoji: "👨‍⚕️" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DoctorsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">فريقنا الطبي</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            أطباؤنا المتخصصون
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            نخبة من أفضل الأطباء المعتمدين في مصر جاهزين لخدمتك بأعلى مستوى من الرعاية.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {doctors.map((doc) => (
            <motion.div
              key={doc.name}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 60px -15px rgba(0,0,0,0.1)" }}
              className="glass-card rounded-2xl p-6 text-center group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
              >
                {doc.emoji}
              </motion.div>
              <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">{doc.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star className="w-4 h-4 fill-medical-gold text-medical-gold" />
                <span className="text-sm font-medium text-foreground">{doc.rating}</span>
                <span className="text-xs text-muted-foreground">({doc.reviews} تقييم)</span>
              </div>
              <p className="text-xs text-medical-green font-medium mt-2">
                {doc.slots} مواعيد متاحة اليوم
              </p>
              <Link to="/booking">
                <Button size="sm" variant="outline" className="w-full mt-4 gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  احجز الآن
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/doctors">
            <Button variant="outline" size="lg" className="gap-2">
              عرض جميع الأطباء ←
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
