import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function DevLogin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Only available in development
    if (import.meta.env.PROD) {
      setLocation('/');
      return;
    }

    fetch('/api/dev-users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        setLoading(false);
      });
  }, [setLocation]);

  const handleLogin = async (userId: string) => {
    try {
      const response = await fetch('/api/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      toast({
        title: 'Logged in successfully',
        description: `Welcome, ${data.user.firstName} ${data.user.lastName}!`,
      });

      // Redirect based on role
      switch (data.user.role) {
        case 'ADMIN':
          setLocation('/admin');
          break;
        case 'DENTIST':
          setLocation('/dentist');
          break;
        case 'PATIENT':
          setLocation('/dashboard');
          break;
        default:
          setLocation('/');
      }

      // Reload to update auth state
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (import.meta.env.PROD) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Development Login</h1>
          <p className="text-gray-600">Select a user to log in as (development only)</p>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'DENTIST'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
                </div>
                <Button
                  onClick={() => handleLogin(user.id)}
                  className="ml-4"
                >
                  Login as {user.role.toLowerCase()}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
