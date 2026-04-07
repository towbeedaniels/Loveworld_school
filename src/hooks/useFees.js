import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFeeStructures() {
  const [feeStructures, setFeeStructures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFeeStructures = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('fee_structures')
        .select(`
          *,
          classes (name, section)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeeStructures(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addFeeStructure = async (feeData) => {
    try {
      const { data, error } = await supabase
        .from('fee_structures')
        .insert(feeData)
        .select()
        .single()

      if (error) throw error
      await fetchFeeStructures()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateFeeStructure = async (id, feeData) => {
    try {
      const { data, error } = await supabase
        .from('fee_structures')
        .update(feeData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchFeeStructures()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteFeeStructure = async (id) => {
    try {
      const { error } = await supabase
        .from('fee_structures')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchFeeStructures()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchFeeStructures()
  }, [])

  return {
    feeStructures,
    loading,
    error,
    addFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    refetch: fetchFeeStructures,
  }
}

export function useFeePayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('fee_payments')
        .select(`
          *,
          students (first_name, last_name, student_number),
          fee_structures (name, amount)
        `)
        .order('payment_date', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addPayment = async (paymentData) => {
    try {
      const { data, error } = await supabase
        .from('fee_payments')
        .insert(paymentData)
        .select()
        .single()

      if (error) throw error
      await fetchPayments()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updatePayment = async (id, paymentData) => {
    try {
      const { data, error } = await supabase
        .from('fee_payments')
        .update(paymentData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchPayments()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deletePayment = async (id) => {
    try {
      const { error } = await supabase
        .from('fee_payments')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchPayments()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return {
    payments,
    loading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments,
  }
}
