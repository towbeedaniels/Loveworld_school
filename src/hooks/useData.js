import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('last_name', { ascending: true })

      if (error) throw error
      setStudents(data || [])
    } catch (err) {
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  return { students, loading, refetch: fetchStudents }
}

export function useClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('grade_level', { ascending: true })

      if (error) throw error
      setClasses(data || [])
    } catch (err) {
      console.error('Error fetching classes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return { classes, loading, refetch: fetchClasses }
}
