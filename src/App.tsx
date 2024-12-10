import { HomePage } from './pages/HomePage'
import { TodosPage } from './pages/TodosPage'
import { TodoDetailPage } from './pages/TodoDetailPage'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { MutationModal } from './components/MutationModal'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-lg">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl">Demo Todo app</Link>
            <div className="ml-4">
              <Link to="/" className="btn btn-ghost">Accueil</Link>
              <Link to="/todos" className="btn btn-ghost">Todos</Link>
            </div>
          </div>
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="User avatar" src="https://i.pravatar.cc/150?img=50" />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li><a>Profile</a></li>
                <li><a>Settings</a></li> 
              </ul>
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/todo/:id" element={<TodoDetailPage />} />
        </Routes>
        <MutationModal />
      </div>
    </Router>
  )
}

export default App
