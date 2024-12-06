import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Orders } from './orders.model';
import { Products } from 'src/products/products.model';
import { Users } from 'src/users/users.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders) private readonly orders: typeof Orders,
    @InjectModel(Products) private readonly products: typeof Products,
    @InjectModel(Users) private readonly users: typeof Users,
  ) {}
  async create(
    user_id: number,
    product_id: number,
    quantity: number,
  ): Promise<Orders | string> {
    try {
      const user = await this.users.findByPk(user_id);
      if (!user) {
        return 'User not found';
      }

      const product = await this.products.findByPk(product_id);
      if (!product) {
        return 'Product not found';
      }

      if (product.stock < quantity) {
        return 'Insufficient stock';
      }

      const tutalPrice = Number(product.price) * quantity;

      const order = await this.orders.create({
        user_id: user.id,
        product_id: product.id,
        quantity: quantity,
        total_price: tutalPrice.toFixed(2),
      });

      product.stock -= quantity;
      await product.save();

      return order;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findAll() {
    try {
      return this.orders.findAll({
        include: [
          {
            model: Users,
            attributes: ['full_name', 'role'],
          },
          {
            model: Products,
            attributes: ['product_name', 'price'],
          },
        ],
        attributes: {
          exclude: ['user_id', 'product_id', 'createdAt', 'updatedAt'],
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async getOrdersByUser(user_id: number) {
    try {
      const orders = await this.orders.findAll({
        where: {
          user_id: user_id, // Assuming 'userId' is the foreign key in the orders table
        },
      });

      return orders; // Returns an array of orders or an empty array
    } catch (error) {
      throw new Error('Error fetching orders for user: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.orders.findByPk(id, {
        include: [
          {
            model: Users,
            attributes: ['full_name', 'role'],
          },
          {
            model: Products,
            attributes: ['product_name', 'price'],
          },
        ],
        attributes: { exclude: ['user_id', 'product_id'] },
      });
      return order;
    } catch (error) {
      console.log(error.message);
    }
  }

 
  

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
