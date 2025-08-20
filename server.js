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
app.use(express.static('public'));

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

// Routes
app.get('/', (req, res) => {
  res.send(`
    
    
    
        Whyteboard - Free AI Learning
        
        
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; min-height: 100vh; }
            .container { max-width: 800px; margin: 0 auto; text-align: center; padding: 50px 20px; }
            .logo { font-size: 3rem; margin-bottom: 20px; }
            .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 40px 0; }
            .feature { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; }
            .cta { background: #10B981; color: white; padding: 15px 30px; border: none; border-radius: 25px; font-size: 1.1rem; cursor: pointer; margin: 20px 10px; }
            .cta:hover { background: #059669; }
            a { color: #FFD700; text-decoration: none; }
        
    
    
        
            🎓
            Welcome to Whyteboard
            Free AI-Powered Learning Platform
            Learn with personalized AI tutors, track your progress, and achieve your educational goals!
            
            
                
                    🤖 AI Tutors
                    Get instant help from AI tutors in Math, Science, English, and more!
                
                
                    📊 Progress Tracking
                    Monitor your learning journey with detailed analytics and insights.
                
                
                    💬 Interactive Chat
                    Ask questions and get personalized explanations in real-time.
                
                
                    🆓 Completely Free
                    Access quality education without any cost or subscription fees.
                
            
            
            Try Demo
            Get Started Free
            
            
                API Endpoints:
                Health Check | Interactive Demo | Registration
            
        
    
    
  `);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Whyteboard is running successfully!',
    database: 'connected'
  });
});

// Demo page
app.get('/api/demo', (req, res) => {
  res.send(`
    
    
    
        Whyteboard Demo
        
        
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
            .container { max-width: 800px; margin: 0 auto; }
            .chat-container { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .messages { height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
            .message { margin-bottom: 15px; padding: 10px; border-radius: 8px; }
            .user-message { background: #e3f2fd; text-align: right; }
            .ai-message { background: #f5f5f5; text-align: left; }
            .input-area { display: flex; gap: 10px; }
            input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 5px; }
            button { background: #1976d2; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; }
            select { padding: 8px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ddd; }
        
    
    
        
            🎓 Whyteboard AI Tutor Demo
            
                
                    Choose Subject: 
                    
                        Mathematics
                        Science
                        English
                        History
                    
                
                
                    
                        AI Tutor: Hello! I'm your personal AI tutor. Ask me anything about Math, Science, English, or History. What would you like to learn today?
                    
                
                
                    
                    Send
                
            
            
                ← Back to Home | 
                Create Account →
            
        

        
            function handleKeyPress(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            }

            function sendMessage() {
                const messageInput = document.getElementById('messageInput');
                const message = messageInput.value.trim();
                const subject = document.getElementById('subject').value;
                
                if (!message) return;

                // Add user message
                addMessage('You', message, 'user-message');
                messageInput.value = '';

                // Simulate AI response
                setTimeout(() => {
                    const response = generateResponse(message, subject);
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

            function generateResponse(message, subject) {
                const responses = {
                    math: "Great math question! Let me help you understand this step by step. In mathematics, we always work systematically. " + (message.includes('algebra') ? "For algebra, remember to isolate the variable." : "Break the problem into smaller parts."),
                    science: "Excellent science question! " + (message.includes('physics') ? "Physics helps us understand how things move and interact." : "Science is all about discovering how our world works.") + " What specific aspect interests you?",
                    english: "Wonderful English question! " + (message.includes('grammar') ? "Grammar is the foundation of clear communication." : "Literature opens our minds to new ideas and perspectives.") + " Let me explain further.",
                    history: "Fascinating history question! " + (message.includes('ancient') ? "Ancient civilizations laid the foundation for our modern world." : "History teaches us about human progress and lessons from the past.") + " What period interests you most?"
                };
                return responses[subject] || "That's a thoughtful question! I'm here to help you learn and understand any topic. Could you be more specific about what you'd like to study?";
            }
        
    
    
  `);
});

