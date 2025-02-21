import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import * as nwc from "@/lib/nwc";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const PAYMENT_THRESHOLD_SECONDS = 1;

export function Player(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [_, setPlayTime] = useState(0);
  const [hasTriggeredPayment, setHasTriggeredPayment] = useState(false);
  const [__, navigate] = useLocation();

  console.log("Player props:", props);

  const { data: artists } = useQuery({
    queryKey: ["/api/artists"],
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audioRef.current]);

  useEffect(() => {
    if (audioRef.current) { 
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef.current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = Math.floor(audio.currentTime);
      setPlayTime(currentTime);

      if (currentTime >= PAYMENT_THRESHOLD_SECONDS && !hasTriggeredPayment) {
        console.log("Threshold reached, triggering payment");
        handlePaymentThreshold();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [hasTriggeredPayment, audioRef.current]);

  const togglePlayPause = () => {
    console.log("Toggle play/pause");
    if (audioRef.current) {
      if (isPlaying) {
        console.log("Pausing audio");
        audioRef.current.pause();
      } else {
        console.log("Pausing audio");
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = ([value]: number[]) => {
    if (audioRef.current) {
      const newTime = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value);
    }
  };

  const handlePaymentThreshold = async () => {
    const isConnected = nwc.walletService.getConnection() !== null;
    
    if (!isConnected) {
      audioRef.current?.pause();
      setIsPlaying(false);
      navigate('/wallet');
      return;
    }

    try {
      setHasTriggeredPayment(true);
      await nwc.walletService.pay(21, "cyphercosmo@getalby.com");
    } catch (error) {
      console.error('Payment failed:', error);
      // Optionally handle payment failure
    }

  };  

  if (!artists) {
    return null;
  }

  const artist = artists.find(artist => artist.id === props.track?.artistId);
  
  if (!audioRef.current) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border px-4">
      <audio ref={audioRef} crossOrigin="anonymous"
        src={props.track?.audioUrl}
      />
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 w-[300px]">
          <img
            src={props.track?.albumCover}
            alt={props.track?.title || ""}
            className="h-12 w-12 rounded-md"
          />
          <div>
            <h4 className="font-medium">
              {props.track?.title || ""}
            </h4>
            <p className="text-sm text-muted-foreground">
              {artist?.name || ""}
            </p>
          </div>
          <Button 
            size="default" 
            className="bg-yellow-500 hover:bg-yellow-600 flex gap-2"
            onClick={() => {
              nwc.walletService.payInvoice(21, "cyphercosmo@getalby.com")
                .catch(err => console.error("Payment failed:", err));
            }}
          >
            <Zap className="h-5 w-5 text-white" />
            <span className="text-white">Boost</span>
          </Button>
        </div>

        <div className="flex flex-col items-center flex-1 max-w-xl px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={togglePlayPause}
            >

              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
            className="w-full mt-2"
          />
        </div>

        <div className="flex items-center gap-3 w-[200px] justify-end">
          <Volume2 className="h-5 w-5" />
          <Slider
            value={[volume]}
            onValueChange={([value]) => setVolume(value)}
            max={100}
            step={1}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}