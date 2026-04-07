# School Management System

A comprehensive school management system built with React, Vite, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication System** - User registration and login with role-based access
- 📊 **Dashboard** - Overview with statistics, charts, and recent activities
- 👨‍🎓 **Student Management** - Complete student records and enrollment
- 👨‍🏫 **Teacher Management** - Teacher profiles and assignments
- 📚 **Class Management** - Classes, sections, and subjects
- ✅ **Attendance Tracking** - Student and teacher attendance
- 📝 **Grading System** - Exams, assignments, and report cards
- 💰 **Fee Management** - Billing, payments, and receipts
- 📖 **Library Management** - Book tracking and issuance
- 🚌 **Transport Management** - Routes and vehicle management
- 📢 **Announcements** - System-wide notifications
- 📅 **Timetable** - Class schedules
- 📈 **Reports & Analytics** - Various reports and insights

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database/Backend**: Supabase
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form (ready for implementation)

## Prerequisites

- Node.js 16+ and npm
- A Supabase account and project ([supabase.com](https://supabase.com))

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `database/schema.sql` to create all tables and policies

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials from your project settings:
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key
   
3. Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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
