import { pgTable, uuid, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

/* ──────────────── USERS ──────────────── */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  role: text("role").notNull().default("student"), // student | council | prefect | admin
  curriculum: text("curriculum").notNull().default("uneb"), // uneb | cambridge
  school: text("school"),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ──────────────── GAMING SOCIETY ──────────────── */
export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // fps | sports | strategy | puzzle | racing | adventure
  type: text("type").notNull(), // online | offline
  coverImage: text("cover_image"),
  rating: integer("rating").default(0),
  playersCount: integer("players_count").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  gameId: uuid("game_id").references(() => games.id),
  score: integer("score").notNull().default(0),
  rank: integer("rank").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gameClips = pgTable("game_clips", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  gameId: uuid("game_id").references(() => games.id),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tournaments = pgTable("tournaments", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  gameId: uuid("game_id").references(() => games.id),
  status: text("status").notNull().default("upcoming"), // upcoming | live | completed
  maxPlayers: integer("max_players").default(32),
  currentPlayers: integer("current_players").default(0),
  prize: text("prize"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ──────────────── BLOG SPOT ──────────────── */
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  tags: jsonb("tags").$type<string[]>().default([]),
  category: text("category").notNull().default("general"), // general | creative | tech | opinion | jazz
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  commentCount: integer("comment_count").default(0),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogComments = pgTable("blog_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").references(() => blogPosts.id),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  parentId: uuid("parent_id"), // for nested replies
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogReactions = pgTable("blog_reactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").references(() => blogPosts.id),
  userId: uuid("user_id").references(() => users.id),
  type: text("type").notNull(), // like | love | fire | clap | laugh
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ──────────────── STUDENT LEADER ──────────────── */
export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  section: text("section").notNull(), // general | council | prefect
  priority: text("priority").notNull().default("normal"), // urgent | high | normal | low
  isPinned: boolean("is_pinned").default(false).notNull(),
  targetCurriculum: text("target_curriculum"), // uneb | cambridge | all
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const discussions = pgTable("discussions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  section: text("section").notNull(), // general | council | prefect
  category: text("category").notNull().default("general"), // general | academics | events | welfare | discipline
  isPinned: boolean("is_pinned").default(false).notNull(),
  isLocked: boolean("is_locked").default(false).notNull(),
  replyCount: integer("reply_count").default(0),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const discussionReplies = pgTable("discussion_replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  discussionId: uuid("discussion_id").references(() => discussions.id),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  parentId: uuid("parent_id"), // for threaded replies
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pollVotes = pgTable("poll_votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  discussionId: uuid("discussion_id").references(() => discussions.id),
  userId: uuid("user_id").references(() => users.id),
  option: text("option").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
