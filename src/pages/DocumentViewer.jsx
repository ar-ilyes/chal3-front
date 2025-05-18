import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDocuments } from '../contexts/DocumentContext'
import ChangeModal from '../components/ChangeModal'
import { motion, AnimatePresence } from 'framer-motion'

const DocumentViewer = () => {
  const { id } = useParams()
  const { getDocumentById, getChangesForDocument, approveChange, rejectChange } = useDocuments()
  const [document, setDocument] = useState(null)
  const [changes, setChanges] = useState([])
  const [selectedChange, setSelectedChange] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('document') // 'document', 'fasGaps', 'boardProposals', 'allChanges'
  const [highlightedContent, setHighlightedContent] = useState('')

  useEffect(() => {
    if (id) {
      const doc = getDocumentById(id)
      const docChanges = getChangesForDocument(id)
      console.log('Document:', doc)
      console.log('Changes:', docChanges)
      
      setDocument(doc)
      setChanges(docChanges)
      
      // Create highlighted content
      if (doc) {
        createHighlightedContent(doc.content, docChanges)
      }
      
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }, [id, getDocumentById, getChangesForDocument])
  
  // Function to create highlighted content with span tags
  const createHighlightedContent = (content, docChanges) => {
    if (!content || !docChanges || docChanges.length === 0) {
      setHighlightedContent(content)
      return
    }
    
    // Create a temporary div to parse the markdown
    let contentWithHighlights = content
    
    // Go through each change and wrap the old text with a highlight span
    docChanges.forEach(change => {
      if (change.oldText && contentWithHighlights.includes(change.oldText)) {
        const escapedOldText = change.oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const highlightTag = `<span class="highlight" data-change-id="${change.id}">${change.oldText}</span>`
        contentWithHighlights = contentWithHighlights.replace(
          new RegExp(escapedOldText, 'g'), 
          highlightTag
        )
      }
    })
    
    setHighlightedContent(contentWithHighlights)
  }

  const handleChangeClick = (event) => {
    const changeId = event.target.getAttribute('data-change-id')
    if (changeId) {
      const change = changes.find(c => c.id === changeId)
      if (change) {
        setSelectedChange(change)
        setIsModalOpen(true)
      }
    }
  }

  const handleApproveChange = () => {
    if (selectedChange) {
      approveChange(selectedChange.id)
      setIsModalOpen(false)
      setSelectedChange(null)
      
      const updatedChanges = changes.map(change => 
        change.id === selectedChange.id 
          ? { ...change, status: 'approved' } 
          : change
      )
      
      setChanges(updatedChanges)
      // Re-create highlighted content with updated changes
      if (document) {
        createHighlightedContent(document.content, updatedChanges)
      }
    }
  }

  const handleRejectChange = () => {
    if (selectedChange) {
      rejectChange(selectedChange.id, rejectionReason)
      setIsModalOpen(false)
      setSelectedChange(null)
      setRejectionReason('')
      
      const updatedChanges = changes.map(change => 
        change.id === selectedChange.id 
          ? { ...change, status: 'rejected', rejectionReason } 
          : change
      )
      
      setChanges(updatedChanges)
      // Re-create highlighted content with updated changes
      if (document) {
        createHighlightedContent(document.content, updatedChanges)
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedChange(null)
    setRejectionReason('')
  }

  // Handle clicking on a change in the All Changes tab
  const handleChangeItemClick = (changeId) => {
    const change = changes.find(c => c.id === changeId)
    if (change) {
      setSelectedChange(change)
      setIsModalOpen(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-primary-200 h-12 w-12 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-primary-600 font-medium">Loading document...</div>
        </div>
      </div>
    )
  }

  if (!document) {
    return <div className="p-8 text-center">Document not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Version {document.version}</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            <span className="font-medium text-gray-800">{changes.filter(c => c.status === 'pending').length}</span>
            <span className="text-gray-500"> pending changes</span>
          </div>
        </div>
      </div>

      {/* Change Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Change Summary</h2>
        <p className="text-gray-700">{document.changeSummary}</p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('document')}
            className={`${
              activeTab === 'document'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Document
          </button>
          <button
            onClick={() => setActiveTab('allChanges')}
            className={`${
              activeTab === 'allChanges'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Changes
          </button>
          <button
            onClick={() => setActiveTab('fasGaps')}
            className={`${
              activeTab === 'fasGaps'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            FAS Gaps Analysis
          </button>
          <button
            onClick={() => setActiveTab('boardProposals')}
            className={`${
              activeTab === 'boardProposals'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Board Proposals
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="document-container">
        {activeTab === 'document' && (
          <div className="prose max-w-none">
            {/* Using dangerouslySetInnerHTML to render the highlighted content */}
            <div 
              className="document-content" 
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
              onClick={handleChangeClick}
            />
          </div>
        )}

        {activeTab === 'allChanges' && (
          <div className="prose max-w-none">
            <h2>All Document Changes</h2>
            <p className="text-gray-600 text-sm mb-4">
              Below is a complete list of all proposed changes to this document. Click on any change to review it in detail.
            </p>

            {changes.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">No changes found for this document.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {changes.map((change, index) => (
                  <motion.div
                    key={change.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow ${
                      change.status === 'approved' 
                        ? 'border-success-300' 
                        : change.status === 'rejected'
                        ? 'border-error-300'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleChangeItemClick(change.id)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">Change #{index + 1}</h3>
                          <p className="text-sm text-gray-500 mb-3">Reference: {change.reference || 'Not specified'}</p>
                        </div>
                        <div className="ml-4">
                          {change.status === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                              Pending
                            </span>
                          )}
                          {change.status === 'approved' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              Approved
                            </span>
                          )}
                          {change.status === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Original Text:</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">{change.oldText}</p>
                      </div>
                      
                      <div className="bg-success-50 p-3 rounded-lg">
                        <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">New Text:</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">{change.newText}</p>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Justification:</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">{change.justification}</p>
                      </div>
                      
                      {change.status === 'rejected' && change.rejectionReason && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h4 className="text-xs font-medium uppercase text-error-500 mb-1">Rejection Reason:</h4>
                          <p className="text-sm text-gray-700">{change.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'fasGaps' && (
          <div className="prose max-w-none">
            <h2>FAS Gaps Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3>Overall Verdict</h3>
              <p><strong>Justification:</strong> {document.fasGaps.overall_verdict.overall_justification}</p>
              <p><strong>Chain of Thought:</strong> {document.fasGaps.overall_verdict.overall_chain_of_thought}</p>
              
              <h4>FAS to Update:</h4>
              <ul>
                {document.fasGaps.overall_verdict.fas_to_update.map((fas, index) => (
                  <li key={index}>{fas}</li>
                ))}
              </ul>
              
              <h4>Referenced Gaps:</h4>
              <ul>
                {document.fasGaps.overall_verdict.overall_referenced_gaps.map((gap, index) => (
                  <li key={index}>{gap}</li>
                ))}
              </ul>
            </div>

            <h3>Updated FAS Details</h3>
            {document.fasGaps.updated_fas_details.map((detail, index) => (
              <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
                <h4>FAS ID: {detail.fas_id}</h4>
                <p><strong>Justification:</strong> {detail.justification}</p>
                <p><strong>Chain of Thought:</strong> {detail.chain_of_thought}</p>
                
                <h5>Referenced Gaps:</h5>
                <ul>
                  {detail.referenced_gaps.map((gap, gapIndex) => (
                    <li key={gapIndex}>{gap}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'boardProposals' && (
          <div className="prose max-w-none">
            <h2>Board Proposals</h2>
            {document.boardProposals.map((proposal, index) => (
              <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg mb-6">
                <h3>Proposal from {proposal.llm}</h3>
                
                <div className="mb-4">
                  <h4>Shariah Solution</h4>
                  <p>{proposal.content.shariah_solution}</p>
                  
                  <h5>Updated Shariah Clauses:</h5>
                  {proposal.content.updated_shariah_clauses.map((clause, clauseIndex) => (
                    <div key={clauseIndex} className="bg-gray-50 p-3 rounded mb-2">
                      <p><strong>Clause {clause.clause_id}:</strong> {clause.text}</p>
                      <p className="text-sm text-gray-600">Reference: {clause.reference}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mb-4">
                  <h4>Accounting Rationale</h4>
                  <p>{proposal.content.accounting_rationale}</p>
                  
                  <h5>Updated Accounting Clauses:</h5>
                  {proposal.content.updated_accounting_clauses.map((clause, clauseIndex) => (
                    <div key={clauseIndex} className="bg-gray-50 p-3 rounded mb-2">
                      <p><strong>Clause {clause.clause_id}:</strong> {clause.text}</p>
                      <p className="text-sm text-gray-600">Reference: {clause.reference}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4>References</h4>
                  <ul>
                    {proposal.content.references.map((ref, refIndex) => (
                      <li key={refIndex}>{ref}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {isModalOpen && selectedChange && (
          <ChangeModal 
            change={selectedChange}
            onClose={closeModal}
            onApprove={handleApproveChange}
            onReject={handleRejectChange}
            rejectionReason={rejectionReason}
            onRejectionReasonChange={(e) => setRejectionReason(e.target.value)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default DocumentViewer