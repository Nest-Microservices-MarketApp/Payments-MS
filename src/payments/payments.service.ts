import { Request, Response } from 'express';
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from 'src/config';
import { CreatePaymentSessionDto } from './dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecretKey);
  private readonly logger = new Logger(PaymentsService.name);

  async createPaymentSession(createPaymentSessionDto: CreatePaymentSessionDto) {
    const { orderId, currency, items } = createPaymentSessionDto;

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
        metadata: {
          orderId: orderId,
        },
      },

      line_items: lineItems,

      mode: 'payment',

      success_url: `${envs.baseUrl}/payments/success`,
      cancel_url: `${envs.baseUrl}/payments/cancel`,
    });

    return session;
  }

  async stripWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      this.logger.error('Stripe signature is missing');
      return res.status(400).send('Stripe signature is missing');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        envs.stripeEndpointSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        this.logger.log(`PaymentIntent was successful: ${paymentIntent.id}`);
        // TODO:Handle the successful payment intent here
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        this.logger.log(`PaymentMethod was attached: ${paymentMethod.id}`);
        // TODO:Handle the attached payment method here
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
    return res.status(200).json({ received: true, event });
  }
}
