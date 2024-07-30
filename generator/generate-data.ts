import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import { User } from './entities/user.entity';
import { Blog } from './entities/blog.entity';
import { Post } from './entities/post.entity';
import { Reply } from './entities/reply.entity';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '5000', 10);
const USER_COUNT = parseInt(process.env.USER_COUNT || '1000000', 10);
const BLOG_COUNT = parseInt(process.env.BLOG_COUNT || '100000', 10);
const POST_COUNT = parseInt(process.env.POST_COUNT || '10000000', 10);
const COMMENT_COUNT = parseInt(process.env.COMMENT_COUNT || '100000000', 10);

async function getLastId(entityName: string): Promise<number> {
  const result = await AppDataSource.query(
    `SELECT id FROM ${entityName} ORDER BY id DESC LIMIT 1`
  );
  return result.length > 0 ? result[0].id : 0;
}

async function generateUsers(startId: number) {
  const userRepository = AppDataSource.getRepository(User);
  for (let i = startId; i <= USER_COUNT; i += BATCH_SIZE) {
    const userBatch: User[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j <= USER_COUNT; j++) {
      const uniqueEmail = `${faker.internet.email()}_${uuidv4()}`;
      const user = userRepository.create({
        username: faker.internet.userName(),
        email: uniqueEmail,
        password: faker.internet.password(),
        isAdmin: faker.datatype.boolean(),
      });
      userBatch.push(user);
    }
    await userRepository.save(userBatch);
    console.log(`Saved batch of users from ID ${i} to ${i + BATCH_SIZE - 1}...`);
  }
}

async function generateBlogs(startId: number) {
  const blogRepository = AppDataSource.getRepository(Blog);
  for (let i = startId; i <= BLOG_COUNT; i += BATCH_SIZE) {
    const blogBatch: Blog[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j <= BLOG_COUNT; j++) {
      const ownerId = Math.floor(Math.random() * (USER_COUNT - startId)) + startId + 1;
      const blog = blogRepository.create({
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        owner: { id: ownerId } as User,
        isPublic: faker.datatype.boolean(),
      });
      blogBatch.push(blog);
    }
    await blogRepository.save(blogBatch);
    console.log(`Saved batch of blogs from ID ${i} to ${i + BATCH_SIZE - 1}...`);
  }
}

async function generatePosts(startId: number) {
  const postRepository = AppDataSource.getRepository(Post);
  for (let i = startId; i <= POST_COUNT; i += BATCH_SIZE) {
    const postBatch: Post[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j <= POST_COUNT; j++) {
      const blogId = Math.floor(Math.random() * (BLOG_COUNT - startId)) + startId + 1;
      const authorId = Math.floor(Math.random() * (USER_COUNT - startId)) + startId + 1;
      const post = postRepository.create({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(5),
        blog: { id: blogId } as Blog,
        author: { id: authorId } as User,
        likes: faker.number.int({ min: 0, max: 100 }),
        dislikes: faker.number.int({ min: 0, max: 100 }),
        views: faker.number.int({ min: 0, max: 1000 }),
        isPublic: faker.datatype.boolean(),
      });
      postBatch.push(post);
    }
    await postRepository.save(postBatch);
    console.log(`Saved batch of posts from ID ${i} to ${i + BATCH_SIZE - 1}...`);
  }
}

async function generateReplies(startId: number) {
  const replyRepository = AppDataSource.getRepository(Reply);
  for (let i = startId; i <= COMMENT_COUNT; i += BATCH_SIZE) {
    const replyBatch: Reply[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j <= COMMENT_COUNT; j++) {
      const postId = Math.floor(Math.random() * (POST_COUNT - startId)) + startId + 1;
      const authorId = Math.floor(Math.random() * (USER_COUNT - startId)) + startId + 1;
      const parentReplyId = Math.random() > 0.9 ? Math.floor(Math.random() * COMMENT_COUNT) + 1 : null;

      const reply = replyRepository.create({
        content: faker.lorem.sentences(2),
        post: { id: postId } as Post,
        author: { id: authorId } as User,
        parentComment: parentReplyId ? { id: parentReplyId } as Reply : undefined,
        likes: faker.number.int({ min: 0, max: 50 }),
        dislikes: faker.number.int({ min: 0, max: 50 }),
      });
      replyBatch.push(reply);
    }
    await replyRepository.save(replyBatch);
    console.log(`Saved batch of replies from ID ${i} to ${i + BATCH_SIZE - 1}...`);
  }
}

async function generateData() {
  await AppDataSource.initialize();

  const lastUserId = await getLastId('users');
  const lastBlogId = await getLastId('blogs');
  const lastPostId = await getLastId('posts');
  const lastReplyId = await getLastId('replies');

  console.log(`Starting data generation with batch size ${BATCH_SIZE}...`);

  await generateUsers(lastUserId + 1);
  console.log('User data generation completed.');

  await generateBlogs(lastBlogId + 1);
  console.log('Blog data generation completed.');

  await generatePosts(lastPostId + 1);
  console.log('Post data generation completed.');

  await generateReplies(lastReplyId + 1);
  console.log('Reply data generation completed.');

  await AppDataSource.destroy();
  console.log('Database connection closed.');
}

generateData().catch((error) => {
  console.error('Error generating data:', error);
  AppDataSource.destroy();
});
