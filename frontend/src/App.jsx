import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import Login from './pages/Login'
import Register from './pages/Register'

function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  )
}

export default App
