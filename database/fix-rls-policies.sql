-- =====================================================
-- FIX ROW LEVEL SECURITY (RLS) POLICIES
-- Run this in Supabase SQL Editor to allow authenticated users
-- to read and manage data properly
-- =====================================================

-- 1. Students
DO $$ BEGIN
  DROP POLICY IF EXISTS "Students are viewable by authenticated users" ON public.students;
  DROP POLICY IF EXISTS "Students manageable by authenticated users" ON public.students;
  DROP POLICY IF EXISTS "Students viewable by authenticated users" ON public.students;
  DROP POLICY IF EXISTS "Students manageable by admin/teachers" ON public.students;
END $$;
CREATE POLICY "Students viewable by authenticated users" ON public.students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Students manageable by authenticated users" ON public.students FOR ALL USING (auth.role() = 'authenticated');

-- 2. Teachers
DO $$ BEGIN
  DROP POLICY IF EXISTS "Teachers viewable by authenticated users" ON public.teachers;
  DROP POLICY IF EXISTS "Teachers manageable by authenticated users" ON public.teachers;
  DROP POLICY IF EXISTS "Teachers manageable by admin" ON public.teachers;
END $$;
CREATE POLICY "Teachers viewable by authenticated users" ON public.teachers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Teachers manageable by authenticated users" ON public.teachers FOR ALL USING (auth.role() = 'authenticated');

-- 3. Parents
DO $$ BEGIN
  DROP POLICY IF EXISTS "Parents viewable by authenticated users" ON public.parents;
  DROP POLICY IF EXISTS "Parents manageable by authenticated users" ON public.parents;
END $$;
CREATE POLICY "Parents viewable by authenticated users" ON public.parents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Parents manageable by authenticated users" ON public.parents FOR ALL USING (auth.role() = 'authenticated');

-- 4. Classes
DO $$ BEGIN
  DROP POLICY IF EXISTS "Classes viewable by authenticated users" ON public.classes;
  DROP POLICY IF EXISTS "Classes manageable by authenticated users" ON public.classes;
END $$;
CREATE POLICY "Classes viewable by authenticated users" ON public.classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Classes manageable by authenticated users" ON public.classes FOR ALL USING (auth.role() = 'authenticated');

-- 5. Subjects
DO $$ BEGIN
  DROP POLICY IF EXISTS "Subjects viewable by authenticated users" ON public.subjects;
  DROP POLICY IF EXISTS "Subjects manageable by authenticated users" ON public.subjects;
END $$;
CREATE POLICY "Subjects viewable by authenticated users" ON public.subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Subjects manageable by authenticated users" ON public.subjects FOR ALL USING (auth.role() = 'authenticated');

-- 6. Class Subjects
DO $$ BEGIN
  DROP POLICY IF EXISTS "Class subjects viewable by authenticated users" ON public.class_subjects;
  DROP POLICY IF EXISTS "Class subjects manageable by authenticated users" ON public.class_subjects;
END $$;
CREATE POLICY "Class subjects viewable by authenticated users" ON public.class_subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Class subjects manageable by authenticated users" ON public.class_subjects FOR ALL USING (auth.role() = 'authenticated');

-- 7. Enrollments
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enrollments viewable by authenticated users" ON public.enrollments;
  DROP POLICY IF EXISTS "Enrollments manageable by authenticated users" ON public.enrollments;
END $$;
CREATE POLICY "Enrollments viewable by authenticated users" ON public.enrollments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enrollments manageable by authenticated users" ON public.enrollments FOR ALL USING (auth.role() = 'authenticated');

-- 8. Attendance
DO $$ BEGIN
  DROP POLICY IF EXISTS "Attendance viewable by authenticated users" ON public.attendance;
  DROP POLICY IF EXISTS "Attendance manageable by authenticated users" ON public.attendance;
END $$;
CREATE POLICY "Attendance viewable by authenticated users" ON public.attendance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Attendance manageable by authenticated users" ON public.attendance FOR ALL USING (auth.role() = 'authenticated');

-- 9. Teacher Attendance
DO $$ BEGIN
  DROP POLICY IF EXISTS "Teacher attendance viewable by authenticated users" ON public.teacher_attendance;
  DROP POLICY IF EXISTS "Teacher attendance manageable by authenticated users" ON public.teacher_attendance;
END $$;
CREATE POLICY "Teacher attendance viewable by authenticated users" ON public.teacher_attendance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Teacher attendance manageable by authenticated users" ON public.teacher_attendance FOR ALL USING (auth.role() = 'authenticated');

-- 10. Books
DO $$ BEGIN
  DROP POLICY IF EXISTS "Books viewable by authenticated users" ON public.books;
  DROP POLICY IF EXISTS "Books manageable by authenticated users" ON public.books;
END $$;
CREATE POLICY "Books viewable by authenticated users" ON public.books FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Books manageable by authenticated users" ON public.books FOR ALL USING (auth.role() = 'authenticated');

-- 11. BOOK ISSUANCE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Book issuance viewable by authenticated users" ON public.book_issuance;
  DROP POLICY IF EXISTS "Book issuance manageable by authenticated users" ON public.book_issuance;
END $$;
CREATE POLICY "Book issuance viewable by authenticated users" ON public.book_issuance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Book issuance manageable by authenticated users" ON public.book_issuance FOR ALL USING (auth.role() = 'authenticated');

