import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
import pool from "../../lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const user = result.rows[0];
    console.log(`[loginpage] User found:`, {
      id: user.id,
      email: user.email,
      typegroup: user.typegroup
    });

    // Compare password directly (not secure)
    if (password !== user.password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || "mytemporarysecret"; // Use a fallback secret

    const token = jwt.sign(
      { userId: user.id, email: user.email, typegroup: user.typegroup },
      secret,
      { expiresIn: "1h" }
    );

    // Get username to store in response
    const username = user.username || "";

    // For vendor accounts, ensure we have the vendor ID
    let vendorId = user.id;
    if (user.typegroup === 'vendor') {
      // Check if there's a record in the Vendor table
      try {
        // FIX: Remove array destructuring, use .rows property
        const vendorResult = await pool.query(
          "SELECT id FROM vendor WHERE id = $1 OR email = $2",
          [user.id, user.email]
        );

        // If found, use that ID
        if (vendorResult.rows && vendorResult.rows.length > 0) {
          vendorId = vendorResult.rows[0].id;
          console.log(`[loginpage] Found vendor record with ID: ${vendorId}`);
        } else {
          console.log(`[loginpage] No vendor record found, using user ID: ${vendorId}`);
        }
      } catch (error) {
        console.error("[loginpage] Error looking up vendor:", error);
      }
    }

    console.log(`[loginpage] Login successful:`, {
      userId: user.id,
      email: user.email,
      typegroup: user.typegroup,
      vendorId: vendorId,
      username: username
    });

    // Return user information including typegroup and vendorId
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username,
        typegroup: user.typegroup,
        vendorId: vendorId.toString()
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}