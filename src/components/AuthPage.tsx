
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const { signUp, signIn } = useAuth();
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      toast.error('Please fill in all fields!');
      return;
    }

    setLoading(true);
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.name);
    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('Email already registered. Try signing in instead!');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } else {
      toast.success(`Welcome ${signUpData.name}! Account created successfully!`);
      setSignUpData({ name: '', email: '', password: '' });
      // No need to manually redirect - the auth state change will handle it
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error('Please fill in all fields!');
      return;
    }

    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password!');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    } else {
      setSignInData({ email: '', password: '' });
      // The auth state change will automatically redirect to the game
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 rounded-3xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="p-2 rounded-2xl hover:bg-purple-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-center text-xl sm:text-2xl text-purple-700 flex-1">
              🎮 Bug Adventure Account 🎮
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-100 rounded-2xl">
              <TabsTrigger value="signin" className="rounded-2xl text-sm">🔐 Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-2xl text-sm">✨ Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-purple-700 font-semibold text-sm">📧 Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 rounded-2xl border-2 border-purple-200 text-sm"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-purple-700 font-semibold text-sm">🔒 Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      className="pl-10 rounded-2xl border-2 border-purple-200 text-sm"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white rounded-2xl font-bold h-10 sm:h-12 transform hover:scale-105 transition-all text-sm sm:text-base"
                >
                  {loading ? '⏳ Signing In...' : '🎯 Sign In & Play!'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-purple-700 font-semibold text-sm">👤 Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      id="signup-name"
                      placeholder="Your trainer name"
                      className="pl-10 rounded-2xl border-2 border-purple-200 text-sm"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-purple-700 font-semibold text-sm">📧 Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 rounded-2xl border-2 border-purple-200 text-sm"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-purple-700 font-semibold text-sm">🔒 Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10 rounded-2xl border-2 border-purple-200 text-sm"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 text-white rounded-2xl font-bold h-10 sm:h-12 transform hover:scale-105 transition-all text-sm sm:text-base"
                >
                  {loading ? '⏳ Creating Account...' : '✨ Create Account & Start!'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
