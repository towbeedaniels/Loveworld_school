import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('vehicle_number', { ascending: true })

      if (error) throw error
      setVehicles(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addVehicle = async (vehicleData) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single()

      if (error) throw error
      await fetchVehicles()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateVehicle = async (id, vehicleData) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchVehicles()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteVehicle = async (id) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchVehicles()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
  }
}

export function useRoutes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          vehicles (vehicle_number, vehicle_type)
        `)
        .order('route_name', { ascending: true })

      if (error) throw error
      setRoutes(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addRoute = async (routeData) => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert(routeData)
        .select()
        .single()

      if (error) throw error
      await fetchRoutes()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateRoute = async (id, routeData) => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .update(routeData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchRoutes()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteRoute = async (id) => {
    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchRoutes()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  return {
    routes,
    loading,
    error,
    addRoute,
    updateRoute,
    deleteRoute,
    refetch: fetchRoutes,
  }
}

export function useStudentTransport() {
  const [transportRecords, setTransportRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransportRecords = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('student_transport')
        .select(`
          *,
          students (first_name, last_name, student_number),
          routes (route_name, vehicles (vehicle_number))
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransportRecords(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTransport = async (transportData) => {
    try {
      const { data, error } = await supabase
        .from('student_transport')
        .insert(transportData)
        .select()
        .single()

      if (error) throw error
      await fetchTransportRecords()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateTransport = async (id, transportData) => {
    try {
      const { data, error } = await supabase
        .from('student_transport')
        .update(transportData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchTransportRecords()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const deleteTransport = async (id) => {
    try {
      const { error } = await supabase
        .from('student_transport')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchTransportRecords()
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchTransportRecords()
  }, [])

  return {
    transportRecords,
    loading,
    error,
    addTransport,
    updateTransport,
    deleteTransport,
    refetch: fetchTransportRecords,
  }
}
