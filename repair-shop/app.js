require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Ensure logo upload folder exists
const logoDir = path.join(__dirname, 'public/uploads/logo');
if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });

// Template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'repairshop_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

// Make user, logo, and shop name available in all views
const Setting = require('./models/Setting');
app.use(async (req, res, next) => {
  try {
    res.locals.user = req.session.user || null;
    const logoPath = path.join(__dirname, 'public/uploads/logo');
    const logoFiles = fs.readdirSync(logoPath).filter(f => /\.(png|jpg|jpeg|svg|gif)$/i.test(f));
    res.locals.logoFile = logoFiles.length > 0 ? `/uploads/logo/${logoFiles[0]}` : null;
    let setting = await Setting.findOne();
    if (!setting) setting = await Setting.create({ shopName: 'Repair Shop', shopSlogan: 'Your trusted gadget repair center' });
    res.locals.shopName = setting.shopName;
    res.locals.shopSlogan = setting.shopSlogan;
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/jobs', require('./routes/jobs'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));