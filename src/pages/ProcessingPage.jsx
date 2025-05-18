import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocuments } from '../contexts/DocumentContext'
import LoadingScreen from '../components/LoadingScreen'

const ProcessingPage = () => {
  const { promptId } = useParams()
  const navigate = useNavigate()
  const { documents } = useDocuments()
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Initializing enhancement process...")
  
  useEffect(() => {
    // This is a simulation of processing steps
    // In a real app, you might poll an API endpoint for status updates
    
    const statusMessages = [
      "Analyzing your prompt...",
      "Identifying relevant documentation...",
      "Generating potential changes...",
      "Evaluating FAS compliance...",
      "Creating board proposals...",
      "Finalizing documentation changes..."
    ]
    
    let currentStep = 0
    
    const interval = setInterval(() => {
      if (currentStep < statusMessages.length) {
        setStatusMessage(statusMessages[currentStep])
        setProgress((currentStep + 1) / statusMessages.length * 100)
        currentStep++
      } else {
        clearInterval(interval)
        
        // After processing is complete, find the latest document and navigate to it
        // This is a placeholder - in a real app, you'd navigate to the correct document ID
        const docIds = documents.map(doc => doc.id)
        const latestDocId = docIds.length > 0 ? docIds[docIds.length - 1] : null
        
        if (latestDocId) {
          navigate(`/document/${latestDocId}`)
        } else {
          navigate('/')
        }
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [navigate, documents])
  
  return <LoadingScreen message={statusMessage} />
}

export default ProcessingPage