import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور!");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ. حاول مرة تانية.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-hero-bg flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            ميدي<span className="text-primary">كير</span>
          </span>
        </Link>

        {sent ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">تم الإرسال! 📧</h1>
            <p className="text-muted-foreground mb-6">
              لو الإيميل ده مسجل عندنا، هتلاقي رابط إعادة تعيين كلمة المرور في صندوق الوارد.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              مش لاقي الإيميل؟ تأكد من مجلد السبام.
            </p>
            <Link to="/login">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="w-4 h-4" />
                رجوع لتسجيل الدخول
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">نسيت كلمة المرور؟ 🔐</h1>
            <p className="text-muted-foreground mb-8">
              اكتب الإيميل المسجل بيه وهنبعتلك رابط لإعادة تعيين كلمة المرور.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    className="pr-10 h-12 rounded-xl"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 gradient-hero-bg text-primary-foreground border-0 text-base font-semibold shadow-lg shadow-primary/25">
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                ) : (
                  "إرسال رابط الاستعادة"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              فاكر كلمة المرور؟{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                سجل دخولك
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
