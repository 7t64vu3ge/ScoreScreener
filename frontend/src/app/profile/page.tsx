"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ bio: '', avatarUrl: '' });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://scorescreener-1.onrender.com/api';

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetch(`${apiUrl}/profile`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data) {
                    setProfile(data);
                    setFormData({ bio: data.bio || '', avatarUrl: data.avatarUrl || '' });
                }
            })
            .catch(err => console.error(err));
        }
    }, [user, apiUrl]);

    const handleSave = async () => {
        if (!user) return;
        
        try {
            const res = await fetch(`${apiUrl}/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setProfile(data);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (authLoading || !user) return <div className="p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-background p-10">
            <Link href="/">
                <Button variant="ghost" className="mb-6">&larr; Back to Screener</Button>
            </Link>

            <div className="max-w-2xl mx-auto border p-8 bg-card text-card-foreground shadow-sm">
                <div className="flex items-center gap-6 mb-8">
                    <div className="size-20 bg-muted rounded-full flex items-center justify-center text-3xl font-bold">
                        {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="rounded-full size-full object-cover"/> : user.username[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user.username}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Bio</h3>
                        {isEditing ? (
                            <Input 
                                value={formData.bio} 
                                onChange={e => setFormData({...formData, bio: e.target.value})} 
                            />
                        ) : (
                            <p className="text-muted-foreground">{profile?.bio || 'No bio yet.'}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Avatar URL</h3>
                        {isEditing ? (
                            <Input 
                                value={formData.avatarUrl} 
                                onChange={e => setFormData({...formData, avatarUrl: e.target.value})} 
                                placeholder="https://..."
                            />
                         ) : (
                            <p className="text-muted-foreground break-all">{profile?.avatarUrl || 'No custom avatar.'}</p>
                         )}
                    </div>

                    <div className="pt-4 flex gap-4">
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave}>Save Changes</Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
