import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ text: '¡Inicio de sesión exitoso! Redirigiendo...', type: 'success' });
        
        // Guardar sesión si "Recordarme" está marcado
        if (rememberMe) {
          localStorage.setItem('userEmail', email);
        }
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error) {
      setMessage({ text: 'Error inesperado. Intenta nuevamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error inesperado. Intenta nuevamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    // Redirigir a la página de registro
    window.location.href = '/register';
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage({ text: 'Por favor ingresa tu email primero', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ 
          text: '¡Email de recuperación enviado! Revisa tu bandeja de entrada.', 
          type: 'success' 
        });
      }
    } catch (error) {
      setMessage({ text: 'Error inesperado. Intenta nuevamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Cargar email guardado si existe
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="container">
        <div className="left-panel">
          <div className="app-name">MoneyLiamApp</div>
          <div className="app-tagline">Tu solución financiera rápida y confiable</div>
          
          <div className="graphic">
            <div className="circle">
              <div className="inner-circle">
                <i className="fas fa-hand-holding-usd money-icon"></i>
              </div>
            </div>
          </div>
          
          <ul className="app-features">
            <li><i className="fas fa-check-circle"></i> Préstamos rápidos y seguros</li>
            <li><i className="fas fa-check-circle"></i> Tasas de interés competitivas</li>
            <li><i className="fas fa-check-circle"></i> Proceso 100% digital</li>
          </ul>
        </div>
        
        <div className="right-panel">
          <div className="welcome-text">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresa a tu cuenta para gestionar tus préstamos</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <i className="fas fa-envelope input-icon"></i>
              <input 
                type="email" 
                id="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <i className="fas fa-lock input-icon"></i>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            
            <div className="remember-forgot">
              <div className="remember">
                <input 
                  type="checkbox" 
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember">Recordarme</label>
              </div>
              <a href="#" className="forgot-password" onClick={handlePasswordReset}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="separator">o continúa con</div>
          
          <div className="social-login">
            <div 
              className="social-button google" 
              onClick={() => !loading && handleSocialLogin('google')}
              disabled={loading}
            >
              <i className="fab fa-google"></i>
            </div>
            <div 
              className="social-button facebook" 
              onClick={() => !loading && handleSocialLogin('facebook')}
              disabled={loading}
            >
              <i className="fab fa-facebook-f"></i>
            </div>
            <div 
              className="social-button apple" 
              onClick={() => !loading && handleSocialLogin('apple')}
              disabled={loading}
            >
              <i className="fab fa-apple"></i>
            </div>
          </div>
          
          <div className="signup-link">
            ¿No tienes una cuenta? <a href="#" onClick={handleSignUp}>Regístrate ahora</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;