import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ResponseDto } from 'src/common';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  async createPaymentSession() {
    const payload = await this.paymentsService.createPaymentSession();

    return new ResponseDto(
      HttpStatus.CREATED,
      'Payment session created',
      payload,
    );
  }

  @Get('success')
  success() {
    return new ResponseDto(HttpStatus.OK, 'Payment successful', {
      ok: true,
    });
  }

  @Get('cancel')
  cancel() {
    return new ResponseDto(HttpStatus.CONTINUE, 'Payment cancelled', {
      ok: false,
    });
  }

  @Post('webhook')
  async stripWebhook() {
    const payload = await this.paymentsService.stripWebhook();

    return new ResponseDto(HttpStatus.OK, 'Webhook received', payload);
  }
}
