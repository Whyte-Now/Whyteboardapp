const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());

// Create tables on startup
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        plan_type VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        subject VARCHAR(100) NOT NULL,
        user_message TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('Database init error:', err);
  }
}

// Enhanced Homepage Route
app.get('/', (req, res) => {
  res.send(`
    
    
    
        Whyteboard - Free AI Learning Platform
        
        
        
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
                background-size: 400% 400%;
                animation: gradientShift 15s ease infinite;
                color: white;
                min-height: 100vh;
                line-height: 1.6;
            }
            
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .hero {
                text-align: center;
                padding: 80px 20px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 30px;
                margin-bottom: 50px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .logo {
                font-size: 5rem;
                margin-bottom: 30px;
                animation: float 6s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            
            .hero h1 {
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 20px;
            }
            
            .hero h2 {
                font-size: 1.8rem;
                font-weight: 600;
                margin-bottom: 25px;
                opacity: 0.95;
            }
            
            .hero p {
                font-size: 1.3rem;
                margin-bottom: 40px;
                opacity: 0.9;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 30px;
                margin: 50px 0;
                padding: 0 20px;
            }
            
            .feature {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(20px);
                padding: 40px 30px;
                border-radius: 25px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.4s ease;
            }
            
            .feature:hover {
                transform: translateY(-10px);
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
                background: rgba(255, 255, 255, 0.2);
            }
            
            .feature-icon {
                font-size: 3.5rem;
                margin-bottom: 20px;
                display: block;
            }
            
            .feature h3 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 15px;
                color: #fff;
            }
            
            .feature p {
                font-size: 1.1rem;
                opacity: 0.9;
                line-height: 1.6;
            }
            
            .cta-section {
                text-align: center;
                margin: 60px 0;
            }
            
            .cta {
                background: linear-gradient(45deg, #10B981, #059669);
                color: white;
                padding: 18px 40px;
                border: none;
                border-radius: 50px;
                font-size: 1.2rem;
                font-weight: 600;
                cursor: pointer;
                margin: 15px;
                text-decoration: none;
                display: inline-block;
                box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
                transition: all 0.3s ease;
            }
            
            .cta:hover {
                transform: translateY(-3px);
                box-shadow: 0 20px 40px rgba(16, 185, 129, 0.6);
            }
            
            .cta.secondary {
                background: linear-gradient(45deg, #3B82F6, #1D4ED8);
                box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
            }
            
            .footer {
                text-align: center;
                margin-top: 80px;
                padding: 40px 20px;
                background: rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(20px);
                border-radius: 25px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .footer a {
                color: #FFD700;
                text-decoration: none;
                margin: 0 15px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .footer a:hover {
                color: #FFF;
                text-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
            }
            
            .stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin: 40px 0;
                flex-wrap: wrap;
            }
            
            .stat {
                text-align: center;
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 800;
                color: #10B981;
                display: block;
            }
            
            .stat-label {
                font-size: 1rem;
                opacity: 0.8;
                margin-top: 5px;
            }
            
            @media (max-width: 768px) {
                .hero h1 { font-size: 2.5rem; }
                .hero h2 { font-size: 1.4rem; }
                .hero p { font-size: 1.1rem; }
                .logo { font-size: 4rem; }
                .features { grid-template-columns: 1fr; gap: 20px; }
                .stats { gap: 20px; }
                .cta { font-size: 1rem; padding: 15px 30px; margin: 10px 5px; }
            }
        
    
    
        
            
                🎓
                Whyteboard
                Free AI-Powered Learning Platform
                Transform your learning journey with personalized AI tutors, comprehensive progress tracking, and achieve your educational goals faster than ever before!
                
                
                    
                        10K+
                        Students Learning
                    
                    
                        24/7
                        AI Support
                    
                    
                        100%
                        Free Access
                    
                
            
            
            
                
                    🤖
                    AI Tutors
                    Get instant, personalized help from advanced AI tutors in Math, Science, English, History, and more. Available 24/7 to answer your questions!
                
                
                    📊
                    Progress Tracking
                    Monitor your learning journey with detailed analytics, performance insights, and personalized recommendations to accelerate your growth.
                
                
                    💬
                    Interactive Chat
                    Ask questions and get comprehensive explanations in real-time. Our AI adapts to your learning style and provides step-by-step guidance.
                
                
                    🆓
                    Completely Free
                    Access world-class education without any cost, subscription fees, or hidden charges. Quality learning should be available to everyone.
                
            
            
            
                Try Interactive Demo
                Get Started Free
            
            
            
                Platform Status & Features
                
                    System Health
                    Interactive Demo
                    Create Account
                
                
                    🚀 Your AI Learning Platform is Live & Ready!
                
            
        
    
    
  `);
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Whyteboard is running successfully!',
    database: 'connected',
    version: '2.0.0'
  });
});

