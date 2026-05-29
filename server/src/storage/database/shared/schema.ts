import { pgTable, serial, timestamp, varchar, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 金庸人物投票表
export const jinyongCharacters = pgTable(
	"jinyong_characters",
	{
		id: serial().primaryKey(),
		name: varchar("name", { length: 50 }).notNull(),
		novel: varchar("novel", { length: 100 }).notNull(),
		gender: varchar("gender", { length: 10 }).notNull(), // 'male', 'female', 'hengshan'
		avatarUrl: varchar("avatar_url", { length: 500 }).notNull(),
		votesCount: integer("votes_count").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [
		index("jinyong_characters_gender_idx").on(table.gender),
		index("jinyong_characters_votes_count_idx").on(table.votesCount),
	]
);

// 评论表
export const comments = pgTable(
	"comments",
	{
		id: serial().primaryKey(),
		characterId: integer("character_id").notNull(), // 关联人物ID
		content: varchar("content", { length: 500 }).notNull(), // 评论内容
		nickname: varchar("nickname", { length: 50 }).notNull(), // 昵称
		createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [
		index("comments_character_id_idx").on(table.characterId),
		index("comments_created_at_idx").on(table.createdAt),
	]
);
