import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import pool from '../../../../../lib/db';  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();

    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if ((existingUser as any[]).length > 0) {
      connection.release();
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert the new user
    await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    connection.release();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
  }
}
