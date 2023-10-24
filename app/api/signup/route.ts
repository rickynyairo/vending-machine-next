// create signup route using nextjs
import { MemoryDatabase } from "../db";
import jwt from "jsonwebtoken";
import { Role, User } from "../types";

const db = new MemoryDatabase();

const validateRole = (role?: string) => {
  return role && (role == Role.BUYER || role == Role.SELLER);
};

export async function POST(request: Request) {
  const user: User = await request.json();
  // validate user

  if (!validateRole(user.role)) {
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

  try {
    const { username, role } = await db.createUser(user);
    const options: jwt.SignOptions = {
      algorithm: "HS256",
      expiresIn: "1d",
    };

    // create token
    const token = jwt.sign({ username, role }, "SECRET_KEY", options);

    const response = new Response(
      JSON.stringify({
        username: user.username,
        role: user.role,
        token,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error: Error | any) {
    console.log(error);
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
