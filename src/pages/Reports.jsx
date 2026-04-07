import { useState } from 'react'
import { useReports } from '../hooks/useReports'
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
  LineChart,
  Line,
  Legend,
} from 'recharts'
import {
  Users,
  GraduationCap,
  BookOpen,
  Bus,
  DollarSign,
  TrendingUp,
  CalendarCheck,
  Award,
  Download,
  RefreshCw,
} from 'lucide-react'

export default function Reports() {
  const { summary, loading, refetch } = useReports()
  const [activeTab, setActiveTab] = useState('overview')

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive school analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'students'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'finance'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Finance
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'resources'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Resources
          </button>
        </div>
      </div>

      {activeTab === 'overview' && <OverviewTab summary={summary} colors={COLORS} />}
      {activeTab === 'students' && <StudentsTab summary={summary} colors={COLORS} />}
      {activeTab === 'finance' && <FinanceTab summary={summary} />}
      {activeTab === 'resources' && <ResourcesTab summary={summary} />}
    </div>
  )
}

function OverviewTab({ summary, colors }) {
  const overviewData = [
    { name: 'Students', value: summary.students.total, color: colors[0] },
    { name: 'Teachers', value: summary.teachers.total, color: colors[1] },
    { name: 'Classes', value: summary.classes, color: colors[2] },
    { name: 'Books', value: summary.books.total, color: colors[3] },
    { name: 'Vehicles', value: summary.vehicles.total, color: colors[4] },
  ]

  const attendanceData = [
    { name: 'Present', value: summary.attendance.todayPresent, color: '#10b981' },
    { name: 'Absent', value: summary.attendance.todayAbsent, color: '#ef4444' },
  ]

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold mb-1">{summary.students.total}</p>
          <p className="text-blue-100">Total Students</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <span className="font-semibold">{summary.students.active}</span>
              <span className="text-blue-200 ml-1">Active</span>
            </div>
            <div>
              <span className="font-semibold">{summary.students.graduated}</span>
              <span className="text-blue-200 ml-1">Graduated</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <GraduationCap className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold mb-1">{summary.teachers.total}</p>
          <p className="text-green-100">Total Teachers</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <span className="font-semibold">{summary.teachers.active}</span>
              <span className="text-green-200 ml-1">Active</span>
            </div>
            <div>
              <span className="font-semibold">{summary.teachers.onLeave}</span>
              <span className="text-green-200 ml-1">On Leave</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold mb-1">
            ${summary.payments.totalRevenue.toLocaleString()}
          </p>
          <p className="text-purple-100">Total Revenue</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <span className="font-semibold">{summary.payments.pending}</span>
              <span className="text-purple-200 ml-1">Pending</span>
            </div>
            <div>
              <span className="font-semibold">{summary.payments.overdue}</span>
              <span className="text-purple-200 ml-1">Overdue</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CalendarCheck className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold mb-1">{summary.attendance.todayTotal}</p>
          <p className="text-orange-100">Today's Attendance</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <span className="font-semibold">{summary.attendance.todayPresent}</span>
              <span className="text-orange-200 ml-1">Present</span>
            </div>
            <div>
              <span className="font-semibold">{summary.attendance.todayAbsent}</span>
              <span className="text-orange-200 ml-1">Absent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Pie */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Attendance Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Academic Performance</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{summary.grades.average}</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Library Usage</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {summary.books.totalCopies - summary.books.availableCopies}
            </p>
            <p className="text-sm text-gray-600">Books Issued</p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Bus className="w-6 h-6 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Transport</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">{summary.vehicles.active}</p>
            <p className="text-sm text-gray-600">Active Vehicles</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentsTab({ summary, colors }) {
  const statusData = [
    { name: 'Active', value: summary.students.active, color: '#10b981' },
    { name: 'Inactive', value: summary.students.inactive, color: '#ef4444' },
    { name: 'Graduated', value: summary.students.graduated, color: '#3b82f6' },
  ]

  const teacherStatusData = [
    { name: 'Active', value: summary.teachers.active, color: '#10b981' },
    { name: 'Inactive', value: summary.teachers.inactive, color: '#ef4444' },
    { name: 'On Leave', value: summary.teachers.onLeave, color: '#f59e0b' },
  ]

  const studentTeacherRatio = [
    { name: 'Students', value: summary.students.total },
    { name: 'Teachers', value: summary.teachers.total },
  ]

  const ratio =
    summary.teachers.total > 0
      ? (summary.students.total / summary.teachers.total).toFixed(1)
      : 'N/A'

  return (
    <div>
      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Students</h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">{summary.students.total}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 font-medium">
              {summary.students.active} active
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Student-Teacher Ratio</h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">{ratio}:1</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {summary.students.total} students / {summary.teachers.total} teachers
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Classes</h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">{summary.classes}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active classes</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Teacher Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teacherStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {teacherStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Students vs Teachers</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentTeacherRatio}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function FinanceTab({ summary }) {
  const paymentStatusData = [
    { name: 'Paid', value: summary.payments.total - summary.payments.pending - summary.payments.overdue, color: '#10b981' },
    { name: 'Pending', value: summary.payments.pending, color: '#f59e0b' },
    { name: 'Overdue', value: summary.payments.overdue, color: '#ef4444' },
  ]

  const estimatedPendingRevenue = summary.payments.pending * 1000 // Estimate
  const estimatedOverdueRevenue = summary.payments.overdue * 1000 // Estimate

  return (
    <div>
      {/* Finance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <DollarSign className="w-8 h-8 mb-4" />
          <p className="text-4xl font-bold mb-2">
            ${summary.payments.totalRevenue.toLocaleString()}
          </p>
          <p className="text-green-100">Total Revenue Collected</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm p-6 text-white">
          <DollarSign className="w-8 h-8 mb-4" />
          <p className="text-4xl font-bold mb-2">~${estimatedPendingRevenue.toLocaleString()}</p>
          <p className="text-yellow-100">Estimated Pending</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
          <DollarSign className="w-8 h-8 mb-4" />
          <p className="text-4xl font-bold mb-2">~${estimatedOverdueRevenue.toLocaleString()}</p>
          <p className="text-red-100">Estimated Overdue</p>
        </div>
      </div>

      {/* Payment Status Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Payments</h3>
            <p className="text-3xl font-bold text-gray-900">{summary.payments.total}</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Collection Rate</h3>
            <p className="text-3xl font-bold text-green-600">
              {summary.payments.total > 0
                ? Math.round(
                    ((summary.payments.total - summary.payments.pending - summary.payments.overdue) /
                      summary.payments.total) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourcesTab({ summary }) {
  const libraryData = [
    { name: 'Available', value: summary.books.availableCopies, color: '#10b981' },
    { name: 'Issued', value: summary.books.totalCopies - summary.books.availableCopies, color: '#f59e0b' },
  ]

  const vehicleData = [
    { name: 'Active', value: summary.vehicles.active, color: '#10b981' },
    { name: 'Maintenance', value: summary.vehicles.maintenance, color: '#ef4444' },
  ]

  const libraryUtilization =
    summary.books.totalCopies > 0
      ? Math.round(
          ((summary.books.totalCopies - summary.books.availableCopies) / summary.books.totalCopies) *
            100
        )
      : 0

  const vehicleUtilization =
    summary.vehicles.total > 0
      ? Math.round((summary.vehicles.active / summary.vehicles.total) * 100)
      : 0

  return (
    <div>
      {/* Library Stats */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Library Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Books</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{summary.books.total}</p>
            <p className="text-sm text-gray-600">{summary.books.totalCopies} total copies</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Available Copies</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {summary.books.availableCopies}
            </p>
            <p className="text-sm text-gray-600">Ready to issue</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Library Utilization</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">{libraryUtilization}%</p>
            <p className="text-sm text-gray-600">Books currently issued</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Library Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={libraryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {libraryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transport Stats */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bus className="w-6 h-6 text-orange-600" />
          Transport Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Vehicles</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{summary.vehicles.total}</p>
            <p className="text-sm text-gray-600">All vehicles</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Vehicles</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">{summary.vehicles.active}</p>
            <p className="text-sm text-gray-600">Currently operational</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Vehicle Utilization</h3>
            <p className="text-3xl font-bold text-orange-600 mb-1">{vehicleUtilization}%</p>
            <p className="text-sm text-gray-600">Fleet utilization rate</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
