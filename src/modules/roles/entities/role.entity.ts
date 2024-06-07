import { RoleEnum } from 'src/modules/roles/enums/RoleEnum'
import { User } from 'src/modules/users/entities/user.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: RoleEnum, unique: true })
  name: RoleEnum.ROOT | RoleEnum.ADMIN | RoleEnum.TEACHER | RoleEnum.STUDENT

  @Column({ type: 'text' })
  description: string

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}
