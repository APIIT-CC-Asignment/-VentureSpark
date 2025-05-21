import { NextApiRequest, NextApiResponse } from 'next';
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
    console.log("[getConsultants] Fetching consultants...");

    // Query for consultants (finance, legal, business)
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, service_name, type, expertise_in FROM Vendor WHERE type IN ('finance', 'legal', 'business')"
    );

    console.log(`[getConsultants] Found ${rows.length} consultants`);

    if (rows.length === 0) {
      console.log("[getConsultants] No consultants found, checking for any non-service vendors...");

      // Fallback query
      const [fallbackRows] = await pool.query<RowDataPacket[]>(
        "SELECT id, service_name, type, expertise_in FROM Vendor WHERE type <> 'Services' LIMIT 10"
      );

      console.log(`[getConsultants] Found ${fallbackRows.length} non-service vendors`);

      if (fallbackRows.length > 0) {
        const consultants: Consultant[] = fallbackRows.map((row) => ({
          id: row.id || '',
          name: row.service_name || 'Consultant',
          type: (row.type as ConsultantType) || 'business',
          description: row.expertise_in || 'Professional consultant',
        }));

        console.log(`[getConsultants] Returning ${consultants.length} fallback consultants`);
        return NextResponse.json(consultants);
      }
    }

    const consultants: Consultant[] = rows.map((row) => ({
      id: row.id || '',
      name: row.service_name || 'Consultant',
      type: (row.type as ConsultantType) || 'business',
      description: row.expertise_in || 'Professional consultant',
    }));

    console.log(`[getConsultants] Returning ${consultants.length} consultants`);
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



