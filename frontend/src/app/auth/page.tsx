"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const body = isLogin ? { email, password } : { username, email, password };
            
            const res = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            login(data);
            router.push('/'); // Redirect to home after success
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 border shadow-sm rounded-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {isLogin ? 'Enter your credentials to access your account' : 'Enter your email below to create your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {error && <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">{error}</div>}
                    
                    {!isLogin && (
                        <div className="space-y-2">
                             <Input 
                                placeholder="Username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                             />
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-2">
                         <Input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                         />
                    </div>

                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground mt-4">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        type="button" 
                        className="font-bold text-foreground hover:underline"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
                
                <div className="text-center mt-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            &larr; Back to Screener
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
