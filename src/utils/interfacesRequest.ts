export interface AuthRegisterBody {
  email: string;
  password: string;
  name: string;
  type?: string;
  manager?: boolean;
}

export interface AuthLoginBody {
  email: string;
  password: string;
  manager?: boolean;
}

export interface FriendCreateBody {
  friendId: number;
}