-- 12. Examinations
DO $$ BEGIN
  DROP POLICY IF EXISTS "Examinations viewable by authenticated users" ON public.examinations;
  DROP POLICY IF EXISTS "Examinations manageable by authenticated users" ON public.examinations;
END $$;
CREATE POLICY "Examinations viewable by authenticated users" ON public.examinations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Examinations manageable by authenticated users" ON public.examinations FOR ALL USING (auth.role() = 'authenticated');

-- 13. Grades
DO $$ BEGIN
  DROP POLICY IF EXISTS "Grades viewable by authenticated users" ON public.grades;
  DROP POLICY IF EXISTS "Grades manageable by authenticated users" ON public.grades;
END $$;
CREATE POLICY "Grades viewable by authenticated users" ON public.grades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Grades manageable by authenticated users" ON public.grades FOR ALL USING (auth.role() = 'authenticated');

-- 14. Fee Structures
DO $$ BEGIN
  DROP POLICY IF EXISTS "Fee structures viewable by authenticated users" ON public.fee_structures;
  DROP POLICY IF EXISTS "Fee structures manageable by authenticated users" ON public.fee_structures;
END $$;
CREATE POLICY "Fee structures viewable by authenticated users" ON public.fee_structures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Fee structures manageable by authenticated users" ON public.fee_structures FOR ALL USING (auth.role() = 'authenticated');

-- 15. Fee Payments
DO $$ BEGIN
  DROP POLICY IF EXISTS "Fee payments viewable by authenticated users" ON public.fee_payments;
  DROP POLICY IF EXISTS "Fee payments manageable by authenticated users" ON public.fee_payments;
END $$;
CREATE POLICY "Fee payments viewable by authenticated users" ON public.fee_payments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Fee payments manageable by authenticated users" ON public.fee_payments FOR ALL USING (auth.role() = 'authenticated');

-- 16. Vehicles
DO $$ BEGIN
  DROP POLICY IF EXISTS "Vehicles viewable by authenticated users" ON public.vehicles;
  DROP POLICY IF EXISTS "Vehicles manageable by authenticated users" ON public.vehicles;
END $$;
CREATE POLICY "Vehicles viewable by authenticated users" ON public.vehicles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Vehicles manageable by authenticated users" ON public.vehicles FOR ALL USING (auth.role() = 'authenticated');

-- 17. Routes
DO $$ BEGIN
  DROP POLICY IF EXISTS "Routes viewable by authenticated users" ON public.routes;
  DROP POLICY IF EXISTS "Routes manageable by authenticated users" ON public.routes;
END $$;
CREATE POLICY "Routes viewable by authenticated users" ON public.routes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Routes manageable by authenticated users" ON public.routes FOR ALL USING (auth.role() = 'authenticated');

-- 18. Student Transport
DO $$ BEGIN
  DROP POLICY IF EXISTS "Student transport viewable by authenticated users" ON public.student_transport;
  DROP POLICY IF EXISTS "Student transport manageable by authenticated users" ON public.student_transport;
END $$;
CREATE POLICY "Student transport viewable by authenticated users" ON public.student_transport FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Student transport manageable by authenticated users" ON public.student_transport FOR ALL USING (auth.role() = 'authenticated');

-- 19. Announcements
DO $$ BEGIN
  DROP POLICY IF EXISTS "Announcements viewable by authenticated users" ON public.announcements;
  DROP POLICY IF EXISTS "Announcements manageable by authenticated users" ON public.announcements;
END $$;
CREATE POLICY "Announcements viewable by authenticated users" ON public.announcements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Announcements manageable by authenticated users" ON public.announcements FOR ALL USING (auth.role() = 'authenticated');

-- 20. Timetable
DO $$ BEGIN
  DROP POLICY IF EXISTS "Timetable viewable by authenticated users" ON public.timetable;
  DROP POLICY IF EXISTS "Timetable manageable by authenticated users" ON public.timetable;
END $$;
CREATE POLICY "Timetable viewable by authenticated users" ON public.timetable FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Timetable manageable by authenticated users" ON public.timetable FOR ALL USING (auth.role() = 'authenticated');

-- 21. Employees
DO $$ BEGIN
  DROP POLICY IF EXISTS "Employees viewable by authenticated users" ON public.employees;
  DROP POLICY IF EXISTS "Employees manageable by authenticated users" ON public.employees;
END $$;
CREATE POLICY "Employees viewable by authenticated users" ON public.employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Employees manageable by authenticated users" ON public.employees FOR ALL USING (auth.role() = 'authenticated');

-- 22. Payroll
DO $$ BEGIN
  DROP POLICY IF EXISTS "Payroll viewable by authenticated users" ON public.payroll;
  DROP POLICY IF EXISTS "Payroll manageable by authenticated users" ON public.payroll;
END $$;
CREATE POLICY "Payroll viewable by authenticated users" ON public.payroll FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Payroll manageable by authenticated users" ON public.payroll FOR ALL USING (auth.role() = 'authenticated');

-- 23. Leave Requests
DO $$ BEGIN
  DROP POLICY IF EXISTS "Leave requests viewable by authenticated users" ON public.leave_requests;
  DROP POLICY IF EXISTS "Leave requests manageable by authenticated users" ON public.leave_requests;
END $$;
CREATE POLICY "Leave requests viewable by authenticated users" ON public.leave_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leave requests manageable by authenticated users" ON public.leave_requests FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- ✅ DONE! All RLS policies now allow authenticated users to access data
-- =====================================================
