import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, email, phone, productDetails, paymentMethod } = body;

    if (!orderId || !amount || !email || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount, email, paymentMethod' },
        { status: 400 }
      );
    }

    const merchantCode = process.env.DUITKU_MERCHANT_CODE;
    const apiKey = process.env.DUITKU_API_KEY;
    const baseUrl = process.env.DUITKU_BASE_URL;
    const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (!merchantCode || !apiKey || !baseUrl) {
      console.error('Payment env missing:', { merchantCode: !!merchantCode, apiKey: !!apiKey, baseUrl: !!baseUrl });
      return NextResponse.json(
        { error: 'Payment gateway not configured. Set DUITKU_MERCHANT_CODE, DUITKU_API_KEY, DUITKU_BASE_URL.' },
        { status: 500 }
      );
    }

    const paymentAmount = Math.round(amount);
    const merchantOrderId = orderId;

    // Generate MD5 signature
    const signature = crypto
      .createHash('md5')
      .update(merchantCode + merchantOrderId + paymentAmount + apiKey)
      .digest('hex');

    const callbackUrl = `${appBaseUrl}/api/payment/callback`;
    const returnUrl = `${appBaseUrl}/checkout/thank-you?order_id=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`;

    const requestBody = {
      merchantCode,
      paymentAmount,
      paymentMethod,
      merchantOrderId,
      productDetails: productDetails || 'Kaos EUY! Order',
      email,
      phoneNumber: phone || '',
      callbackUrl,
      returnUrl,
      signature,
      expiryPeriod: 1440, // 24 hours
    };

    console.log('Duitku request:', { baseUrl, merchantCode, paymentAmount, paymentMethod, callbackUrl });

    const response = await fetch(`${baseUrl}/merchant/v2/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.statusCode !== '00') {
      console.error('Duitku error:', JSON.stringify(data));
      return NextResponse.json(
        { error: `Duitku: ${data.statusMessage || data.Message || JSON.stringify(data)}` },
        { status: 400 }
      );
    }

    // Save payment reference to order
    const supabase = getSupabaseAdmin();
    await supabase
      .from('orders')
      .update({
        payment_reference: data.reference,
        payment_method: paymentMethod,
      })
      .eq('id', orderId);

    return NextResponse.json({
      paymentUrl: data.paymentUrl,
      reference: data.reference,
      vaNumber: data.vaNumber,
      amount: data.amount,
    });
  } catch (error) {
    console.error('Payment create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
