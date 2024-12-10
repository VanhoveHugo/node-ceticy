export interface AuthRegisterBody {
  email: string;
  password: string;
  name: string;
  scope?: string;
}

export interface AuthLoginBody {
  email: string;
  password: string;
  scope?: string;
}

export interface FriendCreateBody {
  email: string;
}

export interface RestaurantCreateBody {
  name: string;
  description: string;
  averagePrive: number;
  averageService: number;
  phoneNumber: string;
}