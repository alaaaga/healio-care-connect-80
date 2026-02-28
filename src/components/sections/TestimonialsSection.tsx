import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  { name: "ماريا سعيد", text: "تجربة الحجز كانت سهلة جداً! حصلت على موعد في خلال ساعة والدكتور كان محترف جداً. شكراً ميديكير!", rating: 5, role: "مريضة" },
  { name: "أحمد حسن", text: "الاستشارة الأونلاين وفرت عليا وقت ومجهود. جودة الفيديو كانت ممتازة والدكتور كتبلي الروشتة فوراً.", rating: 5, role: "مريض" },
  { name: "ليلى محمد", text: "بقالي سنين بتابع مع ميديكير. أسلوبهم الحديث في الرعاية الصحية مالوش مثيل. أنصح بيهم جداً!", rating: 5, role: "مريضة منتظمة" },
  { name: "عمر عبدالله", text: "ميزة متابعة الحجز ممتازة. دايماً عارف موعدي إمتى ومستني قد إيه. خدمة ممتازة فعلاً.", rating: 5, role: "مريض" },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="section-padding">
      <div className="container-narrow max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">آراء المرضى</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            ماذا يقول مرضانا عنا
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl p-8 md:p-12 text-center relative"
            >
              <Quote className="w-10 h-10 text-primary/20 mx-auto mb-4" />
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Star
                      className={`w-5 h-5 ${i < t.rating ? "fill-medical-gold text-medical-gold" : "text-muted"}`}
                    />
                  </motion.div>
                ))}
              </div>
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6 font-medium">
                "{t.text}"
              </blockquote>
              <div className="font-display font-semibold text-foreground">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.role}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-primary w-8" : "bg-muted-foreground/30 w-2.5"
                }`}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
