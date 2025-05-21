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
    console.log("[getServices] Fetching services...");

    // Clear query cache to ensure we get the latest data
    await pool.execute('SELECT 1');

    // First try to get all vendors with non-empty service_name
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT v.id, v.service_name, v.type, v.expertise_in, v.selected_services, v.years_of_excellence, " +
      "u.username, u.email FROM Vendor v LEFT JOIN users u ON v.id = u.id " +
      "WHERE v.service_name IS NOT NULL AND v.service_name != '' " +
      "ORDER BY v.updated_at DESC"
    );

    console.log(`[getServices] Found ${rows?.length || 0} vendors with service names`);

    // If no services found with service_name, get all vendors
    if (!rows || rows.length === 0) {
      console.log("[getServices] No vendors found with service names, getting all vendors");

      const [allVendors] = await pool.query<RowDataPacket[]>(
        "SELECT v.id, v.service_name, v.type, v.expertise_in, v.selected_services, v.years_of_excellence, " +
        "u.username, u.email FROM Vendor v LEFT JOIN users u ON v.id = u.id " +
        "ORDER BY v.updated_at DESC LIMIT 20"
      );

      console.log(`[getServices] Found ${allVendors?.length || 0} total vendors`);

      if (allVendors && allVendors.length > 0) {
        const consultants: Consultant[] = allVendors.map((row) => ({
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
      console.log("[getServices] No vendors found in Vendor table, checking users table");
      const [userRows] = await pool.query<RowDataPacket[]>(
        "SELECT id, username, email FROM users WHERE typegroup = 'vendor' LIMIT 20"
      );

      if (userRows && userRows.length > 0) {
        const consultants: Consultant[] = userRows.map((row) => ({
          id: row.id?.toString() || '',
          name: row.username || 'Service Provider',
          type: 'Services' as ConsultantTypeServices,
          selectedservice: 'General Services',
          description: 'Professional vendor services',
          years_of_excellence: '1',
        }));

        console.log(`[getServices] Returning ${consultants.length} users as services`);
        return NextResponse.json(consultants);
      }

      // If still nothing, return empty array
      return NextResponse.json([]);
    }

    // If we have vendors with service_name, format and return them
    const consultants: Consultant[] = rows.map((row) => {
      // Ensure we have a valid service name
      const name = row.service_name || row.username || 'Service Provider';

      // Parse selected_services if it's a JSON string
      let selectedServices = row.selected_services || '';
      if (selectedServices && typeof selectedServices === 'string') {
        try {
          // If it's a JSON array, convert to comma-separated string
          if (selectedServices.startsWith('[')) {
            const parsed = JSON.parse(selectedServices);
            if (Array.isArray(parsed)) {
              selectedServices = parsed.join(', ');
            }
          }
        } catch (e) {
          console.log(`[getServices] Error parsing selected_services for vendor ${row.id}:`, e);
        }
      }

      return {
        id: row.id?.toString() || '',
        name: name,
        type: 'Services' as ConsultantTypeServices,
        selectedservice: selectedServices,
        description: row.expertise_in || 'Professional services',
        years_of_excellence: row.years_of_excellence?.toString() || '1',
      };
    });

    console.log(`[getServices] Returning ${consultants.length} services`);
    return NextResponse.json(consultants);
  } catch (error) {
    console.error("Error fetching services:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    // Return an empty array instead of an error to prevent breaking the UI
    console.log("[getServices] Returning empty array due to error:", errorMessage);
    return NextResponse.json([]);
  }
}



