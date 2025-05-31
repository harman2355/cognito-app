import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MobileLayout from '@/components/MobileLayout';
import { useUser } from '@/contexts/UserContext';
import { useGame, GameType } from '@/contexts/GameContext';
import {
  Brain,
  Target,
  Puzzle,
  Shuffle,
  Zap,
  Play,
  Crown,
  Star,
  Flame } from
'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const { dailyChallenge, getGameStats } = useGame();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, navigate]);

  const gameCategories = [
  {
    type: 'memory' as GameType,
    title: 'Memory Palace',
    description: 'Pattern recall & sequence matching',
    icon: Brain,
    gradient: 'from-red-500 to-red-600',
    level: getGameStats('memory').currentLevel,
    maxLevel: 50,
    progress: getGameStats('memory').currentLevel / 50 * 100
  },
  {
    type: 'attention' as GameType,
    title: 'Focus Zone',
    description: 'Attention training & distraction filtering',
    icon: Target,
    gradient: 'from-orange-500 to-yellow-500',
    level: getGameStats('attention').currentLevel,
    maxLevel: 45,
    progress: getGameStats('attention').currentLevel / 45 * 100
  },
  {
    type: 'problem-solving' as GameType,
    title: 'Logic Labs',
    description: 'Puzzles & mathematical reasoning',
    icon: Puzzle,
    gradient: 'from-purple-500 to-purple-600',
    level: getGameStats('problem-solving').currentLevel,
    maxLevel: 60,
    progress: getGameStats('problem-solving').currentLevel / 60 * 100,
    isNew: true
  },
  {
    type: 'flexibility' as GameType,
    title: 'Mental Shift',
    description: 'Cognitive flexibility & task switching',
    icon: Shuffle,
    gradient: 'from-green-500 to-emerald-500',
    level: getGameStats('flexibility').currentLevel,
    maxLevel: 40,
    progress: getGameStats('flexibility').currentLevel / 40 * 100
  },
  {
    type: 'speed' as GameType,
    title: 'Quick Think',
    description: 'Processing speed & rapid decisions',
    icon: Zap,
    gradient: 'from-blue-500 to-blue-600',
    level: getGameStats('speed').currentLevel,
    maxLevel: 35,
    progress: getGameStats('speed').currentLevel / 35 * 100
  }];


  const handleGameClick = (gameType: GameType) => {
    navigate(`/game/${gameType}`);
  };

  const handleDailyChallengeClick = () => {
    if (dailyChallenge) {
      navigate(`/game/${dailyChallenge.gameType}?daily=true`);
    }
  };

  const getDailyChallengeTitle = () => {
    if (!dailyChallenge) return 'Memory Master';
    const game = gameCategories.find((g) => g.type === dailyChallenge.gameType);
    return game?.title || 'Memory Master';
  };

  const getDailyChallengeDescription = () => {
    if (!dailyChallenge) return 'Remember the sequence and boost your working memory';
    const game = gameCategories.find((g) => g.type === dailyChallenge.gameType);
    return game?.description || 'Remember the sequence and boost your working memory';
  };

  return (
    <MobileLayout data-id="isbehand2" data-path="src/pages/HomePage.tsx">
      <div className="p-5 space-y-6" data-id="kcf7dcq3e" data-path="src/pages/HomePage.tsx">
        {/* Daily Challenge */}
        <section data-id="aj4bug1wg" data-path="src/pages/HomePage.tsx">
          <h2 className="text-xl font-bold text-gray-800 mb-4" data-id="f1ha18zko" data-path="src/pages/HomePage.tsx">Daily Challenge</h2>
          <Card
            className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer transform transition-transform hover:scale-105 relative overflow-hidden ${
            dailyChallenge?.completed ? 'opacity-75' : ''}`
            }
            onClick={handleDailyChallengeClick} data-id="7nri3xzc3" data-path="src/pages/HomePage.tsx">

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 opacity-20 animate-pulse" data-id="qs26kldl0" data-path="src/pages/HomePage.tsx"></div>
            <CardContent className="p-6 relative z-10" data-id="2k8kci109" data-path="src/pages/HomePage.tsx">
              <div className="flex justify-between items-start mb-4" data-id="efb8ngs7m" data-path="src/pages/HomePage.tsx">
                <div data-id="e1sh5audw" data-path="src/pages/HomePage.tsx">
                  <h3 className="text-xl font-bold mb-2" data-id="c80l1s7bl" data-path="src/pages/HomePage.tsx">{getDailyChallengeTitle()}</h3>
                  <p className="text-white/80 text-sm mb-4" data-id="1a3gts3zo" data-path="src/pages/HomePage.tsx">{getDailyChallengeDescription()}</p>
                  {dailyChallenge?.completed ?
                  <Badge className="bg-green-500 text-white" data-id="4h8cbapah" data-path="src/pages/HomePage.tsx">
                      ✓ Completed
                    </Badge> :

                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                    size="sm" data-id="u6qs54qjz" data-path="src/pages/HomePage.tsx">

                      <Play className="w-4 h-4 mr-2" data-id="t6n2k1x38" data-path="src/pages/HomePage.tsx" />
                      Start Challenge
                    </Button>
                  }
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center" data-id="jsyyabwyi" data-path="src/pages/HomePage.tsx">
                  <Flame className="w-8 h-8 text-white" data-id="tlapw0o2p" data-path="src/pages/HomePage.tsx" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brain Training Games */}
        <section data-id="5i1bkjwoq" data-path="src/pages/HomePage.tsx">
          <h2 className="text-xl font-bold text-gray-800 mb-4" data-id="n63iacwum" data-path="src/pages/HomePage.tsx">Brain Training Games</h2>
          <div className="grid grid-cols-2 gap-3" data-id="dqjzhcxuh" data-path="src/pages/HomePage.tsx">
            {gameCategories.map((game) => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.type}
                  className={`bg-gradient-to-br ${game.gradient} text-white cursor-pointer transform transition-transform hover:scale-105 relative overflow-hidden`}
                  onClick={() => handleGameClick(game.type)} data-id="xo7qk8419" data-path="src/pages/HomePage.tsx">

                  {game.isNew &&
                  <Badge className="absolute top-2 right-2 bg-emerald-500 text-white text-xs z-10" data-id="xyuq6g8do" data-path="src/pages/HomePage.tsx">
                      NEW
                    </Badge>
                  }
                  <CardContent className="p-4 relative z-10" data-id="5tcjnjqe4" data-path="src/pages/HomePage.tsx">
                    <div className="flex flex-col h-full" data-id="hu20n32of" data-path="src/pages/HomePage.tsx">
                      <Badge className="bg-black/30 text-white text-xs mb-3 self-start" data-id="xfyuf3wn0" data-path="src/pages/HomePage.tsx">
                        LEVEL {game.level}/{game.maxLevel}
                      </Badge>
                      <div className="flex-1" data-id="7e45ip0rb" data-path="src/pages/HomePage.tsx">
                        <h3 className="font-bold text-sm mb-1" data-id="lqyh4hcme" data-path="src/pages/HomePage.tsx">{game.title}</h3>
                        <p className="text-xs text-white/80 leading-tight" data-id="lm3x86oal" data-path="src/pages/HomePage.tsx">
                          {game.description}
                        </p>
                      </div>
                      <div className="mt-3" data-id="wxc8ml1jp" data-path="src/pages/HomePage.tsx">
                        <Progress
                          value={game.progress}
                          className="h-2 bg-white/20" data-id="nd4rh27lc" data-path="src/pages/HomePage.tsx" />

                      </div>
                    </div>
                  </CardContent>
                  <div className="absolute top-2 right-2" data-id="bpmzquf9o" data-path="src/pages/HomePage.tsx">
                    <Icon className="w-6 h-6 text-white/70" data-id="ceiwu14fn" data-path="src/pages/HomePage.tsx" />
                  </div>
                </Card>);

            })}
            
            {/* Premium Card */}
            <Card
              className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-800 cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => navigate('/subscription')} data-id="3awsmy5gi" data-path="src/pages/HomePage.tsx">

              <CardContent className="p-4" data-id="4wu061wta" data-path="src/pages/HomePage.tsx">
                <div className="flex flex-col h-full" data-id="kd12f3km2" data-path="src/pages/HomePage.tsx">
                  <Badge className="bg-black/20 text-gray-800 text-xs mb-3 self-start" data-id="xb3l8d30p" data-path="src/pages/HomePage.tsx">
                    🔒 PREMIUM
                  </Badge>
                  <div className="flex-1" data-id="vz5bsg6s1" data-path="src/pages/HomePage.tsx">
                    <h3 className="font-bold text-sm mb-1" data-id="jjjq3loto" data-path="src/pages/HomePage.tsx">Advanced Training</h3>
                    <p className="text-xs text-gray-700 leading-tight" data-id="q62vtwd7c" data-path="src/pages/HomePage.tsx">
                      Unlock premium cognitive training
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="absolute top-2 right-2" data-id="w8lhn77o6" data-path="src/pages/HomePage.tsx">
                <Crown className="w-6 h-6 text-gray-700" data-id="e43my9le1" data-path="src/pages/HomePage.tsx" />
              </div>
            </Card>
          </div>
        </section>

        {/* Quick Stats */}
        <section data-id="i8449euql" data-path="src/pages/HomePage.tsx">
          <Card className="bg-white shadow-sm" data-id="86z6r1yel" data-path="src/pages/HomePage.tsx">
            <CardHeader className="pb-3" data-id="h7o8jmrsz" data-path="src/pages/HomePage.tsx">
              <CardTitle className="text-lg text-gray-800" data-id="ezqtslelw" data-path="src/pages/HomePage.tsx">Today's Performance</CardTitle>
            </CardHeader>
            <CardContent data-id="midzpfeno" data-path="src/pages/HomePage.tsx">
              <div className="grid grid-cols-3 gap-4 text-center" data-id="qxtpb8tfq" data-path="src/pages/HomePage.tsx">
                <div data-id="s740l2nk1" data-path="src/pages/HomePage.tsx">
                  <div className="text-2xl font-bold text-purple-600" data-id="xow3my1pe" data-path="src/pages/HomePage.tsx">
                    {user?.totalGamesPlayed || 0}
                  </div>
                  <div className="text-xs text-gray-500" data-id="1murnx5m6" data-path="src/pages/HomePage.tsx">Games Played</div>
                </div>
                <div data-id="j02zmcu31" data-path="src/pages/HomePage.tsx">
                  <div className="text-2xl font-bold text-purple-600" data-id="0cylnn1qx" data-path="src/pages/HomePage.tsx">
                    {user?.streak || 0}
                  </div>
                  <div className="text-xs text-gray-500" data-id="73pbb7yir" data-path="src/pages/HomePage.tsx">Day Streak</div>
                </div>
                <div data-id="7d5q6zhef" data-path="src/pages/HomePage.tsx">
                  <div className="text-2xl font-bold text-purple-600" data-id="zjjhc524c" data-path="src/pages/HomePage.tsx">
                    {user?.level || 1}
                  </div>
                  <div className="text-xs text-gray-500" data-id="2nm44rw5r" data-path="src/pages/HomePage.tsx">Overall Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Scientific Info */}
        <section data-id="uequnw2hp" data-path="src/pages/HomePage.tsx">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" data-id="2oab44myw" data-path="src/pages/HomePage.tsx">
            <CardContent className="p-4" data-id="rxj9fh0ny" data-path="src/pages/HomePage.tsx">
              <div className="flex items-start gap-3" data-id="l8pvnvnkb" data-path="src/pages/HomePage.tsx">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center" data-id="fpy1ph6s4" data-path="src/pages/HomePage.tsx">
                  <Star className="w-5 h-5 text-blue-600" data-id="bmimowxoi" data-path="src/pages/HomePage.tsx" />
                </div>
                <div className="flex-1" data-id="aekgt3vpv" data-path="src/pages/HomePage.tsx">
                  <h3 className="font-semibold text-gray-800 mb-1" data-id="l3iapdxdv" data-path="src/pages/HomePage.tsx">
                    Science-Backed Training
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed" data-id="cpudqx6e2" data-path="src/pages/HomePage.tsx">
                    Our exercises are based on neuroplasticity research and cognitive science. 
                    Regular training can improve working memory, attention span, and processing speed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </MobileLayout>);

};

export default HomePage;