import { motion } from "framer-motion";
import { Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const doctors = [
  { name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: 4.9, reviews: 124, slots: 5, image: "👩‍⚕️" },
  { name: "Dr. Michael Chen", specialty: "Dermatologist", rating: 4.8, reviews: 98, slots: 3, image: "👨‍⚕️" },
  { name: "Dr. Emily Davis", specialty: "Neurologist", rating: 4.9, reviews: 156, slots: 7, image: "👩‍⚕️" },
  { name: "Dr. James Wilson", specialty: "Orthopedic", rating: 4.7, reviews: 87, slots: 2, image: "👨‍⚕️" },
];

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
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Meet Our Expert Doctors
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Board-certified specialists ready to provide you with the best care possible.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 hover-lift text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                {doc.image}
              </div>
              <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">{doc.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star className="w-4 h-4 fill-medical-gold text-medical-gold" />
                <span className="text-sm font-medium text-foreground">{doc.rating}</span>
                <span className="text-xs text-muted-foreground">({doc.reviews})</span>
              </div>
              <p className="text-xs text-medical-green font-medium mt-2">
                {doc.slots} slots available today
              </p>
              <Link to="/booking">
                <Button size="sm" variant="outline" className="w-full mt-4 gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Book Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
