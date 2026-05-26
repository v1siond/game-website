import {
  useRef,
  useEffect
} from 'react'
import { loadCanvasLevel } from '../canvasLogic/testLevel/loadCanvasLevel'

const Level1 = () => {

  const ref = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let cleanupLevel: (() => void) | undefined

    if (ref?.current) {
      cleanupLevel = loadCanvasLevel(ref.current)
    }

    const playAudio = () => {
      const audio = new Audio('/music/level1.mp3');
      audioRef.current = audio
      audio.onended = () => {
        audio.play();
      };
      audio.play();
    };

    document.addEventListener('click', playAudio, { once: true });

    return () => {
      // Clean up canvas level (animation loop + event listeners)
      if (cleanupLevel) cleanupLevel()
      // Stop and clean up audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      document.removeEventListener('click', playAudio);
    };
  }, [])


  return (
    <main className="grid grid-rows-1 grid-cols-1">
      <canvas className="w-max h-max min-h-full min-w-full font-silk-bold" id="level1" ref={ref}></canvas>
    </main>
  )
}

export default Level1;