import { Exclude, instanceToPlain } from 'class-transformer'
import { Role } from 'src/modules/roles/entities/role.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { SocialEnum } from '../enums/SocialEnum'

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

  @ManyToOne(() => Role, (role) => role.users)
  role: Role

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  toJSON() {
    return instanceToPlain(this)
  }
}
