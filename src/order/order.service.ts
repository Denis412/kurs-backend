import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { DirectionService } from 'src/direction/direction.service';
import { OrderStatus } from './entities/order-status.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    private readonly userService: UserService,
    private readonly directionService: DirectionService,
  ) {}

  async acceptOrder(id: number) {
    const acceptStatus = await this.orderStatusRepository.findOneBy({
      name: 'Оплачено',
    });

    return this.orderRepository.save({
      id,
      status: acceptStatus,
    });
  }

  async cancelOrder(id: number) {
    const cancelStatus = await this.orderStatusRepository.findOneBy({
      name: 'Отказ',
    });

    return this.orderRepository.save({
      id,
      status: cancelStatus,
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.userService.findOne(createOrderDto.user_id);
    const direction = await this.directionService.findOne(
      createOrderDto.direction_id,
    );
    const orderStatus = await this.orderStatusRepository.findOneBy({
      id: 1,
    });

    let createdOrder: Order | null = null;
    try {
      createdOrder = this.orderRepository.create({
        ...createOrderDto,
        user,
        direction,
        status: orderStatus,
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

  findAllAdmin() {
    return this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.status', 'status')
      .leftJoinAndSelect('orders.direction', 'direction')
      .leftJoinAndSelect('orders.user', 'user')
      .select([
        'orders.id as id',
        'orders.name as name',
        'orders.phone as phone',
        'orders.address as address',
        'user.email AS user_email',
        'status.name AS status_name',
        'direction.name AS direction_name',
        'direction.price AS direction_price',
      ])
      .getRawMany();
  }

  findAllByUserId(userId: number) {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  async getStatistics() {
    const allOrders = await this.orderRepository.find({
      relations: ['status', 'direction'],
    });

    return allOrders.reduce(
      (acc, el) => {
        if (typeof acc.statuses[el.status?.name] === 'undefined') {
          acc.statuses[el.status?.name] = 0;
        }
        if (typeof acc.directions[el.direction?.name] === 'undefined') {
          acc.directions[el.direction?.name] = 0;
        }

        acc.statuses[el.status?.name]++;
        acc.directions[el.direction?.name]++;
        acc.all++;

        return acc;
      },
      {
        all: 0,
        statuses: {},
        directions: {},
      } as any,
    );
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.save({ id, ...updateOrderDto });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
