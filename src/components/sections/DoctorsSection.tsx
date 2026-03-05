import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("doctors").select("*").eq("is_active", true).order("rating", { ascending: false }).limit(4);
      setDoctors(data || []);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel('doctors-home')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doctors' }, async () => {
        const { data } = await supabase.from("doctors").select("*").eq("is_active", true).order("rating", { ascending: false }).limit(4);
        setDoctors(data || []);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">فريقنا الطبي</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">أطباؤنا المتخصصون</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">نخبة من أفضل الأطباء المعتمدين في مصر جاهزين لخدمتك بأعلى مستوى من الرعاية.</p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <motion.div key={doc.id} variants={cardVariants} whileHover={{ y: -8, boxShadow: "0 20px 60px -15px rgba(0,0,0,0.1)" }} className="glass-card rounded-2xl p-6 text-center group cursor-pointer">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:bg-primary/20 transition-colors overflow-hidden">
                  {doc.image_url ? <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" /> : "👨‍⚕️"}
                </motion.div>
                <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
                <p className="text-sm text-primary font-medium mt-1">{doc.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <Star className="w-4 h-4 fill-medical-gold text-medical-gold" />
                  <span className="text-sm font-medium text-foreground">{Number(doc.rating).toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-2">{doc.price} جنيه</p>
                <Link to="/booking">
                  <Button size="sm" variant="outline" className="w-full mt-4 gap-2"><Calendar className="w-3.5 h-3.5" />احجز الآن</Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
          <Link to="/doctors"><Button variant="outline" size="lg" className="gap-2">عرض جميع الأطباء ←</Button></Link>
        </motion.div>
      </div>
    </section>
  );
}
