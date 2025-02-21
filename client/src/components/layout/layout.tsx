import { Sidebar } from "./sidebar";
import { Player } from "./player";
import { useState, Children, cloneElement } from "react";
import { Track } from "@shared/schema";



export function Layout({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const childrenWithProps = Children.map(children, child => {
    return cloneElement(child as React.ReactElement, { setCurrentTrack });
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4">
          {childrenWithProps}
        </div>
      </main>
      <Player 
        track={currentTrack}
        onTrackChange={setCurrentTrack}
      />
    </div>
  );
}