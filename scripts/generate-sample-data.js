import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file')
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

// Sample data arrays
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Emma', 'Oliver', 'Sophia', 'Jack', 'Isabella', 'Daniel', 'Mia', 'Matthew', 'Charlotte', 'Henry', 'Amelia', 'Sebastian', 'Harper', 'Alexander', 'Evelyn', 'Benjamin', 'Abigail', 'Jacob', 'Emily', 'Ethan', 'Ella', 'Samuel', 'Scarlett', 'Lucas', 'Grace', 'Mason', 'Chloe', 'Logan', 'Victoria']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores']
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston']
const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'TX', 'FL', 'TX', 'OH', 'NC', 'CA', 'IN', 'WA', 'CO', 'DC', 'MA']
const qualifications = ['PhD Mathematics', 'Masters in Education', 'B.Ed Science', 'PhD English', 'Masters Physics', 'B.Ed History', 'PhD Chemistry', 'Masters Biology', 'B.Ed Geography', 'PhD Computer Science', 'Masters Arts', 'B.Ed Physical Education', 'PhD Psychology', 'Masters Music', 'B.Ed Art']
const specializations = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Psychology', 'Economics', 'Political Science']
const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Economics', 'Political Science', 'French', 'Spanish']
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const genders = ['male', 'female']
const statuses = ['active', 'active', 'active', 'active', 'inactive', 'on_leave']
const studentStatuses = ['active', 'active', 'active', 'graduated', 'inactive']
const attendanceStatuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'excused']
const paymentMethods = ['cash', 'card', 'bank_transfer', 'online']
const paymentStatuses = ['paid', 'paid', 'paid', 'pending', 'partial']
const examTypes = ['exam', 'quiz', 'assignment', 'project']
const leaveTypes = ['sick', 'vacation', 'personal', 'family', 'medical']
const leaveStatuses = ['approved', 'approved', 'pending', 'rejected']
const frequencies = ['monthly', 'quarterly', 'annually', 'one-time']
const bookCategories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Educational', 'Reference']
const vehicleTypes = ['bus', 'van', 'car']
const routeNames = ['Route A - North', 'Route B - South', 'Route C - East', 'Route D - West', 'Route E - Central']

