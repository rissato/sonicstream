import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express) {
  // Tracks
  app.get("/api/tracks", async (req, res) => {
    const tracks = await storage.getTracks();
    res.json(tracks);
  });

  app.get("/api/tracks/search", async (req, res) => {
    const query = req.query.q as string;
    const tracks = await storage.searchTracks(query);
    res.json(tracks);
  });

  app.get("/api/tracks/:id", async (req, res) => {
    const track = await storage.getTrack(parseInt(req.params.id));
    if (!track) return res.status(404).json({ message: "Track not found" });
    res.json(track);
  });

  // Artists
  app.get("/api/artists", async (req, res) => {
    const artists = await storage.getArtists();
    res.json(artists);
  });

  app.get("/api/artists/:id", async (req, res) => {
    const artist = await storage.getArtist(parseInt(req.params.id));
    if (!artist) return res.status(404).json({ message: "Artist not found" });
    res.json(artist);
  });

  // Users
  app.post("/api/users", async (req, res) => {
    const user = await storage.createUser(req.body);
    res.json(user);
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  });

  return createServer(app);
}
