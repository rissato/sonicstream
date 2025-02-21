import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { mockTracks, mockArtists } from "@/lib/mock-data";
import { Link } from "wouter";

export default function Discover() {
  const { data: tracks = mockTracks } = useQuery({
    queryKey: ["/api/tracks"],
  });

  const { data: artists = mockArtists } = useQuery({
    queryKey: ["/api/artists"],
  });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <Link key={track.id} href={`/track/${track.id}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <img
                    src={track.albumCover}
                    alt={track.title}
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-medium">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {artists.find((a) => a.id === track.artistId)?.name}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Popular Artists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <Card key={artist.id}>
              <CardContent className="p-4 text-center">
                <img
                  src={artist.profileImage}
                  alt={artist.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-medium">{artist.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
