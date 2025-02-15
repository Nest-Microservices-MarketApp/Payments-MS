import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ResponseDto } from 'src/common';
import { CreatePaymentSessionDto } from './dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  async createPaymentSession(
    @Body() createPaymentSessionDto: CreatePaymentSessionDto,
  ) {
    const payload = await this.paymentsService.createPaymentSession(
      createPaymentSessionDto,
    );

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
  async stripWebhook(@Req() req: Request, @Res() res: Response) {
    const payload = await this.paymentsService.stripWebhook(req, res);

    return new ResponseDto(HttpStatus.OK, 'Webhook received', payload);
  }
}
