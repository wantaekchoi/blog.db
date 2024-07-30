import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import { User } from './entities/user.entity';
import { Blog } from './entities/blog.entity';
import { Post } from './entities/post.entity';
import { Reply } from './entities/reply.entity';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '1000', 10);
const USER_COUNT = parseInt(process.env.USER_COUNT || '1000000', 10);
const BLOG_COUNT = parseInt(process.env.BLOG_COUNT || '100000', 10);
const POST_COUNT = parseInt(process.env.POST_COUNT || '10000000', 10);
const COMMENT_COUNT = parseInt(process.env.COMMENT_COUNT || '100000000', 10);

async function generateData() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const blogRepository = AppDataSource.getRepository(Blog);
  const postRepository = AppDataSource.getRepository(Post);
  const commentRepository = AppDataSource.getRepository(Reply);

  console.log(`Starting data generation with batch size ${BATCH_SIZE}...`);

  console.log('Generating user data...');
  for (let i = 0; i < USER_COUNT; i += BATCH_SIZE) {
    const userBatch: User[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j < USER_COUNT; j++) {
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
    console.log(`Saved batch of users up to ${i + BATCH_SIZE}...`);
  }
  console.log('User data generation completed.');

  console.log('Generating blog data...');
  for (let i = 0; i < BLOG_COUNT; i += BATCH_SIZE) {
    const blogBatch: Blog[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j < BLOG_COUNT; j++) {
      // Randomly assign an owner from the existing users
      const ownerId = await userRepository.findOneBy({ id: Math.floor(Math.random() * USER_COUNT) });
      if (!ownerId) continue; // Skip if no owner found (edge case)
      const blog = blogRepository.create({
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        owner: ownerId,
        isPublic: faker.datatype.boolean(),
      });
      blogBatch.push(blog);
    }
    await blogRepository.save(blogBatch);
    console.log(`Saved batch of blogs up to ${i + BATCH_SIZE}...`);
  }
  console.log('Blog data generation completed.');

  console.log('Generating post data...');
  for (let i = 0; i < POST_COUNT; i += BATCH_SIZE) {
    const postBatch: Post[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j < POST_COUNT; j++) {
      // Randomly assign a blog and author from the existing entries
      const blog = await blogRepository.findOneBy({ id: Math.floor(Math.random() * BLOG_COUNT) });
      const author = await userRepository.findOneBy({ id: Math.floor(Math.random() * USER_COUNT) });
      if (!blog || !author) continue; // Skip if no blog or author found (edge case)
      const post = postRepository.create({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(5),
        blog: blog,
        author: author,
        likes: faker.number.int({ min: 0, max: 100 }),
        dislikes: faker.number.int({ min: 0, max: 100 }),
        views: faker.number.int({ min: 0, max: 1000 }),
        isPublic: faker.datatype.boolean(),
      });
      postBatch.push(post);
    }
    await postRepository.save(postBatch);
    console.log(`Saved batch of posts up to ${i + BATCH_SIZE}...`);
  }
  console.log('Post data generation completed.');

  console.log('Generating comment data...');
  for (let i = 0; i < COMMENT_COUNT; i += BATCH_SIZE) {
    const commentBatch: Reply[] = [];
    for (let j = 0; j < BATCH_SIZE && i + j < COMMENT_COUNT; j++) {
      // Randomly assign a post and author from the existing entries
      const post = await postRepository.findOneBy({ id: Math.floor(Math.random() * POST_COUNT) });
      const author = await userRepository.findOneBy({ id: Math.floor(Math.random() * USER_COUNT) });
      if (!post || !author) continue; // Skip if no post or author found (edge case)

      const parentComment = Math.random() > 0.9 ? await commentRepository.findOneBy({ id: Math.floor(Math.random() * COMMENT_COUNT) }) : null;
      const comment = commentRepository.create({
        content: faker.lorem.sentences(2),
        post: post,
        author: author,
        likes: faker.number.int({ min: 0, max: 50 }),
        dislikes: faker.number.int({ min: 0, max: 50 }),
        parentComment: parentComment || undefined,
      });
      commentBatch.push(comment);
    }
    await commentRepository.save(commentBatch);
    console.log(`Saved batch of comments up to ${i + BATCH_SIZE}...`);
  }
  console.log('Comment data generation completed.');

  await AppDataSource.destroy();
  console.log('Database connection closed.');
}

generateData().catch((error) => {
  console.error('Error generating data:', error);
  AppDataSource.destroy();
});
