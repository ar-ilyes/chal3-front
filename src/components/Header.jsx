import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocuments } from '../contexts/DocumentContext'
import PromptModal from './PromptModal'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addDocument } = useDocuments()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleNewNews = () => {
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    if (!isLoading) {
      setIsModalOpen(false)
    }
  }
  
  const handleSubmitPrompt = async (prompt) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('https://challenge3-onsite.onrender.com/enhance-standard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Add the document to our context and navigate to it
      // const newDocId = await addDocument(data)
      
      // // Close modal and navigate to the new document
      // setIsModalOpen(false)
      // setIsLoading(false)
      navigate(`/`)
      
    } catch (error) {
      console.error('Error submitting prompt:', error)
      // Handle error (you could add error state and display to user)
      setIsLoading(false)
    }
  }
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                  <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </motion.div>
              <span className="text-xl font-semibold text-gray-900">DocReview</span>
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link 
              to="/" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'border-primary-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <motion.button
              type="button"
              className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewNews}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>New Enhancement</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      <PromptModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPrompt}
        isLoading={isLoading}
      />
    </header>
  )
}

export default Header
