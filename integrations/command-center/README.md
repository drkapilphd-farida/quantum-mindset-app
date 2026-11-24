# Command Center — automatic follow-up after a payment

After someone pays through a Razorpay payment link (Sharp Brain ₹499 / ₹4,999,
offline workshop ₹3,000 registration, Telepathy ₹999), the website's Razorpay
webhook (`src/features/payments/paymentCaptured.ts`):

1. emails the buyer a Hindi + English confirmation with next steps (Resend);
2. emails the owner "payment received";
3. calls the **cc-payment** Edge Function in the WhatsApp dashboard / Command
   Center Supabase project (`isdohdsscwumvmzgtgua`), which saves a **Paid**
   lead + a follow-up task, and sends the buyer a WhatsApp template.

## One-time setup

1. **Deploy the function** to project `isdohdsscwumvmzgtgua`:
   copy `cc-payment/index.deno.ts` to `supabase/functions/cc-payment/index.ts`
   in a Supabase CLI workspace linked to that project, then
   `supabase functions deploy cc-payment --no-verify-jwt`.
2. **Secrets** in that project: `CC_PAYMENT_HOOK_SECRET` (a long random string).
   The function reuses the WhatsApp token / phone-number-ID secrets that
   `wa-send` already uses (it accepts the common names; if `wa-send` uses a
   different name, set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` too).
3. **Website (Cloud Run "web")** env vars:
   `CC_PAYMENT_HOOK_URL=https://isdohdsscwumvmzgtgua.supabase.co/functions/v1/cc-payment`
   and `CC_PAYMENT_HOOK_SECRET` (same value as step 2).
4. **Razorpay**: the account webhook must send `payment.captured` to
   `https://mindurmind.org.in/api/razorpay/webhook` (already used by the
   Online Retreat and Clarity Session).
5. **WhatsApp template** (WhatsApp Manager → Message templates → Create,
   category *Utility*, name `payment_received`, language *Hindi*):

   ```
   नमस्ते {{1}} 🙏
   {{2}} के लिए आपका पेमेंट मिल गया है। आपकी सीट पक्की है।
   आगे की जानकारी (तारीख़ और Zoom लिंक) इसी WhatsApp पर भेजी जाएगी। कोई सवाल हो तो यहीं reply कीजिए।
   — डॉ. कपिल देव शर्मा, Mind Ur Mind
   ```

   Samples: `{{1}}` = रवि, `{{2}}` = Sharp Brain 2 दिन की ऑनलाइन वर्कशॉप.
   Until it is approved, leads and emails still work; WhatsApp shows "failed".

When the buyer replies to that WhatsApp message, the free 24-hour window
opens, so the Zoom link and dates can be sent from the WhatsApp dashboard
at no cost.
