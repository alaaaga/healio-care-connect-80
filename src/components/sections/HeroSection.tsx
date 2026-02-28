import { motion } from "framer-motion";
import { Calendar, Video, BookOpen, Shield, Clock, Users, Stethoscope, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const stats = [
  { icon: Users, label: "مريض سعيد", value: "+٥٠,٠٠٠" },
  { icon: Stethoscope, label: "طبيب متخصص", value: "+٢٠٠" },
  { icon: Clock, label: "سنة خبرة", value: "+١٥" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[-8rem] w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[-8rem] w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-medical-blue/5 blur-3xl"
        />
        {/* Floating medical icons */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[15%] text-primary/20 text-4xl"
        >
          🩺
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-48 right-[10%] text-primary/15 text-3xl"
        >
          💊
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 left-[20%] text-primary/15 text-3xl"
        >
          🏥
        </motion.div>
      </div>

      <div className="container-narrow px-4 md:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Right Content (RTL so this shows first) */}
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
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              موثوق من أكثر من ٥٠,٠٠٠ مريض
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              صحتك هي{" "}
              <span className="gradient-text">أولويتنا</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              استمتع برعاية صحية عالمية المستوى بأحدث التقنيات في مصر. احجز مواعيدك، استشر أطباءنا أونلاين، وتابع صحتك — كل ده في مكان واحد.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/booking">
                <Button size="lg" className="gradient-hero-bg text-primary-foreground border-0 shadow-lg shadow-primary/25 gap-2 text-base px-6">
                  <Calendar className="w-5 h-5" />
                  احجز موعد
                </Button>
              </Link>
              <Link to="/booking?type=online">
                <Button size="lg" variant="outline" className="gap-2 text-base px-6">
                  <Video className="w-5 h-5" />
                  استشارة أونلاين
                </Button>
              </Link>
              <Link to="/articles">
                <Button size="lg" variant="ghost" className="gap-2 text-base px-6 text-muted-foreground">
                  <BookOpen className="w-5 h-5" />
                  المقالات الطبية
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
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2"
                  >
                    <stat.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div className="text-xl font-display font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
                src={heroImage}
                alt="عيادة طبية حديثة"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-6 -right-6 glass-card rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-medical-green/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-medical-green" />
              </div>
              <div>
                <div className="font-display font-semibold text-sm">أطباء معتمدون</div>
                <div className="text-xs text-muted-foreground">جميع الأطباء حاصلين على تراخيص مزاولة</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -top-4 -left-4 glass-card rounded-2xl p-3 flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-display font-semibold text-xs">متاح ٢٤/٧</div>
                <div className="text-[10px] text-muted-foreground">خدمة طوارئ على مدار الساعة</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
