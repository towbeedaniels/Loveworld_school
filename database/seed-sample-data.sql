-- =====================================================
-- SAMPLE DATA GENERATION SCRIPT
-- Run this in your Supabase SQL Editor
-- URL: https://app.supabase.com/project/YOUR_PROJECT/sql
-- =====================================================
-- This script populates all tables with realistic sample data:
-- • 500 Students
-- • 50 Teachers
-- • 150 Parents
-- • 16 Classes (Grades 9-12, Sections A-D)
-- • 15 Subjects
-- • ~2000 Attendance records
-- • ~1500 Grades
-- • 50 Library books
-- • Transport, HR, and more
-- =====================================================

-- STEP 1: CLEAR EXISTING DATA
TRUNCATE TABLE public.grades CASCADE;
TRUNCATE TABLE public.examinations CASCADE;
TRUNCATE TABLE public.fee_payments CASCADE;
TRUNCATE TABLE public.fee_structures CASCADE;
TRUNCATE TABLE public.enrollments CASCADE;
TRUNCATE TABLE public.attendance CASCADE;
TRUNCATE TABLE public.teacher_attendance CASCADE;
TRUNCATE TABLE public.book_issuance CASCADE;
TRUNCATE TABLE public.books CASCADE;
TRUNCATE TABLE public.student_transport CASCADE;
TRUNCATE TABLE public.routes CASCADE;
TRUNCATE TABLE public.vehicles CASCADE;
TRUNCATE TABLE public.announcements CASCADE;
TRUNCATE TABLE public.timetable CASCADE;
TRUNCATE TABLE public.class_subjects CASCADE;
TRUNCATE TABLE public.classes CASCADE;
TRUNCATE TABLE public.subjects CASCADE;
TRUNCATE TABLE public.teachers CASCADE;
TRUNCATE TABLE public.students CASCADE;
TRUNCATE TABLE public.parents CASCADE;
TRUNCATE TABLE public.payroll CASCADE;
TRUNCATE TABLE public.employees CASCADE;
TRUNCATE TABLE public.leave_requests CASCADE;

