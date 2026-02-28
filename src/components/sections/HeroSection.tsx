import { motion } from "framer-motion";
import { Calendar, Video, BookOpen, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const stats = [
  { icon: Users, label: "Happy Patients", value: "50,000+" },
  { icon: Shield, label: "Expert Doctors", value: "200+" },
  { icon: Clock, label: "Years Experience", value: "15+" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background gradient decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-medical-blue/5 blur-3xl animate-float-slow" />
      </div>

      <div className="container-narrow px-4 md:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
              Trusted by 50,000+ patients
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Your Health, Our{" "}
              <span className="gradient-text">Priority</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Experience world-class healthcare with modern technology. Book appointments, consult doctors online, and manage your health — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/booking">
                <Button size="lg" className="gradient-hero-bg text-primary-foreground border-0 shadow-lg shadow-primary/25 gap-2 text-base px-6">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/booking?type=online">
                <Button size="lg" variant="outline" className="gap-2 text-base px-6">
                  <Video className="w-5 h-5" />
                  Online Consultation
                </Button>
              </Link>
              <Link to="/articles">
                <Button size="lg" variant="ghost" className="gap-2 text-base px-6 text-muted-foreground">
                  <BookOpen className="w-5 h-5" />
                  View Articles
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <img
                src={heroImage}
                alt="Modern medical clinic with professional doctor"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-medical-green/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-medical-green" />
              </div>
              <div>
                <div className="font-display font-semibold text-sm">Verified Doctors</div>
                <div className="text-xs text-muted-foreground">All doctors are board certified</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
