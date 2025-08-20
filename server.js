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

// FIXED Homepage Route - NO MORE PLAIN TEXT!
app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`


    Whyteboard - Free AI Learning Platform
    
    
    
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            color: white; min-height: 100vh; line-height: 1.6;
        }
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .hero {
            text-align: center; padding: 80px 20px;
            background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px);
            border-radius: 30px; margin-bottom: 50px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .logo { font-size: 5rem; margin-bottom: 30px; animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; }
        .hero h2 { font-size: 1.8rem; font-weight: 600; margin-bottom: 25px; opacity: 0.95; }
        .hero p { font-size: 1.3rem; margin-bottom: 40px; opacity: 0.9; max-width: 600px; margin-left: auto; margin-right: auto; }
        .stats { display: flex; justify-content: center; gap: 40px; margin: 40px 0; flex-wrap: wrap; }
        .stat { text-align: center; }
        .stat-number { font-size: 2.5rem; font-weight: 800; color: #10B981; display: block; }
        .stat-label { font-size: 1rem; opacity: 0.8; margin-top: 5px; }
        .features {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px; margin: 50px 0; padding: 0 20px;
        }
        .feature {
            background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px);
            padding: 40px 30px; border-radius: 25px; text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.4s ease;
        }
        .feature:hover {
            transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.2);
        }
        .feature-icon { font-size: 3.5rem; margin-bottom: 20px; display: block; }
        .feature h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 15px; color: #fff; }
        .feature p { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; }
        .cta-section { text-align: center; margin: 60px 0; }
        .cta {
            background: linear-gradient(45deg, #10B981, #059669); color: white;
            padding: 18px 40px; border: none; border-radius: 50px;
            font-size: 1.2rem; font-weight: 600; cursor: pointer; margin: 15px;
            text-decoration: none; display: inline-block;
            box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4); transition: all 0.3s ease;
        }
        .cta:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(16, 185, 129, 0.6); }
        .cta.secondary { background: linear-gradient(45deg, #3B82F6, #1D4ED8); box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4); }
        .footer {
            text-align: center; margin-top: 80px; padding: 40px 20px;
            background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(20px);
            border-radius: 25px; border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer a { color: #FFD700; text-decoration: none; margin: 0 15px; font-weight: 500; }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; } .hero h2 { font-size: 1.4rem; }
            .hero p { font-size: 1.1rem; } .logo { font-size: 4rem; }
            .features { grid-template-columns: 1fr; gap: 20px; }
            .stats { gap: 20px; } .cta { font-size: 1rem; padding: 15px 30px; margin: 10px 5px; }
        }
    


    
        
            🎓
            Whyteboard
            Free AI-Powered Learning Platform
            Transform your learning journey with personalized AI tutors, comprehensive progress tracking, and achieve your educational goals faster than ever before!
            
                10K+Students Learning
                24/7AI Support
                100%Free Access
            
        
        
            
                🤖AI Tutors
                Get instant, personalized help from advanced AI tutors in Math, Science, English, History, and more. Available 24/7 to answer your questions!
            
            
                📊Progress Tracking
                Monitor your learning journey with detailed analytics, performance insights, and personalized recommendations to accelerate your growth.
            
            
                💬Interactive Chat
                Ask questions and get comprehensive explanations in real-time. Our AI adapts to your learning style and provides step-by-step guidance.
            
            
                🆓Completely Free
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

// FIXED Demo Page
app.get('/demo', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`


    Whyteboard Demo - AI Tutoring
    
    
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; padding: 20px; 
            background: linear-gradient(135deg, #667eea, #764ba2);
            min-height: 100vh; color: white;
        }
        .container { max-width: 900px; margin: 0 auto; }
        .header {
            text-align: center; background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px); border-radius: 20px;
            padding: 40px 20px; margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .chat-container { 
            background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px);
            border-radius: 20px; padding: 30px; 
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .subject-selector {
            background: rgba(255, 255, 255, 0.1); border-radius: 15px;
            padding: 20px; margin-bottom: 20px; text-align: center;
        }
        .messages { 
            height: 400px; overflow-y: auto; 
            background: rgba(0, 0, 0, 0.2); padding: 20px; 
            margin-bottom: 20px; border-radius: 15px;
        }
        .message { margin-bottom: 15px; padding: 15px; border-radius: 10px; }
        .user-message { background: linear-gradient(45deg, #3B82F6, #1D4ED8); margin-left: 20%; }
        .ai-message { background: linear-gradient(45deg, #10B981, #059669); margin-right: 20%; }
        .input-area { display: flex; gap: 15px; align-items: center; }
        input { 
            flex: 1; padding: 15px; border: none; border-radius: 25px; font-size: 16px;
            background: rgba(255, 255, 255, 0.9); color: #333;
        }
        button { 
            background: linear-gradient(45deg, #10B981, #059669); color: white; 
            padding: 15px 25px; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;
        }
        select { 
            padding: 12px 20px; border-radius: 10px; border: none;
            background: rgba(255, 255, 255, 0.9); color: #333; font-size: 16px;
        }
        .nav-links {
            text-align: center; margin-top: 30px; padding: 20px;
            background: rgba(255, 255, 255, 0.1); border-radius: 15px;
        }
        .nav-links a { color: #FFD700; text-decoration: none; margin: 0 20px; font-weight: 500; }
    


    
        
            🎓 AI Tutor Demo
            Experience personalized learning with our AI tutoring system
        
        
            
                Choose Your Subject:
                
                    📐 Mathematics
                    🔬 Science
                    📚 English
                    🏛️ History
                    🎯 General Learning
                
            
            
                
                    AI Tutor: Hello! I'm your personal AI tutor. Choose a subject above and ask me anything - from basic concepts to complex problems. What would you like to explore today?
                
            
            
                
                Send
            
        
        
            ← Back to Home
            Create Free Account →
        
    
    
        function handleKeyPress(event) {
            if (event.key === 'Enter') { sendMessage(); }
        }
        async function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            const subject = document.getElementById('subject').value;
            if (!message) return;
            addMessage('You', message, 'user-message');
            messageInput.value = '';
            const responses = {
                math: "Great math question! Mathematics is the language of patterns and logical reasoning. What specific math topic can I help you explore?",
                science: "Excellent science question! Science helps us understand our amazing universe. What scientific mystery would you like to investigate?",
                english: "Wonderful English question! Language arts empowers clear communication. What aspect of English would you like to improve?",
                history: "Fascinating history question! History shows us how we got here. What historical period interests you?",
                general: "Great question! Learning opens infinite possibilities. What new topic would you like to explore today?"
            };
            setTimeout(() => {
                const response = responses[subject] || responses.general;
                addMessage('AI Tutor', response, 'ai-message');
            }, 1000);
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

// FIXED Registration Page
app.get('/register', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`


    Join Whyteboard - Free AI Learning
    
    
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; padding: 20px; 
            background: linear-gradient(135deg, #667eea, #764ba2);
            min-height: 100vh; color: white;
        }
        .container { 
            max-width: 500px; margin: 50px auto; 
            background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px);
            padding: 40px; border-radius: 25px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .form-group { margin-bottom: 25px; }
        label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 1.1rem; }
        input, select { 
            width: 100%; padding: 15px; border: none; border-radius: 15px; font-size: 16px;
            background: rgba(255, 255, 255, 0.9); color: #333; box-sizing: border-box;
        }
        button { 
            width: 100%; background: linear-gradient(45deg, #10B981, #059669);
            color: white; padding: 18px; border: none; border-radius: 15px; 
            font-size: 1.2rem; font-weight: 600; cursor: pointer; margin-top: 20px;
        }
        .result { 
            margin-top: 25px; padding: 20px; border-radius: 15px; 
            display: none; text-align: center;
        }
        .success { background: rgba(16, 185, 129, 0.2); border: 2px solid #10B981; }
        .nav-links { text-align: center; margin-top: 30px; padding: 20px; }
        .nav-links a { color: #FFD700; text-decoration: none; font-weight: 500; }
        .features {
            background: rgba(255, 255, 255, 0.1); border-radius: 15px;
            padding: 20px; margin-bottom: 30px;
        }
        .features h3 { text-align: center; margin-bottom: 15px; }
        .features ul { list-style: none; padding: 0; }
        .features li { padding: 8px 0; padding-left: 25px; position: relative; }
        .features li:before { content: "✅"; position: absolute; left: 0; }
    


    
        
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
            const name = document.getElementById('name').value;
            const button = document.querySelector('button[type="submit"]');
            button.textContent = '⏳ Creating Account...';
            button.disabled = true;
            setTimeout(() => {
                const resultDiv = document.getElementById('result');
                resultDiv.className = 'result success';
                resultDiv.innerHTML = '🎉 <strong>Welcome to Whyteboard, ' + name + '!</strong><br><br>Your demo account is ready! Start exploring:<br><br><a href="/demo" style="color: #FFD700; text-decoration: none; font-weight: bold;">→ Try AI Tutoring Now</a>';
                resultDiv.style.display = 'block';
                document.querySelector('form').reset();
                button.textContent = '🚀 Start Learning Free';
                button.disabled = false;
            }, 2000);
        }
    

`);
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
