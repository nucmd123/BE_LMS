import { Exclude, instanceToPlain } from 'class-transformer'
import { Role } from 'src/modules/roles/entities/role.entity'
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
import { SocialEnum } from '../enums/SocialEnum'
import { Course } from 'src/modules/courses/entities/course.entity'
import { Enrollment } from 'src/modules/courses/entities/enrollment.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string

  // @Column({ default: false })
  // emailVerified: boolean

  @Column({ default: null, nullable: true })
  avatar: string

  @Column({ type: 'enum', enum: SocialEnum, default: SocialEnum.NONE })
  social: string

  @Column({ nullable: true })
  socialId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  /* Relationship */
  @ManyToOne(() => Role, (role) => role.users)
  role: Role

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[]

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[]

  toJSON() {
    return instanceToPlain(this)
  }
}
