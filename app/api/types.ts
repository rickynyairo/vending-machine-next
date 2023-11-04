export enum Role {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export interface User {
  id?: string;
  username: string;
  password: string;
  role?: Role;
  availableBalance?: number;
}

export interface Database {
  createUser: (user: User) => Promise<User | any>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  validateUser: (
    username: string,
    password: string
  ) => Promise<User | boolean>;
  getUserById?: (id: string) => Promise<User | undefined>;
  updateUser?: (user: User) => Promise<User | undefined>;
}
