
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Sword, Zap, AlertTriangle } from 'lucide-react';

const BattleGuide: React.FC = () => {
  const rules = [
    {
      icon: <Sword className="w-8 h-8 text-red-500" />,
      vs: <Shield className="w-8 h-8 text-blue-500" />,
      result: "🔄 STUN",
      description: "Attack vs Defense = Attacker gets stunned",
      color: "from-red-200 to-blue-200"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      vs: <Sword className="w-8 h-8 text-red-500" />,
      result: "💥 COUNTER",
      description: "Defense vs Attack = Counter-attack + stun opponent",
      color: "from-blue-200 to-green-200"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      vs: <Shield className="w-8 h-8 text-blue-500" />,
      result: "⚡ STUN",
      description: "Speed vs Defense = Speed user stuns defender",
      color: "from-yellow-200 to-blue-200"
    },
    {
      icon: <Sword className="w-8 h-8 text-red-500" />,
      vs: <Zap className="w-8 h-8 text-yellow-500" />,
      result: "🎯 HIT",
      description: "Attack vs Speed = Attack hits slow opponent",
      color: "from-red-200 to-yellow-200"
    },
    {
      icon: <Sword className="w-8 h-8 text-red-500" />,
      vs: <Sword className="w-8 h-8 text-red-500" />,
      result: "💥 CLASH",
      description: "Same moves = Both take damage or nothing happens",
      color: "from-gray-200 to-gray-300"
    }
  ];

  return (
    <Card className="border-4 border-purple-400 rounded-2xl shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 mb-4">
      <CardHeader className="bg-gradient-to-r from-purple-200 to-pink-300 rounded-t-2xl border-b-4 border-purple-400">
        <CardTitle className="flex items-center gap-2 text-purple-800 font-black text-lg">
          <AlertTriangle className="w-6 h-6" />
          📚 Battle Rules Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map((rule, index) => (
            <div key={index} className={`bg-gradient-to-r ${rule.color} p-3 rounded-xl border-2 border-purple-300 shadow-md`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {rule.icon}
                <span className="text-lg font-black">VS</span>
                {rule.vs}
                <span className="text-lg font-black">=</span>
                <span className="text-lg font-black text-purple-800">{rule.result}</span>
              </div>
              <p className="text-sm text-purple-700 font-bold text-center">{rule.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BattleGuide;
