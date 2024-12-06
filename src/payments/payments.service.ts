import { Payments } from 'src/payments/payments.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Users } from 'src/users/users.model';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payments) private readonly payments: typeof Payments,
    @InjectModel(Users) private readonly users: typeof Users,
  ) {}

  async create(user_id: number, amount: number): Promise<Payments | string> {
    try {
      const user = await this.users.findByPk(user_id);
      console.log('users', user);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let finalAmount = amount;
      if (user.role === 'admin' || user.role === 'worker') {
        finalAmount = amount * 0.8;
      }

      if (isNaN(finalAmount)) {
        throw new Error('Invalid amount provided');
      }

      const payment = await this.payments.create({
        user_id: user_id,
        amount: finalAmount.toFixed(2), // Correct amount format
        status: 'pending',
      });
      return payment;
    } catch (error) {
      console.log(error.message);
      throw new Error('An error occurred while creating the payment.');
    }
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'completed' | 'failed',
  ): Promise<Payments | string> {
    try {
      const payment = await this.payments.findByPk(id);
      if (!payment) {
        return 'Payment not found';
      }
      payment.status = status;
      await payment.save();
      console.log(payment.status);

      return payment;
    } catch (error) {
      console.log(error.message);
    }
  }

  async checkPaymentsStatus(): Promise<string[]> {
    try {
      const payments = await this.payments.findAll({
        include: [
          {
            model: Users,
            attributes: ['full_name', 'role'], // Only include the full_name field
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!payments) {
        throw new NotFoundException('Payment not founds');
      }

      const pay = payments.map((payment) => {
        const userName = payment.user?.full_name;
        const roles = payment.user?.role;
        const amount = payment.amount;
        switch (payment.status) {
          case 'pending':
            return `
          payment qiladigan odam: ${userName}
          role: ${roles}
          sumasi: ${amount} is Pending, please wait`;
          case 'failed':
            return `
          payment qiladigan odam: ${userName}
          role: ${roles}
          sumasi: ${amount} is Payment failed, please try again`;
          case 'completed':
            return `
          payment qiladigan odam: ${userName}
          role: ${roles}
          sumasi: ${amount} is Payment successful`;
          default:
            throw new Error('Unknown payment status');
        }
      });
      return pay;
    } catch (error) {
      console.log(error.message);
      throw new Error('Error checking payments status');
    }
  }

  async findAll() {
    try {
      const payment = await this.payments.findAll();
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return payment;
    } catch (error) {
      console.log(error.message);
      throw new Error('Error fetching payments');
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.payments.findByPk(id, {
        include: [
          {
            model: Users,
            attributes: ['full_name', 'role'],
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      return payment;
    } catch (error) {
      console.log(error.message);
      throw new Error('Error fetching payment');
    }
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
