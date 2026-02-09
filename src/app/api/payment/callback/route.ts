import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchantCode,
      amount,
      merchantOrderId,
      productDetail,
      additionalParam,
      paymentCode,
      resultCode,
      merchantUserId,
      reference,
      signature: receivedSignature,
    } = body;

    const apiKey = process.env.DUITKU_API_KEY!;
    const expectedMerchantCode = process.env.DUITKU_MERCHANT_CODE!;

    // Verify merchant code
    if (merchantCode !== expectedMerchantCode) {
      console.error('Invalid merchant code in callback');
      return NextResponse.json({ error: 'Invalid merchant code' }, { status: 403 });
    }

    // Verify signature: MD5(merchantCode + amount + merchantOrderId + apiKey)
    const expectedSignature = crypto
      .createHash('md5')
      .update(expectedMerchantCode + amount + merchantOrderId + apiKey)
      .digest('hex');

    if (receivedSignature !== expectedSignature) {
      console.error('Invalid signature in callback');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();

    if (resultCode === '00') {
      // Payment successful
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_method: paymentCode || 'duitku',
          payment_reference: reference,
          status: 'processing',
          paid_at: new Date().toISOString(),
        })
        .eq('id', merchantOrderId);

      console.log(`Payment successful for order ${merchantOrderId}`);
    } else {
      // Payment failed
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_reference: reference,
        })
        .eq('id', merchantOrderId);

      console.log(`Payment failed for order ${merchantOrderId}, resultCode: ${resultCode}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
