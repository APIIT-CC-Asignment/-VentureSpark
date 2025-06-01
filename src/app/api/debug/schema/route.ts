import pool from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("[schema-debug] Checking database schema...");

        // Check vendor table columns
        const vendorSchema = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'vendor'
        ORDER BY ordinal_position
      `);

        // Check users table columns  
        const usersSchema = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);

        // Sample data from each table
        const vendorSample = await pool.query('SELECT * FROM vendor LIMIT 3');
        const usersSample = await pool.query('SELECT * FROM users WHERE typegroup = \'vendor\' LIMIT 3');

        return NextResponse.json({
            vendorSchema: vendorSchema.rows,
            usersSchema: usersSchema.rows,
            vendorSample: vendorSample.rows,
            usersSample: usersSample.rows
        });

    } catch (error) {
        console.error("[schema-debug] Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}