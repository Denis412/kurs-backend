import { Direction } from 'src/direction/entities/direction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';

@Entity('orders')
@Unique(['user', 'direction'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  phone: string;

  @Column({ length: 255 })
  address: string;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Direction, (direction) => direction.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'direction_id' })
  direction: Direction;

  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
