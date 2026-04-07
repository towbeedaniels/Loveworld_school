# School Management System - Database Setup Guide

## 📋 Required Supabase Tables

Run the SQL script in `database/schema.sql` in your Supabase SQL Editor to create all tables.

### Tables Created:

1. **profiles** - User profiles (linked to auth.users)
2. **students** - Student records
3. **parents** - Parent/Guardian information
4. **teachers** - Teacher records
5. **classes** - Class/Section information
6. **subjects** - Subject catalog
7. **class_subjects** - Class-Subject relationships
8. **enrollments** - Student-Class enrollments
9. **attendance** - Student attendance records
10. **teacher_attendance** - Teacher attendance
11. **examinations** - Exam/Quiz/Assignment definitions
12. **grades** - Student grades
13. **fee_structures** - Fee definitions
14. **fee_payments** - Payment records
15. **books** - Library books
16. **book_issuance** - Book issue/return records
17. **vehicles** - Transport vehicles
18. **routes** - Transport routes
19. **student_transport** - Student transport assignments
20. **announcements** - School announcements
21. **timetable** - Class timetables

## 🔧 Setup Steps

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Choose your organization
4. Set project name and database password
5. Wait for project to be created (~2 minutes)

### Step 2: Get Your Credentials
1. Go to Project Settings → API
2. Copy **Project URL**
3. Copy **anon/public key**

### Step 3: Configure Environment Variables
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Run Database Schema
1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Copy entire content of `database/schema.sql`
4. Click "Run"
5. Wait for success message (~5-10 seconds)

### Step 5: Verify Tables
Run this query in SQL Editor to verify all tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 21 tables listed.

## 🚀 Quick Start

After database setup:

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173

4. Create your first account using the Register page

## 📊 Sample Data (Optional)

To test with sample data, you can insert test records:

```sql
-- Insert a test student
INSERT INTO students (student_number, first_name, last_name, date_of_birth, gender, status)
VALUES ('STU001', 'John', 'Doe', '2010-05-15', 'male', 'active');

-- Insert a test teacher
INSERT INTO teachers (teacher_number, first_name, last_name, gender, qualification, status)
VALUES ('TCH001', 'Jane', 'Smith', 'female', 'PhD Education', 'active');

-- Insert a test class
INSERT INTO classes (name, section, grade_level)
VALUES ('Class 10', 'A', 10);
```

## 🔐 Security Notes

- Row Level Security (RLS) is enabled on all tables
- Auth policies restrict access based on user role
- Anonymous key is safe to expose in client code
- Never expose your `service_role` key

## 🐛 Troubleshooting

### "Table does not exist" error
- Run the `database/schema.sql` script in Supabase SQL Editor
- Check that the script ran without errors

### "Permission denied" error  
- Verify RLS policies are set correctly
- Check that you're authenticated (logged in)
- Ensure your user has the correct role

### Connection issues
- Verify `.env.local` has correct credentials
- Check that your Supabase project is active
- Ensure network allows connections to Supabase

## 📞 Support

For issues or questions:
1. Check Supabase Dashboard logs
2. Review browser console for errors
3. Verify environment variables are loaded
4. Check Supabase project status
