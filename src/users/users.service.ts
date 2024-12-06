import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './users.model';
import { ConfigService } from 'src/common/config/config.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Orders } from 'src/orders/orders.model';
import { Payments } from 'src/payments/payments.model';
import { Products } from 'src/products/products.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private readonly users: typeof Users,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.findByUserEmail(createUserDto.email);

      if (user) {
        throw new BadRequestException('users already');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const result = await this.users.create({
        ...createUserDto,
        password: hashedPassword,
      });

      if (result.role === 'admin' || result.role === 'worker') {
        result.salary = createUserDto.salary || 0; //default xolatda 0 boladi oylik
        await result.save();
      } else {
        result.salary = null;
        await result.save();
        return 'role is not valid salary not added';
      }

      return result;
    } catch (error) {
      console.log(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.findByUserEmail(loginUserDto.email);
      if (!user) {
        throw new NotFoundException('email or password error');
      }

      const checkedPassword = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!checkedPassword) {
        throw new BadRequestException('email or password not found');
      }
      const accessToken = this.generateAccessToken({
        id: user.id,
        role: user.role,
      });

      const refreshtoken = this.generateRefreshToken({ id: user.id });
      return { accessToken, refreshtoken };
    } catch (error) {
      console.log(error.message);
    }
  }

  async findAll() {
    try {
      const user = await this.users.findAll({
        include: [
          {
            model: Orders,
            attributes: ['quantity', 'total_price'],
            include: [
              { model: Products, attributes: ['product_name', 'price'] },
            ],
          },
          {
            model: Payments,
            attributes: ['amount', 'status'],
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.users.findByPk(id, {
        include: [
          {
            model: Orders,
            attributes: ['quantity', 'total_price'],
            include: [
              { model: Products, attributes: ['product_name', 'price'] },
            ],
          },
          {
            model: Payments,
            attributes: ['amount', 'status'],
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      console.log('user', user);

      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {}

  async remove(id: number) {}

  async findByUserEmail(email: string) {
    try {
      const user = await this.users.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`${email} bunday email topilmadi `);
      }
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }

  private generateAccessToken(data) {
    try {
      return jwt.sign(data, this.configService.get('JWT_ACCESS_SECRET_TOKEN'), 
    {expiresIn: '10m'});
    } catch (error) {
      console.log('accessTokenda xatolik bor', error.message);
    }
  }

  private generateRefreshToken(data) {
    try {
      return jwt.sign(
        data,
        this.configService.get('JWT_REFRESH_SECRET_TOKEN'),
        { expiresIn: '5h' },
      );
    } catch (error) {
      console.log('refreshTokenda xatolik bor', error.message);
    }
  }
}
