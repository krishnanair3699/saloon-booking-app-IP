import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Buddhist Calm Meditation Music
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.25; // Set to 25% volume for ambient background
      
      // Auto-play on load (some browsers may block this)
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Autoplay blocked by browser. User interaction required.');
          setIsPlaying(false);
        }
      };
      
      playAudio();
    }
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        {/* Buddhist Calm Meditation Music - using royalty-free meditation music from reliable sources */}
        <source src="https://assets.mixkit.co/music/preview/mixkit-forest-treasure-138.mp3" type="audio/mpeg" />
        <source src="https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" type="audio/mpeg" />
        <source src="https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Control Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <button
          onClick={toggleMute}
          className="p-4 bg-gradient-to-br from-pink-400 to-purple-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
}