import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          classes (name, section),
          parents (first_name, last_name, phone, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setStudents(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addStudent = async (studentData) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single()

      if (error) throw error
      await fetchStudents()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateStudent = async (id, studentData) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchStudents()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteStudent = async (id) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchStudents()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  }
}
