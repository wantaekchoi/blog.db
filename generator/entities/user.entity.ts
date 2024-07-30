import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { Post } from './post.entity';
import { Reply } from './reply.entity';
import { TABLE_NAMES, USER_COLUMNS } from './constants';

@Entity(TABLE_NAMES.USERS)
export class User {
  @PrimaryGeneratedColumn({ name: USER_COLUMNS.ID })
  id!: number;

  @Column({ name: USER_COLUMNS.USERNAME })
  username!: string;

  @Column({ name: USER_COLUMNS.EMAIL })
  email!: string;

  @Column({ name: USER_COLUMNS.PASSWORD })
  password!: string;

  @Column({ name: USER_COLUMNS.IS_ADMIN, default: false })
  isAdmin!: boolean;

  @CreateDateColumn({ name: USER_COLUMNS.CREATED_AT })
  createdAt!: Date;

  @UpdateDateColumn({ name: USER_COLUMNS.UPDATED_AT })
  updatedAt!: Date;

  @OneToMany(() => Blog, blog => blog.owner)
  blogs!: Blog[];

  @OneToMany(() => Post, post => post.author)
  posts!: Post[];

  @OneToMany(() => Reply, comment => comment.author)
  comments!: Reply[];
}
