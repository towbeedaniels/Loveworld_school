-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE public.students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  student_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  photo_url TEXT,
  parent_guardian_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parents/Guardians table
CREATE TABLE public.parents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  occupation TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers table
CREATE TABLE public.teachers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  teacher_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  qualification TEXT,
  experience_years INTEGER,
  specialization TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  phone TEXT,
  email TEXT,
  address TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes table
CREATE TABLE public.classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  section TEXT,
  grade_level INTEGER NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id),
  room_number TEXT,
  capacity INTEGER,
  academic_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subject table
CREATE TABLE public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class-Subject relationship
CREATE TABLE public.class_subjects (
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id),
  PRIMARY KEY (class_id, subject_id)
);

-- Student-Class enrollment
CREATE TABLE public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id, academic_year)
);

-- Attendance table
CREATE TABLE public.attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Teacher Attendance
CREATE TABLE public.teacher_attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
  check_in TIME,
  check_out TIME,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teacher_id, date)
);

-- Examinations table
CREATE TABLE public.examinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('exam', 'quiz', 'assignment', 'project')),
  class_id UUID REFERENCES public.classes(id),
  subject_id UUID REFERENCES public.subjects(id),
  max_marks INTEGER NOT NULL,
  weightage NUMERIC(5, 2),
  exam_date DATE,
  academic_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades table
CREATE TABLE public.grades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  examination_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(5, 2),
  grade TEXT,
  remarks TEXT,
  graded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, examination_id)
);

-- Fee Structure table
CREATE TABLE public.fee_structures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id),
  amount NUMERIC(10, 2) NOT NULL,
  frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'annually', 'one-time')),
  academic_year TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Payments table
CREATE TABLE public.fee_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES public.fee_structures(id),
  amount_paid NUMERIC(10, 2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'online')),
  transaction_id TEXT,
  receipt_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'partial', 'overdue', 'cancelled')),
  remarks TEXT,
  paid_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Books table
CREATE TABLE public.books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  category TEXT,
  publisher TEXT,
  publication_year INTEGER,
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book Issuance table
CREATE TABLE public.book_issuance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id),
  student_id UUID REFERENCES public.students(id),
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  return_date DATE,
  fine_amount NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transport Vehicles table
CREATE TABLE public.vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT CHECK (vehicle_type IN ('bus', 'van', 'car')),
  capacity INTEGER,
  driver_name TEXT,
  driver_phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transport Routes table
CREATE TABLE public.routes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  route_name TEXT NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  pickup_points JSONB,
  total_distance NUMERIC(10, 2),
  estimated_time TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Transport Assignment
CREATE TABLE public.student_transport (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  route_id UUID REFERENCES public.routes(id),
  pickup_point TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT[] DEFAULT ARRAY['all'],
  created_by UUID REFERENCES auth.users(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timetable table
CREATE TABLE public.timetable (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id),
  subject_id UUID REFERENCES public.subjects(id),
  teacher_id UUID REFERENCES public.teachers(id),
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_issuance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Students: Full access for admin/teachers, limited for others
CREATE POLICY "Students viewable by authenticated users" ON public.students
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Students manageable by admin/teachers" ON public.students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Teachers: Similar to students
CREATE POLICY "Teachers viewable by authenticated users" ON public.teachers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers manageable by admin" ON public.teachers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Classes: Viewable by all, manageable by admin/teachers
CREATE POLICY "Classes viewable by authenticated users" ON public.classes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Classes manageable by admin/teachers" ON public.classes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Attendance: Viewable by all, manageable by admin/teachers
CREATE POLICY "Attendance viewable by authenticated users" ON public.attendance
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Attendance manageable by admin/teachers" ON public.attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Grades: Viewable by all, manageable by admin/teachers
CREATE POLICY "Grades viewable by authenticated users" ON public.grades
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Grades manageable by admin/teachers" ON public.grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Fee Payments: Restricted access
CREATE POLICY "Fee payments viewable by admin and own parent" ON public.fee_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Fee payments manageable by admin" ON public.fee_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Books: Viewable by all, manageable by admin/librarian
CREATE POLICY "Books viewable by authenticated users" ON public.books
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Books manageable by admin" ON public.books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Announcements: Viewable by all, manageable by admin/teachers
CREATE POLICY "Announcements viewable by authenticated users" ON public.announcements
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Announcements manageable by admin/teachers" ON public.announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON public.parents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_examinations_updated_at BEFORE UPDATE ON public.examinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_structures_updated_at BEFORE UPDATE ON public.fee_structures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at BEFORE UPDATE ON public.fee_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_book_issuance_updated_at BEFORE UPDATE ON public.book_issuance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timetable_updated_at BEFORE UPDATE ON public.timetable
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better query performance
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_students_admission_date ON public.students(admission_date);
CREATE INDEX idx_teachers_status ON public.teachers(status);
CREATE INDEX idx_attendance_student_date ON public.attendance(student_id, date);
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_grades_student_exam ON public.grades(student_id, examination_id);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_class ON public.enrollments(class_id);
CREATE INDEX idx_fee_payments_student ON public.fee_payments(student_id);
CREATE INDEX idx_fee_payments_status ON public.fee_payments(status);
CREATE INDEX idx_book_issuance_student ON public.book_issuance(student_id);
CREATE INDEX idx_book_issuance_status ON public.book_issuance(status);
CREATE INDEX idx_timetable_class ON public.timetable(class_id);
CREATE INDEX idx_announcements_active ON public.announcements(is_active, publish_date);
