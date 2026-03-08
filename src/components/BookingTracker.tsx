import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, XCircle, MapPin, Video, Timer, Users, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookingTrackerProps {
  booking: any;
}

const steps = [
  { key: "pending", label: "تم استلام الحجز", icon: AlertCircle },
  { key: "confirmed", label: "تم تأكيد الموعد", icon: CheckCircle2 },
  { key: "completed", label: "تمت الزيارة", icon: CheckCircle2 },
];

const statusIndex: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  completed: 2,
  cancelled: -1,
};

export default function BookingTracker({ booking }: BookingTrackerProps) {
  const currentStep = statusIndex[booking.status] ?? 0;
  const isCancelled = booking.status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 border border-primary/10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl">👨‍⚕️</div>
          <div>
            <h4 className="font-display font-bold text-foreground">{booking.doctors?.name}</h4>
            <p className="text-xs text-muted-foreground">{booking.doctors?.specialty}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.booking_date} • {booking.booking_time}</span>
          <Badge variant="outline" className="text-xs gap-1">
            {booking.type === "online" ? <><Video className="w-3 h-3" />أونلاين</> : <><MapPin className="w-3 h-3" />عيادة</>}
          </Badge>
        </div>
      </div>

      {/* Timeline Stepper */}
      {isCancelled ? (
        <div className="flex items-center gap-3 bg-destructive/5 rounded-xl p-4">
          <XCircle className="w-6 h-6 text-destructive" />
          <div>
            <p className="font-semibold text-destructive text-sm">تم إلغاء الحجز</p>
            <p className="text-xs text-muted-foreground">يمكنك حجز موعد جديد في أي وقت</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;
              const StepIcon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all mb-2",
                      isActive
                        ? "gradient-hero-bg text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <StepIcon className="w-5 h-5" />
                  </motion.div>
                  <span className={cn(
                    "text-xs text-center font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress Line */}
          <div className="absolute top-5 right-[16.5%] left-[16.5%] h-0.5 bg-muted -z-0" />
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(0, currentStep) * 50}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-5 right-[16.5%] h-0.5 bg-primary -z-0"
          />
        </div>
      )}

      {/* Queue Info */}
      {!isCancelled && (booking.queue_position || booking.estimated_wait) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-primary/5 rounded-xl p-3 flex items-center justify-center gap-6"
        >
          {booking.queue_position && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">قدامك:</span>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-display font-bold text-primary text-lg"
              >
                {booking.queue_position}
              </motion.span>
            </div>
          )}
          {booking.estimated_wait && (
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">وقت الانتظار:</span>
              <span className="font-semibold text-foreground text-sm">{booking.estimated_wait}</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
