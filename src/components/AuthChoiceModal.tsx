
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, UserX, Shield, AlertTriangle } from 'lucide-react';

interface AuthChoiceModalProps {
  isOpen: boolean;
  onChoice: (choice: 'auth' | 'anonymous') => void;
}

const AuthChoiceModal: React.FC<AuthChoiceModalProps> = ({ isOpen, onChoice }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="border-6 border-purple-400 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-black text-purple-800 mb-4">
            🎮 Welcome to Bug Adventure! 🎮
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <div className="text-center">
            <p className="text-lg font-bold text-purple-700 mb-6">
              🌟 Choose how you want to play! 🌟
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => onChoice('auth')}
              className="w-full h-20 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transform hover:scale-105 transition-all shadow-xl"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6" />
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-lg font-black">🔐 Sign Up / Sign In</div>
                <div className="text-sm opacity-90">Save your progress forever!</div>
              </div>
            </Button>

            <Button
              onClick={() => onChoice('anonymous')}
              variant="outline"
              className="w-full h-20 bg-gradient-to-r from-orange-200 to-yellow-200 hover:from-orange-300 hover:to-yellow-300 border-4 border-orange-400 text-orange-800 rounded-2xl transform hover:scale-105 transition-all shadow-xl"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <UserX className="w-6 h-6" />
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="text-lg font-black">🎯 Play Anonymously</div>
                <div className="text-sm">Quick play - progress not saved</div>
              </div>
            </Button>
          </div>

          <div className="bg-blue-100 p-4 rounded-2xl border-2 border-blue-300">
            <p className="text-sm text-blue-800 font-bold text-center">
              💡 Tip: Sign up to keep your bug collection and progress safe!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthChoiceModal;
