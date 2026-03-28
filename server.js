const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new Database('youshengxiao.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS qa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    answer TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Insert default admin if not exists
const adminExists = db.prepare('SELECT * FROM admin WHERE username = ?').get('admin');
if (!adminExists) {
  db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('admin', 'admin123');
  console.log('Default admin created: admin / admin123');
}

// Insert sample data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM qa').get();
if (count.count === 0) {
  const sampleData = [
    ['张妈妈', '138****1234', '人大附中实验小学落户年限要求？', '我家孩子2024年上小学，请问现在买房落户还来得及吗？', '人大附中实验小学学位非常紧张，建议提前3-5年落户比较稳妥。具体以当年招生简章为准。', 'answered'],
    ['李爸爸', '139****5678', '租房入学需要准备哪些材料？', '我们是租房住，想问租房入学需要房东提供什么材料？', '租房入学需提供：1.房东房产证原件及复印件 2.租房合同 3.房东本人身份证 4.知情同意书（房东签字）。建议提前与房东沟通。', 'answered'],
    ['王妈妈', '', '信息采集网址是什么？', '第一次给孩子办入学，不知道在哪里进行信息采集', '', 'pending']
  ];
  const insert = db.prepare('INSERT INTO qa (name, phone, title, content, answer, status) VALUES (?, ?, ?, ?, ?, ?)');
  sampleData.forEach(row => insert.run(...row));
  console.log('Sample data inserted');
}

// ============ API Routes ============

// Get all Q&A
app.get('/api/qa', (req, res) => {
  try {
    const qa = db.prepare('SELECT * FROM qa ORDER BY created_at DESC').all();
    res.json({ success: true, data: qa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add Q&A
app.post('/api/qa', (req, res) => {
  try {
    const { name, phone, title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: '标题和内容不能为空' });
    }
    const result = db.prepare('INSERT INTO qa (name, phone, title, content) VALUES (?, ?, ?, ?)').run(name || '匿名用户', phone || '', title, content);
    const newQA = db.prepare('SELECT * FROM qa WHERE id = ?').get(result.lastInsertRowid);
    res.json({ success: true, data: newQA });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = db.prepare('SELECT * FROM admin WHERE username = ? AND password = ?').get(username, password);
    if (admin) {
      res.json({ success: true, message: '登录成功', isAdmin: true });
    } else {
      res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Q&A (admin)
app.put('/api/qa/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { answer, title, content, status } = req.body;
    
    let sql = 'UPDATE qa SET ';
    let params = [];
    let updates = [];
    
    if (answer !== undefined) {
      updates.push('answer = ?');
      params.push(answer);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: '没有要更新的字段' });
    }
    
    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    db.prepare(sql).run(...params);
    const updated = db.prepare('SELECT * FROM qa WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Q&A (admin)
app.delete('/api/qa/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM qa WHERE id = ?').run(id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Start Server ============
app.listen(PORT, () => {
  console.log(`
============================================
  幼升小注意事项服务已启动！
  
  本地访问: http://localhost:${PORT}
  在线访问: https://youshengxiao.onrender.com
  
  数据库: youshengxiao.db (SQLite)
  
  默认管理员:
  用户名: admin
  密码: admin123
  
============================================
  `);
});
