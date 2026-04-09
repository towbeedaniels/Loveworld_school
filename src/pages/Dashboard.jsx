import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Users,
  GraduationCap,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Clock,
  BookOpen,
  Bus,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalBooks: 0,
    revenueThisMonth: 0,
    attendanceRate: 0,
  })
  const [attendanceData, setAttendanceData] = useState([])
  const [gradeDistribution, setGradeDistribution] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch counts
      const [
        { count: studentsCount },
        { count: teachersCount },
        { count: classesCount },
        { count: booksCount },
        { count: parentsCount },
        { count: employeesCount },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('teachers').select('*', { count: 'exact', head: true }),
        supabase.from('classes').select('*', { count: 'exact', head: true }),
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('parents').select('*', { count: 'exact', head: true }),
        supabase.from('employees').select('*', { count: 'exact', head: true }),
      ])

      // Fetch revenue this month
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()
      const { data: payments } = await supabase
        .from('fee_payments')
        .select('amount_paid')
        .eq('status', 'paid')

      const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0) || 0

      // Fetch attendance stats for last 7 days
      const today = new Date()
      const last7Days = new Date(today)
      last7Days.setDate(last7Days.getDate() - 6)

      const { data: attendanceRecords } = await supabase
        .from('attendance')
        .select('date, status')
        .gte('date', last7Days.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const attendanceByDay = {}
      
      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dayName = dayNames[date.getDay()]
        attendanceByDay[dayName] = { name: dayName, present: 0, absent: 0 }
      }

      if (attendanceRecords) {
        attendanceRecords.forEach(record => {
          const date = new Date(record.date)
          const dayName = dayNames[date.getDay()]
          if (attendanceByDay[dayName]) {
            if (record.status === 'present' || record.status === 'late') {
              attendanceByDay[dayName].present++
            } else if (record.status === 'absent') {
              attendanceByDay[dayName].absent++
            }
          }
        })
      }

      const attendanceChartData = Object.values(attendanceByDay)

      // Calculate attendance rate
      const totalPresent = attendanceRecords?.filter(r => r.status === 'present' || r.status === 'late').length || 0
      const totalAttendance = attendanceRecords?.length || 1
      const attendanceRate = ((totalPresent / totalAttendance) * 100).toFixed(1)

      // Fetch grade distribution
      const { data: grades } = await supabase
        .from('grades')
        .select('grade')

      const gradeCount = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
      if (grades) {
        grades.forEach(g => {
          if (gradeCount.hasOwnProperty(g.grade)) {
            gradeCount[g.grade]++
          }
        })
      }

      const gradeChartData = Object.entries(gradeCount)
        .filter(([_, count]) => count > 0)
        .map(([name, value]) => ({ name, value }))

      // Fetch recent activities (latest enrollments, payments, etc.)
      const { data: recentStudents } = await supabase
        .from('students')
        .select('first_name, last_name, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      const { data: recentPayments } = await supabase
        .from('fee_payments')
        .select('amount_paid, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      const activities = []
      
      if (recentStudents) {
        recentStudents.forEach((student, idx) => {
          activities.push({
            id: `student-${idx}`,
            user: 'System',
            action: 'enrolled new student',
            target: `${student.first_name} ${student.last_name}`,
            time: getTimeAgo(student.created_at),
          })
        })
      }

      if (recentPayments) {
        recentPayments.forEach((payment, idx) => {
          activities.push({
            id: `payment-${idx}`,
            user: 'Finance Office',
            action: `collected fee payment - $${parseFloat(payment.amount_paid || 0).toFixed(2)}`,
            target: payment.status,
            time: getTimeAgo(payment.created_at),
          })
        })
      }

      // Sort by time (newest first) and limit to 5
      activities.sort((a, b) => b.time.localeCompare(a.time))
      
      setStats({
        totalStudents: studentsCount || 0,
        totalTeachers: teachersCount || 0,
        totalClasses: classesCount || 0,
        totalBooks: booksCount || 0,
        revenueThisMonth: totalRevenue,
        attendanceRate: attendanceRate,
      })

      setAttendanceData(attendanceChartData)
      setGradeDistribution(gradeChartData)
      setRecentActivities(activities.slice(0, 5))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now - time
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return time.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statsCards = [
    { 
      name: 'Total Students', 
      value: stats.totalStudents.toLocaleString(), 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Total Teachers', 
      value: stats.totalTeachers.toLocaleString(), 
      icon: GraduationCap, 
      color: 'bg-green-500' 
    },
    { 
      name: 'Total Classes', 
      value: stats.totalClasses.toLocaleString(), 
      icon: BookOpen, 
      color: 'bg-purple-500' 
    },
    { 
      name: 'Attendance Rate', 
      value: `${stats.attendanceRate}%`, 
      icon: CalendarCheck, 
      color: 'bg-orange-500' 
    },
    { 
      name: 'Total Books', 
      value: stats.totalBooks.toLocaleString(), 
      icon: BookOpen, 
      color: 'bg-indigo-500' 
    },
    { 
      name: 'Revenue (Paid)', 
      value: `₦${stats.revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      color: 'bg-emerald-500' 
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Real-time overview from database • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-xs text-gray-600 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days Attendance</h2>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" name="Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No attendance data available
            </div>
          )}
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          {gradeDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {gradeDistribution.map((grade, index) => (
                  <div key={grade.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">{grade.name}: {grade.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No grade data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="bg-primary-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activities
          </div>
        )}
      </div>
    </div>
  )
}
