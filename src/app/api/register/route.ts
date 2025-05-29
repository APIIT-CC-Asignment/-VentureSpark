import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT username FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      return NextResponse.json(
        { message: `User already registered as ${result.rows[0].username}` },
        { status: 409 }
      );
    }

    const insertResult = await pool.query(
      "INSERT INTO users (username, email, password, typegroup) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, email, password, 'client']
    );

    return NextResponse.json({
      message: "User registered successfully!",
      userId: insertResult.rows[0].id
    });
  } catch (error) {
    console.error("Registration Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Registration failed", error: errorMessage },
      { status: 500 }
    );
  }
}
