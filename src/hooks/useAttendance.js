import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAttendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAttendance = async (date = null) => {
    try {
      setLoading(true)
      let query = supabase
        .from('attendance')
        .select(`
          *,
          students (first_name, last_name, student_number)
        `)
        .order('date', { ascending: false })

      if (date) {
        query = query.eq('date', date)
      }

      const { data, error } = await query

      if (error) throw error
      setAttendance(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (attendanceData) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .upsert(attendanceData)
        .select()

      if (error) throw error
      await fetchAttendance()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateAttendance = async (id, attendanceData) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .update(attendanceData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchAttendance()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteAttendance = async (id) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchAttendance()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  return {
    attendance,
    loading,
    error,
    markAttendance,
    updateAttendance,
    deleteAttendance,
    refetch: fetchAttendance,
  }
}
