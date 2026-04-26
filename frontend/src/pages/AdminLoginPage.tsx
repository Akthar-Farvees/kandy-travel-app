import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPin, Lock, Mail } from 'lucide-react';
import { getApiErrorMessage } from '../lib/utils';

export function AdminLoginPage() {
  const [email, setEmail] = useState('admin@kandy.lk');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (error) {
      setError(getApiErrorMessage(error, 'Invalid credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MapPin size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-secondary">Admin Portal</h1>
          <p className="text-text-muted mt-2">Secure access for Kandy Travel administrators</p>
        </div>

        <div className="glass p-8 rounded-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="admin@kandy.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-text-muted">
          Need help? Contact system administrator.
        </p>
      </div>
    </div>
  );
}