async function clearExistingData() {
  console.log('Clearing existing data...')
  
  // Temporarily disable RLS for data insertion
  const tables = [
    'grades', 'examinations', 'fee_payments', 'fee_structures', 
    'enrollments', 'attendance', 'teacher_attendance', 
    'book_issuance', 'books', 'student_transport', 'routes', 'vehicles',
    'announcements', 'timetable', 'class_subjects', 
    'classes', 'subjects', 'teachers', 'students', 'parents',
    'payroll', 'employees', 'leave_requests', 'profiles'
  ]
  
  // Disable RLS on all tables
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;` 
      })
      if (!error) {
        console.log(`  ✓ Disabled RLS on ${table}`)
      }
    } catch (error) {
      // Table might not exist or RPC not available
    }
  }
  
  // Clear data
  for (const table of tables) {
    try {
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    } catch (error) {
      // Table might not exist
    }
  }
  console.log('✓ Existing data cleared')
  console.log('✓ RLS temporarily disabled for data insertion\n')
}

async function insertParents(count) {
  console.log(`\n📝 Inserting ${count} parents...`)
  const parents = []
  
  for (let i = 0; i < count; i++) {
    parents.push({
      first_name: randomChoice(firstNames),
      last_name: randomChoice(lastNames),
      email: `parent${i + 1}@example.com`,
      phone: `+1${randomInt(2000000000, 9999999999)}`,
      occupation: randomChoice(['Engineer', 'Doctor', 'Teacher', 'Business', 'Nurse', 'Manager', 'Artist', 'Scientist']),
      address: `${randomInt(100, 9999)} ${randomChoice(['Main', 'Oak', 'Elm', 'Pine', 'Maple'])} St`,
    })
  }
  
  const { data, error } = await supabase.from('parents').insert(parents).select()
  if (error) {
    console.error('Error inserting parents:', error)
    return []
  }
  console.log(`✓ ${data.length} parents inserted`)
  return data
}

async function insertTeachers(count) {
  console.log(`\n👨‍🏫 Inserting ${count} teachers...`)
  const teachers = []
  
  for (let i = 0; i < count; i++) {
    const firstName = randomChoice(firstNames)
    const lastName = randomChoice(lastNames)
    teachers.push({
      teacher_number: `TCH${String(i + 1).padStart(4, '0')}`,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: randomDate(new Date(1960, 0, 1), new Date(1995, 11, 31)),
      gender: randomChoice(genders),
      qualification: randomChoice(qualifications),
      experience_years: randomInt(0, 30),
      specialization: randomChoice(specializations),
      join_date: randomDate(new Date(2015, 0, 1), new Date(2024, 11, 31)),
      status: randomChoice(statuses),
      phone: `+1${randomInt(2000000000, 9999999999)}`,
      email: `teacher${i + 1}@school.com`,
      address: `${randomInt(100, 9999)} ${randomChoice(['Main', 'Oak', 'Elm', 'Pine', 'Maple'])} St, ${randomChoice(cities)}, ${randomChoice(states)}`,
    })
  }
  
  const { data, error } = await supabase.from('teachers').insert(teachers).select()
  if (error) {
    console.error('Error inserting teachers:', error)
    return []
  }
  console.log(`✓ ${data.length} teachers inserted`)
  return data
}

async function insertStudents(count, parents) {
  console.log(`\n🎓 Inserting ${count} students...`)
  const students = []
  
  for (let i = 0; i < count; i++) {
    const firstName = randomChoice(firstNames)
    const lastName = randomChoice(lastNames)
    students.push({
      student_number: `STU${String(i + 1).padStart(4, '0')}`,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: randomDate(new Date(2005, 0, 1), new Date(2016, 11, 31)),
      gender: randomChoice(genders),
      blood_group: randomChoice(bloodGroups),
      admission_date: randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31)),
      status: randomChoice(studentStatuses),
      address: `${randomInt(100, 9999)} ${randomChoice(['Main', 'Oak', 'Elm', 'Pine', 'Maple'])} St`,
      city: randomChoice(cities),
      state: randomChoice(states),
      zip_code: String(randomInt(10000, 99999)),
      country: 'USA',
      parent_guardian_id: parents.length > 0 ? randomChoice(parents).id : null,
    })
  }
  
  const { data, error } = await supabase.from('students').insert(students).select()
  if (error) {
    console.error('Error inserting students:', error)
    return []
  }
  console.log(`✓ ${data.length} students inserted`)
  return data
}

async function insertSubjects() {
  console.log('\n📚 Inserting subjects...')
  const subjectsData = subjects.map((subject, i) => ({
    name: subject,
    code: `${subject.substring(0, 3).toUpperCase()}${101 + i}`,
    description: `${subject} course for all grades`,
  }))
  
  const { data, error } = await supabase.from('subjects').insert(subjectsData).select()
  if (error) {
    console.error('Error inserting subjects:', error)
    return []
  }
  console.log(`✓ ${data.length} subjects inserted`)
  return data
}

async function insertClasses(teachers, subjects) {
  console.log('\n🏫 Inserting classes...')
  const grades = [9, 10, 11, 12]
  const sections = ['A', 'B', 'C', 'D']
  const classes = []
  
  for (const grade of grades) {
    for (const section of sections) {
      classes.push({
        name: `Grade ${grade}${section}`,
        section: section,
        grade_level: grade,
        teacher_id: teachers.length > 0 ? randomChoice(teachers).id : null,
        room_number: `${randomInt(100, 299)}`,
        capacity: randomInt(25, 40),
        academic_year: '2024-2025',
      })
    }
  }
  
  const { data, error } = await supabase.from('classes').insert(classes).select()
  if (error) {
    console.error('Error inserting classes:', error)
    return []
  }
  console.log(`✓ ${data.length} classes inserted`)
  
  // Insert class_subjects
  console.log('\n📖 Inserting class_subjects...')
  const classSubjects = []
  for (const cls of data) {
    const numSubjects = randomInt(4, 8)
    const selectedSubjects = subjects.sort(() => 0.5 - Math.random()).slice(0, numSubjects)
    
    for (const subject of selectedSubjects) {
      classSubjects.push({
        class_id: cls.id,
        subject_id: subject.id,
        teacher_id: teachers.length > 0 ? randomChoice(teachers).id : null,
      })
    }
  }
  
  if (classSubjects.length > 0) {
    const { error: csError } = await supabase.from('class_subjects').insert(classSubjects)
    if (csError) {
      console.error('Error inserting class_subjects:', csError)
    } else {
      console.log(`✓ ${classSubjects.length} class_subjects inserted`)
    }
  }
  
  return data
}

async function insertEnrollments(students, classes) {
  console.log('\n📋 Inserting enrollments...')
  const enrollments = []
  const usedCombinations = new Set()
  
  for (const student of students) {
    const cls = randomChoice(classes)
    const key = `${student.id}-${cls.id}`
    
    if (!usedCombinations.has(key)) {
      usedCombinations.add(key)
      enrollments.push({
        student_id: student.id,
        class_id: cls.id,
        academic_year: '2024-2025',
        enrollment_date: randomDate(new Date(2024, 7, 1), new Date(2024, 8, 15)),
        status: 'active',
      })
    }
  }
  
  const { data, error } = await supabase.from('enrollments').insert(enrollments).select()
  if (error) {
    console.error('Error inserting enrollments:', error)
    return []
  }
  console.log(`✓ ${data.length} enrollments inserted`)
  return data
}

async function insertAttendance(students) {
  console.log('\n✅ Inserting student attendance...')
  const attendance = []
  const dates = []
  
  // Generate last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  // Sample 100 students for attendance
  const sampleStudents = students.sort(() => 0.5 - Math.random()).slice(0, 100)
  
  for (const student of sampleStudents) {
    for (const date of dates.slice(0, 20)) { // Last 20 days
      attendance.push({
        student_id: student.id,
        date: date,
        status: randomChoice(attendanceStatuses),
        remarks: Math.random() > 0.8 ? 'Late arrival' : null,
      })
    }
  }
  
  const { data, error } = await supabase.from('attendance').insert(attendance).select()
  if (error) {
    console.error('Error inserting attendance:', error)
    return []
  }
  console.log(`✓ ${data.length} attendance records inserted`)
  return data
}

async function insertTeacherAttendance(teachers) {
  console.log('\n✅ Inserting teacher attendance...')
  const attendance = []
  const dates = []
  
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  for (const teacher of teachers.slice(0, 20)) {
    for (const date of dates.slice(0, 20)) {
      attendance.push({
        teacher_id: teacher.id,
        date: date,
        status: randomChoice(attendanceStatuses),
        check_in: Math.random() > 0.1 ? `${randomInt(7, 9)}:${randomInt(0, 59)}:00` : null,
        check_out: Math.random() > 0.3 ? `${randomInt(15, 17)}:${randomInt(0, 59)}:00` : null,
      })
    }
  }
  
  const { data, error } = await supabase.from('teacher_attendance').insert(attendance).select()
  if (error) {
    console.error('Error inserting teacher attendance:', error)
    return []
  }
  console.log(`✓ ${data.length} teacher attendance records inserted`)
  return data
}

async function insertExaminations(classes, subjects) {
  console.log('\n📝 Inserting examinations...')
  const exams = []
  
  const examNames = ['Mid-term Exam', 'Final Exam', 'Unit Test 1', 'Unit Test 2', 'Quiz 1', 'Project Work']
  
  for (let i = 0; i < 50; i++) {
    const cls = randomChoice(classes)
    const subject = randomChoice(subjects)
    exams.push({
      name: `${randomChoice(examNames)} - ${cls.name}`,
      type: randomChoice(examTypes),
      class_id: cls.id,
      subject_id: subject.id,
      max_marks: randomChoice([50, 100, 25, 75]),
      weightage: randomChoice([20, 25, 30, 40, 50]),
      exam_date: randomDate(new Date(2024, 8, 1), new Date(2024, 11, 31)),
      academic_year: '2024-2025',
    })
  }
  
  const { data, error } = await supabase.from('examinations').insert(exams).select()
  if (error) {
    console.error('Error inserting examinations:', error)
    return []
  }
  console.log(`✓ ${data.length} examinations inserted`)
  return data
}

async function insertGrades(students, examinations) {
  console.log('\n📊 Inserting grades...')
  const grades = []
  const usedCombinations = new Set()
  
  const sampleStudents = students.slice(0, 100)
  const sampleExams = examinations.slice(0, 30)
  
  for (const exam of sampleExams) {
    for (const student of sampleStudents.slice(0, randomInt(20, 50))) {
      const key = `${student.id}-${exam.id}`
      if (!usedCombinations.has(key)) {
        usedCombinations.add(key)
        const marksObtained = randomInt(Math.floor(exam.max_marks * 0.4), exam.max_marks)
        const percentage = (marksObtained / exam.max_marks) * 100
        
        let grade = 'F'
        if (percentage >= 90) grade = 'A+'
        else if (percentage >= 80) grade = 'A'
        else if (percentage >= 70) grade = 'B+'
        else if (percentage >= 60) grade = 'B'
        else if (percentage >= 50) grade = 'C'
        else if (percentage >= 40) grade = 'D'
        
        grades.push({
          student_id: student.id,
          examination_id: exam.id,
          marks_obtained: marksObtained,
          grade: grade,
          remarks: percentage >= 50 ? 'Passed' : 'Needs improvement',
        })
      }
    }
  }
  
  const { data, error } = await supabase.from('grades').insert(grades).select()
  if (error) {
    console.error('Error inserting grades:', error)
    return []
  }
  console.log(`✓ ${data.length} grade records inserted`)
  return data
}

async function insertFeeStructures(classes) {
  console.log('\n💰 Inserting fee structures...')
  const feeNames = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Technology Fee', 'Transport Fee', 'Annual Day Fee', 'Exam Fee']
  const fees = []
  
  for (const cls of classes.slice(0, 8)) {
    for (let i = 0; i < 4; i++) {
      fees.push({
        name: `${feeNames[i]} - ${cls.name}`,
        class_id: cls.id,
        amount: randomInt(500, 5000),
        frequency: randomChoice(frequencies),
        academic_year: '2024-2025',
        due_date: randomDate(new Date(2024, 8, 1), new Date(2025, 6, 31)),
      })
    }
  }
  
  const { data, error } = await supabase.from('fee_structures').insert(fees).select()
  if (error) {
    console.error('Error inserting fee structures:', error)
    return []
  }
  console.log(`✓ ${data.length} fee structures inserted`)
  return data
}

async function insertFeePayments(students, feeStructures) {
  console.log('\n💳 Inserting fee payments...')
  const payments = []
  
  const sampleStudents = students.slice(0, 100)
  
  for (const student of sampleStudents) {
    const numPayments = randomInt(1, 3)
    for (let i = 0; i < numPayments; i++) {
      const feeStructure = randomChoice(feeStructures)
      const amount = parseInt(feeStructure.amount)
      const paidAmount = Math.random() > 0.2 ? amount : Math.floor(amount * 0.5)
      
      payments.push({
        student_id: student.id,
        fee_structure_id: feeStructure.id,
        amount_paid: paidAmount,
        payment_date: randomDate(new Date(2024, 7, 1), new Date(2024, 11, 31)),
        payment_method: randomChoice(paymentMethods),
        transaction_id: `TXN${randomInt(100000, 999999)}`,
        receipt_number: `RCP${randomInt(10000, 99999)}`,
        status: randomChoice(paymentStatuses),
      })
    }
  }
  
  const { data, error } = await supabase.from('fee_payments').insert(payments).select()
  if (error) {
    console.error('Error inserting fee payments:', error)
    return []
  }
  console.log(`✓ ${data.length} fee payments inserted`)
  return data
}

async function insertAnnouncements() {
  console.log('\n📢 Inserting announcements...')
  const announcements = []
  const titles = [
    'School Reopening Notice',
    'Holiday Announcement',
    'Parent-Teacher Meeting',
    'Sports Day Event',
    'Annual Function',
    'Exam Schedule Released',
    'Summer Vacation Dates',
    'New Library Books',
    'Science Fair 2024',
    'Cultural Program',
    'Health Checkup Camp',
    'Book Fair Next Week',
  ]
  
  for (let i = 0; i < 20; i++) {
    announcements.push({
      title: titles[i % titles.length],
      content: `This is an important announcement regarding ${titles[i % titles.length].toLowerCase()}. Please check the details and take necessary action. Contact the school office for more information.`,
      target_audience: ['all'],
      priority: randomChoice(['low', 'normal', 'high', 'urgent']),
      publish_date: randomDate(new Date(2024, 9, 1), new Date(2024, 11, 31)),
      is_active: true,
    })
  }
  
  const { data, error } = await supabase.from('announcements').insert(announcements).select()
  if (error) {
    console.error('Error inserting announcements:', error)
    return []
  }
  console.log(`✓ ${data.length} announcements inserted`)
  return data
}

async function insertLibraryData() {
  console.log('\n📚 Inserting library books...')
  const books = []
  const bookTitles = [
    'To Kill a Mockingbird', '1984', 'The Great Gatsby', 'Pride and Prejudice',
    'The Catcher in the Rye', 'Lord of the Flies', 'The Hobbit', 'Fahrenheit 451',
    'Animal Farm', 'Brave New World', 'The Alchemist', 'Harry Potter Series',
    'Mathematics Basics', 'Physics Fundamentals', 'Chemistry Essentials',
    'Biology for Students', 'World History', 'Geography Atlas',
    'English Grammar', 'Computer Science Intro', 'Art and Design',
    'Music Theory', 'Economics 101', 'Political Systems',
  ]
  
  for (let i = 0; i < 50; i++) {
    const title = bookTitles[i % bookTitles.length]
    books.push({
      title: `${title} ${i >= 24 ? 'Vol. ' + (i - 23) : ''}`,
      author: randomChoice(['John Smith', 'Mary Johnson', 'Robert Williams', 'Patricia Brown', 'Michael Davis']),
      isbn: `978-${randomInt(1000000000, 9999999999)}`,
      publisher: randomChoice(['Penguin', 'HarperCollins', 'Macmillan', 'Scholastic', 'Oxford Press']),
      publication_year: randomInt(2010, 2024),
      category: randomChoice(bookCategories),
      total_copies: randomInt(1, 5),
      available_copies: randomInt(0, 5),
      location: `Shelf ${randomChoice(['A', 'B', 'C', 'D', 'E'])}-${randomInt(1, 20)}`,
    })
  }
  
  const { data, error } = await supabase.from('books').insert(books).select()
  if (error) {
    console.error('Error inserting books:', error)
    return { books: [], bookIds: [] }
  }
  console.log(`✓ ${data.length} books inserted`)
  return { books: data, bookIds: data.map(b => b.id) }
}

async function insertBookIssuances(students, bookIds) {
  console.log('\n📖 Inserting book issuances...')
  const issuances = []
  
  const sampleStudents = students.slice(0, 50)
  
  for (let i = 0; i < 40; i++) {
    const student = randomChoice(sampleStudents)
    const bookId = randomChoice(bookIds)
    const issueDate = randomDate(new Date(2024, 8, 1), new Date(2024, 11, 15))
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + 14)
    
    const isReturned = Math.random() > 0.5
    let returnDate = null
    if (isReturned) {
      returnDate = randomDate(new Date(issueDate), new Date(2024, 11, 31))
    }
    
    issuances.push({
      book_id: bookId,
      student_id: student.id,
      issue_date: issueDate,
      due_date: dueDate.toISOString().split('T')[0],
      return_date: returnDate,
      status: isReturned ? 'returned' : 'issued',
    })
  }
  
  const { data, error } = await supabase.from('book_issuance').insert(issuances).select()
  if (error) {
    console.error('Error inserting book issuances:', error)
    return []
  }
  console.log(`✓ ${data.length} book issuances inserted`)
  return data
}

async function insertTransportData(students) {
  console.log('\n🚌 Inserting transport data...')
  
  // Vehicles
  const vehicles = []
  for (let i = 0; i < 15; i++) {
    vehicles.push({
      vehicle_number: `VH-${randomInt(1000, 9999)}`,
      vehicle_type: randomChoice(vehicleTypes),
      capacity: randomChoice([30, 40, 50, 60]),
      driver_name: randomChoice(firstNames) + ' ' + randomChoice(lastNames),
      driver_phone: `+1${randomInt(2000000000, 9999999999)}`,
      status: randomChoice(['active', 'active', 'active', 'maintenance']),
    })
  }
  
  const { data: vehiclesData, error: vError } = await supabase.from('vehicles').insert(vehicles).select()
  if (vError) {
    console.error('Error inserting vehicles:', vError)
    return
  }
  console.log(`✓ ${vehiclesData.length} vehicles inserted`)
  
  // Routes
  const routes = []
  for (let i = 0; i < 10; i++) {
    routes.push({
      route_name: routeNames[i % routeNames.length],
      vehicle_id: randomChoice(vehiclesData).id,
      pickup_points: [{ location: randomChoice(cities), time: '07:30' }],
      total_distance: randomInt(5, 50),
      estimated_time: `${randomInt(20, 90)} minutes`,
      status: 'active',
    })
  }
  
  const { data: routesData, error: rError } = await supabase.from('transport_routes').insert(routes).select()
  if (rError) {
    console.error('Error inserting routes:', rError)
    return
  }
  console.log(`✓ ${routesData.length} routes inserted`)
  
  // Student transport
  const studentTransport = []
  const sampleStudents = students.slice(0, 80)
  
  for (const student of sampleStudents) {
    const vehicle = randomChoice(vehiclesData)
    const route = randomChoice(routesData)
    
    studentTransport.push({
      student_id: student.id,
      vehicle_id: vehicle.id,
      route_id: route.id,
      pickup_point: randomChoice(cities),
      monthly_fee: randomInt(100, 500),
      status: 'active',
    })
  }
  
  const { data: stData, error: stError } = await supabase.from('student_transport').insert(studentTransport).select()
  if (stError) {
    console.error('Error inserting student transport:', stError)
    return
  }
  console.log(`✓ ${stData.length} student transport records inserted`)
}

async function insertTimetable(classes, subjects, teachers) {
  console.log('\n📅 Inserting timetable...')
  const timetable = []
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const timeSlots = [
    { start: '08:00', end: '08:45' },
    { start: '08:50', end: '09:35' },
    { start: '09:40', end: '10:25' },
    { start: '10:40', end: '11:25' },
    { start: '11:30', end: '12:15' },
    { start: '13:00', end: '13:45' },
    { start: '13:50', end: '14:35' },
  ]
  
  for (const cls of classes.slice(0, 8)) {
    for (const day of days) {
      const usedSlots = new Set()
      const numPeriods = randomInt(5, 7)
      
      for (let i = 0; i < numPeriods; i++) {
        let slotIndex
        do {
          slotIndex = randomInt(0, timeSlots.length - 1)
        } while (usedSlots.has(slotIndex))
        
        usedSlots.add(slotIndex)
        const slot = timeSlots[slotIndex]
        const subject = randomChoice(subjects)
        
        timetable.push({
          class_id: cls.id,
          subject_id: subject.id,
          teacher_id: randomChoice(teachers).id,
          day_of_week: day,
          start_time: slot.start,
          end_time: slot.end,
          room_number: cls.room_number,
        })
      }
    }
  }
  
  const { data, error } = await supabase.from('timetable').insert(timetable).select()
  if (error) {
    console.error('Error inserting timetable:', error)
    return []
  }
  console.log(`✓ ${data.length} timetable entries inserted`)
  return data
}

async function insertHRData() {
  console.log('\n👥 Inserting HR data...')
  
  // Employees
  const employees = []
  const departments = ['Administration', 'Finance', 'IT', 'Library', 'Maintenance', 'Security', 'Cafeteria']
  const designations = ['Manager', 'Coordinator', 'Assistant', 'Technician', 'Staff', 'Supervisor']
  
  for (let i = 0; i < 30; i++) {
    employees.push({
      employee_number: `EMP${String(i + 1).padStart(4, '0')}`,
      first_name: randomChoice(firstNames),
      last_name: randomChoice(lastNames),
      email: `employee${i + 1}@school.com`,
      phone: `+1${randomInt(2000000000, 9999999999)}`,
      department: randomChoice(departments),
      designation: randomChoice(designations),
      role: 'staff',
      join_date: randomDate(new Date(2018, 0, 1), new Date(2024, 11, 31)),
      status: randomChoice(statuses),
      basic_salary: randomInt(30000, 80000),
      allowances: randomInt(3000, 8000),
      address: `${randomInt(100, 9999)} ${randomChoice(['Main', 'Oak', 'Elm'])} St`,
    })
  }
  
  const { data: employeesData, error: empError } = await supabase.from('employees').insert(employees).select()
  if (empError) {
    console.error('Error inserting employees:', empError)
    return
  }
  console.log(`✓ ${employeesData.length} employees inserted`)
  
  // Payroll
  const payroll = []
  for (const emp of employeesData.slice(0, 20)) {
    for (let month = 9; month <= 11; month++) {
      const basicSalary = emp.basic_salary || 50000
      const allowances = emp.allowances || 5000
      const deductions = Math.floor(basicSalary * 0.1)
      const grossSalary = basicSalary + allowances
      const netSalary = grossSalary - deductions
      
      payroll.push({
        employee_id: emp.id,
        month: month,
        year: 2024,
        basic_salary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        gross_salary: grossSalary,
        net_salary: netSalary,
        status: 'paid',
        payment_date: `2024-${String(month).padStart(2, '0')}-28`,
        payment_method: 'bank_transfer',
      })
    }
  }
  
  const { data: payrollData, error: payError } = await supabase.from('payroll').insert(payroll).select()
  if (payError) {
    console.error('Error inserting payroll:', payError)
    return
  }
  console.log(`✓ ${payrollData.length} payroll records inserted`)
  
  // Leave requests
  const leaveRequests = []
  for (let i = 0; i < 25; i++) {
    const emp = randomChoice(employeesData)
    const startDate = randomDate(new Date(2024, 9, 1), new Date(2024, 11, 31))
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + randomInt(1, 5))
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    
    leaveRequests.push({
      employee_id: emp.id,
      leave_type: randomChoice(leaveTypes),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      total_days: totalDays,
      reason: randomChoice(['Personal matters', 'Medical appointment', 'Family event', 'Vacation', 'Health reasons']),
      status: randomChoice(leaveStatuses),
    })
  }
  
  const { data: leaveData, error: leaveError } = await supabase.from('leave_requests').insert(leaveRequests).select()
  if (leaveError) {
    console.error('Error inserting leave requests:', leaveError)
    return
  }
  console.log(`✓ ${leaveData.length} leave requests inserted`)
}

async function main() {
  console.log('🚀 Starting sample data generation...\n')
  console.log('⚠️  This will clear existing data and insert new sample data.')
  console.log('⏳ Please wait...\n')
  
  try {
    // Clear existing data
    await clearExistingData()
    
    // Insert data in order of dependencies
    const parents = await insertParents(150)
    const teachers = await insertTeachers(50) // 50 teachers
    const students = await insertStudents(500, parents) // 500 students
    
    if (students.length === 0) {
      console.error('❌ Failed to insert students. Aborting.')
      return
    }
    
    const subjectsData = await insertSubjects()
    const classesData = await insertClasses(teachers, subjectsData)
    
    if (classesData.length === 0) {
      console.error('❌ Failed to insert classes. Aborting.')
      return
    }
    
    await insertEnrollments(students, classesData)
    await insertAttendance(students)
    await insertTeacherAttendance(teachers)
    
    const examinations = await insertExaminations(classesData, subjectsData)
    if (examinations.length > 0) {
      await insertGrades(students, examinations)
    }
    
    const feeStructures = await insertFeeStructures(classesData)
    if (feeStructures.length > 0) {
      await insertFeePayments(students, feeStructures)
    }
    
    await insertAnnouncements()
    
    const { bookIds } = await insertLibraryData()
    if (bookIds.length > 0) {
      await insertBookIssuances(students, bookIds)
    }
    
    await insertTransportData(students)
    await insertTimetable(classesData, subjectsData, teachers)
    await insertHRData()
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ Sample data generation completed successfully!')
    console.log('='.repeat(60))
    console.log('\n📊 Summary:')
    console.log(`   • 500 Students`)
    console.log(`   • 50 Teachers`)
    console.log(`   • 150 Parents`)
    console.log(`   • ${subjectsData.length} Subjects`)
    console.log(`   • ${classesData.length} Classes`)
    console.log(`   • ~500 Enrollments`)
    console.log(`   • ~2000 Attendance records`)
    console.log(`   • ~200 Grades/Examinations`)
    console.log(`   • ~30 Fee structures & payments`)
    console.log(`   • 20 Announcements`)
    console.log(`   • 50 Library books & issuances`)
    console.log(`   • Transport data (vehicles, routes, students)`)
    console.log(`   • Timetable entries`)
    console.log(`   • HR data (employees, payroll, leave requests)`)
    console.log('\n🎉 Your database is now populated and ready for testing!')
    
  } catch (error) {
    console.error('❌ Error during data generation:', error)
  }
}

main()
