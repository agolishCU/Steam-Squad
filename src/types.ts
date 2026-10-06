export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  role: 'host' | 'member';
  status: 'online' | 'ready' | 'downloading' | 'delayed';
  statusDetail?: string;
  downloadProgress?: number;
  micOn?: boolean;
}

export interface GameItem {
  id: string;
  title: string;
  genre: string;
  image: string;
  ratingPercent: number;
  reviewCount?: string;
  originalPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  maxPlayers: number;
  deckVerified?: boolean;
  controllerSupported?: boolean;
  vrSupported?: boolean;
  crossplay?: boolean;
  squadOwnership: {
    alex: 'owns' | 'wishlist' | 'none';
    jax: 'owns' | 'wishlist' | 'none';
    sarah: 'owns' | 'wishlist' | 'none';
    elena: 'owns' | 'wishlist' | 'none';
    you?: 'owns' | 'wishlist' | 'none';
  };
  votes?: number;
  voters?: string[];
  lastPlayed?: string;
  featured?: boolean;
}

export type ScreenType = 'discover' | 'matrix' | 'flight' | 'game-detail' | 'party-lobby';
