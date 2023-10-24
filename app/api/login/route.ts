// create login route using nextjs
import { MemoryDatabase } from "../db";
import jwt from "jsonwebtoken";

const db = new MemoryDatabase();

export async function POST(request: Request) {
  const { username, password } = await request.json();
  // validate user
  const user = await db.validateUser(username, password);
  if (!user) {
    const response = new Response(
      JSON.stringify({
        message: "Invalid credentials",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  }
  const options: jwt.SignOptions = {
    algorithm: "HS256",
    expiresIn: "1d",
  };

  // create token
  const token = jwt.sign({ username, role: user.role }, "SECRET_KEY", options);

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
}
