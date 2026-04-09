import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title', { ascending: true })

      if (error) throw error
      setBooks(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addBook = async (bookData) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single()

      if (error) throw error
      await fetchBooks()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateBook = async (id, bookData) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchBooks()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteBook = async (id) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchBooks()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
  }
}

export function useBookIssuance() {
  const [issuances, setIssuances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchIssuances = async () => {
    try {
      setLoading(true)
      // Fetch issuances first without joins
      const { data, error } = await supabase
        .from('book_issuance')
        .select('*')
        .order('issue_date', { ascending: false })

      if (error) {
        console.error('Supabase error fetching issuances:', error)
        throw error
      }
      
      console.log('Fetched issuances:', data?.length)
      
      // Enrich with book and student data separately
      if (data && data.length > 0) {
        const bookIds = [...new Set(data.map(i => i.book_id).filter(Boolean))]
        const studentIds = [...new Set(data.map(i => i.student_id).filter(Boolean))]
        
        console.log('Fetching books for IDs:', bookIds)
        console.log('Fetching students for IDs:', studentIds)
        
        const { data: books, error: booksError } = await supabase
          .from('books')
          .select('id, title, author')
          .in('id', bookIds)
        
        if (booksError) console.error('Error fetching books:', booksError)
        
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('id, first_name, last_name, student_number')
          .in('id', studentIds)
        
        if (studentsError) console.error('Error fetching students:', studentsError)
        
        console.log('Fetched books:', books?.length)
        console.log('Fetched students:', students?.length)
        
        const enrichedIssuances = data.map(issuance => ({
          ...issuance,
          books: books?.find(b => b.id === issuance.book_id) || null,
          students: students?.find(s => s.id === issuance.student_id) || null,
        }))
        
        console.log('Enriched issuances:', enrichedIssuances.length)
        setIssuances(enrichedIssuances)
      } else {
        console.log('No issuances found')
        setIssuances(data || [])
      }
    } catch (err) {
      console.error('Error in fetchIssuances:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const issueBook = async (issuanceData) => {
    try {
      const { data, error } = await supabase
        .from('book_issuance')
        .insert(issuanceData)
        .select()
        .single()

      if (error) throw error
      await fetchIssuances()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const returnBook = async (id, returnData) => {
    try {
      const { data, error } = await supabase
        .from('book_issuance')
        .update(returnData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchIssuances()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteIssuance = async (id) => {
    try {
      const { error } = await supabase
        .from('book_issuance')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchIssuances()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchIssuances()
  }, [])

  return {
    issuances,
    loading,
    error,
    issueBook,
    returnBook,
    deleteIssuance,
    refetch: fetchIssuances,
  }
}