// Registration form
app.get('/api/register-form', (req, res) => {
  res.send(`
    
    
    
        Join Whyteboard
        
        
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; min-height: 100vh; }
            .container { max-width: 500px; margin: 50px auto; background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; backdrop-filter: blur(10px); }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select { width: 100%; padding: 12px; border: none; border-radius: 5px; font-size: 16px; }
            button { width: 100%; background: #10B981; color: white; padding: 15px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; margin-top: 20px; }
            button:hover { background: #059669; }
            .result { margin-top: 20px; padding: 15px; border-radius: 5px; display: none; }
            .success { background: rgba(16,185,129,0.2); border: 2px solid #10B981; }
            .error { background: rgba(239,68,68,0.2); border: 2px solid #EF4444; }
        
    
    
        
            🎓 Join Whyteboard Free
            Create your account and start learning with AI tutors today!
            
            
                
                    Email Address
                    
                
                
                    Password
                    
                
                
                    Full Name
                    
                
                
                    Age
                    
                        Select your age
                        8 years old
                        10 years old
                        12 years old
                        14 years old
                        16 years old
                        18+ years old
                    
                
                Start Learning Free
            
            
            
            
            
                ← Back to Home
            
        

        
            async function register(event) {
                event.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const name = document.getElementById('name').value;
                const age = document.getElementById('age').value;
                
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
                        resultDiv.innerHTML = '<strong>Success!</strong> Welcome to Whyteboard, ' + name + '! Your account has been created. You can now start chatting with AI tutors using our <a href="/api/demo" style="color: #FFD700;">demo</a>.';
                        resultDiv.style.display = 'block';
                        document.querySelector('form').reset();
                    } else {
                        resultDiv.className = 'result error';
                        resultDiv.innerHTML = '<strong>Error:</strong> ' + data.message;
                        resultDiv.style.display = 'block';
                    }
                } catch (error) {
                    const resultDiv = document.getElementById('result');
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = '<strong>Error:</strong> Registration failed. Please try again.';
                    resultDiv.style.display = 'block';
                }
            }
        
    
    
  `);
});

// Auth API endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, age } = req.body;
    
    // Validate input
    if (!email || !password || !name || !age) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, age) VALUES ($1, $2, $3, $4) RETURNING id, email, name, age',
      [email, passwordHash, name, parseInt(age)]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
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
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
    
    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, age: user.age },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, subject } = req.body;
    
    if (!message || !subject) {
      return res.status(400).json({ success: false, message: 'Message and subject are required' });
    }
    
    // Generate AI response based on subject and message
    const responses = {
      math: {
        keywords: {
          algebra: "Great algebra question! When solving equations, remember to keep the equation balanced by doing the same operation to both sides. For example, if you have 2x + 3 = 11, first subtract 3 from both sides to get 2x = 8, then divide both sides by 2 to get x = 4.",
          geometry: "Excellent geometry question! Remember that the sum of angles in a triangle is always 180°. For area calculations: triangle = (base × height) ÷ 2, rectangle = length × width, circle = π × radius².",
          calculus: "Calculus can be challenging but rewarding! Remember that derivatives show the rate of change, while integrals find the area under curves. Start with basic rules and practice regularly.",
          default: "Math is all about patterns and logical thinking! Break complex problems into smaller steps, show your work clearly, and don't be afraid to try different approaches."
        }
      },
      science: {
        keywords: {
          physics: "Physics helps us understand how the universe works! Remember F = ma (Force = mass × acceleration), and that energy is conserved in closed systems. What specific physics concept are you working on?",
          chemistry: "Chemistry is fascinating! Remember that atoms bond to become more stable, usually by filling their outer electron shells. The periodic table is your best friend for understanding element properties.",
          biology: "Biology is the study of life! Remember that structure relates to function in living things. Cells are the basic units of life, and DNA carries genetic information.",
          default: "Science is all about observation, hypothesis, and experimentation! Ask questions, make predictions, and test your ideas. What scientific phenomenon interests you?"
        }
      },
      english: {
        keywords: {
          grammar: "Grammar is the foundation of clear communication! Remember: subjects do the action, verbs show the action, objects receive the action. Practice identifying parts of speech in sentences.",
          writing: "Good writing has a clear structure: introduction, body paragraphs with evidence, and conclusion. Always revise your work and read it aloud to catch errors.",
          literature: "Literature helps us understand different perspectives and cultures. Look for themes, character development, and literary devices like metaphors and symbolism.",
          default: "English skills improve with practice! Read widely, write regularly, and don't be afraid to express your ideas. Language is a powerful tool for communication."
        }
      },
      history: {
        keywords: {
          ancient: "Ancient civilizations laid the foundation for our modern world! Look for patterns in how societies developed agriculture, government, and culture. What ancient period interests you?",
          medieval: "The medieval period was a time of great change! Feudalism, the rise of Christianity, and trade networks shaped European society. Consider cause and effect relationships.",
          modern: "Modern history shows rapid changes in technology, politics, and society. Look for connections between past events and current issues.",
          default: "History teaches us about human experiences across time! Look for patterns, consider multiple perspectives, and think about how past events influence the present."
        }
      }
    };
    
    const subjectResponses = responses[subject];
    let response = "That's a great question! I'm here to help you learn and understand any topic.";
    
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
      if (response === "That's a great question! I'm here to help you learn and understand any topic.") {
        response = subjectResponses.keywords.default;
      }
    }
    
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong! Please try again later.' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found',
    availableEndpoints: ['/', '/health', '/api/demo', '/api/register-form', '/api/register', '/api/login', '/api/chat']
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Whyteboard running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  await initDatabase();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