-- STEP 2: PARENTS (150)
INSERT INTO public.parents (first_name, last_name, email, phone, occupation, address)
SELECT 
  (ARRAY['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth','David','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen','Emma','Oliver','Sophia','Jack','Isabella','Daniel','Mia','Matthew','Charlotte','Henry'])[floor(random()*30+1)],
  (ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin'])[floor(random()*20+1)],
  'parent'||i||'@example.com',
  '+1'||floor(random()*8000000000+2000000000)::text,
  (ARRAY['Engineer','Doctor','Teacher','Business','Nurse','Manager','Artist','Scientist'])[floor(random()*8+1)],
  (floor(random()*9900+100)::text)||' '||(ARRAY['Main','Oak','Elm','Pine','Maple'])[floor(random()*5+1)]||' St'
FROM generate_series(1,150) AS i;

-- STEP 3: TEACHERS (50)
INSERT INTO public.teachers (teacher_number, first_name, last_name, date_of_birth, gender, qualification, experience_years, specialization, join_date, status, phone, email, address)
SELECT 
  'TCH'||LPAD(i::text,4,'0'),
  (ARRAY['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth','David','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen','Emma','Oliver','Sophia','Jack','Isabella','Daniel','Mia','Matthew','Charlotte','Henry'])[floor(random()*30+1)],
  (ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin'])[floor(random()*20+1)],
  DATE '1960-01-01'+(random()*(DATE '1995-12-31'-DATE '1960-01-01'))::int,
  (ARRAY['male','female'])[floor(random()*2+1)],
  (ARRAY['PhD Mathematics','Masters in Education','B.Ed Science','PhD English','Masters Physics','B.Ed History','PhD Chemistry','Masters Biology','B.Ed Geography','PhD Computer Science'])[floor(random()*10+1)],
  floor(random()*30)::int,
  (ARRAY['Mathematics','English','Physics','Chemistry','Biology','History','Geography','Computer Science','Physical Education','Art'])[floor(random()*10+1)],
  DATE '2015-01-01'+(random()*(DATE '2024-12-31'-DATE '2015-01-01'))::int,
  (ARRAY['active','active','active','active','inactive','on_leave'])[floor(random()*6+1)],
  '+1'||floor(random()*8000000000+2000000000)::text,
  'teacher'||i||'@school.com',
  (floor(random()*9900+100)::text)||' '||(ARRAY['Main','Oak','Elm','Pine','Maple'])[floor(random()*5+1)]||' St'
FROM generate_series(1,50) AS i;

-- STEP 4: STUDENTS (500)
INSERT INTO public.students (student_number, first_name, last_name, date_of_birth, gender, blood_group, admission_date, status, address, city, state, zip_code, country, parent_guardian_id)
SELECT 
  'STU'||LPAD(i::text,4,'0'),
  (ARRAY['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth','David','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen','Emma','Oliver','Sophia','Jack','Isabella','Daniel','Mia','Matthew','Charlotte','Henry'])[floor(random()*30+1)],
  (ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin'])[floor(random()*20+1)],
  DATE '2005-01-01'+(random()*(DATE '2016-12-31'-DATE '2005-01-01'))::int,
  (ARRAY['male','female'])[floor(random()*2+1)],
  (ARRAY['A+','A-','B+','B-','O+','O-','AB+','AB-'])[floor(random()*8+1)],
  DATE '2020-01-01'+(random()*(DATE '2024-12-31'-DATE '2020-01-01'))::int,
  (ARRAY['active','active','active','graduated','inactive'])[floor(random()*5+1)],
  (floor(random()*9900+100)::text)||' '||(ARRAY['Main','Oak','Elm','Pine','Maple'])[floor(random()*5+1)]||' St',
  (ARRAY['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','San Francisco','Indianapolis','Seattle','Denver','Washington','Boston'])[floor(random()*20+1)],
  (ARRAY['NY','CA','IL','TX','AZ','PA','FL','OH','NC','WA','CO','DC','MA','IN','GA'])[floor(random()*15+1)],
  (floor(random()*89999+10000)::text),
  'USA',
  (SELECT id FROM public.parents ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1,500) AS i;

-- STEP 5: SUBJECTS (15)
INSERT INTO public.subjects (name, code, description) VALUES
('Mathematics','MATH101','Mathematics course for all grades'),
('English','ENG101','English Language and Literature'),
('Physics','PHY101','Fundamentals of Physics'),
('Chemistry','CHEM101','Fundamentals of Chemistry'),
('Biology','BIO101','Life Sciences'),
('History','HIST101','World History'),
('Geography','GEO101','Physical and Human Geography'),
('Computer Science','CS101','Introduction to Computing'),
('Physical Education','PE101','Health and Fitness'),
('Art','ART101','Visual Arts'),
('Music','MUS101','Music Theory and Practice'),
('Economics','ECON101','Basic Economics'),
('Political Science','POL101','Government and Politics'),
('French','FR101','French Language'),
('Spanish','SP101','Spanish Language');

-- STEP 6: CLASSES (16 - Grades 9-12, Sections A-D)
INSERT INTO public.classes (name, section, grade_level, teacher_id, room_number, capacity, academic_year)
SELECT 
  'Grade '||grade||section,
  section,
  grade,
  (SELECT id FROM public.teachers ORDER BY RANDOM() LIMIT 1),
  (floor(random()*200+100)::text),
  floor(random()*15+25)::int,
  '2024-2025'
FROM (SELECT grade, section FROM unnest(ARRAY[9,10,11,12]) AS grade CROSS JOIN unnest(ARRAY['A','B','C','D']) AS section) sub;

-- STEP 7: CLASS_SUBJECTS (~80)
INSERT INTO public.class_subjects (class_id, subject_id, teacher_id)
SELECT c.id, s.id, (SELECT id FROM public.teachers ORDER BY RANDOM() LIMIT 1)
FROM public.classes c
CROSS JOIN LATERAL (SELECT id FROM public.subjects ORDER BY RANDOM() LIMIT floor(random()*4+4)::int) s;

-- STEP 8: ENROLLMENTS (500)
INSERT INTO public.enrollments (student_id, class_id, academic_year, enrollment_date, status)
SELECT s.id, (SELECT id FROM public.classes ORDER BY RANDOM() LIMIT 1), '2024-2025', DATE '2024-08-01'+(random()*45)::int, 'active'
FROM public.students s;

-- STEP 9: STUDENT ATTENDANCE (~2000)
INSERT INTO public.attendance (student_id, date, status, remarks)
SELECT student_id, date_series::date, (ARRAY['present','present','present','present','absent','late','excused'])[floor(random()*7+1)], CASE WHEN random()>0.8 THEN 'Late arrival' ELSE NULL END
FROM (SELECT id AS student_id FROM public.students ORDER BY RANDOM() LIMIT 100) students
CROSS JOIN LATERAL (SELECT generate_series(DATE '2024-11-01', DATE '2024-11-20', '1 day'::interval)::date AS date_series) dates
WHERE EXTRACT(DOW FROM date_series) BETWEEN 1 AND 5;

-- STEP 10: TEACHER ATTENDANCE (~400)
INSERT INTO public.teacher_attendance (teacher_id, date, status, check_in, check_out)
SELECT teacher_id, date_series::date, (ARRAY['present','present','present','present','absent','late','on_leave'])[floor(random()*7+1)], 
  CASE WHEN random()>0.1 THEN (floor(random()*2+7)::text||':'||LPAD(floor(random()*60)::text,2,'0')||':00')::time ELSE NULL END,
  CASE WHEN random()>0.3 THEN (floor(random()*2+15)::text||':'||LPAD(floor(random()*60)::text,2,'0')||':00')::time ELSE NULL END
FROM (SELECT id AS teacher_id FROM public.teachers LIMIT 20) teachers
CROSS JOIN LATERAL (SELECT generate_series(DATE '2024-11-01', DATE '2024-11-20', '1 day'::interval)::date AS date_series) dates
WHERE EXTRACT(DOW FROM date_series) BETWEEN 1 AND 5;

-- STEP 11: EXAMINATIONS (50)
INSERT INTO public.examinations (name, type, class_id, subject_id, max_marks, weightage, exam_date, academic_year)
SELECT (ARRAY['Mid-term Exam','Final Exam','Unit Test 1','Unit Test 2','Quiz 1','Project Work'])[floor(random()*6+1)]||' - '||c.name,
  (ARRAY['exam','quiz','assignment','project'])[floor(random()*4+1)], c.id,
  (SELECT id FROM public.subjects ORDER BY RANDOM() LIMIT 1),
  (ARRAY[25,50,75,100])[floor(random()*4+1)], (ARRAY[20,25,30,40,50])[floor(random()*5+1)],
  DATE '2024-09-01'+(random()*120)::int, '2024-2025'
FROM public.classes c ORDER BY RANDOM() LIMIT 50;

-- STEP 12: GRADES (~1500)
INSERT INTO public.grades (student_id, examination_id, marks_obtained, grade, remarks)
SELECT DISTINCT ON (s.id, e.id) s.id, e.id, floor(random()*(e.max_marks*0.6)+e.max_marks*0.4)::numeric(5,2),
  CASE WHEN random()>0.9 THEN 'A+' WHEN random()>0.8 THEN 'A' WHEN random()>0.7 THEN 'B+' WHEN random()>0.6 THEN 'B' WHEN random()>0.5 THEN 'C' WHEN random()>0.3 THEN 'D' ELSE 'F' END,
  CASE WHEN random()>0.5 THEN 'Passed' ELSE 'Needs improvement' END
FROM (SELECT id FROM public.students ORDER BY RANDOM() LIMIT 100) s
CROSS JOIN (SELECT id, max_marks FROM public.examinations LIMIT 30) e;

-- STEP 13: FEE STRUCTURES (32)
INSERT INTO public.fee_structures (name, class_id, amount, frequency, academic_year, due_date)
SELECT (ARRAY['Tuition Fee','Lab Fee','Library Fee','Sports Fee','Technology Fee'])[floor(random()*5+1)]||' - '||c.name,
  c.id, floor(random()*450000+50000)::numeric(10,2), (ARRAY['monthly','quarterly','annually','one-time'])[floor(random()*4+1)],
  '2024-2025', DATE '2024-09-01'+(random()*300)::int
FROM public.classes c LIMIT 32;

-- STEP 14: FEE PAYMENTS (~250)
INSERT INTO public.fee_payments (student_id, fee_structure_id, amount_paid, payment_date, payment_method, transaction_id, receipt_number, status)
SELECT student_id, fs_id, 
  CASE WHEN random()>0.2 THEN amt ELSE amt*0.5 END,
  DATE '2024-08-01'+(random()*120)::int, 
  (ARRAY['cash','card','bank_transfer','online'])[floor(random()*4+1)],
  'TXN'||floor(random()*900000000+100000000)::text, 
  'RCP'||(100000+rn)::text,
  (ARRAY['paid','paid','paid','pending','partial'])[floor(random()*5+1)]
FROM (
  SELECT s.id as student_id, fs.id as fs_id, fs.amount as amt, 
         row_number() OVER () as rn
  FROM (SELECT id FROM public.students ORDER BY RANDOM() LIMIT 100) s
  CROSS JOIN LATERAL (SELECT id, amount FROM public.fee_structures ORDER BY RANDOM() LIMIT floor(random()*3+1)::int) fs
) sub;

-- STEP 15: ANNOUNCEMENTS (20)
INSERT INTO public.announcements (title, content, target_audience, priority, publish_date, is_active)
SELECT (ARRAY['School Reopening Notice','Holiday Announcement','Parent-Teacher Meeting','Sports Day Event','Annual Function','Exam Schedule Released','Summer Vacation Dates','New Library Books','Science Fair 2024','Cultural Program','Health Checkup Camp','Book Fair Next Week'])[i%12+1],
  'Important announcement. Please check the details and take necessary action. Contact the school office for more information.',
  ARRAY['all'], (ARRAY['low','normal','high','urgent'])[floor(random()*4+1)], DATE '2024-10-01'+(random()*90)::int, true
FROM generate_series(1,20) AS i;

-- STEP 16: BOOKS (50)
INSERT INTO public.books (title, author, isbn, category, publisher, publication_year, total_copies, available_copies, location)
SELECT (ARRAY['To Kill a Mockingbird','1984','The Great Gatsby','Pride and Prejudice','The Catcher in the Rye','Lord of the Flies','The Hobbit','Fahrenheit 451','Animal Farm','Brave New World','The Alchemist','Mathematics Basics','Physics Fundamentals','Chemistry Essentials','Biology for Students','World History','Geography Atlas','English Grammar','Computer Science Intro','Art and Design'])[floor(random()*20+1)]||CASE WHEN i>20 THEN ' Vol. '||(i-20) ELSE '' END,
  (ARRAY['John Smith','Mary Johnson','Robert Williams','Patricia Brown','Michael Davis'])[floor(random()*5+1)],
  '978-'||floor(random()*9000000000+1000000000)::text,
  (ARRAY['Fiction','Non-Fiction','Science','History','Biography','Children','Educational','Reference'])[floor(random()*8+1)],
  (ARRAY['Penguin','HarperCollins','Macmillan','Scholastic','Oxford Press'])[floor(random()*5+1)],
  floor(random()*14+2010)::int, floor(random()*4+1)::int, floor(random()*5)::int,
  'Shelf '||(ARRAY['A','B','C','D','E'])[floor(random()*5+1)]||'-'||floor(random()*20+1)::text
FROM generate_series(1,50) AS i;

-- STEP 17: BOOK ISSUANCE (40)
INSERT INTO public.book_issuance (book_id, student_id, issue_date, due_date, return_date, status)
SELECT (SELECT id FROM public.books ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM public.students ORDER BY RANDOM() LIMIT 1),
  DATE '2024-09-01'+(random()*75)::int,
  DATE '2024-09-15'+(random()*75)::int,
  CASE WHEN random()>0.5 THEN DATE '2024-09-20'+(random()*70)::int ELSE NULL END,
  CASE WHEN random()>0.5 THEN 'returned' ELSE 'issued' END
FROM generate_series(1,40);

-- STEP 18: VEHICLES (15)
INSERT INTO public.vehicles (vehicle_number, vehicle_type, capacity, driver_name, driver_phone, status)
SELECT 'VH-'||floor(random()*9000+1000)::text,
  (ARRAY['bus','van','car'])[floor(random()*3+1)],
  (ARRAY[30,40,50,60])[floor(random()*4+1)],
  (ARRAY['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth'])[floor(random()*10+1)]||' '||(ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez'])[floor(random()*10+1)],
  '+1'||floor(random()*8000000000+2000000000)::text,
  (ARRAY['active','active','active','maintenance'])[floor(random()*4+1)]
FROM generate_series(1,15);

-- STEP 19: ROUTES (10)
INSERT INTO public.routes (route_name, vehicle_id, pickup_points, total_distance, estimated_time, status)
SELECT (ARRAY['Route A - North','Route B - South','Route C - East','Route D - West','Route E - Central'])[i%5+1],
  (SELECT id FROM public.vehicles ORDER BY RANDOM() LIMIT 1),
  '[{"location":"City Center","time":"07:30"}]'::jsonb,
  floor(random()*45+5)::numeric(10,2),
  (floor(random()*70+20)::text)||' minutes',
  'active'
FROM generate_series(1,10) AS i;

-- STEP 20: STUDENT TRANSPORT (80)
INSERT INTO public.student_transport (student_id, route_id, pickup_point, status)
SELECT s.id, (SELECT id FROM public.routes ORDER BY RANDOM() LIMIT 1),
  (ARRAY['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin'])[floor(random()*10+1)],
  'active'
FROM (SELECT id FROM public.students ORDER BY RANDOM() LIMIT 80) s;

-- STEP 21: TIMETABLE (~280)
INSERT INTO public.timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number)
SELECT c.id, s.id, (SELECT id FROM public.teachers ORDER BY RANDOM() LIMIT 1),
  (ARRAY['monday','tuesday','wednesday','thursday','friday'])[d+1],
  (ARRAY['08:00','08:50','09:40','10:40','11:30','13:00','13:50'])[p+1]::time,
  (ARRAY['08:45','09:35','10:25','11:25','12:15','13:45','14:35'])[p+1]::time,
  c.room_number
FROM (SELECT id, room_number FROM public.classes LIMIT 8) c
CROSS JOIN generate_series(0,4) AS d
CROSS JOIN generate_series(0,6) AS p
CROSS JOIN LATERAL (SELECT id FROM public.subjects ORDER BY RANDOM() LIMIT 1) s;

-- STEP 22: EMPLOYEES (30)
INSERT INTO public.employees (employee_number, first_name, last_name, email, phone, department, designation, role, join_date, status, basic_salary, allowances, address)
SELECT 'EMP'||LPAD(i::text,4,'0'),
  (ARRAY['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth'])[floor(random()*10+1)],
  (ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez'])[floor(random()*10+1)],
  'employee'||i||'@school.com',
  '+1'||floor(random()*8000000000+2000000000)::text,
  (ARRAY['Administration','Finance','IT','Library','Maintenance','Security','Cafeteria'])[floor(random()*7+1)],
  (ARRAY['Manager','Coordinator','Assistant','Technician','Staff','Supervisor'])[floor(random()*6+1)],
  'staff',
  DATE '2018-01-01'+(random()*(DATE '2024-12-31'-DATE '2018-01-01'))::int,
  (ARRAY['active','active','active','active','inactive','on_leave'])[floor(random()*6+1)],
  floor(random()*5000000+3000000)::numeric(10,2),
  floor(random()*500000+300000)::numeric(10,2),
  (floor(random()*9900+100)::text)||' '||(ARRAY['Main','Oak','Elm'])[floor(random()*3+1)]||' St'
FROM generate_series(1,30) AS i;

-- STEP 23: PAYROLL (60 - 3 months for 20 employees)
INSERT INTO public.payroll (employee_id, month, year, basic_salary, allowances, deductions, gross_salary, net_salary, status, payment_date, payment_method)
SELECT e.id, m, 2024,
  COALESCE(e.basic_salary, 5000000),
  COALESCE(e.allowances, 500000),
  floor(COALESCE(e.basic_salary, 5000000)*0.1)::numeric(10,2),
  COALESCE(e.basic_salary, 5000000)+COALESCE(e.allowances, 500000),
  COALESCE(e.basic_salary, 5000000)+COALESCE(e.allowances, 500000)-floor(COALESCE(e.basic_salary, 5000000)*0.1),
  'paid',
  ('2024-'||LPAD(m::text,2,'0')||'-28')::date,
  'bank_transfer'
FROM (SELECT id, basic_salary, allowances FROM public.employees LIMIT 20) e
CROSS JOIN generate_series(9,11) AS m;

-- STEP 24: LEAVE REQUESTS (25)
INSERT INTO public.leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status)
SELECT (SELECT id FROM public.employees ORDER BY RANDOM() LIMIT 1),
  (ARRAY['sick','vacation','personal','maternity','paternity','emergency'])[floor(random()*6+1)],
  DATE '2024-10-01'+(random()*90)::int,
  DATE '2024-10-01'+(random()*90)::int + floor(random()*5+1)::int,
  floor(random()*5+1)::int,
  (ARRAY['Personal matters','Medical appointment','Family event','Vacation','Health reasons'])[floor(random()*5+1)],
  (ARRAY['approved','approved','pending','rejected'])[floor(random()*4+1)]
FROM generate_series(1,25);

-- =====================================================
-- VERIFICATION QUERIES (Run these to check counts)
-- =====================================================

SELECT 'Students' as table_name, COUNT(*) FROM public.students
UNION ALL
SELECT 'Teachers', COUNT(*) FROM public.teachers
UNION ALL
SELECT 'Parents', COUNT(*) FROM public.parents
UNION ALL
SELECT 'Classes', COUNT(*) FROM public.classes
UNION ALL
SELECT 'Subjects', COUNT(*) FROM public.subjects
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM public.enrollments
UNION ALL
SELECT 'Attendance', COUNT(*) FROM public.attendance
UNION ALL
SELECT 'Examinations', COUNT(*) FROM public.examinations
UNION ALL
SELECT 'Grades', COUNT(*) FROM public.grades
UNION ALL
SELECT 'Fee Structures', COUNT(*) FROM public.fee_structures
UNION ALL
SELECT 'Fee Payments', COUNT(*) FROM public.fee_payments
UNION ALL
SELECT 'Books', COUNT(*) FROM public.books
UNION ALL
SELECT 'Announcements', COUNT(*) FROM public.announcements
UNION ALL
SELECT 'Employees', COUNT(*) FROM public.employees
UNION ALL
SELECT 'Payroll', COUNT(*) FROM public.payroll
ORDER BY table_name;

-- =====================================================
-- ✅ DONE! Your database is now populated with sample data.
-- =====================================================
