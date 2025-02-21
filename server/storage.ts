import { Track, Artist, User, InsertTrack, InsertArtist, InsertUser } from "@shared/schema";

export interface IStorage {
  // Tracks
  getTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  searchTracks(query: string): Promise<Track[]>;
  
  // Artists
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
}

export class MemStorage implements IStorage {
  private tracks: Map<number, Track>;
  private artists: Map<number, Artist>;
  private users: Map<number, User>;
  private currentId: number;

  constructor() {
    this.tracks = new Map();
    this.artists = new Map();
    this.users = new Map();
    this.currentId = 1;
  }

  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async searchTracks(query: string): Promise<Track[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tracks.values()).filter(track => 
      track.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
