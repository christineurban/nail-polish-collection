export interface StatItem {
  name: string;
  count: number;
  percentage: number;
}

export interface CollectionStats {
  totalPolishes: number;
  totalBrands: number;
  brandStats: StatItem[];
  colorStats: StatItem[];
  finishStats: StatItem[];
}
