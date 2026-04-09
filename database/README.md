# 📊 Sample Data Generator

This script populates your Supabase database with realistic sample data for testing the school management system.

## 📋 What Gets Inserted

| Table | Records | Description |
|-------|---------|-------------|
| Students | 500 | Student records with complete information |
| Teachers | 50 | Teacher records with qualifications |
| Parents | 150 | Parent/Guardian information |
| Classes | 16 | Grades 9-12, Sections A-D |
| Subjects | 15 | Academic subjects |
| Class Subjects | ~80 | Subject-class assignments |
| Enrollments | 500 | Student-class enrollments |
| Attendance | ~2,000 | Student attendance (20 days, 100 students) |
| Teacher Attendance | ~400 | Teacher attendance (20 days, 20 teachers) |
| Examinations | 50 | Various exam types |
| Grades | ~1,500 | Student exam grades |
| Fee Structures | 32 | Fee configurations |
| Fee Payments | ~250 | Payment records |
| Books | 50 | Library book catalog |
| Book Issuance | 40 | Book lending records |
| Vehicles | 15 | Transport vehicles |
| Routes | 10 | Transport routes |
| Student Transport | 80 | Student transport assignments |
| Timetable | ~280 | Class schedules |
| Announcements | 20 | School announcements |
| Employees | 30 | HR employee records |
| Payroll | 60 | Payroll records (3 months) |
| Leave Requests | 25 | Employee leave requests |

## 🚀 How to Use

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Script**
   - Copy the contents of `seed-sample-data.sql`
   - Paste into the SQL Editor
   - Click "Run" button (or press Cmd/Ctrl + Enter)

4. **Wait for Completion**
   - The script will clear existing data and insert new records
   - You'll see a results table showing record counts
   - Should complete in 5-15 seconds

5. **Verify**
   - Refresh your school management app
   - Navigate to different sections to see the data

### Option 2: Supabase CLI

```bash
# Navigate to project root
cd /Users/tobidaniel/Downloads/Loveworl_school

# Run the SQL file
npx supabase db execute --file database/seed-sample-data.sql
```

## ⚠️ Important Notes

1. **This will DELETE all existing data** - The script starts with TRUNCATE statements
2. **Backup first** - If you have important data, backup your database before running
3. **Authenticated user required** - You must be logged into Supabase to run the script
4. **RLS Policies** - The script respects existing Row Level Security policies

## 🔍 Verification Queries

After running, you can verify the data with these queries:

```sql
-- Check total counts
SELECT 'Students' as table_name, COUNT(*) FROM public.students
UNION ALL SELECT 'Teachers', COUNT(*) FROM public.teachers
UNION ALL SELECT 'Classes', COUNT(*) FROM public.classes
UNION ALL SELECT 'Subjects', COUNT(*) FROM public.subjects;

-- Check sample students
SELECT student_number, first_name, last_name, status FROM public.students LIMIT 10;

-- Check sample teachers
SELECT teacher_number, first_name, last_name, qualification FROM public.teachers LIMIT 10;
```

## 🎯 Sample Data Features

- **Realistic Names** - Common first and last names
- **Valid Dates** - Proper date ranges for birth, admission, join dates
- **Random Distribution** - Status fields distributed realistically
- **Relationships** - Proper foreign key relationships maintained
- **Variety** - Multiple cities, states, qualifications, etc.
- **Attendance Patterns** - Weekday-only attendance, realistic present/absent ratios
- **Grade Distribution** - Realistic grade distributions based on exam scores

## 🔄 Re-running the Script

You can run the script multiple times:
- It will clear and regenerate all data
- Useful for testing with fresh datasets
- Each run generates different random data

## 🐛 Troubleshooting

**Error: "violates row-level security policy"**
- Make sure you're running as an authenticated user with proper permissions
- Try running as the `postgres` role in Supabase

**Error: "relation does not exist"**
- Make sure you've run the schema migration first
- Check that all tables exist in your database

**Foreign key constraint violation**
- The script inserts data in the correct order to avoid this
- If you see this, some prerequisite data may be missing

## 📝 Customization

You can modify the script to:
- Change record counts (adjust the `generate_series` numbers)
- Use different names or locations
- Adjust date ranges
- Add more variety to any field

Simply edit the SQL file and re-run it.

---

**Need Help?** Check the database schema in `database/schema.sql` to understand the table structure.
