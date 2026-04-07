import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teachers (first_name, last_name)
        `)
        .order('grade_level', { ascending: true })

      if (error) throw error
      setClasses(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addClass = async (classData) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert(classData)
        .select()
        .single()

      if (error) throw error
      await fetchClasses()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateClass = async (id, classData) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update(classData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchClasses()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteClass = async (id) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchClasses()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return {
    classes,
    loading,
    error,
    addClass,
    updateClass,
    deleteClass,
    refetch: fetchClasses,
  }
}
