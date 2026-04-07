import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useExaminations() {
  const [examinations, setExaminations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchExaminations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('examinations')
        .select(`
          *,
          classes (name, section),
          subjects (name, code)
        `)
        .order('exam_date', { ascending: false })

      if (error) throw error
      setExaminations(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addExamination = async (examData) => {
    try {
      const { data, error } = await supabase
        .from('examinations')
        .insert(examData)
        .select()
        .single()

      if (error) throw error
      await fetchExaminations()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateExamination = async (id, examData) => {
    try {
      const { data, error } = await supabase
        .from('examinations')
        .update(examData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchExaminations()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteExamination = async (id) => {
    try {
      const { error } = await supabase
        .from('examinations')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchExaminations()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchExaminations()
  }, [])

  return {
    examinations,
    loading,
    error,
    addExamination,
    updateExamination,
    deleteExamination,
    refetch: fetchExaminations,
  }
}

export function useGrades() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGrades = async (examinationId = null) => {
    try {
      setLoading(true)
      let query = supabase
        .from('grades')
        .select(`
          *,
          students (first_name, last_name, student_number),
          examinations (name, type, max_marks, subjects (name))
        `)

      if (examinationId) {
        query = query.eq('examination_id', examinationId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setGrades(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addGrade = async (gradeData) => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert(gradeData)
        .select()
        .single()

      if (error) throw error
      await fetchGrades()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateGrade = async (id, gradeData) => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .update(gradeData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchGrades()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteGrade = async (id) => {
    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchGrades()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchGrades()
  }, [])

  return {
    grades,
    loading,
    error,
    addGrade,
    updateGrade,
    deleteGrade,
    refetch: fetchGrades,
  }
}
