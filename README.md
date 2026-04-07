# School Management System

A comprehensive school management system built with React, Vite, Tailwind CSS, and Supabase.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with role-based access
- Roles: Admin, Teacher, Student, Parent
- Protected routes with auth guards
- Automatic profile creation on signup

### 📊 Dashboard
- Real-time statistics and metrics
- Interactive charts (Bar, Pie, Line, Area)
- Weekly attendance tracking
- Grade distribution analysis
- Recent activity feed

### 👨‍🎓 Student Management
- Full CRUD operations for student records
- Advanced search and pagination
- Status tracking (Active, Inactive, Graduated, Transferred)
- **Export/Import** - CSV and Excel file support
- Statistics dashboard

### 👨‍🏫 Teacher Management
- Complete teacher records management
- Qualification and specialization tracking
- Experience years monitoring
- **Export/Import** capabilities
- Status management (Active, Inactive, On Leave)

### 📚 Classes & Subjects
- Class and section management
- Subject catalog with codes
- Teacher-class assignments
- Grade level tracking

### 📅 Timetable Management
- Weekly timetable grid (Monday-Saturday)
- Class-based filtering
- Subject, teacher, and room assignment
- Time slot management
- Visual timetable cards

### ✅ Attendance Tracking
- **Student Attendance**
  - Individual and bulk attendance marking
  - Date-based filtering
  - Status tracking: Present, Absent, Late, Excused
- **Teacher Attendance** (Ready for implementation)
- Real-time statistics

### 📝 Grades & Examinations
- **Examination Management**
  - Create exams, quizzes, assignments, projects
  - Track max marks, weightage, dates
  - Class and subject association
- **Grade Management**
  - Record student grades
  - **Auto-grade calculation** based on percentage
  - Custom grading scales support
  - Track highest/lowest/average scores

### 💰 Fee Management
- **Fee Structures**
  - Define fee types (Tuition, Transport, etc.)
  - Set frequency: Monthly, Quarterly, Annually, One-time
  - Class-specific fees
  - Due date tracking
- **Payment Tracking**
  - Record payments with multiple methods
  - Status tracking: Pending, Paid, Partial, Overdue
  - Receipt number generation
  - Revenue statistics

### 📖 Library Management
- **Book Management**
  - Complete book catalog with ISBN, category, publisher
  - Track total and available copies
  - Location tracking (shelf/location)
- **Book Issuance System**
  - Issue/return books to students
  - Due date and fine calculation
  - Status tracking: Issued, Returned, Overdue

### 🚌 Transport Management
- **Vehicle Management**
  - Full CRUD for vehicles (Bus, Van, Car)
  - Track vehicle number, capacity, driver info
  - Status tracking: Active, Maintenance, Inactive
- **Route Management**
  - Create and manage transport routes
  - Assign vehicles to routes
  - Pickup points tracking
- **Student Transport Assignment**
  - Assign students to routes
  - Track pickup points per student

### 📢 Announcements & Communication
- Create and manage school-wide announcements
- Priority levels: Low, Normal, High, Urgent
- Target audience selection (All, Students, Teachers, Parents, Staff)
- Publish and expiry date tracking
- Rich content editor

### 👥 HR & Payroll
- **Employee Management**
  - Employee records with departments
  - Role and salary tracking
  - Status management (Active, On Leave)
- **Payroll Tab** (Ready for Supabase connection)
- **Leave Management Tab** (Ready for Supabase connection)

### 📈 Reports & Analytics
- **Overview Dashboard**
  - Resource distribution charts
  - Attendance pie charts
  - Key performance metrics
- **Student Analytics**
  - Student-teacher ratio
  - Status distribution charts
- **Finance Reports**
  - Revenue collection metrics
  - Payment status distribution
  - Collection rate calculation
- **Resource Analytics**
  - Library utilization
  - Vehicle fleet management

### 📊 Advanced Reports
- **Attendance Reports**
  - Monthly trends with area charts
  - Status breakdown
  - Attendance rate calculation
- **Grades Reports**
  - Grade distribution pie charts
  - Subject average comparisons
  - Performance by exam type
- **Fee Reports**
  - Monthly revenue trends
  - Payment method distribution
  - Pending and overdue analysis
- **Library Reports**
  - Books by category
  - Issuance status breakdown
  - Availability metrics
- **Performance Reports**
  - Student performance distribution
  - Excellent/Good/Average/Below breakdown
  - Graded students tracking

### 💾 Export & Import
- **CSV Export** - Download any data as CSV
- **Excel Export** - Export to .xlsx format
- **CSV/Excel Import** - Bulk data import with preview
- **Template Download** - Get import templates
- **Data Transformation** - Custom field mapping for exports
- Available on:
  - Students module
  - Teachers module (ready to add)
  - All other modules (easy to integrate)

### ⚙️ Settings
- **Profile Settings** - Update name, email, phone
- **Security Settings** - Password management
- **Notification Preferences** - Toggle alerts
  - Email notifications
  - SMS notifications
  - Attendance alerts
  - Fee reminders
  - Announcements
- **System Settings** - School info, academic year, timezone

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database/Backend**: Supabase
- **State Management**: React Context API + Custom Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Export/Import**: PapaParse, File-Saver, XLSX
- **Forms**: React Hook Form (ready for implementation)

