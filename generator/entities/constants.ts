export const TABLE_NAMES = {
  USERS: 'users',
  BLOGS: 'blogs',
  POSTS: 'posts',
  REPLIES: 'replies',
};

export const USER_COLUMNS = {
  ID: 'id',
  USERNAME: 'username',
  EMAIL: 'email',
  PASSWORD: 'password',
  IS_ADMIN: 'is_admin',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
};

export const BLOG_COLUMNS = {
  ID: 'id',
  TITLE: 'title',
  DESCRIPTION: 'description',
  OWNER_ID: 'owner_id',
  IS_PUBLIC: 'is_public',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
};

export const POST_COLUMNS = {
  ID: 'id',
  TITLE: 'title',
  CONTENT: 'content',
  BLOG_ID: 'blog_id',
  AUTHOR_ID: 'author_id',
  LIKES: 'likes',
  DISLIKES: 'dislikes',
  VIEWS: 'views',
  IS_PUBLIC: 'is_public',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
};

export const REPLY_COLUMNS = {
  ID: 'id',
  CONTENT: 'content',
  POST_ID: 'post_id',
  AUTHOR_ID: 'author_id',
  PARENT_REPLY_ID: 'parent_reply_id',
  LIKES: 'likes',
  DISLIKES: 'dislikes',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
};
