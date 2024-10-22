export interface AuthRegisterBody {
  email: string;
  password: string;
  name?: string;
}

export interface AuthLoginBody {
  email: string;
  password: string;
}

export interface FriendCreateBody {
  friendId: number;
}