## 📦 Project Structure

```
school-management-system/
├── database/
│   └── schema.sql              # Complete Supabase schema (20+ tables)
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Sidebar navigation (16 items)
│   │   └── ExportImport.jsx    # Export/Import component
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication management
│   ├── hooks/
│   │   ├── useStudents.js
│   │   ├── useTeachers.js
│   │   ├── useClasses.js
│   │   ├── useSubjects.js
│   │   ├── useAttendance.js
│   │   ├── useGrades.js
│   │   ├── useFees.js
│   │   ├── useLibrary.js
│   │   ├── useTransport.js
│   │   ├── useTimetable.js
│   │   ├── useReports.js
│   │   └── useData.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Students.jsx
│   │   ├── Teachers.jsx
│   │   ├── Classes.jsx
│   │   ├── Timetable.jsx
│   │   ├── Attendance.jsx
│   │   ├── Grades.jsx
│   │   ├── Fees.jsx
│   │   ├── Library.jsx
│   │   ├── Transport.jsx
│   │   ├── Announcements.jsx
│   │   ├── HR.jsx
│   │   ├── Reports.jsx
│   │   ├── AdvancedReports.jsx
│   │   └── Settings.jsx
│   ├── utils/
│   │   └── exportImport.js     # Export/Import utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- A Supabase account and project ([supabase.com](https://supabase.com))

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- A Supabase account ([supabase.com](https://supabase.com))
- A Supabase project created

### Step 1: Clone and Install Dependencies

```bash
cd school-management-system
npm install
```

### Step 2: Set Up Supabase Database

#### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Choose your organization
4. Set project name and database password
5. Wait for project creation (~2 minutes)

#### 2.2 Get Your Credentials
1. Open your project dashboard
2. Go to **Settings** → **API**
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

#### 2.3 Configure Environment Variables
```bash
# Create .env.local file with your credentials
cp .env.example .env.local

# Edit .env.local and replace with your actual values:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ Important:** 
- Never commit `.env.local` to version control
- `.env.example` contains placeholders only
- Your `.env.local` is gitignored automatically

#### 2.4 Create Database Tables
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Open the file `database/schema.sql` from this project
4. Copy **entire content** (534 lines)
5. Paste into SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. Wait for success message (~5-10 seconds)
8. You should see: `Success. No rows returned`

#### 2.5 Verify Database Setup
Run this query in SQL Editor to verify all 21 tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Tables (21 total):**
1. `announcements` - School communications
2. `attendance` - Student attendance
3. `book_issuance` - Book issue/return records
4. `books` - Library catalog
5. `class_subjects` - Class-Subject relationships
6. `classes` - Class/Section info
7. `enrollments` - Student enrollments
8. `examinations` - Exam definitions
9. `fee_payments` - Payment records
10. `fee_structures` - Fee definitions
11. `grades` - Student grades
12. `parents` - Parent/Guardian info
13. `profiles` - User profiles
14. `routes` - Transport routes
15. `student_transport` - Student transport assignments
16. `students` - Student records
17. `subjects` - Subject catalog
18. `teacher_attendance` - Teacher attendance
19. `teachers` - Teacher records
20. `timetable` - Class schedules
21. `vehicles` - Transport vehicles

### Step 3: Start Development Server

```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`

### Step 4: Create Your First Account

1. Click **"Sign up"** on the login page
2. Fill in:
   - Full Name
   - Email address
   - Password (min 6 characters)
   - Role (Admin recommended for first user)
3. Click **"Sign Up"**
4. You'll be redirected to login
5. Sign in with your credentials

### Step 5: Explore the System

You now have access to all 19 modules:
- Dashboard with analytics
- Student & Teacher management
- Classes, Timetable, Attendance
- Grades & Examinations
- Fee Management
- Library & Transport
- Announcements & HR
- Reports & Advanced Reports
- Settings

## 📁 Environment Files

### `.env.example` (Committed to Git)
```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### `.env.local` (NOT committed - Git ignored)
```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your_actual_key
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Project Structure

```
school-management-system/
├── database/
│   └── schema.sql              # Supabase database schema
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── lib/
│   │   └── supabase.js         # Supabase client configuration
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Login.jsx           # Login page
│   │   └── Register.jsx        # Registration page
│   ├── App.jsx                 # Main app component with routing
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── .env.example                # Environment variables template
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## User Roles

- **Admin** - Full access to all features
- **Teacher** - Access to classes, attendance, grades, and announcements
- **Student** - View own records, attendance, grades, and library
- **Parent** - View child's records, attendance, grades, and fees

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Database Schema

The database includes tables for:
- User profiles (linked to Supabase auth)
- Students, Teachers, Parents
- Classes and Subjects
- Attendance (Student & Teacher)
- Examinations and Grades
- Fee Structures and Payments
- Library Books and Issuance
- Transport (Vehicles, Routes)
- Announcements
- Timetable

All tables have Row Level Security (RLS) policies for data protection.

## Next Steps

The following features are ready to be implemented:
- Student management CRUD operations
- Teacher management CRUD operations
- Class and subject management
- Attendance tracking interface
- Grade entry and report cards
- Fee payment processing
- Library book management
- Transport route planning
- Timetable creation
- Reports and analytics
- Announcement system

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
