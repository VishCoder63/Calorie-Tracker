import { Role } from '../enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  role: Role;

  @Column({ default: 1000 })
  monthlyBudgetLimit: number;

  @Column({ default: 2100 })
  dailyCalorieLimit: number;
}
