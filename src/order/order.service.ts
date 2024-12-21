import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { DirectionService } from 'src/direction/direction.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UserService,
    private readonly directionService: DirectionService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.userService.findOne(createOrderDto.user_id);
    const direction = await this.directionService.findOne(
      createOrderDto.direction_id,
    );

    let createdOrder: Order | null = null;
    try {
      createdOrder = this.orderRepository.create({
        ...createOrderDto,
        user,
        direction,
      });

      delete createdOrder?.user.password;
      delete createdOrder?.user.role;

      return await this.orderRepository.save(createdOrder);
    } catch (e) {
      if (e.message.includes('Duplicate entry')) {
        throw new BadRequestException(
          'Вы уже подали заявку на это направление',
        );
      }
    }
  }

  async checkOrderDirection(directionId: number, userId: number) {
    const targetOrder = await this.orderRepository.findOneBy({
      user: { id: userId },
      direction: { id: directionId },
    });

    if (targetOrder) {
      return {
        order_exist: true,
      };
    }

    return {
      order_exist: false,
    };
  }

  findAll(userId: number) {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.save({ id, ...updateOrderDto });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
