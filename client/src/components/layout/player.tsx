import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import * as nwc from "@/lib/nwc";
import { useLocation } from "wouter";

const PAYMENT_THRESHOLD_SECONDS = 1;

export function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [_, setPlayTime] = useState(0);
  const [hasTriggeredPayment, setHasTriggeredPayment] = useState(false);
  const [location, navigate] = useLocation();

  // Update progress bar during playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) { 
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Add new useEffect for payment threshold
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = Math.floor(audio.currentTime);
      setPlayTime(currentTime);

      if (currentTime >= PAYMENT_THRESHOLD_SECONDS && !hasTriggeredPayment) {
        handlePaymentThreshold();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [hasTriggeredPayment]);

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
      await nwc.walletService.makePayment(21, "cyphercosmo@getalby.com");
      setHasTriggeredPayment(true);
      // Play lightning animation
      const element = document.createElement('div');
      element.className = 'lightning-animation';
      document.body.appendChild(element);
      setTimeout(() => element.remove(), 1000);
    } catch (error) {
      console.error('Payment failed:', error);
      // Optionally handle payment failure
    }

  };  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border px-4">
      <audio ref={audioRef} src="/static/audio/1.m4a" crossOrigin="anonymous"/>
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 w-[300px]">
          <img
            src="/static/images/albums/1.png"
            alt="Album cover"
            className="h-12 w-12 rounded-md"
          />
          <div>
            <h4 className="font-medium">Dissolving</h4>
            <p className="text-sm text-muted-foreground">Btrax</p>
          </div>
          <Button 
            size="default" 
            className="bg-yellow-500 hover:bg-yellow-600 flex gap-2"
            onClick={() => {
              nwc.walletService.makePayment(21, "cyphercosmo@getalby.com")
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