import { motion } from 'framer-motion'

const LoadingScreen = ({ message = "Processing your request..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-24 h-24 mb-6">
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-primary-300 border-b-primary-200 border-l-primary-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Document</h2>
        <p className="text-gray-600 text-center mb-4">{message}</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <motion.div 
            className="bg-primary-500 h-2.5 rounded-full" 
            initial={{ width: "10%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 15, ease: "easeInOut" }}
          />
        </div>
        
        <p className="text-sm text-gray-500 italic">This may take a few moments...</p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen