'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  data: {
    labels: string[];
    users: number[];
    bookings: number[];
    revenue?: number[];
  };
};

export default function MonthlyStatsBarChart({ data }: Props) {
  const chartData = data.labels.map((label, i) => ({
    month: label,
    Users: data.users[i],
    Bookings: data.bookings[i],
    Revenue: data.revenue ? data.revenue[i] : 0,
  }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Users" fill="#1E3Add" />
          <Bar dataKey="Bookings" fill="#1E3A8A" />
          <Bar dataKey="Revenue" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
