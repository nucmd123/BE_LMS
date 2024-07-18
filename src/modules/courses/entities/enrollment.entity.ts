import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Course } from './course.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  enrolledAt: Date

  @ManyToMany(() => User)
  user: User[]

  @ManyToMany(() => Course)
  course: Course[]
}
