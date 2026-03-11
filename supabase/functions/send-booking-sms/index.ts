import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingPayload {
  booking_id: string;
  status: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { booking_id, status } = (await req.json()) as BookingPayload;

    // Fetch booking with doctor and user profile info
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("*, doctors(*)")
      .eq("id", booking_id)
      .single();

    if (bookingErr || !booking) {
      throw new Error("Booking not found: " + bookingErr?.message);
    }

    // Get user profile for phone number
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", booking.user_id)
      .single();

    // Get coupon info if applied
    let couponInfo = "";
    if (booking.coupon_id) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("code, discount_type, discount_value")
        .eq("id", booking.coupon_id)
        .single();
      if (coupon) {
        const discountText =
          coupon.discount_type === "percentage"
            ? `${coupon.discount_value}%`
            : `${coupon.discount_value} جنيه`;
        couponInfo = `\nكوبون: ${coupon.code} (خصم ${discountText})`;
      }
    }

    // Get payment info
    let paymentInfo = "";
    const { data: payment } = await supabase
      .from("payments")
      .select("amount, payment_method, status")
      .eq("booking_id", booking_id)
      .single();
    if (payment) {
      const methodMap: Record<string, string> = {
        cash: "نقدي",
        card: "بطاقة",
        wallet: "محفظة إلكترونية",
      };
      paymentInfo = `\nالمبلغ: ${payment.amount} جنيه (${methodMap[payment.payment_method] || payment.payment_method})`;
    }

    // Status labels
    const statusLabels: Record<string, string> = {
      pending: "قيد المراجعة ⏳",
      confirmed: "تم التأكيد ✅",
      completed: "تم الإكمال 🎉",
      cancelled: "تم الإلغاء ❌",
    };

    const doctorName = booking.doctors?.name || "الطبيب";
    const patientName = profile?.full_name || "المريض";
    const phone = profile?.phone;
    const statusLabel = statusLabels[status] || status;
    const typeLabel = booking.type === "online" ? "أونلاين 💻" : "في العيادة 🏥";

    // Build SMS message
    const smsMessage = `ميديكير 🏥
مرحباً ${patientName}

حالة حجزك: ${statusLabel}
الطبيب: د. ${doctorName}
التاريخ: ${booking.booking_date}
الوقت: ${booking.booking_time}
النوع: ${typeLabel}${couponInfo}${paymentInfo}

شكراً لاختيارك ميديكير ❤️`;

    console.log("=== SMS Message ===");
    console.log("To:", phone || "لا يوجد رقم هاتف");
    console.log("Message:", smsMessage);
    console.log("===================");

    // ============================================
    // SMS PROVIDER INTEGRATION POINT
    // Uncomment and configure when you have an SMS provider
    // ============================================
    //
    // Example for Twilio:
    // const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    // const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    // const TWILIO_FROM = Deno.env.get("TWILIO_PHONE_NUMBER");
    //
    // if (phone && TWILIO_SID && TWILIO_TOKEN) {
    //   const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
    //   await fetch(twilioUrl, {
    //     method: "POST",
    //     headers: {
    //       "Authorization": "Basic " + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams({
    //       To: phone,
    //       From: TWILIO_FROM!,
    //       Body: smsMessage,
    //     }),
    //   });
    // }
    // ============================================

    // Save as in-app notification (always works)
    await supabase.from("notifications").insert({
      user_id: booking.user_id,
      message: smsMessage,
      type: status === "cancelled" ? "error" : status === "confirmed" ? "success" : "info",
    });

    return new Response(
      JSON.stringify({
        success: true,
        phone: phone || null,
        message: smsMessage,
        sms_sent: false, // Will be true when SMS provider is configured
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("SMS Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
