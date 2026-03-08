import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewDialogProps {
  bookingId: string;
  doctorId: string;
  doctorName: string;
  userId: string;
  existingReview?: { id: string; rating: number; comment: string } | null;
  onReviewSubmitted?: () => void;
  trigger?: React.ReactNode;
}

export default function ReviewDialog({
  bookingId, doctorId, doctorName, userId, existingReview, onReviewSubmitted, trigger
}: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("اختار تقييم من فضلك"); return; }
    setSubmitting(true);

    if (existingReview) {
      const { error } = await supabase.from("reviews").update({ rating, comment: comment.trim() }).eq("id", existingReview.id);
      if (error) { toast.error("فشل تعديل التقييم"); } else { toast.success("تم تعديل التقييم"); }
    } else {
      const { error } = await supabase.from("reviews").insert({
        user_id: userId, doctor_id: doctorId, booking_id: bookingId,
        rating, comment: comment.trim(),
      });
      if (error) {
        if (error.code === "23505") toast.error("لقد قيّمت هذا الموعد بالفعل");
        else toast.error("فشل إرسال التقييم");
      } else {
        toast.success("شكراً لتقييمك! ⭐");
      }
    }

    setSubmitting(false);
    setOpen(false);
    onReviewSubmitted?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5 text-medical-gold border-medical-gold/30">
            <Star className="w-3.5 h-3.5" />
            {existingReview ? "تعديل التقييم" : "قيّم الطبيب"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-center">
            {existingReview ? "تعديل تقييمك" : "قيّم"} د. {doctorName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {/* Star rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-medical-gold text-medical-gold"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {rating === 0 ? "اختار تقييمك" : ["", "سيء", "مقبول", "جيد", "جيد جداً", "ممتاز"][rating]}
          </p>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك عن تجربتك مع الطبيب (اختياري)"
            className="bg-muted/50 min-h-[100px]"
            maxLength={500}
          />

          <Button onClick={handleSubmit} disabled={submitting || rating === 0} className="w-full gradient-hero-bg text-primary-foreground border-0 gap-2">
            <Send className="w-4 h-4" />
            {submitting ? "جاري الإرسال..." : existingReview ? "حفظ التعديل" : "إرسال التقييم"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
