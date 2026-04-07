import { supabase } from './lib/supabase'

// Test Supabase Connection
export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...')
  
  try {
    // Test 1: Check if we can connect
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) {
      console.error('❌ Auth Error:', authError.message)
      return { success: false, error: authError.message }
    }
    console.log('✅ Supabase Connected')

    // Test 2: List all tables
    const { data: tables, error: tablesError } = await supabase
      .from('students')
      .select('count', { count: 'exact', head: true })
    
    if (tablesError) {
      console.warn('⚠️  Students table query error (may not exist yet):', tablesError.message)
    } else {
      console.log('✅ Students table exists')
    }

    console.log('🎉 Supabase connection test complete')
    return { success: true }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Run test on import (for development only)
if (import.meta.env.DEV) {
  testSupabaseConnection()
}
