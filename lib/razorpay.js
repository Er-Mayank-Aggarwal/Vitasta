import Razorpay from 'razorpay';

const razorpayKeyId =
  process.env.RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  'rzp_test_VitastaDemoKey';

const razorpayKeySecret =
  process.env.RAZORPAY_KEY_SECRET || 'VitastaDemoSecretKey2026';

export const isRazorpayConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  process.env.RAZORPAY_KEY_ID !== 'rzp_test_VitastaDemoKey' &&
  !process.env.RAZORPAY_KEY_ID.includes('YOUR_RAZORPAY_KEY_ID')
);


export const razorpayInstance = isRazorpayConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export { razorpayKeyId, razorpayKeySecret };
