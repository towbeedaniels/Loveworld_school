import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTimetable() {
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTimetable = async (classId = null) => {
    try {
      setLoading(true)
      let query = supabase
        .from('timetable')
        .select(`
          *,
          classes (name, section),
          subjects (name, code),
          teachers (first_name, last_name)
        `)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })

      if (classId) {
        query = query.eq('class_id', classId)
      }

      const { data, error } = await query

      if (error) throw error
      setTimetable(data || [])
    } catch (err) {
      console.error('Error fetching timetable:', err)
    } finally {
      setLoading(false)
    }
  }

  const addEntry = async (entryData) => {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .insert(entryData)
        .select()
        .single()

      if (error) throw error
      await fetchTimetable()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateEntry = async (id, entryData) => {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .update(entryData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchTimetable()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteEntry = async (id) => {
    try {
      const { error } = await supabase.from('timetable').delete().eq('id', id)

      if (error) throw error
      await fetchTimetable()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchTimetable()
  }, [])

  return {
    timetable,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchTimetable,
  }
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('publish_date', { ascending: false })

      if (error) throw error
      setAnnouncements(data || [])
    } catch (err) {
      console.error('Error fetching announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  const addAnnouncement = async (announcementData) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcementData)
        .select()
        .single()

      if (error) throw error
      await fetchAnnouncements()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateAnnouncement = async (id, announcementData) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(announcementData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchAnnouncements()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteAnnouncement = async (id) => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id)

      if (error) throw error
      await fetchAnnouncements()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  return {
    announcements,
    loading,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements,
  }
}
