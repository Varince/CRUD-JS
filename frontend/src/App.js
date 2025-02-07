import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/create" element={<CreateUserPage />} />
                <Route path="/admin/edit/:id" element={<EditUserPage />} />
            </Routes>
        </Router>
    );
}

export default App;
