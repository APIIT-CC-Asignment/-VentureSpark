import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';
import pool from '../../lib/db';

// Consultant type definition
type ConsultantTypeServices = 'Services';
type Consultant = {
  id: string;
  name: string;
  type: ConsultantTypeServices;
  selectedservice: string;
  description: string;
    years_of_excellence: string;
};

export async function POST(req: Request) {
  try {
   

    const [existingUser] = await pool.query<RowDataPacket[]>(
     "SELECT id, service_name, type, expertise_in,selected_services,years_of_excellence FROM Vendor WHERE type = 'Services'"
    );

    const consultants: Consultant[] = existingUser.map((row) => ({
      id: row.id,
      name: row.service_name,
      type: row.type,
      selectedservice: row.selected_services,
      description: row.expertise_in,
        years_of_excellence: row.years_of_excellence,
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



