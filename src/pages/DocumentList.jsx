import { useNavigate } from 'react-router-dom'
import { useDocuments } from '../contexts/DocumentContext'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

const DocumentList = () => {
  const { documents } = useDocuments()
  const navigate = useNavigate()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve document changes
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            className="bg-white overflow-hidden shadow rounded-lg card-hover-effect"
            variants={item}
            onClick={() => navigate(`/document/${doc.id}`)}
          >
            <div className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{doc.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {format(new Date(doc.lastUpdated), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className={`rounded-full w-3 h-3 ${
                  doc.pendingChanges > 0 ? 'bg-accent-500' : 'bg-success-500'
                }`}></div>
              </div>
              
              <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                {doc.description}
              </p>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                <span>Version {doc.version}</span>
                
                {doc.pendingChanges > 0 && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                    {doc.pendingChanges} pending changes
                  </span>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex justify-center items-center px-4 py-2 w-full border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/document/${doc.id}`);
                  }}
                >
                  View Document
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DocumentList