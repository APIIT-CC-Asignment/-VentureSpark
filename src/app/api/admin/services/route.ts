
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import pool from '../../../lib/db';


type Service = {
  id: string;
  service_name: string;
  years_of_excellence: string;
  email: string;
  contact_number: string;
  address: string;
  selected_services: string;
  type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  expertise_in: string;
  status: string;
};

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, service_name, years_of_excellence, email, contact_number, address, selected_services, type, active, created_at, updated_at, expertise_in,status FROM vendor"
    );

    const services: Service[] = rows.map((row) => ({
      id: row.id,
      service_name: row.service_name,
      years_of_excellence: row.years_of_excellence,
      email: row.email,
      contact_number: row.contact_number,
      address: row.address,
      selected_services: row.selected_services,
      type: row.type,
      active: row.active === 1, 
      created_at: row.created_at,
      updated_at: row.updated_at,
      expertise_in: row.expertise_in,
      status: row.status,
    }));

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch services", error: errorMessage },
      { status: 500 }
    );
  }
}
