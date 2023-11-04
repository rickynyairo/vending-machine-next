import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  try {
    // validate token
    const token = request.headers.get("Authorization")?.split(" ")[1] || "";
    const tokenData = jwt.verify(token, SECRET_KEY) as {
      username: string;
      role: string;
    };
    console.log("tokenData ==>", tokenData);
    const response = new NextResponse(
      JSON.stringify({
        username: tokenData.username,
        role: tokenData.role,
        ...request.body
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    return NextResponse.next(response);
  } catch (error: JsonWebTokenError | any) {
    const response = new NextResponse(
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
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/deposit", "/api/products"],
};
