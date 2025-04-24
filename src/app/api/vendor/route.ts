// import { NextResponse } from "next/server";
// import pool from "../../lib/db";
// import { RowDataPacket } from "mysql2";

// export async function POST(req: Request) {
//   try {
//     const { username, email, password } = await req.json();

//     if (!username || !email || !password) {
//       return NextResponse.json(
//         { message: "All fields are required!" },
//         { status: 400 }
//       );
//     }

//     const [existingUser] = await pool.query<RowDataPacket[]>(
//       "SELECT username FROM users WHERE email = ?",
//       [email]
//     );

//     if (existingUser.length > 0) {
//       return NextResponse.json(
//         { message: `User already registered as ${existingUser[0].username}` },
//         { status: 409 } 
//       );
//     }

//     await pool.query(
//       "INSERT INTO users (username, email, password,typegroup) VALUES (?, ?, ?,?)",
//       [username, email, password,'vendor']
//     );

//     return NextResponse.json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json(
//       { message: "Registration failed", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT service_name, email, type, expertise_in FROM Vendor WHERE active = 'pending'"
    );

    if (!Array.isArray(rows)) {
      return NextResponse.json([], { status: 200 }); // ✅ Ensure it's always an array
    }

    return NextResponse.json(rows); // ✅ guaranteed to be an array
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { message: "Failed to fetch vendors", error: String(error) },
      { status: 500 }
    );
  }
}