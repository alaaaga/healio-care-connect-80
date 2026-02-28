import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  { name: "Maria Santos", text: "The booking experience was seamless! Got an appointment within an hour and the doctor was incredibly professional.", rating: 5, role: "Patient" },
  { name: "Ahmed Hassan", text: "Online consultation saved me a trip to the clinic. The video quality was great and I received my prescription right away.", rating: 5, role: "Patient" },
  { name: "Lisa Chen", text: "I've been coming to MediCare for years. Their modern approach to healthcare is unmatched. Highly recommend!", rating: 4, role: "Regular Patient" },
  { name: "John Williams", text: "The booking tracker is amazing. I always know exactly when my appointment is and how long the wait will be.", rating: 5, role: "Patient" },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

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
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            What Our Patients Say
          </h2>
        </motion.div>

        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < t.rating ? "fill-medical-gold text-medical-gold" : "text-muted"}`}
              />
            ))}
          </div>
          <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6 font-medium italic">
            "{t.text}"
          </blockquote>
          <div className="font-display font-semibold text-foreground">{t.name}</div>
          <div className="text-sm text-muted-foreground">{t.role}</div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