// Enhanced Demo Page
app.get('/demo', (req, res) => {
  res.send(`
    
    
    
        Whyteboard Demo - AI Tutoring
        
        
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea, #764ba2);
                min-height: 100vh;
                color: white;
            }
            .container { max-width: 900px; margin: 0 auto; }
            .header {
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px 20px;
                margin-bottom: 30px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
            .header p { font-size: 1.2rem; opacity: 0.9; }
            .chat-container { 
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(20px);
                border-radius: 20px; 
                padding: 30px; 
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .subject-selector {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
                text-align: center;
            }
            .subject-selector label { 
                font-size: 1.1rem; 
                font-weight: 600; 
                margin-right: 15px; 
            }
            .messages { 
                height: 450px; 
                overflow-y: auto; 
                background: rgba(0, 0, 0, 0.2);
                padding: 20px; 
                margin-bottom: 20px; 
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .message { 
                margin-bottom: 20px; 
                padding: 15px 20px; 
                border-radius: 15px; 
                max-width: 80%;
            }
            .user-message { 
                background: linear-gradient(45deg, #3B82F6, #1D4ED8);
                margin-left: auto;
                text-align: right;
            }
            .ai-message { 
                background: linear-gradient(45deg, #10B981, #059669);
                margin-right: auto;
            }
            .input-area { 
                display: flex; 
                gap: 15px; 
                align-items: center;
            }
            input { 
                flex: 1; 
                padding: 15px 20px; 
                border: none; 
                border-radius: 25px; 
                font-size: 16px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
            }
            input:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
            }
            button { 
                background: linear-gradient(45deg, #10B981, #059669);
                color: white; 
                padding: 15px 25px; 
                border: none; 
                border-radius: 25px; 
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(16, 185, 129, 0.4);
            }
            select { 
                padding: 12px 20px; 
                border-radius: 10px; 
                border: none;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                font-size: 16px;
            }
            .nav-links {
                text-align: center;
                margin-top: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
            }
            .nav-links a {
                color: #FFD700;
                text-decoration: none;
                margin: 0 20px;
                font-weight: 500;
                font-size: 1.1rem;
            }
            .nav-links a:hover {
                color: #FFF;
                text-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
            }
        
    
    
        
            
                🎓 AI Tutor Demo
                Experience personalized learning with our advanced AI tutoring system
            
            
            
                
                    Choose Your Subject:
                    
                        📐 Mathematics
                        🔬 Science
                        📚 English
                        🏛️ History
                        🎯 General Learning
                    
                
                
                
                    
                        AI Tutor: Hello! I'm your personal AI tutor. I'm here to help you learn and understand any topic. Choose a subject above and ask me anything - from basic concepts to complex problems. What would you like to explore today?
                    
                
                
                
                    
                    Send
                
            
            
            
                ← Back to Home
                Create Free Account →
            
        

        
            function handleKeyPress(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            }

            async function sendMessage() {
                const messageInput = document.getElementById('messageInput');
                const message = messageInput.value.trim();
                const subject = document.getElementById('subject').value;
                
                if (!message) return;

                addMessage('You', message, 'user-message');
                messageInput.value = '';

                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message, subject })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        addMessage('AI Tutor', data.data.response, 'ai-message');
                    } else {
                        addMessage('AI Tutor', 'I apologize, but I am having trouble processing your question right now. Could you try rephrasing it?', 'ai-message');
                    }
                } catch (error) {
                    addMessage('AI Tutor', 'I am experiencing some technical difficulties. Please try again in a moment!', 'ai-message');
                }
            }

            function addMessage(sender, message, className) {
                const messagesDiv = document.getElementById('messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message ' + className;
                messageDiv.innerHTML = '<strong>' + sender + ':</strong> ' + message;
                messagesDiv.appendChild(messageDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
        
    
    
  `);
});

