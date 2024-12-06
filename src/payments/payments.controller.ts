import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Roles } from 'src/common/auth/role.decarator';
import { RoleGuard } from 'src/common/auth/role.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  create(@Body() createPaymentDto: { user_id: number; amount: number }) {
    return this.paymentsService.create(
      createPaymentDto.user_id,
      createPaymentDto.amount,
    );
  }


  @Put('update-status/:id')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: 'pending' | 'completed' | 'failed',
  ) {
    const payment = await this.paymentsService.updateStatus(id, status);
    console.log(payment);
    return { message: 'Payment status updated successfully', payment };
  }


  @Get()
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
 checkPaymentsStatus() {
   
    return  this.paymentsService.checkPaymentsStatus();
  }

  @Get()
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'worker')
  @UseGuards(RoleGuard)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
