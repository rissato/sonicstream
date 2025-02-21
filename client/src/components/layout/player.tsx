import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border px-4">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 w-1/3">
          <img
            src="https://images.unsplash.com/photo-1587731556938-38755b4803a6"
            alt="Album cover"
            className="h-12 w-12 rounded-md"
          />
          <div>
            <h4 className="font-medium">Neon Dreams</h4>
            <p className="text-sm text-muted-foreground">Cosmic Drift</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsPlaying(!isPlaying)}
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
            onValueChange={([value]) => setProgress(value)}
            max={100}
            step={1}
            className="w-full mt-2"
          />
        </div>

        <div className="flex items-center gap-2 w-1/3 justify-end">
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
