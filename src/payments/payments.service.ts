import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecretKey);

  async createPaymentSession(createPaymentSessionDto: CreatePaymentSessionDto) {
    const { currency, items } = createPaymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {},
      },

      line_items: lineItems,

      mode: 'payment',

      success_url: `${envs.baseUrl}/payments/success`,
      cancel_url: `${envs.baseUrl}/payments/cancel`,
    });

    return session;
  }
}
