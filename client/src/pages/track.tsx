import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { mockTracks, mockArtists } from "@/lib/mock-data";
import { ZapPaymentDialog } from "@/components/zap-payment-dialog";

export default function Track() {
  const { id } = useParams();
  const trackId = parseInt(id || "0");

  const { data: track } = useQuery({
    queryKey: ["/api/tracks", trackId],
    initialData: mockTracks.find((t) => t.id === trackId),
  });

  const { data: artist } = useQuery({
    queryKey: ["/api/artists", track?.artistId],
    initialData: mockArtists.find((a) => a.id === track?.artistId),
  });

  if (!track || !artist) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-8">
        <img
          src={track.albumCover}
          alt={track.title}
          className="w-64 h-64 rounded-lg shadow-lg"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{track.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={artist.profileImage}
                alt={artist.name}
                className="w-12 h-12 rounded-full"
              />
              <h2 className="text-xl">{artist.name}</h2>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full">
              Play Track
            </Button>
            <ZapPaymentDialog artist={artist} />
          </div>
        </div>
      </div>
    </div>
  );
}