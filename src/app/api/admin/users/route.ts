import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

type User = {
  id: string;
  username: string;
  email: string;
  typegroup: string;
  createdAt: Date;
};

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, username, email, typegroup, created_at FROM users ORDER BY created_at DESC"
    );

    const users: User[] = result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      email: row.email,
      typegroup: row.typegroup,
      createdAt: row.created_at
    }));

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch users", error: errorMessage },
      { status: 500 }
    );
  }
}
