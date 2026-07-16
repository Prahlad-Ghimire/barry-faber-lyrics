import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, type }) {

    const userAuth = sessionStorage.getItem('userAuth')
    const adminAuth = sessionStorage.getItem('adminAuth')

    if (type === 'user' && !userAuth) return <Navigate to="/" replace />

    if (type === 'admin' && !adminAuth) return <Navigate to="/admin/login" replace />

    return children
}