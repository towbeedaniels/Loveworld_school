import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Lock, Bell, Globe, Save, CheckCircle, AlertCircle } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  
  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState(null)

  // Security state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState(null)

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    attendance: true,
    fee_reminders: true,
    announcements: true,
  })
  const [notificationsSaving, setNotificationsSaving] = useState(false)
  const [notificationsMessage, setNotificationsMessage] = useState(null)

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    school_name: 'Loveworld School',
    academic_year: '2024-2025',
    timezone: 'Africa/Lagos',
  })
  const [systemSaving, setSystemSaving] = useState(false)
  const [systemMessage, setMessage] = useState(null)

  const handleProfileSave = async () => {
    setProfileSaving(true)
    setProfileMessage(null)
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone,
        }
      })

      if (error) throw error

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setProfileMessage(null), 3000)
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Error updating profile: ' + error.message })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (passwords.new !== passwords.confirm) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match!' })
      return
    }

    if (passwords.new.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters!' })
      return
    }

    setPasswordSaving(true)
    setPasswordMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' })
      setPasswords({ current: '', new: '', confirm: '' })
      setTimeout(() => setPasswordMessage(null), 3000)
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Error updating password: ' + error.message })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleNotificationsSave = async () => {
    setNotificationsSaving(true)
    setNotificationsMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          notification_preferences: notifications
        }
      })

      if (error) throw error

      setNotificationsMessage({ type: 'success', text: 'Notification preferences updated!' })
      setTimeout(() => setNotificationsMessage(null), 3000)
    } catch (error) {
      setNotificationsMessage({ type: 'error', text: 'Error updating preferences: ' + error.message })
    } finally {
      setNotificationsSaving(false)
    }
  }

  const handleSystemSettingsSave = async () => {
    setSystemSaving(true)
    setMessage(null)

    try {
      // Save to localStorage for now (can be moved to database later)
      localStorage.setItem('school_settings', JSON.stringify(systemSettings))
      
      setMessage({ type: 'success', text: 'System settings saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings: ' + error.message })
    } finally {
      setSystemSaving(false)
    }
  }

  // Load system settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('school_settings')
    if (saved) {
      try {
        setSystemSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your system preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 font-medium transition flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-4 font-medium transition flex items-center gap-2 ${
              activeTab === 'security'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-4 font-medium transition flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-6 py-4 font-medium transition flex items-center gap-2 ${
              activeTab === 'system'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            System
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
          
          {profileMessage && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              profileMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {profileMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {profileMessage.text}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+234 XXX XXX XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
          
          {passwordMessage && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              passwordMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {passwordMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordSaving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {passwordSaving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
          
          {notificationsMessage && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              notificationsMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {notificationsMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {notificationsMessage.text}
            </div>
          )}

          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email notifications', desc: 'Receive email updates' },
              { key: 'sms', label: 'SMS notifications', desc: 'Receive text messages' },
              { key: 'attendance', label: 'Attendance alerts', desc: 'Get notified about attendance changes' },
              { key: 'fee_reminders', label: 'Fee reminders', desc: 'Receive payment due reminders' },
              { key: 'announcements', label: 'Announcements', desc: 'Get notified about new announcements' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleNotificationsSave}
              disabled={notificationsSaving}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {notificationsSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
          
          {systemMessage && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              systemMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {systemMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {systemMessage.text}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <input
                type="text"
                value={systemSettings.school_name}
                onChange={(e) => setSystemSettings({ ...systemSettings, school_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                value={systemSettings.academic_year}
                onChange={(e) => setSystemSettings({ ...systemSettings, academic_year: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={systemSettings.timezone}
                onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSystemSettingsSave}
                disabled={systemSaving}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {systemSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
