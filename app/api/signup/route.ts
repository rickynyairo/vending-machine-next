// create signup route using nextjs
import { CosmosDatabase } from "../db";
import jwt from "jsonwebtoken";
import { Role, User } from "../types";
import bcrypt from "bcrypt";

// const db = new MemoryDatabase();
const db = new CosmosDatabase();
const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY";

const validateRole = (role?: string) => {
  return role == undefined || role == Role.BUYER || role == Role.SELLER;
};

export async function POST(request: Request) {
  const { username, password, role } = await request.json();
  // validate role
  if (!validateRole(role)) {
    const response = new Response(
      JSON.stringify({
        message: "Invalid role",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    username,
    password: passwordHash,
    role: role || Role.BUYER,
  };

  try {
    const { username, role } = (await db.createUser(user)) as User;
    const options: jwt.SignOptions = {
      algorithm: "HS256",
      expiresIn: "1d",
    };

    // create token
    const token = jwt.sign({ username, role }, SECRET_KEY, options);

    const response = new Response(
      JSON.stringify({ username, role, token }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error: Error | any) {
    const response = new Response(
      JSON.stringify({
        error: "Failed to create user",
        error_message: error.message,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  }
}
