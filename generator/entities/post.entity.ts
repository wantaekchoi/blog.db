import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from './user.entity';
import { Reply } from './reply.entity';
import { TABLE_NAMES, POST_COLUMNS } from './constants';

@Entity(TABLE_NAMES.POSTS)
export class Post {
  @PrimaryGeneratedColumn({ name: POST_COLUMNS.ID })
  id!: number;

  @Column({ name: POST_COLUMNS.TITLE })
  title!: string;

  @Column({ name: POST_COLUMNS.CONTENT })
  content!: string;

  @ManyToOne(() => Blog, blog => blog.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: POST_COLUMNS.BLOG_ID })
  blog!: Blog;

  @ManyToOne(() => User, user => user.posts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: POST_COLUMNS.AUTHOR_ID })
  author!: User;

  @OneToMany(() => Reply, comment => comment.post)
  comments!: Reply[];

  @Column({ name: POST_COLUMNS.LIKES, default: 0 })
  likes!: number;

  @Column({ name: POST_COLUMNS.DISLIKES, default: 0 })
  dislikes!: number;

  @Column({ name: POST_COLUMNS.VIEWS, default: 0 })
  views!: number;

  @Column({ name: POST_COLUMNS.IS_PUBLIC, default: true })
  isPublic!: boolean;

  @CreateDateColumn({ name: POST_COLUMNS.CREATED_AT })
  createdAt!: Date;

  @UpdateDateColumn({ name: POST_COLUMNS.UPDATED_AT })
  updatedAt!: Date;
}