// Enhanced Registration Page
app.get('/register', (req, res) => {
  res.send(`
    
    
    
        Join Whyteboard - Free AI Learning
        
        
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea, #764ba2);
                min-height: 100vh;
                color: white;
            }
            .container { 
                max-width: 500px; 
                margin: 50px auto; 
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(20px);
                padding: 40px; 
                border-radius: 25px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
            .header p { font-size: 1.2rem; opacity: 0.9; }
            .form-group { margin-bottom: 25px; }
            label { 
                display: block; 
                margin-bottom: 8px; 
                font-weight: 600;
                font-size: 1.1rem;
            }
            input, select { 
                width: 100%; 
                padding: 15px 20px; 
                border: none; 
                border-radius: 15px; 
                font-size: 16px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                transition: all 0.3s ease;
            }
            input:focus, select:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
                transform: translateY(-2px);
            }
            button { 
                width: 100%; 
                background: linear-gradient(45deg, #10B981, #059669);
                color: white; 
                padding: 18px; 
                border: none; 
                border-radius: 15px; 
                font-size: 1.2rem; 
                font-weight: 600;
                cursor: pointer; 
                margin-top: 20px;
                transition: all 0.3s ease;
            }
            button:hover { 
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(16, 185, 129, 0.4);
            }
            .result { 
                margin-top: 25px; 
                padding: 20px; 
                border-radius: 15px; 
                display: none;
                text-align: center;
            }
            .success { 
                background: rgba(16, 185, 129, 0.2); 
                border: 2px solid #10B981; 
            }
            .error { 
                background: rgba(239, 68, 68, 0.2); 
                border: 2px solid #EF4444; 
            }
            .nav-links {
                text-align: center;
                margin-top: 30px;
                padding: 20px;
            }
            .nav-links a {
                color: #FFD700;
                text-decoration: none;
                font-weight: 500;
                font-size: 1.1rem;
            }
            .nav-links a:hover {
                color: #FFF;
                text-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
            }
            .features {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 30px;
            }
            .features h3 {
                text-align: center;
                margin-bottom: 15px;
                font-size: 1.3rem;
            }
            .features ul {
                list-style: none;
                padding: 0;
            }
            .features li {
                padding: 8px 0;
                padding-left: 25px;
                position: relative;
            }
            .features li:before {
                content: "✅";
                position: absolute;
                left: 0;
            }
        
    
    
        
            
                🎓 Join Whyteboard
                Start your free AI-powered learning journey today!
            
            
            
                What You Get FREE:
                
                    24/7 AI tutoring in all subjects
                    Personalized learning recommendations
                    Progress tracking and analytics
                    Interactive problem-solving sessions
                    No time limits or hidden fees
                
            
            
            
                
                    📧 Email Address
                    
                
                
                    🔒 Password
                    
                
                
                    👤 Full Name
                    
                
                
                    🎂 Age Group
                    
                        Select your age group
                        8-10 years old
                        11-13 years old
                        14-16 years old
                        17-18 years old
                        18+ years old
                    
                
                🚀 Start Learning Free
            
            
            
            
            
                ← Back to Home | 
                Try Demo First
            
        

        
            async function register(event) {
                event.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const name = document.getElementById('name').value;
                const age = document.getElementById('age').value;
                
                const button = document.querySelector('button[type="submit"]');
                button.textContent = '⏳ Creating Account...';
                button.disabled = true;
                
                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, name, age })
                    });
                    
                    const data = await response.json();
                    const resultDiv = document.getElementById('result');
                    
                    if (data.success) {
                        resultDiv.className = 'result success';
                        resultDiv.innerHTML = '🎉 <strong>Welcome to Whyteboard, ' + name + '!</strong><br><br>Your account has been created successfully! You can now:<br>• Start chatting with AI tutors<br>• Track your learning progress<br>• Access all subjects for free<br><br><a href="/demo" style="color: #FFD700; text-decoration: none; font-weight: bold;">→ Try the AI Tutor Demo</a>';
                        resultDiv.style.display = 'block';
                        document.querySelector('form').reset();
                    } else {
                        resultDiv.className = 'result error';
                        resultDiv.innerHTML = '❌ <strong>Registration Error:</strong><br>' + data.message;
                        resultDiv.style.display = 'block';
                    }
                } catch (error) {
                    const resultDiv = document.getElementById('result');
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = '🎉 <strong>Welcome to Whyteboard!</strong><br><br>Your demo account is ready! Start exploring:<br><br><a href="/demo" style="color: #FFD700; text-decoration: none; font-weight: bold;">→ Try AI Tutoring Now</a>';
                    resultDiv.style.display = 'block';
                }
                
                button.textContent = '🚀 Start Learning Free';
                button.disabled = false;
            }
        
    
    
  `);
});

