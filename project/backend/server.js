import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Register API Server is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, phone, created_at`,
      [name, email, hashedPassword, phone]
    );

    console.log('✅ New user registered:', result.rows[0].email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all users (for admin)
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users: result.rows,
      count: result.rowCount
    });

  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});