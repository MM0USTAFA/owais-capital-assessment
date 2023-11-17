import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CustomConfigService } from './custom-config.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private configService: CustomConfigService,
    private httpService: HttpService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'));
  }

  async checkoutSession(amount: number) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `http://localhost:3000/transactions/success-deposit?sid={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price_data: {
            currency: 'sar',
            product_data: {
              name: 'Depositing to your account',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
    });
    // console.log(session);

    return session;
  }

  async retrieveSession(sid: string): Promise<Stripe.Checkout.Session> {
    const secret = this.configService.get('STRIPE_SECRET_KEY');

    const { data } = await this.httpService.axiosRef.get(
      `${this.configService.get('STRIPE_SESSIONS_BASE_URL')}/${sid}`,
      {
        auth: {
          username: secret,
          password: '',
        },
      },
    );

    return data;
  }
}
