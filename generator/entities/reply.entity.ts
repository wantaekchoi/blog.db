import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { TABLE_NAMES, REPLY_COLUMNS } from './constants';

@Entity(TABLE_NAMES.REPLIES)
export class Reply {
  @PrimaryGeneratedColumn({ name: REPLY_COLUMNS.ID })
  id!: number;

  @Column({ name: REPLY_COLUMNS.CONTENT })
  content!: string;

  @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: REPLY_COLUMNS.POST_ID })
  post!: Post;

  @ManyToOne(() => User, user => user.comments, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: REPLY_COLUMNS.AUTHOR_ID })
  author!: User;

  @ManyToOne(() => Reply, comment => comment.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: REPLY_COLUMNS.PARENT_REPLY_ID })
  parentComment!: Reply | null;

  @OneToMany(() => Reply, comment => comment.parentComment)
  children!: Reply[];

  @Column({ name: REPLY_COLUMNS.LIKES, default: 0 })
  likes!: number;

  @Column({ name: REPLY_COLUMNS.DISLIKES, default: 0 })
  dislikes!: number;

  @CreateDateColumn({ name: REPLY_COLUMNS.CREATED_AT })
  createdAt!: Date;

  @UpdateDateColumn({ name: REPLY_COLUMNS.UPDATED_AT })
  updatedAt!: Date;
}
