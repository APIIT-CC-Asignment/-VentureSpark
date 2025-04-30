import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const [usersResult, servicesResult, bookingsResult, activeUsersResult] = await Promise.all([
      pool.query<RowDataPacket[]>('SELECT COUNT(*) AS totalUsers FROM Users WHERE typegroup <> "Admin"'),
      pool.query<RowDataPacket[]>('SELECT COUNT(*) AS totalServices FROM Vendor'),
      pool.query<RowDataPacket[]>('SELECT COUNT(*) AS totalBookings FROM booking'),
      pool.query<RowDataPacket[]>('SELECT COUNT(*) AS activeUsers FROM Users'),
    ]);

    const totalUsers = usersResult[0][0].totalUsers;
    const totalServices = servicesResult[0][0].totalServices;
    const totalBookings = bookingsResult[0][0].totalBookings;

    const [monthlyStatsResult] = await pool.query<RowDataPacket[]>(`
      SELECT 
        DATE_FORMAT(request_date, '%b %Y') AS month,
        COUNT(DISTINCT id) AS users,
        COUNT(*) AS bookings
      FROM booking
      WHERE request_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(request_date, '%b %Y')
      ORDER BY MIN(request_date)
    `);
    
    const monthlyData = {
      labels: monthlyStatsResult.map(row => row.month),
      users: monthlyStatsResult.map(row => row.users),
      bookings: monthlyStatsResult.map(row => row.bookings),
      revenue: [500, 700, 900, 1200, 1000, 1100], 
    };

   
    const [serviceDistResult] = await pool.query<RowDataPacket[]>(`
      SELECT Requstedservice AS label, COUNT(*) AS count
      FROM booking
      GROUP BY Requstedservice
    `);

    const serviceDistribution = {
      labels: serviceDistResult.map(row => row.label),
      data: serviceDistResult.map(row => row.count),
    };

    // 3. Recent bookings
    const [recentBookingsResult] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, email, request_date, status, Requstedservice, what_you_need, committed
      FROM booking
      ORDER BY request_date DESC
      LIMIT 5
    `);

    const recentBookings = recentBookingsResult.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      request_date: row.request_date,
      status: row.status,
      Requstedservice: row.Requstedservice,
      whatYouNeed: row.what_you_need,
      committed: row.committed,
    }));

    const stats = {
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue: 0, 
      monthlyData,
      serviceDistribution,
      recentBookings,
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
