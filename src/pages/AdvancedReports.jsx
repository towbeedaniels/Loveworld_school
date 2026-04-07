import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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
  AreaChart,
  Area,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  DollarSign,
  CalendarCheck,
  Download,
  Calendar,
  Filter,
} from 'lucide-react'
import { exportToExcel } from '../utils/exportImport'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function AdvancedReports() {
  const [activeReport, setActiveReport] = useState('attendance')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    fetchReportData()
  }, [activeReport, dateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      let data = {}
      
      switch (activeReport) {
        case 'attendance':
          data = await fetchAttendanceReport()
          break
        case 'grades':
          data = await fetchGradesReport()
          break
        case 'fees':
          data = await fetchFeesReport()
          break
        case 'library':
          data = await fetchLibraryReport()
          break
        case 'performance':
          data = await fetchPerformanceReport()
          break
        default:
          data = {}
      }
      
      setReportData(data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendanceReport = async () => {
    const { data: attendance } = await supabase
      .from('attendance')
      .select('status, date, students (first_name, last_name)')
      .gte('date', dateRange.start || '2024-01-01')
      .lte('date', dateRange.end || '2024-12-31')

    const byStatus = {}
    const byMonth = {}
    
    attendance?.forEach(record => {
      byStatus[record.status] = (byStatus[record.status] || 0) + 1
      
      const month = new Date(record.date).toLocaleString('default', { month: 'short' })
      if (!byMonth[month]) {
        byMonth[month] = { month, present: 0, absent: 0, late: 0 }
      }
      if (byMonth[month][record.status] !== undefined) {
        byMonth[month][record.status]++
      }
    })

    const monthlyData = Object.values(byMonth).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.indexOf(a.month) - months.indexOf(b.month)
    })

    const total = attendance?.length || 0
    const present = byStatus.present || 0
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0

    return {
      byStatus,
      monthlyData,
      total,
      present,
      absent: byStatus.absent || 0,
      late: byStatus.late || 0,
      attendanceRate,
    }
  }

  const fetchGradesReport = async () => {
    const { data: grades } = await supabase
      .from('grades')
      .select(`
        marks_obtained,
        grade,
        students (first_name, last_name),
        examinations (name, type, max_marks)
      `)

    const gradeDistribution = {}
    const byType = {}
    const bySubject = {}
    
    grades?.forEach(record => {
      const grade = record.grade || 'Unknown'
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1
      
      const type = record.examinations?.type || 'Unknown'
      if (!byType[type]) {
        byType[type] = { type, count: 0, total: 0, max: 0 }
      }
      byType[type].count++
      byType[type].total += parseFloat(record.marks_obtained || 0)
      byType[type].max += parseFloat(record.examinations?.max_marks || 100)

      const subject = record.examinations?.subjects?.name || 'Unknown'
      if (!bySubject[subject]) {
        bySubject[subject] = { subject, average: 0, count: 0, total: 0 }
      }
      bySubject[subject].count++
      bySubject[subject].total += parseFloat(record.marks_obtained || 0)
    })

    Object.values(bySubject).forEach(s => {
      s.average = s.count > 0 ? (s.total / s.count).toFixed(2) : 0
    })

    const gradeOrder = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F']
    const pieData = gradeOrder
      .filter(g => gradeDistribution[g])
      .map(g => ({ name: g, value: gradeDistribution[g] }))

    return {
      gradeDistribution,
      byType: Object.values(byType),
      bySubject: Object.values(bySubject),
      pieData,
      totalGrades: grades?.length || 0,
      overallAverage: grades?.length > 0
        ? (grades.reduce((sum, g) => sum + parseFloat(g.marks_obtained || 0), 0) / grades.length).toFixed(2)
        : 0,
    }
  }

  const fetchFeesReport = async () => {
    const { data: payments } = await supabase
      .from('fee_payments')
      .select('amount_paid, status, payment_date, payment_method, students (first_name, last_name)')
      .gte('payment_date', dateRange.start || '2024-01-01')
      .lte('payment_date', dateRange.end || '2024-12-31')

    const byStatus = {}
    const byMethod = {}
    const byMonth = {}
    
    payments?.forEach(record => {
      byStatus[record.status] = (byStatus[record.status] || 0) + 1
      byStatus[`${record.status}_amount`] = (byStatus[`${record.status}_amount`] || 0) + parseFloat(record.amount_paid || 0)
      
      const method = record.payment_method || 'unknown'
      byMethod[method] = (byMethod[method] || 0) + parseFloat(record.amount_paid || 0)
      
      const month = new Date(record.payment_date).toLocaleString('default', { month: 'short' })
      byMonth[month] = (byMonth[month] || 0) + parseFloat(record.amount_paid || 0)
    })

    const monthlyRevenue = Object.entries(byMonth).map(([month, amount]) => ({
      month,
      revenue: amount,
    })).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.indexOf(a.month) - months.indexOf(b.month)
    })

    const totalRevenue = byStatus.paid_amount || 0
    const pendingAmount = byStatus.pending_amount || 0
    const overdueAmount = byStatus.overdue_amount || 0

    return {
      byStatus,
      byMethod,
      monthlyRevenue,
      totalRevenue,
      pendingAmount,
      overdueAmount,
      totalPayments: payments?.length || 0,
    }
  }

  const fetchLibraryReport = async () => {
    const { data: books } = await supabase
      .from('books')
      .select('category, total_copies, available_copies')
    
    const { data: issuances } = await supabase
      .from('book_issuance')
      .select('status, issue_date')

    const byCategory = {}
    books?.forEach(book => {
      const category = book.category || 'Uncategorized'
      if (!byCategory[category]) {
        byCategory[category] = { category, total: 0, available: 0, issued: 0 }
      }
      byCategory[category].total += book.total_copies || 0
      byCategory[category].available += book.available_copies || 0
      byCategory[category].issued += (book.total_copies || 0) - (book.available_copies || 0)
    })

    const issuanceStatus = {}
    issuances?.forEach(iss => {
      issuanceStatus[iss.status] = (issuanceStatus[iss.status] || 0) + 1
    })

    const pieData = Object.entries(issuanceStatus).map(([name, value]) => ({
      name,
      value,
    }))

    return {
      byCategory: Object.values(byCategory),
      issuanceStatus,
      pieData,
      totalBooks: books?.length || 0,
      totalCopies: books?.reduce((sum, b) => sum + (b.total_copies || 0), 0) || 0,
      availableCopies: books?.reduce((sum, b) => sum + (b.available_copies || 0), 0) || 0,
    }
  }

  const fetchPerformanceReport = async () => {
    const { data: students } = await supabase
      .from('students')
      .select('status, admission_date')
    
    const { data: grades } = await supabase
      .from('grades')
      .select('marks_obtained, grade, student_id')

    const studentGrades = {}
    grades?.forEach(g => {
      if (!studentGrades[g.student_id]) {
        studentGrades[g.student_id] = []
      }
      studentGrades[g.student_id].push(parseFloat(g.marks_obtained || 0))
    })

    const performanceDistribution = {
      excellent: 0, // >= 90
      good: 0,      // >= 75
      average: 0,   // >= 60
      below: 0,     // < 60
    }

    Object.values(studentGrades).forEach(studentMarks => {
      const avg = studentMarks.reduce((a, b) => a + b, 0) / studentMarks.length
      if (avg >= 90) performanceDistribution.excellent++
      else if (avg >= 75) performanceDistribution.good++
      else if (avg >= 60) performanceDistribution.average++
      else performanceDistribution.below++
    })

    const pieData = [
      { name: 'Excellent (≥90)', value: performanceDistribution.excellent },
      { name: 'Good (≥75)', value: performanceDistribution.good },
      { name: 'Average (≥60)', value: performanceDistribution.average },
      { name: 'Below Average (<60)', value: performanceDistribution.below },
    ].filter(d => d.value > 0)

    return {
      performanceDistribution,
      pieData,
      totalStudents: students?.length || 0,
      gradedStudents: Object.keys(studentGrades).length,
    }
  }

  const handleExportReport = () => {
    if (!reportData) return
    
    let exportData = []
    const reportName = activeReport
    
    switch (activeReport) {
      case 'attendance':
        exportData = reportData.monthlyData
        break
      case 'grades':
        exportData = reportData.bySubject
        break
      case 'fees':
        exportData = reportData.monthlyRevenue
        break
      case 'library':
        exportData = reportData.byCategory
        break
      case 'performance':
        exportData = reportData.pieData
        break
      default:
        exportData = []
    }
    
    exportToExcel(exportData, `${reportName}_report`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reports</h1>
          <p className="text-gray-600 mt-1">Detailed analytics and insights</p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'grades', label: 'Grades', icon: Award },
            { id: 'fees', label: 'Fees', icon: DollarSign },
            { id: 'library', label: 'Library', icon: Users },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveReport(id)}
              className={`px-6 py-4 font-medium transition flex items-center gap-2 whitespace-nowrap ${
                activeReport === id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Loading report data...</p>
        </div>
      ) : !reportData ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No data available for this report</p>
        </div>
      ) : (
        <>
          {activeReport === 'attendance' && <AttendanceReport data={reportData} />}
          {activeReport === 'grades' && <GradesReport data={reportData} />}
          {activeReport === 'fees' && <FeesReport data={reportData} />}
          {activeReport === 'library' && <LibraryReport data={reportData} />}
          {activeReport === 'performance' && <PerformanceReport data={reportData} />}
        </>
      )}
    </div>
  )
}

// Attendance Report Component
function AttendanceReport({ data }) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Records</p>
          <p className="text-3xl font-bold text-gray-900">{data.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <p className="text-3xl font-bold text-green-600">{data.attendanceRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-3xl font-bold text-green-600">{data.present}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-3xl font-bold text-red-600">{data.absent}</p>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="present" stackId="1" stroke="#10b981" fill="#10b981" />
            <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" />
            <Area type="monotone" dataKey="late" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Grades Report Component
function GradesReport({ data }) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Grades</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalGrades}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Overall Average</p>
          <p className="text-3xl font-bold text-blue-600">{data.overallAverage}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Subjects</p>
          <p className="text-3xl font-bold text-gray-900">{data.bySubject.length}</p>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Averages</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.bySubject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// Fees Report Component
function FeesReport({ data }) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <p className="text-sm text-green-100">Total Revenue</p>
          <p className="text-3xl font-bold">${data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm p-6 text-white">
          <p className="text-sm text-yellow-100">Pending</p>
          <p className="text-3xl font-bold">${data.pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
          <p className="text-sm text-red-100">Overdue</p>
          <p className="text-3xl font-bold">${data.overdueAmount.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <p className="text-sm text-blue-100">Total Payments</p>
          <p className="text-3xl font-bold">{data.totalPayments}</p>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.byMethod).map(([method, amount]) => (
            <div key={method} className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500 capitalize">{method.replace('_', ' ')}</p>
              <p className="text-2xl font-bold text-gray-900">${amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Library Report Component
function LibraryReport({ data }) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Books</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalBooks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Copies</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalCopies}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-3xl font-bold text-green-600">{data.availableCopies}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Issued</p>
          <p className="text-3xl font-bold text-orange-600">{data.totalCopies - data.availableCopies}</p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Books by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.byCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3b82f6" name="Total" />
            <Bar dataKey="available" fill="#10b981" name="Available" />
            <Bar dataKey="issued" fill="#f59e0b" name="Issued" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Issuance Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Issuance Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Performance Report Component
function PerformanceReport({ data }) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Graded Students</p>
          <p className="text-3xl font-bold text-blue-600">{data.gradedStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Excellent Performers</p>
          <p className="text-3xl font-bold text-green-600">{data.performanceDistribution.excellent}</p>
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Performance Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data.pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Excellent (≥90)</p>
            <p className="text-4xl font-bold text-green-600">{data.performanceDistribution.excellent}</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Good (≥75)</p>
            <p className="text-4xl font-bold text-blue-600">{data.performanceDistribution.good}</p>
          </div>
          <div className="p-6 bg-yellow-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Average (≥60)</p>
            <p className="text-4xl font-bold text-yellow-600">{data.performanceDistribution.average}</p>
          </div>
          <div className="p-6 bg-red-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Below (&lt;60)</p>
            <p className="text-4xl font-bold text-red-600">{data.performanceDistribution.below}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
