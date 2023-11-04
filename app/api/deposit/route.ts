// users with a “buyer” role can deposit coins into the machine and make purchases. vending machine should only accept 5, 10, 20, 50 and 100 cent coins

// create deposit route using nextjs
import { CosmosDatabase } from "../db";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

// const db = new MemoryDatabase();
const db = new CosmosDatabase();
const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY";

export async function POST(request: Request) {
  try {
    // validate token
    const token = request.headers.get("Authorization")?.split(" ")[1] || "";
    const tokenData = jwt.verify(token, SECRET_KEY) as {
      username: string;
      role: string;
    };
  
    if (tokenData.role !== "buyer") {
      const response = new Response(
        JSON.stringify({
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response;
    }
    const { amount } = await request.json();
    // validate amount
    if (![5, 10, 20, 50, 100].includes(amount)) {
      const response = new Response(
        JSON.stringify({
          message: "Invalid amount",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response;
    }
    // update user balance
    const user = await db.getUserByUsername(tokenData.username);
    user.availableBalance += amount;
    await db.updateUser(user);
    const response = new Response(
      JSON.stringify({
        message: "Deposit successful",
        availableBalance: user.availableBalance,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error: JsonWebTokenError | any) {
    // check if jwt error
    if (error instanceof JsonWebTokenError) {
      const response = new Response(
        JSON.stringify({
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response;
    }
    // check if error is from cosmosdb
    if (error.code === 409) {
      const response = new Response(
        JSON.stringify({
          message: "Failed to update user",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response;
    }
    // server error
    const response = new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
