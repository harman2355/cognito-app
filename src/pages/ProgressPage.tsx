import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MobileLayout from '@/components/MobileLayout';
import { useUser } from '@/contexts/UserContext';
import { useGame } from '@/contexts/GameContext';
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Brain,
  Zap,
  Puzzle,
  Shuffle,
  Eye,
  Star,
  Flame,
  Trophy } from
'lucide-react';

const ProgressPage: React.FC = () => {
  const { user, userStats } = useUser();
  const { gameHistory, getGameStats } = useGame();

  // Calculate stats
  const totalGamesPlayed = gameHistory.length;
  const last7DaysGames = gameHistory.filter((game) => {
    const gameDate = new Date(game.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return gameDate >= weekAgo;
  });

  const averageScore = totalGamesPlayed > 0 ?
  Math.round(gameHistory.reduce((sum, game) => sum + game.score, 0) / totalGamesPlayed) :
  0;

  const averageAccuracy = totalGamesPlayed > 0 ?
  Math.round(gameHistory.reduce((sum, game) => sum + game.accuracy, 0) / totalGamesPlayed) :
  0;

  const gameTypeStats = [
  {
    type: 'memory',
    name: 'Memory',
    icon: Brain,
    color: 'from-red-500 to-red-600',
    stats: getGameStats('memory')
  },
  {
    type: 'attention',
    name: 'Attention',
    icon: Eye,
    color: 'from-orange-500 to-yellow-500',
    stats: getGameStats('attention')
  },
  {
    type: 'problem-solving',
    name: 'Problem Solving',
    icon: Puzzle,
    color: 'from-purple-500 to-purple-600',
    stats: getGameStats('problem-solving')
  },
  {
    type: 'flexibility',
    name: 'Flexibility',
    icon: Shuffle,
    color: 'from-green-500 to-emerald-500',
    stats: getGameStats('flexibility')
  },
  {
    type: 'speed',
    name: 'Speed',
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    stats: getGameStats('speed')
  }];


  const recentGames = gameHistory.
  sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).
  slice(0, 5);

  const achievements = [
  {
    id: 'first_game',
    name: 'Getting Started',
    description: 'Completed your first brain training session',
    icon: Star,
    earned: totalGamesPlayed > 0,
    date: totalGamesPlayed > 0 ? gameHistory[0]?.date : null
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day training streak',
    icon: Flame,
    earned: (user?.streak || 0) >= 7,
    date: (user?.streak || 0) >= 7 ? new Date().toISOString() : null
  },
  {
    id: 'games_25',
    name: 'Dedicated Trainer',
    description: 'Completed 25 brain training games',
    icon: Trophy,
    earned: totalGamesPlayed >= 25,
    date: totalGamesPlayed >= 25 ? gameHistory[24]?.date : null
  },
  {
    id: 'accuracy_90',
    name: 'Precision Master',
    description: 'Achieved 90%+ accuracy in a game',
    icon: Target,
    earned: gameHistory.some((game) => game.accuracy >= 90),
    date: gameHistory.find((game) => game.accuracy >= 90)?.date || null
  }];


  const weeklyProgressData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));

    const dayGames = gameHistory.filter((game) => {
      const gameDate = new Date(game.date);
      return gameDate.toDateString() === date.toDateString();
    });

    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      games: dayGames.length,
      avgScore: dayGames.length > 0 ?
      Math.round(dayGames.reduce((sum, game) => sum + game.score, 0) / dayGames.length) :
      0
    };
  });

  return (
    <MobileLayout data-id="y2cpf0efn" data-path="src/pages/ProgressPage.tsx">
      <div className="p-5 space-y-6" data-id="5oxwk9djo" data-path="src/pages/ProgressPage.tsx">
        {/* Header Stats */}
        <section data-id="eu8y9lvhq" data-path="src/pages/ProgressPage.tsx">
          <h2 className="text-xl font-bold text-gray-800 mb-4" data-id="rpai2nb9x" data-path="src/pages/ProgressPage.tsx">Your Progress</h2>
          <div className="grid grid-cols-2 gap-3" data-id="kla8elkr2" data-path="src/pages/ProgressPage.tsx">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-id="jdm63krnl" data-path="src/pages/ProgressPage.tsx">
              <CardContent className="p-4 text-center" data-id="nasx91o4b" data-path="src/pages/ProgressPage.tsx">
                <div className="text-2xl font-bold" data-id="zovrwvlt8" data-path="src/pages/ProgressPage.tsx">{user?.streak || 0}</div>
                <div className="text-xs text-white/80" data-id="vlhc17a2u" data-path="src/pages/ProgressPage.tsx">Day Streak</div>
                <Flame className="w-5 h-5 mx-auto mt-1 text-orange-300" data-id="1kr166o85" data-path="src/pages/ProgressPage.tsx" />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white" data-id="k3zw5ykt2" data-path="src/pages/ProgressPage.tsx">
              <CardContent className="p-4 text-center" data-id="g9k44d6dh" data-path="src/pages/ProgressPage.tsx">
                <div className="text-2xl font-bold" data-id="ogq18p4kg" data-path="src/pages/ProgressPage.tsx">{totalGamesPlayed}</div>
                <div className="text-xs text-white/80" data-id="btsdalo55" data-path="src/pages/ProgressPage.tsx">Total Games</div>
                <Trophy className="w-5 h-5 mx-auto mt-1 text-yellow-300" data-id="4480n1evh" data-path="src/pages/ProgressPage.tsx" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Weekly Performance */}
        <section data-id="zcjj90zqo" data-path="src/pages/ProgressPage.tsx">
          <Card data-id="rv3lhgbgg" data-path="src/pages/ProgressPage.tsx">
            <CardHeader className="pb-3" data-id="4zwulv6eg" data-path="src/pages/ProgressPage.tsx">
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2" data-id="672btfh4c" data-path="src/pages/ProgressPage.tsx">
                <TrendingUp className="w-5 h-5 text-purple-600" data-id="4o0a0nho5" data-path="src/pages/ProgressPage.tsx" />
                Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent data-id="68wa4v2iv" data-path="src/pages/ProgressPage.tsx">
              <div className="grid grid-cols-3 gap-4 text-center mb-4" data-id="6q89y15dy" data-path="src/pages/ProgressPage.tsx">
                <div data-id="ceznnf3dq" data-path="src/pages/ProgressPage.tsx">
                  <div className="text-xl font-bold text-purple-600" data-id="6bk9b0ywq" data-path="src/pages/ProgressPage.tsx">{averageScore}</div>
                  <div className="text-xs text-gray-500" data-id="u8uainrdw" data-path="src/pages/ProgressPage.tsx">Avg Score</div>
                </div>
                <div data-id="ymkvddxku" data-path="src/pages/ProgressPage.tsx">
                  <div className="text-xl font-bold text-purple-600" data-id="4ppnoa1uw" data-path="src/pages/ProgressPage.tsx">{averageAccuracy}%</div>
                  <div className="text-xs text-gray-500" data-id="e7qxkqyq5" data-path="src/pages/ProgressPage.tsx">Avg Accuracy</div>
                </div>
                <div data-id="ocy01c6vv" data-path="src/pages/ProgressPage.tsx">
                  <div className="text-xl font-bold text-purple-600" data-id="63l3r3wji" data-path="src/pages/ProgressPage.tsx">{last7DaysGames.length}</div>
                  <div className="text-xs text-gray-500" data-id="iianjqhcx" data-path="src/pages/ProgressPage.tsx">Games This Week</div>
                </div>
              </div>
              
              {/* Daily Progress Chart */}
              <div className="space-y-2" data-id="7998t30lx" data-path="src/pages/ProgressPage.tsx">
                <h4 className="text-sm font-semibold text-gray-700" data-id="w9ofq4fld" data-path="src/pages/ProgressPage.tsx">Daily Activity</h4>
                <div className="grid grid-cols-7 gap-1" data-id="sexegqxem" data-path="src/pages/ProgressPage.tsx">
                  {weeklyProgressData.map((day, index) =>
                  <div key={index} className="text-center" data-id="moej2klim" data-path="src/pages/ProgressPage.tsx">
                      <div className="text-xs text-gray-500 mb-1" data-id="6enxmhlwm" data-path="src/pages/ProgressPage.tsx">{day.day}</div>
                      <div
                      className={`h-8 rounded ${
                      day.games > 0 ? 'bg-purple-500' : 'bg-gray-200'} flex items-center justify-center`
                      } data-id="r8nxbq6s9" data-path="src/pages/ProgressPage.tsx">

                        <span className={`text-xs font-semibold ${
                      day.games > 0 ? 'text-white' : 'text-gray-400'}`
                      } data-id="qn5paj7pg" data-path="src/pages/ProgressPage.tsx">
                          {day.games || ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cognitive Skills */}
        <section data-id="dg6gke6g9" data-path="src/pages/ProgressPage.tsx">
          <Card data-id="coydad2lz" data-path="src/pages/ProgressPage.tsx">
            <CardHeader className="pb-3" data-id="ggcvjyab2" data-path="src/pages/ProgressPage.tsx">
              <CardTitle className="text-lg text-gray-800" data-id="yz1f54lv3" data-path="src/pages/ProgressPage.tsx">Cognitive Skills</CardTitle>
            </CardHeader>
            <CardContent data-id="pfycbjn9c" data-path="src/pages/ProgressPage.tsx">
              <div className="space-y-4" data-id="kv5ijtz70" data-path="src/pages/ProgressPage.tsx">
                {gameTypeStats.map((skill) => {
                  const Icon = skill.icon;
                  const maxLevel = 50;
                  const progress = skill.stats.currentLevel / maxLevel * 100;

                  return (
                    <div key={skill.type} data-id="tykvze5yt" data-path="src/pages/ProgressPage.tsx">
                      <div className="flex justify-between items-center mb-2" data-id="qxn65kl7y" data-path="src/pages/ProgressPage.tsx">
                        <div className="flex items-center gap-2" data-id="f9zzr6nch" data-path="src/pages/ProgressPage.tsx">
                          <Icon className="w-4 h-4 text-gray-600" data-id="8rbu3z7z0" data-path="src/pages/ProgressPage.tsx" />
                          <span className="text-sm font-medium" data-id="oajtr5gyd" data-path="src/pages/ProgressPage.tsx">{skill.name}</span>
                        </div>
                        <div className="text-right" data-id="gyy987q4g" data-path="src/pages/ProgressPage.tsx">
                          <span className="text-sm font-semibold text-purple-600" data-id="il50yo6i4" data-path="src/pages/ProgressPage.tsx">
                            Level {skill.stats.currentLevel}
                          </span>
                          <div className="text-xs text-gray-500" data-id="85sy0lrqf" data-path="src/pages/ProgressPage.tsx">
                            {skill.stats.gamesPlayed} games
                          </div>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" data-id="csiabdyqz" data-path="src/pages/ProgressPage.tsx" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1" data-id="rx3r4aukc" data-path="src/pages/ProgressPage.tsx">
                        <span data-id="ypb1tws6u" data-path="src/pages/ProgressPage.tsx">Best: {skill.stats.bestScore}</span>
                        <span data-id="ez1rew17e" data-path="src/pages/ProgressPage.tsx">Avg: {skill.stats.averageScore}</span>
                      </div>
                    </div>);

                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Achievements */}
        <section data-id="mpx40vjy6" data-path="src/pages/ProgressPage.tsx">
          <Card data-id="bqrrp1zum" data-path="src/pages/ProgressPage.tsx">
            <CardHeader className="pb-3" data-id="kpo4n5vrw" data-path="src/pages/ProgressPage.tsx">
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2" data-id="qf658zb8s" data-path="src/pages/ProgressPage.tsx">
                <Award className="w-5 h-5 text-yellow-600" data-id="fixkv2ny8" data-path="src/pages/ProgressPage.tsx" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent data-id="17iv6y8am" data-path="src/pages/ProgressPage.tsx">
              <div className="grid grid-cols-2 gap-3" data-id="nqg6j8att" data-path="src/pages/ProgressPage.tsx">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-3 border rounded-lg text-center ${
                      achievement.earned ?
                      'border-yellow-300 bg-yellow-50' :
                      'border-gray-200 bg-gray-50'}`
                      } data-id="tbrs50yu0" data-path="src/pages/ProgressPage.tsx">

                      <Icon
                        className={`w-6 h-6 mx-auto mb-2 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`
                        } data-id="b3dz1fh65" data-path="src/pages/ProgressPage.tsx" />

                      <div className={`text-xs font-semibold ${
                      achievement.earned ? 'text-yellow-800' : 'text-gray-600'}`
                      } data-id="96zvlne8x" data-path="src/pages/ProgressPage.tsx">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1" data-id="dy6pjmcjy" data-path="src/pages/ProgressPage.tsx">
                        {achievement.description}
                      </div>
                      {achievement.earned &&
                      <Badge className="bg-yellow-500 text-white text-xs mt-2" data-id="ia2cfureg" data-path="src/pages/ProgressPage.tsx">
                          Earned
                        </Badge>
                      }
                    </div>);

                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Games */}
        {recentGames.length > 0 &&
        <section data-id="uazjyw54g" data-path="src/pages/ProgressPage.tsx">
            <Card data-id="2wtyvzv1v" data-path="src/pages/ProgressPage.tsx">
              <CardHeader className="pb-3" data-id="w5m65fljg" data-path="src/pages/ProgressPage.tsx">
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2" data-id="icj2lrgmb" data-path="src/pages/ProgressPage.tsx">
                  <Calendar className="w-5 h-5 text-blue-600" data-id="zqg25jtp8" data-path="src/pages/ProgressPage.tsx" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent data-id="wp0w7ffln" data-path="src/pages/ProgressPage.tsx">
                <div className="space-y-3" data-id="4bm59v6eb" data-path="src/pages/ProgressPage.tsx">
                  {recentGames.map((game, index) => {
                  const gameConfig = gameTypeStats.find((g) => g.type === game.gameType);
                  const Icon = gameConfig?.icon || Brain;

                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg" data-id="wwvlsipiq" data-path="src/pages/ProgressPage.tsx">
                        <div className="flex items-center gap-3" data-id="jyt701hvh" data-path="src/pages/ProgressPage.tsx">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gameConfig?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center`} data-id="mzp6tq5dg" data-path="src/pages/ProgressPage.tsx">
                            <Icon className="w-4 h-4 text-white" data-id="z1ftumjr5" data-path="src/pages/ProgressPage.tsx" />
                          </div>
                          <div data-id="v0ge25g8i" data-path="src/pages/ProgressPage.tsx">
                            <div className="text-sm font-medium capitalize" data-id="wiq08an5q" data-path="src/pages/ProgressPage.tsx">
                              {game.gameType.replace('-', ' ')}
                            </div>
                            <div className="text-xs text-gray-500" data-id="958ykglhd" data-path="src/pages/ProgressPage.tsx">
                              Level {game.level} • {game.difficulty}
                            </div>
                          </div>
                        </div>
                        <div className="text-right" data-id="wikvbjoke" data-path="src/pages/ProgressPage.tsx">
                          <div className="text-sm font-semibold text-purple-600" data-id="aphqva290" data-path="src/pages/ProgressPage.tsx">
                            {game.score}
                          </div>
                          <div className="text-xs text-gray-500" data-id="grzdnm3fa" data-path="src/pages/ProgressPage.tsx">
                            {game.accuracy}% accuracy
                          </div>
                        </div>
                      </div>);

                })}
                </div>
              </CardContent>
            </Card>
          </section>
        }

        {/* Insights */}
        <section data-id="7rji32jin" data-path="src/pages/ProgressPage.tsx">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" data-id="50npr2n01" data-path="src/pages/ProgressPage.tsx">
            <CardContent className="p-4" data-id="v26x1smdo" data-path="src/pages/ProgressPage.tsx">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2" data-id="g3u3vgocb" data-path="src/pages/ProgressPage.tsx">
                <Brain className="w-5 h-5 text-blue-600" data-id="lbz9mf801" data-path="src/pages/ProgressPage.tsx" />
                Training Insights
              </h3>
              <div className="space-y-2 text-sm text-gray-600" data-id="y08jpvrw1" data-path="src/pages/ProgressPage.tsx">
                {totalGamesPlayed === 0 &&
                <p data-id="z7l8slhgr" data-path="src/pages/ProgressPage.tsx">Start your brain training journey! Regular practice can improve cognitive abilities.</p>
                }
                {totalGamesPlayed > 0 && averageAccuracy >= 80 &&
                <p data-id="nbc6tki34" data-path="src/pages/ProgressPage.tsx">🎉 Excellent performance! You're showing great cognitive strength.</p>
                }
                {totalGamesPlayed > 0 && averageAccuracy < 60 &&
                <p data-id="87iiuas61" data-path="src/pages/ProgressPage.tsx">💡 Consider trying easier difficulty levels to build confidence and skills.</p>
                }
                {(user?.streak || 0) >= 3 &&
                <p data-id="g4j5kcxws" data-path="src/pages/ProgressPage.tsx">🔥 Great consistency! Regular training is key to cognitive improvement.</p>
                }
                {last7DaysGames.length >= 5 &&
                <p data-id="lq2lxwvpz" data-path="src/pages/ProgressPage.tsx">⭐ Fantastic weekly activity! You're on track for significant cognitive gains.</p>
                }
                <p data-id="5l01kka1f" data-path="src/pages/ProgressPage.tsx">
                  <strong data-id="jwkp9xgke" data-path="src/pages/ProgressPage.tsx">Next milestone:</strong> {
                  totalGamesPlayed < 10 ? `Complete ${10 - totalGamesPlayed} more games to unlock detailed analytics.` :
                  (user?.streak || 0) < 7 ? `Maintain your streak for ${7 - (user?.streak || 0)} more days.` :
                  totalGamesPlayed < 50 ? `Play ${50 - totalGamesPlayed} more games to unlock advanced features.` :
                  "You're a brain training champion! Keep up the excellent work."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </MobileLayout>);

};

export default ProgressPage;