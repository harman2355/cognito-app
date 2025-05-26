import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUser } from '../contexts/UserContext';
import { TrendingUp, Calendar, Trophy, Target, Brain, Zap, Clock, Star } from 'lucide-react';

const ProgressPage = () => {
  const { user, gameHistory, calculateProgress } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" data-id="bx8zr4xc2" data-path="src/pages/ProgressPage.tsx">
        <Card className="w-full max-w-md" data-id="be9vmvcvb" data-path="src/pages/ProgressPage.tsx">
          <CardContent className="text-center p-6" data-id="rhsqkk7jt" data-path="src/pages/ProgressPage.tsx">
            <p className="text-gray-600" data-id="bto4khwj1" data-path="src/pages/ProgressPage.tsx">Please complete onboarding to see your progress.</p>
          </CardContent>
        </Card>
      </div>);

  }

  const progress = calculateProgress();
  const weeklyStreak = user.streak;

  // Mock data for charts - in a real app, this would come from the backend
  const skillTrends = {
    memory: [45, 50, 55, 65, 70, 75, 75],
    attention: [40, 45, 55, 60, 65, 68, 68],
    problemSolving: [60, 65, 70, 75, 80, 82, 82],
    flexibility: [50, 55, 60, 65, 68, 71, 71],
    speed: [55, 60, 65, 70, 75, 79, 79]
  };

  const achievements = [
  { name: 'First Steps', description: 'Complete your first game', earned: true, date: '2 weeks ago' },
  { name: 'Week Warrior', description: 'Play games for 7 consecutive days', earned: true, date: '1 week ago' },
  { name: 'Memory Master', description: 'Score 90%+ in 5 memory games', earned: false, progress: 3 },
  { name: 'Speed Demon', description: 'Complete 10 speed games', earned: false, progress: 7 },
  { name: 'Perfectionist', description: 'Get 100% accuracy in any game', earned: true, date: '3 days ago' }];


  const recentGames = gameHistory.slice(-5).reverse();

  return (
    <div className="min-h-screen p-4 space-y-6" data-id="k5otdoksj" data-path="src/pages/ProgressPage.tsx">
      {/* Header */}
      <div className="pt-6" data-id="hfq3hll5e" data-path="src/pages/ProgressPage.tsx">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" data-id="6uk15gnva" data-path="src/pages/ProgressPage.tsx">Your Progress</h1>
        <p className="text-gray-600" data-id="3zq8ylizn" data-path="src/pages/ProgressPage.tsx">Track your cognitive improvement journey</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-id="6jaf4q93c" data-path="src/pages/ProgressPage.tsx">
        <Card data-id="u8lr0tbft" data-path="src/pages/ProgressPage.tsx">
          <CardContent className="p-4 text-center" data-id="ehh9l2lvd" data-path="src/pages/ProgressPage.tsx">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" data-id="lv5jn0mik" data-path="src/pages/ProgressPage.tsx" />
            <div className="text-2xl font-bold text-gray-800" data-id="ygli82294" data-path="src/pages/ProgressPage.tsx">{weeklyStreak}</div>
            <div className="text-sm text-gray-600" data-id="ndhssjgjp" data-path="src/pages/ProgressPage.tsx">Day Streak</div>
          </CardContent>
        </Card>
        <Card data-id="7xbgxx6fn" data-path="src/pages/ProgressPage.tsx">
          <CardContent className="p-4 text-center" data-id="xfdfw8m1r" data-path="src/pages/ProgressPage.tsx">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" data-id="4ut9x7ukg" data-path="src/pages/ProgressPage.tsx" />
            <div className="text-2xl font-bold text-gray-800" data-id="q0ljqtlot" data-path="src/pages/ProgressPage.tsx">{user.totalGames}</div>
            <div className="text-sm text-gray-600" data-id="j7ckza9d1" data-path="src/pages/ProgressPage.tsx">Games Played</div>
          </CardContent>
        </Card>
        <Card data-id="xfxo75bbw" data-path="src/pages/ProgressPage.tsx">
          <CardContent className="p-4 text-center" data-id="ahtdp9r0t" data-path="src/pages/ProgressPage.tsx">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" data-id="oobgvx9in" data-path="src/pages/ProgressPage.tsx" />
            <div className="text-2xl font-bold text-gray-800" data-id="pp1jmk4nf" data-path="src/pages/ProgressPage.tsx">Level {user.level}</div>
            <div className="text-sm text-gray-600" data-id="scv06ndau" data-path="src/pages/ProgressPage.tsx">Current Level</div>
          </CardContent>
        </Card>
        <Card data-id="c3mg71cm0" data-path="src/pages/ProgressPage.tsx">
          <CardContent className="p-4 text-center" data-id="go8dyjxe0" data-path="src/pages/ProgressPage.tsx">
            <Star className="h-8 w-8 text-green-600 mx-auto mb-2" data-id="fh8fsbl9w" data-path="src/pages/ProgressPage.tsx" />
            <div className="text-2xl font-bold text-gray-800" data-id="qb9ad0t68" data-path="src/pages/ProgressPage.tsx">
              {progress ? progress.averageAccuracy : 75}%
            </div>
            <div className="text-sm text-gray-600" data-id="0i7jdurdj" data-path="src/pages/ProgressPage.tsx">Avg Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      {progress &&
      <Card data-id="agfitvkc9" data-path="src/pages/ProgressPage.tsx">
          <CardHeader data-id="z00absu4c" data-path="src/pages/ProgressPage.tsx">
            <CardTitle className="flex items-center space-x-2" data-id="x3v6gdaaq" data-path="src/pages/ProgressPage.tsx">
              <TrendingUp className="h-5 w-5 text-purple-600" data-id="bjyegr6cl" data-path="src/pages/ProgressPage.tsx" />
              <span data-id="rm7cr5ppt" data-path="src/pages/ProgressPage.tsx">This Week's Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-id="x8lolpfs4" data-path="src/pages/ProgressPage.tsx">
            <div className="grid grid-cols-3 gap-6 text-center" data-id="801knkofq" data-path="src/pages/ProgressPage.tsx">
              <div data-id="wou0uxhjl" data-path="src/pages/ProgressPage.tsx">
                <div className="text-3xl font-bold text-blue-600" data-id="n4acvbg9x" data-path="src/pages/ProgressPage.tsx">{progress.gamesPlayed}</div>
                <div className="text-sm text-gray-600" data-id="lua93ph5o" data-path="src/pages/ProgressPage.tsx">Games Played</div>
              </div>
              <div data-id="qir0hl6p6" data-path="src/pages/ProgressPage.tsx">
                <div className="text-3xl font-bold text-green-600" data-id="v811f4den" data-path="src/pages/ProgressPage.tsx">{progress.averageAccuracy}%</div>
                <div className="text-sm text-gray-600" data-id="05cgaijl5" data-path="src/pages/ProgressPage.tsx">Average Score</div>
              </div>
              <div data-id="5d81u2b7o" data-path="src/pages/ProgressPage.tsx">
                <div className="text-3xl font-bold text-purple-600" data-id="8izgjt1id" data-path="src/pages/ProgressPage.tsx">{progress.totalTime}m</div>
                <div className="text-sm text-gray-600" data-id="16cs4jn98" data-path="src/pages/ProgressPage.tsx">Time Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      }

      {/* Cognitive Skills Progress */}
      <Card data-id="1ffyufw6p" data-path="src/pages/ProgressPage.tsx">
        <CardHeader data-id="p3me6r2jb" data-path="src/pages/ProgressPage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="81l97bxh9" data-path="src/pages/ProgressPage.tsx">
            <Brain className="h-5 w-5 text-purple-600" data-id="mg4t366xu" data-path="src/pages/ProgressPage.tsx" />
            <span data-id="5jan7tzsi" data-path="src/pages/ProgressPage.tsx">Cognitive Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6" data-id="isy7yrntj" data-path="src/pages/ProgressPage.tsx">
          {Object.entries(user.cognitiveScores).map(([skill, score]) => {
            const trend = skillTrends[skill as keyof typeof skillTrends];
            const improvement = trend ? trend[trend.length - 1] - trend[0] : 0;

            return (
              <div key={skill} className="space-y-3" data-id="nwsh8zmq7" data-path="src/pages/ProgressPage.tsx">
                <div className="flex justify-between items-center" data-id="t2t8j4ejx" data-path="src/pages/ProgressPage.tsx">
                  <div data-id="28ntsf4iz" data-path="src/pages/ProgressPage.tsx">
                    <span className="font-medium capitalize" data-id="luuy1n0z2" data-path="src/pages/ProgressPage.tsx">
                      {skill === 'problemSolving' ? 'Problem Solving' : skill}
                    </span>
                    <div className="text-sm text-gray-500" data-id="hds9ij1kh" data-path="src/pages/ProgressPage.tsx">
                      {improvement > 0 && `+${improvement} points this week`}
                    </div>
                  </div>
                  <div className="text-right" data-id="psez5rze5" data-path="src/pages/ProgressPage.tsx">
                    <span className="text-lg font-bold" data-id="twptpe9nf" data-path="src/pages/ProgressPage.tsx">{Math.round(score)}</span>
                    <span className="text-gray-500" data-id="1u7f0ku0t" data-path="src/pages/ProgressPage.tsx">/100</span>
                  </div>
                </div>
                <Progress value={score} className="h-3" data-id="f9brpi21a" data-path="src/pages/ProgressPage.tsx" />
                {improvement > 0 &&
                <div className="flex items-center text-green-600 text-sm" data-id="b3mvzutvu" data-path="src/pages/ProgressPage.tsx">
                    <TrendingUp className="h-3 w-3 mr-1" data-id="08lver6kt" data-path="src/pages/ProgressPage.tsx" />
                    Improving
                  </div>
                }
              </div>);

          })}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card data-id="534e5pkbl" data-path="src/pages/ProgressPage.tsx">
        <CardHeader data-id="wgu0o4s73" data-path="src/pages/ProgressPage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="vr6rnoiky" data-path="src/pages/ProgressPage.tsx">
            <Trophy className="h-5 w-5 text-yellow-500" data-id="39y1tfpjd" data-path="src/pages/ProgressPage.tsx" />
            <span data-id="ok20pvmua" data-path="src/pages/ProgressPage.tsx">Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="2r8m6zm37" data-path="src/pages/ProgressPage.tsx">
          {achievements.map((achievement, index) =>
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border ${
            achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`
            } data-id="ucfibjllx" data-path="src/pages/ProgressPage.tsx">

              <div className="flex items-center space-x-3" data-id="47p1phm90" data-path="src/pages/ProgressPage.tsx">
                <div className={`p-2 rounded-full ${
              achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'}`
              } data-id="05kp3vmv4" data-path="src/pages/ProgressPage.tsx">
                  <Trophy className={`h-4 w-4 ${
                achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`
                } data-id="3arasuqit" data-path="src/pages/ProgressPage.tsx" />
                </div>
                <div data-id="14dtfzc3m" data-path="src/pages/ProgressPage.tsx">
                  <div className="font-medium" data-id="1fc8grn6i" data-path="src/pages/ProgressPage.tsx">{achievement.name}</div>
                  <div className="text-sm text-gray-600" data-id="0vnxal588" data-path="src/pages/ProgressPage.tsx">{achievement.description}</div>
                  {achievement.earned && achievement.date &&
                <div className="text-xs text-gray-500" data-id="492yz9cj1" data-path="src/pages/ProgressPage.tsx">Earned {achievement.date}</div>
                }
                </div>
              </div>
              {achievement.earned ?
            <Badge className="bg-yellow-100 text-yellow-700" data-id="6xawn8ilr" data-path="src/pages/ProgressPage.tsx">Earned</Badge> :

            <Badge variant="outline" data-id="7kq6vhfbj" data-path="src/pages/ProgressPage.tsx">
                  {achievement.progress}/10
                </Badge>
            }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card data-id="pshf4qgr7" data-path="src/pages/ProgressPage.tsx">
        <CardHeader data-id="36bo0ye6p" data-path="src/pages/ProgressPage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="omklqmfe3" data-path="src/pages/ProgressPage.tsx">
            <Clock className="h-5 w-5 text-blue-600" data-id="pwfprq83i" data-path="src/pages/ProgressPage.tsx" />
            <span data-id="dhur1kvly" data-path="src/pages/ProgressPage.tsx">Recent Games</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="yhw34ei3e" data-path="src/pages/ProgressPage.tsx">
          {recentGames.length > 0 ?
          <div className="space-y-3" data-id="bx4lv830j" data-path="src/pages/ProgressPage.tsx">
              {recentGames.map((game, index) =>
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-id="6dclcutgw" data-path="src/pages/ProgressPage.tsx">
                  <div data-id="zkfw5tt0d" data-path="src/pages/ProgressPage.tsx">
                    <div className="font-medium capitalize" data-id="ecffme3j6" data-path="src/pages/ProgressPage.tsx">{game.gameId.replace('-', ' ')}</div>
                    <div className="text-sm text-gray-600" data-id="awmgh71s9" data-path="src/pages/ProgressPage.tsx">
                      {game.category} • {Math.round(game.timeSpent / 60)}m {Math.round(game.timeSpent % 60)}s
                    </div>
                  </div>
                  <div className="text-right" data-id="7c5jy2oxi" data-path="src/pages/ProgressPage.tsx">
                    <div className="font-bold" data-id="29yrhs8n7" data-path="src/pages/ProgressPage.tsx">{game.accuracy}%</div>
                    <div className="text-sm text-gray-500" data-id="lp944mq12" data-path="src/pages/ProgressPage.tsx">{game.score} pts</div>
                  </div>
                </div>
            )}
            </div> :

          <div className="text-center text-gray-500 py-6" data-id="jgdacl1t9" data-path="src/pages/ProgressPage.tsx">
              No games played yet. Start your brain training journey!
            </div>
          }
        </CardContent>
      </Card>

      {/* Goals Progress */}
      {user.goals && user.goals.length > 0 &&
      <Card data-id="ebh0ru83v" data-path="src/pages/ProgressPage.tsx">
          <CardHeader data-id="1jneq3cum" data-path="src/pages/ProgressPage.tsx">
            <CardTitle className="flex items-center space-x-2" data-id="yv4iz033d" data-path="src/pages/ProgressPage.tsx">
              <Target className="h-5 w-5 text-green-600" data-id="orx0lmtd8" data-path="src/pages/ProgressPage.tsx" />
              <span data-id="4b6s42jds" data-path="src/pages/ProgressPage.tsx">Your Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-id="noe2daann" data-path="src/pages/ProgressPage.tsx">
            <div className="space-y-3" data-id="fw8ztvsju" data-path="src/pages/ProgressPage.tsx">
              {user.goals.map((goal, index) =>
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg" data-id="y3mdhdw8z" data-path="src/pages/ProgressPage.tsx">
                  <div className="flex items-center space-x-3" data-id="49wivyjvb" data-path="src/pages/ProgressPage.tsx">
                    <Target className="h-4 w-4 text-green-600" data-id="mfc16yu3j" data-path="src/pages/ProgressPage.tsx" />
                    <span className="font-medium" data-id="zquuj8vc7" data-path="src/pages/ProgressPage.tsx">{goal}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700" data-id="4w3i24lyb" data-path="src/pages/ProgressPage.tsx">Active</Badge>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default ProgressPage;