import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('last_name', { ascending: true })

      if (error) throw error
      setEmployees(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const addEmployee = async (employeeData) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert(employeeData)
        .select()
        .single()

      if (error) throw error
      await fetchEmployees()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateEmployee = async (id, employeeData) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchEmployees()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteEmployee = async (id) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchEmployees()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  }
}

export function usePayroll() {
  const [payroll, setPayroll] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPayroll = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payroll')
        .select(`
          *,
          employees (first_name, last_name, employee_number, department)
        `)
        .order('year', { ascending: false })
        .order('month', { ascending: false })

      if (error) throw error
      setPayroll(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching payroll:', err)
    } finally {
      setLoading(false)
    }
  }

  const addPayroll = async (payrollData) => {
    try {
      const { data, error } = await supabase
        .from('payroll')
        .insert(payrollData)
        .select()
        .single()

      if (error) throw error
      await fetchPayroll()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updatePayroll = async (id, payrollData) => {
    try {
      const { data, error } = await supabase
        .from('payroll')
        .update(payrollData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchPayroll()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deletePayroll = async (id) => {
    try {
      const { error } = await supabase
        .from('payroll')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchPayroll()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchPayroll()
  }, [])

  return {
    payroll,
    loading,
    error,
    addPayroll,
    updatePayroll,
    deletePayroll,
    refetch: fetchPayroll,
  }
}

export function useLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employees (first_name, last_name, employee_number, department)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeaveRequests(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching leave requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const addLeaveRequest = async (leaveData) => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert(leaveData)
        .select()
        .single()

      if (error) throw error
      await fetchLeaveRequests()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateLeaveRequest = async (id, leaveData) => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .update(leaveData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchLeaveRequests()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteLeaveRequest = async (id) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchLeaveRequests()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  return {
    leaveRequests,
    loading,
    error,
    addLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    refetch: fetchLeaveRequests,
  }
}
