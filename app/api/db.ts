import { Database, Role, User } from "./types";

const testUser: User = {
  id: "1",
  username: "test",
  password: "test",
  role: Role.BUYER,
};

const users: User[] = [testUser];
// create MemoryDatabase class
export class MemoryDatabase implements Database {
  async createUser(user: User) {
    // find user by username and password
    // throw error if user already exists
    const existingUser = await this.getUserByUsername(user.username);
    if (existingUser) {
      throw new Error("User already exists");
    }
    // create user
    users.push(user);
    return user;
  }
  async getUserByUsername(username: string) {
    // find user by username
    const user = users.find((u) => u.username === username);
    return user;
  }

  async validateUser(username: string, password: string) {
    // find user by username and password
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    return user;
  }
}
