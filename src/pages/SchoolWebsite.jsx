import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  Menu,
  X,
  School,
  BookOpen,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Calendar,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Library,
  Bus,
  Trophy,
} from 'lucide-react'

export default function SchoolWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [announcements, setAnnouncements] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true)
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .gte('expiry_date', new Date().toISOString())
        .order('publish_date', { ascending: false })
        .limit(6)

      if (error) throw error
      setAnnouncements(data || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-primary-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@loveworlschool.edu</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span>Mon - Fri: 8:00 AM - 4:00 PM</span>
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <School className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Loveworl School</h1>
                <p className="text-xs text-gray-500">Excellence in Education</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('home')}
                className={`text-sm font-medium transition ${
                  activeSection === 'home' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium transition ${
                  activeSection === 'about' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className={`text-sm font-medium transition ${
                  activeSection === 'programs' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Programs
              </button>
              <button
                onClick={() => scrollToSection('admissions')}
                className={`text-sm font-medium transition ${
                  activeSection === 'admissions' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Admissions
              </button>
              <button
                onClick={() => scrollToSection('news')}
                className={`text-sm font-medium transition ${
                  activeSection === 'news' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                News & Events
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium transition ${
                  activeSection === 'contact' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Contact
              </button>
              <Link
                to="/portal/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Portal Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-gray-700">Home</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-gray-700">About</button>
              <button onClick={() => scrollToSection('programs')} className="block w-full text-left py-2 text-gray-700">Programs</button>
              <button onClick={() => scrollToSection('admissions')} className="block w-full text-left py-2 text-gray-700">Admissions</button>
              <button onClick={() => scrollToSection('news')} className="block w-full text-left py-2 text-gray-700">News & Events</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-gray-700">Contact</button>
              <Link
                to="/portal/login"
                className="block w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium text-center"
              >
                Portal Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Loveworl School
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Nurturing minds, building character, and shaping the leaders of tomorrow through excellence in education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('admissions')}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-primary-100">Students Enrolled</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">85+</div>
              <div className="text-primary-100">Expert Teachers</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-100">Graduation Rate</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-primary-100">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Loveworl School?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a comprehensive educational experience that prepares students for success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: 'Academic Excellence',
                description: 'Rigorous curriculum designed to challenge and inspire students at every level.',
                color: 'bg-blue-500',
              },
              {
                icon: Users,
                title: 'Expert Faculty',
                description: 'Highly qualified teachers dedicated to nurturing each student\'s potential.',
                color: 'bg-green-500',
              },
              {
                icon: Library,
                title: 'Modern Facilities',
                description: 'State-of-the-art classrooms, laboratories, and library resources.',
                color: 'bg-purple-500',
              },
              {
                icon: Trophy,
                title: 'Extracurricular Activities',
                description: 'Sports, arts, clubs, and competitions for well-rounded development.',
                color: 'bg-orange-500',
              },
              {
                icon: Bus,
                title: 'Transportation',
                description: 'Safe and reliable bus service covering all major routes.',
                color: 'bg-red-500',
              },
              {
                icon: Award,
                title: 'Proven Results',
                description: 'Consistently high test scores and college acceptance rates.',
                color: 'bg-yellow-500',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition group"
              >
                <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Our School</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 1998, Loveworl School has been a beacon of educational excellence for over 25 years. 
                We believe in nurturing not just academic brilliance, but also character, creativity, and compassion.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our holistic approach to education ensures that every student discovers their unique talents 
                and develops the skills needed to thrive in an ever-changing world.
              </p>

              <div className="space-y-4">
                {[
                  'Student-centered learning approach',
                  'Small class sizes for personalized attention',
                  'Integration of technology in education',
                  'Strong parent-school partnership',
                  'Focus on mental health and well-being',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-12 flex items-center justify-center">
              <div className="text-center">
                <School className="w-32 h-32 text-primary-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-700 text-lg">
                  To empower students with knowledge, skills, and values needed to become 
                  responsible global citizens and lifelong learners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive educational programs designed for every stage of learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                level: 'Pre-Primary',
                grades: 'Ages 3-5',
                description: 'Play-based learning foundation focusing on social skills, creativity, and early literacy.',
                icon: '🎨',
                color: 'from-pink-500 to-rose-500',
              },
              {
                level: 'Elementary',
                grades: 'Grades 1-5',
                description: 'Core academics with hands-on learning experiences and character development.',
                icon: '📚',
                color: 'from-blue-500 to-indigo-500',
              },
              {
                level: 'Middle School',
                grades: 'Grades 6-8',
                description: 'Advanced curriculum with emphasis on critical thinking and independence.',
                icon: '🔬',
                color: 'from-green-500 to-emerald-500',
              },
              {
                level: 'High School',
                grades: 'Grades 9-12',
                description: 'College preparatory program with AP courses and career guidance.',
                icon: '🎓',
                color: 'from-purple-500 to-violet-500',
              },
              {
                level: 'STEM Program',
                grades: 'All Grades',
                description: 'Science, Technology, Engineering, and Math enrichment activities.',
                icon: '💻',
                color: 'from-orange-500 to-amber-500',
              },
              {
                level: 'Arts & Music',
                grades: 'All Grades',
                description: 'Creative expression through visual arts, music, drama, and dance.',
                icon: '🎭',
                color: 'from-red-500 to-pink-500',
              },
            ].map((program, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                  <div className="text-5xl mb-4">{program.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{program.level}</h3>
                  <p className="text-white text-opacity-90">{program.grades}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{program.description}</p>
                  <button className="mt-4 text-primary-600 font-medium flex items-center gap-2 hover:gap-3 transition">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Section */}
      <section id="admissions" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Admissions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community of learners. Follow these simple steps to enroll.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { step: '1', title: 'Inquiry', description: 'Submit an inquiry form online or visit our campus.' },
              { step: '2', title: 'Application', description: 'Complete the application form and submit required documents.' },
              { step: '3', title: 'Assessment', description: 'Student completes an entrance assessment and interview.' },
              { step: '4', title: 'Enrollment', description: 'Receive acceptance letter and complete enrollment.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Join Loveworl School?</h3>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Applications are now open for the 2024-2025 academic year. Don't miss out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition">
                Apply Online
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section id="news" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">News & Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest happenings at our school
            </p>
          </div>

          {loadingAnnouncements ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No announcements available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map((announcement, idx) => {
                const icons = ['📢', '🎉', '📚', '🏆', '🎓', '📅']
                const priorityColors = {
                  low: 'from-blue-100 to-blue-200',
                  normal: 'from-primary-100 to-primary-200',
                  high: 'from-orange-100 to-orange-200',
                  urgent: 'from-red-100 to-red-200',
                }

                return (
                  <div key={announcement.id || idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className={`bg-gradient-to-br ${priorityColors[announcement.priority] || priorityColors.normal} p-12 text-center`}>
                      <div className="text-6xl">{icons[idx % icons.length]}</div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(announcement.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          announcement.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          announcement.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          announcement.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {announcement.priority}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{announcement.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Parents Say</h2>
            <p className="text-xl text-gray-600">Hear from our school community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Parent of Grade 5 Student',
                content: 'Loveworl School has transformed my child\'s approach to learning. The teachers are incredibly dedicated.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Parent of Grade 8 Student',
                content: 'The balance of academics and extracurricular activities is perfect. My child loves going to school!',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Parent of Grade 2 Student',
                content: 'Small class sizes mean personalized attention. I\'ve seen remarkable progress in just one year.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with us for any inquiries or to schedule a campus visit
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">123 Education Street, Learning City, LC 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@loveworlschool.edu</p>
                    <p className="text-gray-600">admissions@loveworlschool.edu</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Office Hours</h4>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 8:00 AM - 4:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <School className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Loveworl School</h3>
                  <p className="text-xs text-gray-400">Excellence in Education</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Nurturing minds and building character since 1998. Join our community of learners today.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-800 hover:bg-primary-600 p-2 rounded-lg transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-primary-600 p-2 rounded-lg transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-primary-600 p-2 rounded-lg transition">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-primary-600 p-2 rounded-lg transition">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['About Us', 'Programs', 'Admissions', 'News & Events', 'Contact', 'Careers'].map((link, idx) => (
                  <li key={idx}>
                    <button className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Programs</h4>
              <ul className="space-y-3">
                {['Pre-Primary', 'Elementary', 'Middle School', 'High School', 'STEM Program', 'Arts & Music'].map((link, idx) => (
                  <li key={idx}>
                    <button className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Portal Access</h4>
              <p className="text-gray-400 mb-4">
                Access your school portal for grades, attendance, and more.
              </p>
              <Link
                to="/portal/login"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-lg font-medium transition"
              >
                <Users className="w-4 h-4" />
                Login to Portal
              </Link>
              <div className="mt-6 space-y-2 text-gray-400">
                <p>Student Portal</p>
                <p>Parent Portal</p>
                <p>Teacher Portal</p>
                <p>Admin Portal</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Loveworl School. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <button className="hover:text-white transition">Privacy Policy</button>
                <button className="hover:text-white transition">Terms of Service</button>
                <button className="hover:text-white transition">Cookie Policy</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
