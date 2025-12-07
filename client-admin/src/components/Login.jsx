import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext.jsx';
import 'shared-ui/components/Login.css'

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AdminContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault(); // prevent reloading page

        setError(null);
        setIsSubmitting(true);
    
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError("Network error", err);
        } finally {
            setIsSubmitting(false);
        }
    }
    

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome back 👋</h1>
                <p className="subtitle">Please log in to continue</p>

                {error && <p className="login-error">{error}</p>} 
        
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email"
                           id="email" 
                           name="email" 
                           placeholder='Email' 
                           value={email} 
                           onChange={(e) => setEmail(e.target.value)}
                           required />

                    <label htmlFor="password">Password</label>
                    <input type="password" 
                           id="password" 
                           name="password" 
                           placeholder='Password'
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in…' : 'Login'}
                    </button>

                    <div className="register-link">
                        <p>Don’t have an account?</p>
                        <Link to="/register">Create one</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
