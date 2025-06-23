
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  onAuth: (user: { email: string; name: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.name && signUpData.email &&signUpData.password) {
      onAuth({ email: signUpData.email, name: signUpData.name });
      toast.success(`Welcome ${signUpData.name}! Account created successfully!`);
      setIsOpen(false);
      setSignUpData({ name: '', email: '', password: '' });
    } else {
      toast.error('Please fill in all fields!');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInData.email && signInData.password) {
      onAuth({ email: signInData.email, name: 'Bug Trainer' });
      toast.success('Welcome back! Signed in successfully!');
      setIsOpen(false);
      setSignInData({ email: '', password: '' });
    } else {
      toast.error('Please fill in all fields!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white rounded-2xl font-bold transform hover:scale-105 transition-all shadow-lg">
          <User className="w-5 h-5 mr-2" />
          🎮 Join Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-purple-700">
            🎮 Bug Battles Account 🎮
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-purple-100 rounded-2xl">
            <TabsTrigger value="signin" className="rounded-2xl">🔐 Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-2xl">✨ Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-purple-700 font-semibold">📧 Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-12 rounded-2xl border-2 border-purple-200"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-purple-700 font-semibold">🔒 Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    className="pl-12 rounded-2xl border-2 border-purple-200"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white rounded-2xl font-bold h-12 transform hover:scale-105 transition-all">
                🎯 Sign In & Play!
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-purple-700 font-semibold">👤 Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                  <Input
                    id="signup-name"
                    placeholder="Your trainer name"
                    className="pl-12 rounded-2xl border-2 border-purple-200"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-purple-700 font-semibold">📧 Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-12 rounded-2xl border-2 border-purple-200"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-purple-700 font-semibold">🔒 Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-12 rounded-2xl border-2 border-purple-200"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 text-white rounded-2xl font-bold h-12 transform hover:scale-105 transition-all">
                ✨ Create Account & Start!
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
