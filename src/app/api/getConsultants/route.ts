import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../lib/db";
import { RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';
import pool from '../../lib/db';

// Consultant type definition
type ConsultantType = 'finance' | 'legal' | 'business' | '';
type Consultant = {
  id: string;
  name: string;
  type: ConsultantType;
  description: string;
};

export async function POST(req: Request) {
  try {
   

    const [existingUser] = await pool.query<RowDataPacket[]>(
     "SELECT id, service_name, type, expertise_in FROM Vendor"
    );

    const consultants: Consultant[] = existingUser.map((row) => ({
      id: row.id,
      name: row.service_name,
      type: row.type,
      description: row.expertise_in,
    }));
    return NextResponse.json(consultants);
  } catch (error) {
    console.error("Error fetching consultants:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch consultants", error: errorMessage },
      { status: 500 }
    );
  }
}



