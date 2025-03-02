import {
  useRef,
  useEffect,
  useCallback
} from 'react'
import LevelProps from '../interfaces/LevelProps'
import { loadCanvasLevel } from '../canvasLogic/loadCanvasLevel'

const Level1 = ({}: LevelProps) => {

  const ref = useRef<HTMLCanvasElement>(null)

  const loadLevel1 = useCallback(() => {
    if (ref?.current) loadCanvasLevel(ref.current)
  }, [ref?.current])

  useEffect(() => {
    loadLevel1()
  }, [])


  return (
    <main className="grid grid-rows-1 grid-cols-1">
      <canvas className="w-max h-max min-h-full min-w-full" id="level1" ref={ref}></canvas>
    </main>
  )
}

export default Level1;