import {
  users,
  images,
  type User,
  type UpsertUser,
  type Image,
  type InsertImage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Image operations
  createImage(image: InsertImage): Promise<Image>;
  getImagesByUserId(userId: string): Promise<Image[]>;
  getImageById(id: string): Promise<Image | undefined>;
  updateImageCaptions(id: string, captions: { english: string; telugu: string; hindi: string }): Promise<Image>;
  deleteImage(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Image operations
  async createImage(image: InsertImage): Promise<Image> {
    const [newImage] = await db
      .insert(images)
      .values(image)
      .returning();
    return newImage;
  }

  async getImagesByUserId(userId: string): Promise<Image[]> {
    return await db
      .select()
      .from(images)
      .where(eq(images.userId, userId))
      .orderBy(desc(images.createdAt));
  }

  async getImageById(id: string): Promise<Image | undefined> {
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id, id));
    return image;
  }

  async updateImageCaptions(id: string, captions: { english: string; telugu: string; hindi: string }): Promise<Image> {
    const [updatedImage] = await db
      .update(images)
      .set({
        captionEnglish: captions.english,
        captionTelugu: captions.telugu,
        captionHindi: captions.hindi,
      })
      .where(eq(images.id, id))
      .returning();
    return updatedImage;
  }

  async deleteImage(id: string): Promise<boolean> {
    const result = await db
      .delete(images)
      .where(eq(images.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
