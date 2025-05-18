import { useState } from 'react'
import { motion } from 'framer-motion'

const ChangeModal = ({ 
  change, 
  onClose, 
  onApprove, 
  onReject, 
  rejectionReason, 
  onRejectionReasonChange 
}) => {
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  
  const handleRejectClick = () => {
    if (showRejectionForm) {
      onReject()
    } else {
      setShowRejectionForm(true)
    }
  }

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto my-8 max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">Review Suggested Change</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Original Text:</h4>
            <div className="text-gray-800 p-3 bg-white border border-gray-200 rounded">
              {change.oldText}
            </div>
          </div>
          
          <div className="bg-success-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Suggested Change:</h4>
            <div className="text-gray-800 p-3 bg-white border border-success-200 rounded">
              {change.newText}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Justification:</h4>
            <div className="text-gray-800">
              {change.justification}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Reference:</h4>
            <div className="text-gray-800">
              {change.reference}
            </div>
          </div>
          
          {showRejectionForm && (
            <div className="mt-6">
              <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Please provide a reason for rejecting this change..."
                value={rejectionReason}
                onChange={onRejectionReasonChange}
              />
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            {showRejectionForm && (
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setShowRejectionForm(false)}
              >
                Cancel
              </button>
            )}
            
            <motion.button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 ${
                showRejectionForm && !rejectionReason 
                  ? 'bg-error-300 cursor-not-allowed' 
                  : 'bg-error-600 hover:bg-error-700'
              }`}
              disabled={showRejectionForm && !rejectionReason}
              onClick={handleRejectClick}
              whileHover={showRejectionForm && !rejectionReason ? {} : { scale: 1.05 }}
              whileTap={showRejectionForm && !rejectionReason ? {} : { scale: 0.95 }}
            >
              {showRejectionForm ? 'Submit Rejection' : 'Reject'}
            </motion.button>
            
            <motion.button
              type="button"
              className="px-4 py-2 bg-success-600 rounded-md text-sm font-medium text-white hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500"
              onClick={onApprove}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Approve
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ChangeModal