import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, MapPin, Star, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Step = "type" | "doctor" | "datetime" | "confirm";
type BookingType = "online" | "clinic";

const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: 4.9, slots: 5 },
  { id: 2, name: "Dr. Michael Chen", specialty: "Dermatologist", rating: 4.8, slots: 3 },
  { id: 3, name: "Dr. Emily Davis", specialty: "Neurologist", rating: 4.9, slots: 7 },
  { id: 4, name: "Dr. James Wilson", specialty: "Orthopedic", rating: 4.7, slots: 2 },
];

const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];

export default function BookingPage() {
  const [step, setStep] = useState<Step>("type");
  const [bookingType, setBookingType] = useState<BookingType | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const steps: { key: Step; label: string }[] = [
    { key: "type", label: "Type" },
    { key: "doctor", label: "Doctor" },
    { key: "datetime", label: "Date & Time" },
    { key: "confirm", label: "Confirm" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4 md:px-8">
        <div className="container-narrow max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
              Book an Appointment
            </h1>
            <p className="text-center text-muted-foreground mb-10">
              Choose your preferred consultation type and schedule a visit.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    i <= stepIndex
                      ? "gradient-hero-bg text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn("text-sm hidden sm:block", i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground")}>
                  {s.label}
                </span>
                {i < steps.length - 1 && <div className={cn("w-8 h-0.5 mx-1", i < stepIndex ? "bg-primary" : "bg-muted")} />}
              </div>
            ))}
          </div>

          {/* Step: Type */}
          {step === "type" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 gap-6">
              {[
                { type: "online" as BookingType, icon: Video, title: "Online Consultation", desc: "Video call with a doctor from anywhere" },
                { type: "clinic" as BookingType, icon: MapPin, title: "In-Clinic Visit", desc: "Visit our clinic for in-person examination" },
              ].map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => { setBookingType(opt.type); setStep("doctor"); }}
                  className={cn(
                    "glass-card rounded-2xl p-8 text-left hover-lift transition-all",
                    bookingType === opt.type && "ring-2 ring-primary"
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <opt.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{opt.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step: Doctor */}
          {step === "doctor" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => { setSelectedDoctor(doc.id); setStep("datetime"); }}
                  className={cn(
                    "glass-card rounded-2xl p-5 w-full text-left hover-lift flex items-center gap-4 transition-all",
                    selectedDoctor === doc.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                    👨‍⚕️
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-primary">{doc.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-medical-gold text-medical-gold" />
                      <span className="text-sm font-medium">{doc.rating}</span>
                    </div>
                    <span className="text-xs text-medical-green">{doc.slots} slots</span>
                  </div>
                </button>
              ))}
              <Button variant="ghost" onClick={() => setStep("type")} className="text-muted-foreground">← Back</Button>
            </motion.div>
          )}

          {/* Step: Date & Time */}
          {step === "datetime" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold mb-4 text-foreground">Select Date</h3>
                <CalendarUI
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto mx-auto"
                />
              </div>

              {selectedDate && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-semibold mb-4 text-foreground">Select Time</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-sm font-medium transition-all",
                          selectedTime === t
                            ? "gradient-hero-bg text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("doctor")} className="text-muted-foreground">← Back</Button>
                <Button
                  onClick={() => setStep("confirm")}
                  disabled={!selectedDate || !selectedTime}
                  className="gradient-hero-bg text-primary-foreground border-0 flex-1"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-medical-green/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-medical-green" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">Your appointment has been successfully scheduled.</p>
              <div className="bg-muted rounded-xl p-4 space-y-2 text-sm text-left max-w-sm mx-auto">
                <div className="flex justify-between"><span className="text-muted-foreground">Type:</span><span className="font-medium text-foreground">{bookingType === "online" ? "Online" : "In-Clinic"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Doctor:</span><span className="font-medium text-foreground">{doctors.find((d) => d.id === selectedDoctor)?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-medium text-foreground">{selectedDate?.toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time:</span><span className="font-medium text-foreground">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><Badge className="bg-medical-green/10 text-medical-green border-0">Pending</Badge></div>
              </div>
              <Button className="mt-6 gradient-hero-bg text-primary-foreground border-0" onClick={() => { setStep("type"); setBookingType(null); setSelectedDoctor(null); setSelectedDate(undefined); setSelectedTime(null); }}>
                Book Another Appointment
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
