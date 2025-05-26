import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Brain, Zap, Target, Clock, Trophy, Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import WorkoutGenerator from '@/components/ml/WorkoutGenerator';
import { WorkoutRecommendation } from '@/components/ml/MLEngine';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isOnboarded, calculateProgress } = useUser();
  const [showAIWorkout, setShowAIWorkout] = useState(false);

  const handleStartAIWorkout = (workout: WorkoutRecommendation) => {
    // Store workout data in session storage for the workout page
    sessionStorage.setItem('aiWorkout', JSON.stringify(workout));
    navigate('/workout');
  };

  // Removed automatic navigation to allow testing

  if (!user) {
    return (
      <div className="min-h-screen p-4 space-y-6" data-id="lr4v62yd2" data-path="src/pages/HomePage.tsx">
        <div className="pt-6" data-id="xuena1s7o" data-path="src/pages/HomePage.tsx">
          <h1 className="text-3xl font-bold text-gray-800 mb-2" data-id="ifv96do13" data-path="src/pages/HomePage.tsx">Welcome to Cognito!</h1>
          <p className="text-gray-600 mb-6" data-id="yd38zuxsw" data-path="src/pages/HomePage.tsx">
            Train your brain with scientifically-backed cognitive exercises
          </p>
          <Button
            onClick={() => navigate('/onboarding')}
            className="bg-purple-600 hover:bg-purple-700 py-3 px-6" data-id="3n130lu1t" data-path="src/pages/HomePage.tsx">

            Get Started
          </Button>
        </div>
      </div>);

  }

  const progress = calculateProgress();
  const todaysGoal = 3; // games per day
  const gamesPlayedToday = progress?.gamesPlayed || 0;

  return (
    <div className="min-h-screen p-4 space-y-6" data-id="p7it84i4z" data-path="src/pages/HomePage.tsx">
      {/* Header */}
      <div className="pt-6" data-id="pfle69fvh" data-path="src/pages/HomePage.tsx">
        <div className="flex items-center justify-between mb-6" data-id="3qs1tzw7p" data-path="src/pages/HomePage.tsx">
          <div data-id="ay3jucj1y" data-path="src/pages/HomePage.tsx">
            <h1 className="text-2xl font-bold text-gray-800" data-id="sk3bpp9oy" data-path="src/pages/HomePage.tsx">Welcome back, {user.name}!</h1>
            <p className="text-gray-600" data-id="f64f9o5ar" data-path="src/pages/HomePage.tsx">Ready to train your brain today?</p>
          </div>
          <div className="flex items-center space-x-2" data-id="pz9wqjnbq" data-path="src/pages/HomePage.tsx">
            <div className="text-center" data-id="gdvvzf72i" data-path="src/pages/HomePage.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="tb0rryx9n" data-path="src/pages/HomePage.tsx">{user.streak}</div>
              <div className="text-xs text-gray-500" data-id="fpp5g93a5" data-path="src/pages/HomePage.tsx">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white" data-id="et2c2xcot" data-path="src/pages/HomePage.tsx">
          <CardContent className="p-4" data-id="ril84krhy" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center justify-between mb-3" data-id="6h8xndl21" data-path="src/pages/HomePage.tsx">
              <div className="flex items-center space-x-2" data-id="l7q6np8kz" data-path="src/pages/HomePage.tsx">
                <Target className="h-5 w-5" data-id="fjg74q5oa" data-path="src/pages/HomePage.tsx" />
                <span className="font-medium" data-id="lbjr8gshv" data-path="src/pages/HomePage.tsx">Daily Goal</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white" data-id="nf78t0e47" data-path="src/pages/HomePage.tsx">
                {gamesPlayedToday}/{todaysGoal} games
              </Badge>
            </div>
            <Progress
              value={gamesPlayedToday / todaysGoal * 100}
              className="h-2 bg-white/20" data-id="jn5o0nago" data-path="src/pages/HomePage.tsx" />

          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4" data-id="i648odekj" data-path="src/pages/HomePage.tsx">
        <Card data-id="pexnc1jn1" data-path="src/pages/HomePage.tsx">
          <CardContent className="p-4 text-center" data-id="p40zqxuyc" data-path="src/pages/HomePage.tsx">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" data-id="hwnaldlzl" data-path="src/pages/HomePage.tsx" />
            <div className="text-2xl font-bold text-gray-800" data-id="fxsuae881" data-path="src/pages/HomePage.tsx">{user.level}</div>
            <div className="text-sm text-gray-600" data-id="z5st1okf9" data-path="src/pages/HomePage.tsx">Level</div>
          </CardContent>
        </Card>
        <Card data-id="7uo5j9x1s" data-path="src/pages/HomePage.tsx">
          <CardContent className="p-4 text-center" data-id="7fti9vhwl" data-path="src/pages/HomePage.tsx">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" data-id="ktarznfe5" data-path="src/pages/HomePage.tsx" />
            <div className="text-2xl font-bold text-gray-800" data-id="qqeezq0fk" data-path="src/pages/HomePage.tsx">{user.totalGames}</div>
            <div className="text-sm text-gray-600" data-id="dcmifnt1g" data-path="src/pages/HomePage.tsx">Games Played</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenge */}
      <Card className="border-2 border-dashed border-purple-300" data-id="8prbei3hf" data-path="src/pages/HomePage.tsx">
        <CardHeader data-id="6jf3dnzfu" data-path="src/pages/HomePage.tsx">
          <CardTitle className="flex items-center space-x-2 text-purple-700" data-id="k6dthx5se" data-path="src/pages/HomePage.tsx">
            <Star className="h-5 w-5" data-id="3b44gekfl" data-path="src/pages/HomePage.tsx" />
            <span data-id="b786z6to9" data-path="src/pages/HomePage.tsx">Daily Challenge</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="67fjvy9lk" data-path="src/pages/HomePage.tsx">
          <div className="space-y-3" data-id="s93l227oj" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center justify-between" data-id="nos5e8lem" data-path="src/pages/HomePage.tsx">
              <span className="font-medium" data-id="mx6x5r23n" data-path="src/pages/HomePage.tsx">Memory Pattern Master</span>
              <Badge className="bg-purple-100 text-purple-700" data-id="v7wqf08q1" data-path="src/pages/HomePage.tsx">+50 XP</Badge>
            </div>
            <p className="text-sm text-gray-600" data-id="dacmg2lv3" data-path="src/pages/HomePage.tsx">
              Complete 3 memory games with 80%+ accuracy
            </p>
            <Button
              onClick={() => navigate('/games/memory')}
              className="w-full bg-purple-600 hover:bg-purple-700" data-id="5h5xbx9ti" data-path="src/pages/HomePage.tsx">

              Start Challenge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Skills Overview */}
      <Card data-id="hfsuh86m8" data-path="src/pages/HomePage.tsx">
        <CardHeader data-id="97apadfpj" data-path="src/pages/HomePage.tsx">
          <CardTitle data-id="1awxm8bl7" data-path="src/pages/HomePage.tsx">Your Cognitive Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="slcw57h4b" data-path="src/pages/HomePage.tsx">
          {Object.entries(user.cognitiveScores).map(([skill, score]) =>
          <div key={skill} className="space-y-2" data-id="26vt9m5m8" data-path="src/pages/HomePage.tsx">
              <div className="flex justify-between text-sm" data-id="k2di6a0u8" data-path="src/pages/HomePage.tsx">
                <span className="capitalize font-medium" data-id="ntd5gt30v" data-path="src/pages/HomePage.tsx">
                  {skill === 'problemSolving' ? 'Problem Solving' : skill}
                </span>
                <span className="text-gray-600" data-id="px7tmv0bw" data-path="src/pages/HomePage.tsx">{Math.round(score)}%</span>
              </div>
              <Progress value={score} className="h-2" data-id="ja68et7ce" data-path="src/pages/HomePage.tsx" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Workout Generator */}
      {showAIWorkout ?
      <div className="space-y-4" data-id="6jyyy8h1c" data-path="src/pages/HomePage.tsx">
          <div className="flex justify-between items-center" data-id="07bpfrgb7" data-path="src/pages/HomePage.tsx">
            <h2 className="text-xl font-bold text-gray-800" data-id="wznx73kjy" data-path="src/pages/HomePage.tsx">AI-Powered Workouts</h2>
            <Button
            variant="outline"
            onClick={() => setShowAIWorkout(false)}
            size="sm" data-id="3suufonj7" data-path="src/pages/HomePage.tsx">

              Hide
            </Button>
          </div>
          <WorkoutGenerator onStartWorkout={handleStartAIWorkout} data-id="104bsgpjm" data-path="src/pages/HomePage.tsx" />
        </div> :

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200" data-id="kqe34sr4c" data-path="src/pages/HomePage.tsx">
          <CardContent className="p-4" data-id="whqhxcokh" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center justify-between" data-id="po7khvopt" data-path="src/pages/HomePage.tsx">
              <div className="space-y-1" data-id="izasytxkh" data-path="src/pages/HomePage.tsx">
                <h3 className="font-semibold text-emerald-700 flex items-center" data-id="xkdpp5m5v" data-path="src/pages/HomePage.tsx">
                  <Sparkles className="h-4 w-4 mr-2" data-id="qupdfe7au" data-path="src/pages/HomePage.tsx" />
                  AI-Powered Workouts
                </h3>
                <p className="text-sm text-emerald-600" data-id="b0x20d6iw" data-path="src/pages/HomePage.tsx">
                  Get personalized cognitive training based on your performance
                </p>
              </div>
              <Button
              onClick={() => setShowAIWorkout(true)}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100" data-id="kqd39bovu" data-path="src/pages/HomePage.tsx">

                Try Now
              </Button>
            </div>
          </CardContent>
        </Card>
      }

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4" data-id="pksgmlk34" data-path="src/pages/HomePage.tsx">
        <Button
          onClick={() => navigate('/workout')}
          className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" data-id="upsk60jl5" data-path="src/pages/HomePage.tsx">

          <div className="text-center" data-id="gc49agut2" data-path="src/pages/HomePage.tsx">
            <Zap className="h-6 w-6 mx-auto mb-1" data-id="fzuhi8mok" data-path="src/pages/HomePage.tsx" />
            <div className="text-sm font-medium" data-id="fsnzq7d06" data-path="src/pages/HomePage.tsx">Quick Workout</div>
          </div>
        </Button>
        <Button
          onClick={() => navigate('/games')}
          variant="outline"
          className="h-20 border-purple-200 hover:bg-purple-50" data-id="bi29id2sb" data-path="src/pages/HomePage.tsx">

          <div className="text-center" data-id="i1dj4ycdh" data-path="src/pages/HomePage.tsx">
            <Brain className="h-6 w-6 mx-auto mb-1 text-purple-600" data-id="j1ogcewp5" data-path="src/pages/HomePage.tsx" />
            <div className="text-sm font-medium text-purple-600" data-id="e45xh5exg" data-path="src/pages/HomePage.tsx">All Games</div>
          </div>
        </Button>
      </div>

      {/* Weekly Progress Summary */}
      {progress &&
      <Card data-id="z1ez2g4mu" data-path="src/pages/HomePage.tsx">
          <CardHeader data-id="4vc5zk779" data-path="src/pages/HomePage.tsx">
            <CardTitle className="flex items-center space-x-2" data-id="05i4ixxab" data-path="src/pages/HomePage.tsx">
              <Clock className="h-5 w-5" data-id="19p288g1y" data-path="src/pages/HomePage.tsx" />
              <span data-id="rydk0dz9o" data-path="src/pages/HomePage.tsx">This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-id="wn4fqptn9" data-path="src/pages/HomePage.tsx">
            <div className="grid grid-cols-3 gap-4 text-center" data-id="tue2nw9jm" data-path="src/pages/HomePage.tsx">
              <div data-id="y25uvloyw" data-path="src/pages/HomePage.tsx">
                <div className="text-2xl font-bold text-blue-600" data-id="v8oze2pks" data-path="src/pages/HomePage.tsx">{progress.gamesPlayed}</div>
                <div className="text-xs text-gray-600" data-id="e75a7q9q1" data-path="src/pages/HomePage.tsx">Games Played</div>
              </div>
              <div data-id="kyvov7zrc" data-path="src/pages/HomePage.tsx">
                <div className="text-2xl font-bold text-green-600" data-id="1j8xcqa24" data-path="src/pages/HomePage.tsx">{progress.averageAccuracy}%</div>
                <div className="text-xs text-gray-600" data-id="1ri7ccvd5" data-path="src/pages/HomePage.tsx">Avg Accuracy</div>
              </div>
              <div data-id="gwf9ul7gb" data-path="src/pages/HomePage.tsx">
                <div className="text-2xl font-bold text-purple-600" data-id="kwbtoav9c" data-path="src/pages/HomePage.tsx">{progress.totalTime}m</div>
                <div className="text-xs text-gray-600" data-id="8bm9j1wzp" data-path="src/pages/HomePage.tsx">Time Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default HomePage;