import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const baseUrl = process.env.DUITKU_BASE_URL!;

    const signature = crypto
      .createHash('md5')
      .update(merchantCode + orderId + apiKey)
      .digest('hex');

    const response = await fetch(
      `${baseUrl}/merchant/transactionStatus`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantCode,
          merchantOrderId: orderId,
          signature,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      statusCode: data.statusCode,
      statusMessage: data.statusMessage,
      reference: data.reference,
      amount: data.amount,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
