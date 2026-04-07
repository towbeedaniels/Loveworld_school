import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTeachers(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTeacher = async (teacherData) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert(teacherData)
        .select()
        .single()

      if (error) throw error
      await fetchTeachers()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateTeacher = async (id, teacherData) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .update(teacherData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchTeachers()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteTeacher = async (id) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchTeachers()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  return {
    teachers,
    loading,
    error,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    refetch: fetchTeachers,
  }
}
