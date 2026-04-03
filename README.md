# 🔧 Repair Shop Web App

A gadget repair shop management system built with Node.js, Express, EJS, MongoDB, and Bootstrap 5.

---

## Features

- Create and manage service/repair jobs
- Auto-generated SA numbers (e.g. SA-2026-0001, resets yearly)
- Track repairs done and parts used per job
- Job status workflow: Pending → Done / RTO
- Print-friendly customer receipt (save as PDF)
- Inline history log per job
- Role-based access control (Admin, Technician, Viewer)
- Admin panel: manage users, upload logo, edit shop name & slogan
- Auto-refresh dashboard every 30 seconds
- Network accessible (other devices on same WiFi)

---

## Requirements

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- npm (comes with Node.js)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/repair-shop.git
cd repair-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/repair-shop
SESSION_SECRET=replace_this_with_a_long_random_string
```

To generate a secure SESSION_SECRET, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your SESSION_SECRET.

---

## Running the App

### 1. Start MongoDB

**Linux:**
```bash
sudo systemctl start mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

Confirm MongoDB is running:
```bash
sudo systemctl status mongod
```
You should see `active (running)`.

### 2. Seed the first admin account

Run this once to create the default admin user:

```bash
node utils/seedAdmin.js
```

Output:
```
Admin created — username: admin, password: admin123
```

> ⚠️ Change the admin password immediately after your first login.

### 3. Start the app

**Development (auto-restart on file changes):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### 4. Open in browser

```
http://localhost:3000
```

Login with:
- Username: `admin`
- Password: `admin123`

---

## Accessing from Other Devices (Same Network)

1. Find your local IP address:
```bash
hostname -I
```

2. On any device connected to the same WiFi, open:
```
http://YOUR_IP_ADDRESS:3000
```

If the connection is blocked, allow port 3000 through the firewall:
```bash
sudo ufw allow 3000
```

---

## Roles & Permissions

| Action                | Viewer | Technician | Admin |
|-----------------------|--------|------------|-------|
| View dashboard        | ✅     | ✅         | ✅    |
| View job details      | ✅     | ✅         | ✅    |
| Create job            | ❌     | ✅         | ✅    |
| Add repair / part     | ❌     | ✅         | ✅    |
| Update status / price | ❌     | ✅         | ✅    |
| Delete job            | ❌     | ❌         | ✅    |
| Print view            | ✅     | ✅         | ✅    |
| Admin panel           | ❌     | ❌         | ✅    |

---

## Admin Panel

Access the admin panel by clicking **⚙ Admin** in the navbar (admin accounts only).

From the admin panel you can:
- Edit shop name and slogan
- Upload a shop logo
- Add new user accounts
- Reset user passwords
- Activate or deactivate users

---

## Project Structure

```
repair-shop/
├── app.js                  # App entry point
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment variable template
├── config/
│   └── db.js               # MongoDB connection
├── models/
│   ├── Job.js              # Job schema
│   ├── User.js             # User schema
│   └── Setting.js          # Shop settings schema
├── routes/
│   ├── index.js            # Root redirect
│   ├── jobs.js             # Job routes
│   ├── auth.js             # Auth routes
│   └── admin.js            # Admin routes
├── controllers/
│   ├── jobController.js    # Job business logic
│   └── adminController.js  # Admin business logic
├── middleware/
│   └── authGuard.js        # Login and role protection
├── views/
│   ├── layout/             # Shared header and footer
│   ├── dashboard.ejs       # Job list with filters
│   ├── job-create.ejs      # New job form
│   ├── job-details.ejs     # Job detail and edit page
│   ├── job-print.ejs       # Print/PDF view
│   ├── login.ejs           # Login page
│   └── admin/              # Admin panel views
├── public/
│   ├── css/style.css       # Custom styles + print CSS
│   └── uploads/logo/       # Uploaded shop logo
└── utils/
    ├── saNumber.js         # SA number generator
    └── seedAdmin.js        # First admin seeder
```

---

## Clearing the Database

To clear all jobs (for a fresh start):

```bash
mongosh
use repair-shop
db.jobs.deleteMany({})
exit
```

---

## Security Reminders

- Never commit your `.env` file — it is already in `.gitignore`
- Always use a strong, random `SESSION_SECRET`
- Change the default admin password (`admin123`) after first login
- The `public/uploads/` folder is excluded from git

---

## Future Features (Planned)

- Parts inventory management
- Reports and analytics
- Multi-branch filtering
- Docker support

---
