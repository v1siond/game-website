import {
  useRef,
  useEffect
} from 'react'
import { load } from '../../canvasLogic/lobby/load'

const Lobby = () => {

  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref?.current) load(ref.current)

    const playAudio = () => {
      const audio = new Audio('/music/level1.mp3');
      audio.onended = () => {
        audio.play();
      };
      audio.play();
    };

    document.addEventListener('click', playAudio, { once: true });

    return () => {
      document.removeEventListener('click', playAudio);
    };
  }, [])


  return (
    <main className="grid grid-rows-1 grid-cols-1">
      <canvas className="w-max h-max min-h-full min-w-full font-silk-bold" id="level1" ref={ref}></canvas>
    </main>
  )
}

export default Lobby;