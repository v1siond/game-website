interface CellData {
  value: string;
  color: string;
  transparentFillColor?: string;
  fillColor: string;
  block: boolean;
  rowNumber: number;
  columnNumber: number;
  animation: {
    name: string | null;
    interval: number;
    value: string;
    color: string;
  } | null;
}

interface GameAsset {
  template: string[];
  colorMap?: Record<string, string>;
  templateMap: Record<number, CellData[]>;
}

export default GameAsset;
export type { CellData };
