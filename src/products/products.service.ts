import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Products } from './products.model';
import { Orders } from 'src/orders/orders.model';
import { Users } from 'src/users/users.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products) private readonly products: typeof Products,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.products.create(createProductDto);
      return product;
    } catch (error) {
      console.log(error.message);
    }
  }

  async checkProductStock(id: number): Promise<string> {
    const product = await this.products.findOne({ where: { id: id } });

    if (!product) {
      return 'Product not found';
    }

    if (product.stock <= 0) {
      return 'Product out of stock';
    }
    return `bazada shu ${product.product_name} dan ${product.stock} dona bor`;
  }

  async findAll() {
    try {
      const product = await this.products.findAll({
        include: [
          {
            model: Orders,
            attributes: ['quantity', 'total_price'],
            include: [{ model: Users, attributes: ['full_name'] }],
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      return product;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.products.findByPk(id, {
        include: [
          {
            model: Orders,
            attributes: ['quantity', 'total_price'],
            include: [{ model: Users, attributes: ['full_name'] }],
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      return product;
    } catch (error) {
      console.log(error.message);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
