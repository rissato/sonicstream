import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artistId: integer("artist_id").notNull(),
  albumCover: text("album_cover").notNull(),
  duration: integer("duration").notNull(),
  audioUrl: text("audio_url").notNull(),
});

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profileImage: text("profile_image").notNull(),
  walletAddress: text("wallet_address").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address"),
  subscriptionActive: boolean("subscription_active").default(false),
  subscriptionExpiry: timestamp("subscription_expiry"),
});

export const insertTrackSchema = createInsertSchema(tracks);
export const insertArtistSchema = createInsertSchema(artists);
export const insertUserSchema = createInsertSchema(users);

export type Track = typeof tracks.$inferSelect;
export type Artist = typeof artists.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
