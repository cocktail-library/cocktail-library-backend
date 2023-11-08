export interface CocktailListAllRawFilters {
  alcohol?: string;
  taste?: string;
  accent?: string;
  method?: string;
  glass?: string;

  abvMin?: number;
  abvMax?: number;
  isTasted?: boolean;
}

export interface CocktailListAllFilters {
  tagGroups?: string[][],
  abvMin?: number;
  abvMax?: number;
  isTasted?: boolean;
}