import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Course } from './course.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  enrolledAt: Date

  @ManyToOne(() => User, (user) => user.enrollments)
  user: User

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course
}
