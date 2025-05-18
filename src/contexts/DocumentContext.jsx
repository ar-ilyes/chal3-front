import { createContext, useContext, useState, useEffect } from 'react'

const DocumentContext = createContext()

export const useDocuments = () => useContext(DocumentContext)

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([])
  const [changes, setChanges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPipelineRuns()
  }, [])

  const fetchPipelineRuns = async () => {
    try {
      const response = await fetch('https://challenge3-onsite.onrender.com/pipeline-runs')
      const data = await response.json()
      
      // Transform pipeline runs into documents
      const transformedDocs = data.runs.map(run => ({
        id: run.run_id.toString(),
        title: `FAS ${run.run_data.fas_number} Review`,
        description: run.run_data.user_prompt,
        content: run.fas_old_file,
        version: "1.0",
        lastUpdated: new Date().toISOString(),
        pendingChanges: run.run_data.reasoning_trace.fas_diff.changes.length,
        changeSummary: run.run_data.reasoning_trace.change_summary,
        fasGaps: run.run_data.reasoning_trace.fas_gaps,
        boardProposals: run.run_data.reasoning_trace.board_proposals,
        diffChanges: run.run_data.reasoning_trace.fas_diff.changes
      }))

      setDocuments(transformedDocs)
      
      // Transform diff changes into our change format
      const allChanges = data.runs.flatMap(run => 
        run.run_data.reasoning_trace.fas_diff.changes.map((change, index) => ({
          id: `change-${run.run_id}-${index}`,
          documentId: run.run_id.toString(),
          oldText: change.old_paragraph,
          newText: change.new_paragraph,
          justification: change.justification,
          reference: change.section,
          status: 'pending'
        }))
      )
      console.log('All changes:', allChanges)

      setChanges(allChanges)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching pipeline runs:', error)
      setLoading(false)
    }
  }

  const getDocumentById = (id) => {
    return documents.find(doc => doc.id === id)
  }

  const getChangesForDocument = (documentId) => {
    return changes.filter(change => change.documentId === documentId)
  }

  const approveChange = (changeId) => {
    setChanges(prevChanges => 
      prevChanges.map(change => 
        change.id === changeId 
          ? { ...change, status: 'approved' } 
          : change
      )
    )
    
    // Update document's pending changes count
    const change = changes.find(c => c.id === changeId)
    if (change) {
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === change.documentId 
            ? { ...doc, pendingChanges: doc.pendingChanges - 1 } 
            : doc
        )
      )
    }
  }

  const rejectChange = (changeId, reason) => {
    setChanges(prevChanges => 
      prevChanges.map(change => 
        change.id === changeId 
          ? { ...change, status: 'rejected', rejectionReason: reason } 
          : change
      )
    )
    
    // Update document's pending changes count
    const change = changes.find(c => c.id === changeId)
    if (change) {
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === change.documentId 
            ? { ...doc, pendingChanges: doc.pendingChanges - 1 } 
            : doc
        )
      )
    }
  }
  
  // Add new document from API response
  const addDocument = async (responseData) => {
    // Generate a unique ID for the new document
    const newId = `doc-${Date.now()}`
    
    // Extract FAS number from the response or generate a generic title
    let fasNumber = "New"
    try {
      // Try to extract FAS number from response if available
      if (responseData.run_data && responseData.run_data.fas_number) {
        fasNumber = responseData.run_data.fas_number
      }
    } catch (error) {
      console.warn('Could not extract FAS number from response', error)
    }
    
    // Create document object from response
    const newDocument = {
      id: newId,
      title: `FAS ${fasNumber} Review`,
      description: responseData.run_data?.user_prompt || "User submitted enhancement request",
      content: responseData.fas_old_file || "",
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      pendingChanges: responseData.run_data?.reasoning_trace?.fas_diff?.changes?.length || 0,
      changeSummary: responseData.run_data?.reasoning_trace?.change_summary || "No change summary available",
      fasGaps: responseData.run_data?.reasoning_trace?.fas_gaps || { 
        overall_verdict: { 
          overall_justification: "Not available", 
          overall_chain_of_thought: "Not available",
          fas_to_update: [],
          overall_referenced_gaps: []
        },
        updated_fas_details: []
      },
      boardProposals: responseData.run_data?.reasoning_trace?.board_proposals || []
    }
    
    // Add the new document to our state
    setDocuments(prevDocuments => [...prevDocuments, newDocument])
    
    // Process and add changes
    if (responseData.run_data?.reasoning_trace?.fas_diff?.changes) {
      const newChanges = responseData.run_data.reasoning_trace.fas_diff.changes.map((change, index) => ({
        id: `change-${newId}-${index}`,
        documentId: newId,
        oldText: change.old_paragraph,
        newText: change.new_paragraph,
        justification: change.justification,
        reference: change.section,
        status: 'pending'
      }))
      
      setChanges(prevChanges => [...prevChanges, ...newChanges])
    }
    
    return newId
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        changes,
        loading,
        getDocumentById,
        getChangesForDocument,
        approveChange,
        rejectChange,
        addDocument
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export default DocumentContext
