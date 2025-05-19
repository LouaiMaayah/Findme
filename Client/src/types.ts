export interface Latlng {
  lat: number;
  lng: number;
}

export interface Lobby {
  name: string;
  players: string[];
}

export interface PlayerFromServer {
  username: string;
  connectionId: string;
  lobby: string;
  hidingPlace?: Latlng;
}

export interface MarkerData {
  position: Latlng;
  icon: string;
}
