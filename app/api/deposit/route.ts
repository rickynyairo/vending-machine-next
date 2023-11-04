// users with a “buyer” role can deposit coins into the machine and make purchases. vending machine should only accept 5, 10, 20, 50 and 100 cent coins

// create deposit route using nextjs
import { CosmosDatabase } from "../db";
import { NextRequest } from "next/server";

// const db = new MemoryDatabase();
const db = new CosmosDatabase();

export async function POST(request: NextRequest) {
  try {
    const { amount, username, role } = await request.json();
  
    if (role !== "buyer") {
      const response = new Response(
        JSON.stringify({
          message: "Unauthorized role",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response;
    }
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
    const user = await db.getUserByUsername(username);
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
  } catch (error:any) {
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
    return new Response(
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
