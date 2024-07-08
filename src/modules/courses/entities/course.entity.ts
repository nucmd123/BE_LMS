import { User } from 'src/modules/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  teacherId: number

  @Column()
  title: string

  @Column()
  description: string

  @Column({ nullable: true })
  image: string

  @Column({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
  startDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => User, (user) => user.courses)
  teacher: User
}
