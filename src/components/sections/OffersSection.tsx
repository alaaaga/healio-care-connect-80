import { motion } from "framer-motion";
import { Clock, Tag, Zap, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const offers = [
  {
    title: "50% Off Dental Checkup",
    desc: "Complete dental examination and cleaning at half price. Limited time offer!",
    badge: "Hot",
    badgeIcon: Flame,
    discount: "50%",
    endsIn: new Date("2026-03-15"),
    color: "medical-coral",
  },
  {
    title: "Free Cardiology Consultation",
    desc: "First-time cardiac screening with our top cardiologists — completely free.",
    badge: "New",
    badgeIcon: Zap,
    discount: "FREE",
    endsIn: new Date("2026-03-20"),
    color: "primary",
  },
  {
    title: "Eye Exam Package — 30% Off",
    desc: "Comprehensive eye exam including pressure test and vision correction consult.",
    badge: "Discount",
    badgeIcon: Tag,
    discount: "30%",
    endsIn: new Date("2026-03-10"),
    color: "medical-blue",
  },
];

function Countdown({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      });
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="flex gap-2 items-center text-xs text-muted-foreground">
      <Clock className="w-3.5 h-3.5" />
      <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m left</span>
    </div>
  );
}

export default function OffersSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Limited Time</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Exclusive Offers & Promotions
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-2xl p-6 hover-lift relative overflow-hidden"
            >
              {/* Discount badge */}
              <div className="absolute top-4 right-4">
                <Badge className="gradient-coral-bg text-accent-foreground border-0 gap-1 animate-pulse-soft">
                  <offer.badgeIcon className="w-3 h-3" />
                  {offer.badge}
                </Badge>
              </div>

              <div className="text-3xl font-display font-bold text-primary mb-3">
                {offer.discount}
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{offer.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{offer.desc}</p>
              <Countdown target={offer.endsIn} />
              <Button size="sm" className="w-full mt-4 gradient-hero-bg text-primary-foreground border-0">
                Claim Offer
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
