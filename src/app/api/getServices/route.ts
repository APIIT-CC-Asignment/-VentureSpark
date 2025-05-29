import { NextResponse } from 'next/server';
import pool from '../../lib/db';

// Consultant type definition
type ConsultantTypeServices = 'Services';

interface Consultant {
  id: string;
  name: string;
  type: ConsultantTypeServices;
  selectedservice: string;
  description: string;
  years_of_excellence: string;
}

export async function POST(req: Request) {
  try {
    console.log("[getServices] Fetching services...");

    // First try to get all vendors with non-empty service_name
    const result = await pool.query(
      "SELECT v.id, v.service_name, v.type, v.expertise_in, v.selected_services, v.years_of_excellence, " +
      "u.username, u.email FROM vendor v LEFT JOIN users u ON v.id = u.id " +
      "WHERE v.service_name IS NOT NULL AND v.service_name != '' " +
      "ORDER BY v.updated_at DESC"
    );

    console.log(`[getServices] Found ${result.rows?.length || 0} vendors with service names`);

    // If no services found with service_name, get all vendors
    if (!result.rows || result.rows.length === 0) {
      console.log("[getServices] No vendors found with service names, getting all vendors");

      const allVendorsResult = await pool.query(
        "SELECT v.id, v.service_name, v.type, v.expertise_in, v.selected_services, v.years_of_excellence, " +
        "u.username, u.email FROM vendor v LEFT JOIN users u ON v.id = u.id " +
        "ORDER BY v.updated_at DESC LIMIT 20"
      );

      console.log(`[getServices] Found ${allVendorsResult.rows?.length || 0} total vendors`);

      if (allVendorsResult.rows && allVendorsResult.rows.length > 0) {
        const consultants: Consultant[] = allVendorsResult.rows.map((row) => ({
          id: row.id?.toString() || '',
          name: row.service_name || row.username || 'Service Provider',
          type: 'Services' as ConsultantTypeServices, // Force type for display
          selectedservice: row.selected_services || '',
          description: row.expertise_in || 'Professional services',
          years_of_excellence: row.years_of_excellence?.toString() || '1',
        }));

        console.log(`[getServices] Returning ${consultants.length} vendors as services`);
        return NextResponse.json(consultants);
      }

      // If still no vendors, query the users table directly
      console.log("[getServices] No vendors found in vendor table, checking users table");
      const userResult = await pool.query(
        "SELECT id, username, email FROM users WHERE typegroup = 'vendor' LIMIT 20"
      );

      if (userResult.rows && userResult.rows.length > 0) {
        const consultants: Consultant[] = userResult.rows.map((row) => ({
          id: row.id?.toString() || '',
          name: row.username || 'Service Provider',
          type: 'Services' as ConsultantTypeServices,
          selectedservice: '',
          description: 'Professional services',
          years_of_excellence: '1',
        }));

        console.log(`[getServices] Returning ${consultants.length} users as services`);
        return NextResponse.json(consultants);
      }
    }

    const consultants: Consultant[] = result.rows.map((row) => ({
      id: row.id?.toString() || '',
      name: row.service_name || row.username || 'Service Provider',
      type: 'Services' as ConsultantTypeServices,
      selectedservice: row.selected_services || '',
      description: row.expertise_in || 'Professional services',
      years_of_excellence: row.years_of_excellence?.toString() || '1',
    }));

    console.log(`[getServices] Returning ${consultants.length} services`);
    return NextResponse.json(consultants);
  } catch (error) {
    console.error("Error fetching services:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch services", error: errorMessage },
      { status: 500 }
    );
  }
}



