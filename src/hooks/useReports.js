import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useReports() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    try {
      setLoading(true)

      // Fetch all counts in parallel
      const [
        studentsRes,
        teachersRes,
        classesRes,
        booksRes,
        vehiclesRes,
        attendanceRes,
        gradesRes,
        paymentsRes,
      ] = await Promise.all([
        supabase.from('students').select('id, status'),
        supabase.from('teachers').select('id, status'),
        supabase.from('classes').select('id'),
        supabase.from('books').select('id, total_copies, available_copies'),
        supabase.from('vehicles').select('id, status'),
        supabase.from('attendance').select('id, status, date'),
        supabase.from('grades').select('id, marks_obtained'),
        supabase.from('fee_payments').select('id, amount_paid, status'),
      ])

      // Process students
      const students = studentsRes.data || []
      const studentStats = {
        total: students.length,
        active: students.filter((s) => s.status === 'active').length,
        inactive: students.filter((s) => s.status === 'inactive').length,
        graduated: students.filter((s) => s.status === 'graduated').length,
      }

      // Process teachers
      const teachers = teachersRes.data || []
      const teacherStats = {
        total: teachers.length,
        active: teachers.filter((t) => t.status === 'active').length,
        inactive: teachers.filter((t) => t.status === 'inactive').length,
        onLeave: teachers.filter((t) => t.status === 'on_leave').length,
      }

      // Process books
      const books = booksRes.data || []
      const bookStats = {
        total: books.length,
        totalCopies: books.reduce((sum, b) => sum + (b.total_copies || 0), 0),
        availableCopies: books.reduce((sum, b) => sum + (b.available_copies || 0), 0),
      }

      // Process vehicles
      const vehicles = vehiclesRes.data || []
      const vehicleStats = {
        total: vehicles.length,
        active: vehicles.filter((v) => v.status === 'active').length,
        maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
      }

      // Process attendance
      const attendance = attendanceRes.data || []
      const today = new Date().toISOString().split('T')[0]
      const todayAttendance = attendance.filter((a) => a.date === today)
      const attendanceStats = {
        total: attendance.length,
        todayTotal: todayAttendance.length,
        todayPresent: todayAttendance.filter((a) => a.status === 'present').length,
        todayAbsent: todayAttendance.filter((a) => a.status === 'absent').length,
      }

      // Process grades
      const grades = gradesRes.data || []
      const gradeStats = {
        total: grades.length,
        average:
          grades.length > 0
            ? (
                grades.reduce((sum, g) => sum + parseFloat(g.marks_obtained || 0), 0) /
                grades.length
              ).toFixed(2)
            : 0,
      }

      // Process payments
      const payments = paymentsRes.data || []
      const paymentStats = {
        total: payments.length,
        totalRevenue: payments
          .filter((p) => p.status === 'paid')
          .reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0),
        pending: payments.filter((p) => p.status === 'pending').length,
        overdue: payments.filter((p) => p.status === 'overdue').length,
      }

      setSummary({
        students: studentStats,
        teachers: teacherStats,
        classes: classesRes.data?.length || 0,
        books: bookStats,
        vehicles: vehicleStats,
        attendance: attendanceStats,
        grades: gradeStats,
        payments: paymentStats,
      })
    } catch (err) {
      console.error('Error fetching summary:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return {
    summary,
    loading,
    refetch: fetchSummary,
  }
}
