import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../lib/db";  

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const user = rows[0];

    // Compare password directly (not secure)
    if (password !== user.password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || "mytemporarysecret"; // Use a fallback secret

const token = jwt.sign(
  { userId: user.id, email: user.email },
  secret,  
  { expiresIn: "1h" }
);


    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Login failed", error: errorMessage }, { status: 500 });
  }
}