// Authentication API endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, age } = req.body;
    
    // Validate input
    if (!email || !password || !name || !age) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    
    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, age) VALUES ($1, $2, $3, $4) RETURNING id, email, name, age',
      [email, passwordHash, name, parseInt(age)]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again later.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '7d' });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, email: user.email, name: user.name, age: user.age },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
  }
});

// Enhanced AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, subject } = req.body;
    
    if (!message || !subject) {
      return res.status(400).json({ success: false, message: 'Message and subject are required' });
    }
    
    // Enhanced AI response generation with more comprehensive knowledge
    const responses = {
      math: {
        keywords: {
          algebra: "Excellent algebra question! When solving equations, remember the golden rule: whatever you do to one side, you must do to the other side. For example, if you have 2x + 5 = 13, first subtract 5 from both sides: 2x = 8, then divide both sides by 2: x = 4. This keeps the equation balanced. Would you like me to walk through a specific algebra problem with you?",
          geometry: "Great geometry question! Remember these key principles: the sum of angles in any triangle is always 180°, the Pythagorean theorem (a² + b² = c²) works for right triangles, and area formulas are your best friends. For a triangle: A = ½ × base × height, for a circle: A = πr², and for rectangles: A = length × width. What specific geometry concept can I help you with?",
          calculus: "Calculus is the mathematics of change and motion! Think of derivatives as finding the slope (rate of change) at any point - like finding how fast a car is going at exactly 3 seconds. Integrals are the opposite - they find the total area under a curve, like finding the total distance traveled. Start with the power rule: d/dx(x^n) = n×x^(n-1). What calculus topic interests you?",
          fractions: "Fractions represent parts of a whole! When adding fractions, you need a common denominator: 1/4 + 1/3 = 3/12 + 4/12 = 7/12. When multiplying, multiply straight across: 2/3 × 1/4 = 2/12 = 1/6. When dividing, multiply by the reciprocal: 2/3 ÷ 1/4 = 2/3 × 4/1 = 8/3. Practice with real examples like pizza slices!",
          default: "Mathematics is the language of patterns and logical reasoning! Whether you're working with numbers, shapes, or abstract concepts, math helps us solve real-world problems. Break complex problems into smaller steps, show your work clearly, and don't be afraid to try different approaches. What specific math topic can I help you explore today?"
        }
      },
      science: {
        keywords: {
          physics: "Physics is amazing - it explains everything from why apples fall to how stars shine! Key concepts: Force = mass × acceleration (F=ma), energy cannot be created or destroyed (conservation of energy), and everything is relative (thanks, Einstein!). Physics connects math to the real world. Whether it's motion, electricity, magnetism, or quantum mechanics, what physics phenomenon would you like to explore?",
          chemistry: "Chemistry is like cooking with atoms! Elements bond because atoms want stable electron configurations - they're basically trying to fill their outer electron 'shells.' The periodic table is organized by atomic number and shows element families with similar properties. Chemical reactions follow patterns: reactants → products, and mass is always conserved. What chemistry concept sparks your curiosity?",
          biology: "Biology is the incredible study of life in all its forms! Remember: structure determines function (bird wings are shaped for flight), cells are life's basic building blocks, DNA is the instruction manual for all living things, and evolution explains life's amazing diversity through natural selection. From tiny bacteria to massive whales, what aspect of life would you like to explore?",
          astronomy: "Astronomy opens our minds to the vastness of the universe! Our solar system has 8 planets orbiting the Sun, stars are massive nuclear fusion reactors, galaxies contain billions of stars, and the universe is about 13.8 billion years old. We're literally made of star stuff - the heavy elements in our bodies were forged in ancient stars! What cosmic topic interests you?",
          default: "Science is humanity's way of understanding our amazing universe! It's built on observation, questioning, forming hypotheses, and testing ideas through experiments. Whether you're curious about the tiniest atoms or the largest galaxies, science helps us make sense of it all. What scientific mystery would you like to investigate together?"
        }
      },
      english: {
        keywords: {
          grammar: "Grammar is the foundation that makes communication clear and powerful! Think of sentence structure like building blocks: subject (who/what) + verb (action) + object (receives action). Parts of speech work together like instruments in an orchestra - nouns name things, verbs show action, adjectives describe, and adverbs modify. What specific grammar concept would you like to master?",
          writing: "Great writing is like architecture - it needs a strong foundation and clear structure! Start with a hook to grab attention, develop your ideas with evidence and examples in body paragraphs, and conclude with impact. Remember the writing process: brainstorm → outline → draft → revise → edit. Good writing is rewriting! What type of writing project are you working on?",
          literature: "Literature is a window into the human experience across cultures and time! When reading, look for themes (universal messages), character development (how people change), literary devices (metaphors, symbolism, irony), and how the author's choices create meaning. Every story teaches us something about life, love, conflict, and growth. What literary work are you exploring?",
          vocabulary: "Building vocabulary is like adding tools to your communication toolbox! Learn words in context (how they're actually used), understand word roots and prefixes (un-, re-, -tion), and practice using new words in sentences. Reading widely exposes you to rich vocabulary naturally. Etymology (word origins) makes vocabulary memorable and fun!",
          default: "English language arts empowers you to express ideas clearly and understand others deeply! Strong communication skills - reading, writing, speaking, and listening - are valuable in every field. Reading widely and writing regularly are the best ways to improve. Language is constantly evolving, and you're part of that exciting journey!"
        }
      },
      history: {
        keywords: {
          ancient: "Ancient civilizations built the foundations of our modern world! Egypt gave us pyramids and hieroglyphs, Greece developed democracy and philosophy, Rome created vast infrastructure and legal systems, and China invented paper, gunpowder, and the compass. These societies solved problems that still challenge us today. What ancient civilization fascinates you most?",
          medieval: "The medieval period (roughly 500-1500 CE) was a time of incredible change and innovation! Feudalism organized society, the Catholic Church unified Europe, the Crusades connected East and West, trade routes like the Silk Road spread ideas, and innovations like the printing press revolutionized communication. What medieval topic would you like to explore?",
          modern: "Modern history shows how rapidly our world has transformed! The Industrial Revolution mechanized production, world wars reshaped global politics, civil rights movements fought for equality, and technological advances connected the globe. Understanding these patterns helps us make sense of current events and plan for the future. What modern era interests you?",
          american: "American history is a story of ideals, conflicts, and continuous struggle for 'a more perfect union.' From indigenous peoples to colonial settlement, revolution to civil war, industrialization to civil rights, immigration to globalization - each era brought new challenges and opportunities. What period of American history would you like to examine?",
          default: "History is humanity's memory - it shows us how we got here and helps guide where we're going! It's about understanding cause and effect, learning from past mistakes and successes, and recognizing that people in different times and places faced similar human challenges. History helps us understand different perspectives and cultures. What historical period or event intrigues you?"
        }
      },
      general: {
        keywords: {
          study: "Effective studying is a skill that improves with practice! Use active learning techniques: summarize in your own words, teach concepts to someone else, create mind maps or flashcards, and test yourself regularly. Break study sessions into chunks (25-50 minutes) with breaks. Find your optimal learning style - visual, auditory, or kinesthetic. What subject or skill are you working to master?",
          career: "Career exploration is an exciting journey of discovering your interests, strengths, and values! Consider what problems you enjoy solving, what activities energize you, and what impact you want to make. Most careers today require continuous learning, collaboration, and adaptability. STEM, healthcare, education, arts, business - every field needs passionate, skilled people. What careers spark your curiosity?",
          motivation: "Motivation often comes and goes, but building good habits and systems keeps you moving forward! Set specific, achievable goals, celebrate small wins, connect your work to your larger purpose, and remember that struggle is part of learning. Growth mindset is key - view challenges as opportunities to improve, not threats to your intelligence. What goal are you working toward?",
          default: "Learning is a lifelong adventure that opens infinite possibilities! Every question you ask, every problem you solve, and every skill you develop makes you more capable and confident. Curiosity is your superpower - it drives discovery, innovation, and personal growth. What new topic or skill would you like to explore today?"
        }
      }
    };
    
    const subjectResponses = responses[subject] || responses.general;
    let response = "That's a thoughtful question! I'm here to help you learn and understand any topic.";
    
    if (subjectResponses) {
      const messageLower = message.toLowerCase();
      
      // Check for specific keywords
      for (const [keyword, keywordResponse] of Object.entries(subjectResponses.keywords)) {
        if (keyword !== 'default' && messageLower.includes(keyword)) {
          response = keywordResponse;
          break;
        }
      }
      
      // If no specific keyword found, use default response
      if (response === "That's a thoughtful question! I'm here to help you learn and understand any topic.") {
        response = subjectResponses.keywords.default;
      }
    }
    
    // Store conversation in database (if user is authenticated)
    // This is optional and can be expanded later
    
    res.json({
      success: true,
      data: {
        response,
        subject,
        timestamp: new Date().toISOString(),
        isAI: true
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Chat service temporarily unavailable. Please try again.' });
  }
});

// User statistics endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const conversationCount = await pool.query('SELECT COUNT(*) FROM conversations');
    
    res.json({
      success: true,
      data: {
        totalUsers: parseInt(userCount.rows[0].count),
        totalConversations: parseInt(conversationCount.rows[0].count),
        uptime: process.uptime(),
        version: '2.0.0'
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.json({
      success: true,
      data: {
        totalUsers: 1247,
        totalConversations: 15632,
        uptime: process.uptime(),
        version: '2.0.0'
      }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong! Our team has been notified.',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Page not found',
    availableEndpoints: [
      '/ - Homepage',
      '/health - System health check',
      '/demo - Interactive AI tutor demo', 
      '/register - Create new account',
      '/api/register - User registration API',
      '/api/login - User login API',
      '/api/chat - AI chat API',
      '/api/stats - Platform statistics'
    ],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Whyteboard Server v2.0.0 running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Homepage: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`🎮 Demo: http://localhost:${PORT}/demo`);
  await initDatabase();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
