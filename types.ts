
export enum Platform {
  STEAM = 'Steam',
  ORIGIN = 'Origin',
  UBISOFT = 'Ubisoft Connect',
  GOG = 'GOG.com',
  EPIC = 'Epic Games',
  XBOX = 'Xbox',
  PLAYSTATION = 'PlayStation'
}

export enum Genre {
  ACTION = 'Acción',
  RPG = 'RPG',
  STRATEGY = 'Estrategia',
  SPORTS = 'Deportes',
  ADVENTURE = 'Aventura',
  SIMULATION = 'Simulación',
  FPS = 'FPS'
}

export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  platform: Platform;
  genre: Genre;
  imageUrl: string;
  rating: number;
  releaseYear: number;
  region: 'Global' | 'EU' | 'US' | 'LATAM';
}

export interface CartItem extends Game {
  quantity: number;
}

export interface AppState {
  cart: CartItem[];
  isCartOpen: boolean;
  selectedGenre: Genre | 'All';
  searchQuery: string;
  isAIModalOpen: boolean;
}
