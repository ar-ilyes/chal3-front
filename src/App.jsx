import { Routes, Route } from 'react-router-dom'
import DocumentList from './pages/DocumentList'
import DocumentViewer from './pages/DocumentViewer'
import ProcessingPage from './pages/ProcessingPage'
import Header from './components/Header'
import { DocumentProvider } from './contexts/DocumentContext'

function App() {
  return (
    <DocumentProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DocumentList />} />
            <Route path="/document/:id" element={<DocumentViewer />} />
            <Route path="/processing/:promptId" element={<ProcessingPage />} />
          </Routes>
        </main>
      </div>
    </DocumentProvider>
  )
}

export default App
