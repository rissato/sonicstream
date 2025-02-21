import type { Track, Artist } from "@shared/schema";

export const mockArtists: Artist[] = [
  {
    id: 1,
    name: "Cosmic Drift",
    profileImage: "https://images.unsplash.com/photo-1521198022873-af0f772bf653",
    walletAddress: "mock-wallet-1"
  },
  {
    id: 2,
    name: "Luna Echo",
    profileImage: "https://images.unsplash.com/photo-1535146851324-6571dc3f2672",
    walletAddress: "mock-wallet-2"
  },
  {
    id: 3,
    name: "Digital Pulse",
    profileImage: "https://images.unsplash.com/photo-1517845711063-534c512d32b5",
    walletAddress: "mock-wallet-3"
  }
];

export const mockTracks: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artistId: 1,
    albumCover: "https://images.unsplash.com/photo-1587731556938-38755b4803a6",
    duration: 240,
    audioUrl: "mock-audio-1"
  },
  {
    id: 2,
    title: "Midnight Wave",
    artistId: 2,
    albumCover: "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
    duration: 198,
    audioUrl: "mock-audio-2"
  },
  {
    id: 3,
    title: "Urban Flow",
    artistId: 3,
    albumCover: "https://images.unsplash.com/photo-1510759704643-849552bf3b66",
    duration: 312,
    audioUrl: "mock-audio-3"
  }
];
