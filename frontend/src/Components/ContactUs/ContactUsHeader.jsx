import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Snackbar, Alert } from "@mui/material"

const ContactUsHeader = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.subject && formData.message) {
      setAlertMessage('Message sent successfully! We will get back to you soon.')
      setOpenAlert(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } else {
      setAlertMessage('Please fill in all fields')
      setOpenAlert(true)
    }
  }

  return (
    <div className='min-h-screen bg-[#FAFAFA] py-12 px-4 pt-[100px]'>
      <div className='max-w-6xl mx-auto'>
        
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Contact Us</h1>
          <p className='text-gray-600 text-lg'>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          
          {/* Contact Information */}
          <div className='space-y-8'>
            <div className='bg-white rounded-lg p-8 shadow-md border border-[#e0e0e0]'>
              <h2 className='text-2xl font-bold mb-8'>Get in Touch</h2>
              
              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='flex-shrink-0'>
                    <Mail size={24} className='text-[#6B8E23] mt-1' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Email</h3>
                    <p className='text-gray-600'>support@gohomies.com</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='flex-shrink-0'>
                    <Phone size={24} className='text-[#6B8E23] mt-1' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Phone</h3>
                    <p className='text-gray-600'>+91 (XXX) XXX-XXXX</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='flex-shrink-0'>
                    <MapPin size={24} className='text-[#6B8E23] mt-1' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Address</h3>
                    <p className='text-gray-600'>India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className='bg-[#6B8E23] rounded-lg p-8 text-white'>
              <h3 className='text-xl font-bold mb-4'>Quick Response</h3>
              <p className='text-sm opacity-90'>We aim to respond to all inquiries within 24 hours. For urgent matters, please call us directly.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white rounded-lg p-8 shadow-md border border-[#e0e0e0]'>
            <h2 className='text-2xl font-bold mb-6'>Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Your name'
                  className='w-full px-4 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-[#6B8E23]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='your.email@example.com'
                  className='w-full px-4 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-[#6B8E23]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Subject</label>
                <input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder='What is this about?'
                  className='w-full px-4 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-[#6B8E23]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Message</label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  placeholder='Your message here...'
                  rows='5'
                  className='w-full px-4 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-[#6B8E23] resize-none'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-[#6B8E23] text-white py-3 rounded-lg hover:bg-[#5a7a1c] transition flex items-center justify-center gap-2 font-medium'
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ContactUsHeader
