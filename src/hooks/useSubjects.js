import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSubjects() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setSubjects(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addSubject = async (subjectData) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subjectData)
        .select()
        .single()

      if (error) throw error
      await fetchSubjects()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateSubject = async (id, subjectData) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(subjectData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchSubjects()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteSubject = async (id) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchSubjects()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  return {
    subjects,
    loading,
    error,
    addSubject,
    updateSubject,
    deleteSubject,
    refetch: fetchSubjects,
  }
}
