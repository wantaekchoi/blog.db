import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Blog } from './entities/blog.entity';
import { Post } from './entities/post.entity';
import { Reply } from './entities/reply.entity';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: ['error', 'warn'],
  entities: [User, Blog, Post, Reply],
});
