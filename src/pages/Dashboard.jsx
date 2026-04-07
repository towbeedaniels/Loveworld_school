import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Users,
  GraduationCap,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Clock,
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

const stats = [
  { name: 'Total Students', value: '1,234', icon: Users, change: '+12%', color: 'bg-blue-500' },
  { name: 'Total Teachers', value: '86', icon: GraduationCap, change: '+4%', color: 'bg-green-500' },
  { name: 'Revenue This Month', value: '$124,500', icon: DollarSign, change: '+18%', color: 'bg-purple-500' },
  { name: 'Attendance Rate', value: '94.2%', icon: CalendarCheck, change: '+2.1%', color: 'bg-orange-500' },
]

const attendanceData = [
  { name: 'Mon', present: 120, absent: 10 },
  { name: 'Tue', present: 115, absent: 15 },
  { name: 'Wed', present: 125, absent: 5 },
  { name: 'Thu', present: 118, absent: 12 },
  { name: 'Fri', present: 122, absent: 8 },
]

const gradeDistribution = [
  { name: 'A', value: 35 },
  { name: 'B', value: 40 },
  { name: 'C', value: 20 },
  { name: 'D', value: 5 },
]

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

const recentActivities = [
  { id: 1, user: 'John Smith', action: 'enrolled new student', target: 'Emma Wilson', time: '2 hours ago' },
  { id: 2, user: 'Sarah Johnson', action: 'updated grades for', target: 'Class 10A', time: '3 hours ago' },
  { id: 3, user: 'Mike Davis', action: 'marked attendance for', target: 'Class 9B', time: '4 hours ago' },
  { id: 4, user: 'Emily Brown', action: 'collected fee payment from', target: 'Student #1234', time: '5 hours ago' },
  { id: 5, user: 'David Lee', action: 'added new class', target: 'Physics 101', time: '6 hours ago' },
]

export default function Dashboard() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance</h2>
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
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {gradeDistribution.map((grade, index) => (
              <div key={grade.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{grade.name}: {grade.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
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
      </div>
    </div>
  )
}
