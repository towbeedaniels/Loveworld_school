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
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // If there are students, try to enrich with class/parent data
      if (data && data.length > 0) {
        const studentIds = data.map(s => s.id)
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('student_id, classes(name, section)')
          .in('student_id', studentIds)
        
        const { data: parents } = await supabase
          .from('parents')
          .select('id, first_name, last_name, phone, email')
          .in('id', data.map(s => s.parent_guardian_id).filter(Boolean))

        const enrichedStudents = data.map(student => {
          const enrollment = enrollments?.find(e => e.student_id === student.id)
          const parent = parents?.find(p => p.id === student.parent_guardian_id)
          return {
            ...student,
            classes: enrollment?.classes || null,
            parents: parent || null,
          }
        })
        
        setStudents(enrichedStudents)
      } else {
        setStudents(data || [])
      }
    } catch (err) {
      console.error('Error fetching students:', err)
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
