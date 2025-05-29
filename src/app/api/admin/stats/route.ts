import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    // 1. Total users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // 2. Total services count
    const servicesResult = await pool.query('SELECT COUNT(*) as count FROM vendor');
    const totalServices = parseInt(servicesResult.rows[0].count);

    // 3. Total bookings count
    const bookingsResult = await pool.query('SELECT COUNT(*) as count FROM booking');
    const totalBookings = parseInt(bookingsResult.rows[0].count);

    // 4. Pending bookings count
    const pendingBookingsResult = await pool.query(
      "SELECT COUNT(*) as count FROM booking WHERE status = 'pending'"
    );
    const pendingBookings = parseInt(pendingBookingsResult.rows[0].count);

    // 5. Monthly data
    const monthlyDataResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', request_date) as month,
        COUNT(*) as count
      FROM booking
      GROUP BY DATE_TRUNC('month', request_date)
      ORDER BY month DESC
      LIMIT 12
    `);

    const monthlyData = monthlyDataResult.rows.map(row => ({
      month: row.month,
      count: parseInt(row.count)
    }));

    // 6. Service distribution
    const serviceDistResult = await pool.query(`
      SELECT 
        type as label,
        COUNT(*) as count
      FROM vendor
      GROUP BY type
      ORDER BY count DESC
    `);

    const serviceDistribution = {
      labels: serviceDistResult.rows.map(row => row.label),
      data: serviceDistResult.rows.map(row => parseInt(row.count))
    };

    // 7. Recent bookings
    const recentBookingsResult = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        request_date, 
        status, 
        Requstedservice, 
        what_you_need, 
        committed
      FROM booking
      ORDER BY request_date DESC
      LIMIT 5
    `);

    const recentBookings = recentBookingsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      request_date: row.request_date,
      status: row.status,
      Requstedservice: row.Requstedservice,
      whatYouNeed: row.what_you_need,
      committed: row.committed
    }));

    const stats = {
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue: 0,
      monthlyData,
      serviceDistribution,
      recentBookings,
      pendingBookings
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch stats", error: errorMessage },
      { status: 500 }
    );
  }
}
