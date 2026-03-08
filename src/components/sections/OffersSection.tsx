import { motion } from "framer-motion";
import { Clock, Tag, Zap, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const badgeIcons: Record<string, React.ElementType> = {
  "مميز": Flame,
  "جديد": Zap,
  "خصم": Tag,
  "عرض": Tag,
};

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
    <div className="flex gap-3 items-center">
      {[
        { label: "يوم", value: timeLeft.days },
        { label: "ساعة", value: timeLeft.hours },
        { label: "دقيقة", value: timeLeft.mins },
      ].map((t) => (
        <div key={t.label} className="text-center">
          <div className="bg-muted rounded-lg px-2 py-1 text-sm font-bold text-foreground min-w-[2.5rem]">{t.value}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function OffersSection() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setOffers(data || []);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel('offers-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <Skeleton className="h-10 w-64 mx-auto mb-14" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) return null;

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">لفترة محدودة</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            عروض وخصومات حصرية
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((offer, i) => {
            const BadgeIcon = badgeIcons[offer.badge] || Tag;
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
                className="glass-card rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer pointer-events-none" />

                <div className="absolute top-4 left-4">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Badge className="gradient-coral-bg text-accent-foreground border-0 gap-1">
                      <BadgeIcon className="w-3 h-3" />
                      {offer.badge}
                    </Badge>
                  </motion.div>
                </div>

                <div className="text-3xl font-display font-bold text-primary mb-3 mt-2">
                  {offer.discount}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
                {offer.ends_at && <Countdown target={new Date(offer.ends_at)} />}
                <Link to={`/booking?offer=${offer.id}`}>
                  <Button size="sm" className="w-full mt-4 gradient-hero-bg text-primary-foreground border-0">
                    احصل على العرض
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
