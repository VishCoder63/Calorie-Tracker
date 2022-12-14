import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Food extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  date: string; // YYYY-MM-DD

  @Column()
  month: string; // YYYY-MM

  @Column()
  time: string; // HH:mm

  @Column()
  calorie: number;

  @Column()
  price: number;

  @Column()
  userId: number;
  @Column({ default: 0 })
  dailyTotalCalorie: number;
  @Column({ default: 0 })
  monthlyTotalAmount: number;

  @ManyToOne(() => User)
  user: User;
}
