import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { TABLE_NAMES, BLOG_COLUMNS } from './constants';

@Entity(TABLE_NAMES.BLOGS)
export class Blog {
  @PrimaryGeneratedColumn({ name: BLOG_COLUMNS.ID })
  id!: number;

  @Column({ name: BLOG_COLUMNS.TITLE })
  title!: string;

  @Column({ name: BLOG_COLUMNS.DESCRIPTION, nullable: true })
  description!: string;

  @ManyToOne(() => User, user => user.blogs, { nullable: true })
  @JoinColumn({ name: BLOG_COLUMNS.OWNER_ID })
  owner!: User;

  @Column({ name: BLOG_COLUMNS.IS_PUBLIC, default: true })
  isPublic!: boolean;

  @CreateDateColumn({ name: BLOG_COLUMNS.CREATED_AT })
  createdAt!: Date;

  @UpdateDateColumn({ name: BLOG_COLUMNS.UPDATED_AT })
  updatedAt!: Date;

  @OneToMany(() => Post, post => post.blog)
  posts!: Post[];
}
