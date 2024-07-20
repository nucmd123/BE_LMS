import { User } from 'src/modules/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Enrollment } from './enrollment.entity'

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

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[]
}
