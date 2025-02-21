import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchComponent } from "@/components/search";
import { Card, CardContent } from "@/components/ui/card";
import { mockTracks, mockArtists } from "@/lib/mock-data";
import { Link } from "wouter";

export default function Search() {
  const [query, setQuery] = useState("");

  const { data: tracks = mockTracks } = useQuery({
    queryKey: ["/api/tracks/search", query],
    enabled: query.length > 0,
  });

  const { data: artists = mockArtists } = useQuery({
    queryKey: ["/api/artists"],
  });

  return (
    <div className="space-y-6">
      <SearchComponent />
      
      {query.length > 0 ? (
        <section>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
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
      ) : (
        <div className="text-center text-muted-foreground">
          Search for tracks above
        </div>
      )}
    </div>
  );
}
