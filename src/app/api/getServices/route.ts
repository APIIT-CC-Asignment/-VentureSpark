import { NextResponse } from 'next/server';
import pool from '../../lib/db';

interface Service {
  id: string;
  name: string;
  type: 'Services';
  selectedservice: string;
  description: string;
  years_of_excellence: string;
}

export async function GET(req: Request) {
  try {
    console.log("[getServices] Starting services fetch...");

    let result;

    // Get all active vendors and convert them to services
    try {
      console.log("[getServices] Fetching all vendors for services...");
      result = await pool.query(
        `SELECT v.id, v.service_name, v.type, v.expertise_in, v.selected_services, 
                v.years_of_excellence, v.years_in_business, v.email, u.username 
         FROM vendor v 
         LEFT JOIN users u ON v.id = u.id 
         WHERE v.active = true
         ORDER BY v.created_at DESC`
      );
      console.log(`[getServices] Found ${result.rows.length} active vendors for services`);
    } catch (error) {
      console.error("[getServices] Error fetching vendors for services:", error);
    }

    // Fallback to users table if needed
    if (!result || result.rows.length === 0) {
      console.log("[getServices] No vendors found, trying users table for services...");

      try {
        result = await pool.query(
          `SELECT id, username, email, 'Services' as type, '' as expertise_in, 
                  '' as selected_services, 1 as years_of_excellence
           FROM users 
           WHERE typegroup = 'vendor' 
           ORDER BY createdat DESC`
        );
        console.log(`[getServices] Found ${result.rows.length} vendor users for services`);
      } catch (error) {
        console.error("[getServices] Error with users query for services:", error);
      }
    }

    // Process results if we have any
    if (result && result.rows.length > 0) {
      console.log("[getServices] Processing services results...");

      const services: Service[] = result.rows.map((row, index) => {
        // Create service name from available data
        let serviceName = '';
        if (row.service_name && row.service_name.trim() && row.service_name !== 'New Vendor') {
          serviceName = row.service_name;
        } else if (row.username && row.username.trim()) {
          serviceName = `${row.username}'s Professional Services`;
        } else {
          serviceName = `Professional Service Provider ${index + 1}`;
        }

        // Process selected services
        let selectedServices = '';
        if (row.selected_services && row.selected_services !== '[]' && row.selected_services.trim()) {
          try {
            const parsed = JSON.parse(row.selected_services);
            if (Array.isArray(parsed) && parsed.length > 0) {
              selectedServices = parsed.join(', ');
            }
          } catch (e) {
            // If JSON parsing fails, use as string
            selectedServices = row.selected_services;
          }
        }

        // Default services if none specified
        if (!selectedServices) {
          selectedServices = 'Business Consulting, Strategic Planning, Growth Advisory, Market Analysis';
        }

        // Create description
        let description = '';
        if (row.expertise_in && row.expertise_in.trim() && row.expertise_in !== 'To be updated') {
          description = row.expertise_in;
        } else {
          description = 'Comprehensive business services and professional consulting to help your startup succeed and grow.';
        }

        // Get years of excellence
        let yearsOfExcellence = '1';
        if (row.years_of_excellence && row.years_of_excellence > 0) {
          yearsOfExcellence = row.years_of_excellence.toString();
        } else if (row.years_in_business && row.years_in_business > 0) {
          yearsOfExcellence = row.years_in_business.toString();
        }

        const service: Service = {
          id: row.id?.toString() || `service_${index}`,
          name: serviceName,
          type: 'Services',
          selectedservice: selectedServices,
          description: description,
          years_of_excellence: yearsOfExcellence
        };

        console.log(`[getServices] Processed service ${index + 1}:`, service);
        return service;
      });

      console.log(`[getServices] Successfully returning ${services.length} services`);
      return NextResponse.json(services);
    }

    // If no results found, return empty array
    console.log("[getServices] No services found, returning empty array");
    return NextResponse.json([]);

  } catch (error) {
    console.error("[getServices] Critical error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        message: "Failed to fetch services",
        error: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}