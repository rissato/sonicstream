import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Artist, Track as Trk } from "@shared/schema";
import { RouteComponentProps } from "wouter";
// import { mockTracks, mockArtists } from "@/lib/mock-data";
// import { setSeconds } from "date-fns";

interface TrackProps extends RouteComponentProps<{id: string}> {
  setCurrentTrack?: (track: Trk) => void;
}

export default function Track({ params, setCurrentTrack }: TrackProps) {
  const { id } = useParams();
  const trackId = parseInt(id || "0");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: tracks } = useQuery({
    // queryKey: ["/api/tracks", trackId],
    queryKey: [`/api/tracks/${trackId}`],
    // initialData: mockTracks.find((t) => t.id === trackId),
  });

  const { data: artists } = useQuery({
    queryKey: ["/api/artists", tracks?.artistId],
    // initialData: mockArtists.find((a) => a.id === track?.artistId),
  });
  

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      console.log("Playing track:", setCurrentTrack);
      setCurrentTrack(track);
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!tracks || !artists) return null;

  const track: Trk = tracks;
  const artist: Artist = artists;

  console.log(track);
  return (
    <div className="max-w-4xl mx-auto"> 
      <audio 
        ref={audioRef}
        src={track?.audioUrl}
        crossOrigin="anonymous"
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex gap-8">
        <img
          src={track?.albumCover}
          alt={track?.title}
          className="w-64 h-64 rounded-lg shadow-lg"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{track?.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={artist?.profileImage}
                  alt={artist?.name}
                  className="w-12 h-12 rounded-full"
                />
                <h2 className="text-xl">{artist.name}</h2>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={handlePlayPause}
            >
              {isPlaying ? 'Pause Track' : 'Play Track'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}