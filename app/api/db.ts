import { Database, Role, User } from "./types";
import { CosmosClient } from "@azure/cosmos";
import bcrypt from "bcrypt";

const endpoint = process.env.DATABASE_ENDPOINT as string;
const key = process.env.DATABASE_KEY;
const cosmosClient = new CosmosClient({ endpoint, key });
const dbName = "vending-machine";

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
    return user || false;
  }
}

export class CosmosDatabase implements Database {
  async createUser(user: User) {
    try {
      // find user by username and password
      // throw error if user already exists
      const existingUser = await this.getUserByUsername(user.username);
      if (existingUser) {
        throw new Error("User already exists");
      }
      // create user
      const { database } = await cosmosClient.databases.createIfNotExists({
        id: dbName,
      });
      const { container } = await database.containers.createIfNotExists({
        id: "users",
      });
      const { resource: createdUser } = await container.items.create(user);
      return createdUser;
    } catch (error) {
      console.log("Failed to create user because ==>", error);
      throw error;
    }
  }
  async getUserByUsername(username: string) {
    // find user by username
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: dbName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: "users",
    });

    const querySpec = {
      query: "SELECT * from users u WHERE u.username = @username",
      parameters: [
        {
          name: "@username",
          value: username,
        },
      ],
    };
    const { resources: users } = await container.items
      .query<User>(querySpec)
      .fetchAll();
    return users[0];
  }

  async validateUser(username: string, password: string) {
    if (!username || !password) {
      return false;
    }
    // find user by username and password
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: dbName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: "users",
    });
    const querySpec = {
      query: "SELECT * from users u WHERE u.username = @username",
      parameters: [
        {
          name: "@username",
          value: username,
        },
      ],
    };
    const { resources: users } = await container.items
      .query<User>(querySpec)
      .fetchAll();
    if (!users[0]) {
      return false;
    }
    const isValid = await bcrypt.compare(password, users[0].password);
    if (!isValid) {
      return false;
    }
    return users[0];
  }

  async updateUser(user: User): Promise<User | undefined> {
    // find user by username and password
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: dbName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: "users",
    });
    const { resource: updatedUser } = await container
      .item(user.id as string)
      .replace(user);
    return updatedUser;
  }
}
