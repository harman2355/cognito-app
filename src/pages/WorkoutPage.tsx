import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Play, Clock, Target, Trophy, Zap, CheckCircle } from 'lucide-react';

const WorkoutPage = () => {
  const navigate = useNavigate();
  const { user, addGameSession } = useUser();
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [workoutResults, setWorkoutResults] = useState<any[]>([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const workoutGames = [
  {
    id: 'quick-memory',
    name: 'Quick Memory',
    category: 'memory',
    duration: 90,
    description: 'Remember patterns quickly'
  },
  {
    id: 'focus-burst',
    name: 'Focus Burst',
    category: 'attention',
    duration: 60,
    description: 'Stay focused on moving targets'
  },
  {
    id: 'speed-math',
    name: 'Speed Math',
    category: 'problem-solving',
    duration: 90,
    description: 'Solve math problems quickly'
  }];


  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    setCurrentGameIndex(0);
    setWorkoutResults([]);
  };

  const handleGameComplete = (score: number, accuracy: number, timeSpent: number) => {
    const currentGame = workoutGames[currentGameIndex];
    const result = {
      gameId: currentGame.id,
      name: currentGame.name,
      category: currentGame.category,
      score,
      accuracy,
      timeSpent
    };

    setWorkoutResults((prev) => [...prev, result]);

    // Add to user's game history
    addGameSession({
      gameId: currentGame.id,
      category: currentGame.category,
      score,
      accuracy,
      timeSpent,
      difficulty: 'medium',
      date: new Date()
    });

    // Move to next game or complete workout
    if (currentGameIndex < workoutGames.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    } else {
      setWorkoutComplete(true);
    }
  };

  const getOverallScore = () => {
    if (workoutResults.length === 0) return 0;
    return Math.round(workoutResults.reduce((sum, result) => sum + result.accuracy, 0) / workoutResults.length);
  };

  const getTotalTime = () => {
    return workoutResults.reduce((sum, result) => sum + result.timeSpent, 0);
  };

  if (workoutComplete) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" data-id="p0xfq502o" data-path="src/pages/WorkoutPage.tsx">
        <Card className="w-full max-w-md" data-id="vvqadkvcf" data-path="src/pages/WorkoutPage.tsx">
          <CardHeader className="text-center" data-id="cdkaauwme" data-path="src/pages/WorkoutPage.tsx">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit" data-id="h6kjbywz6" data-path="src/pages/WorkoutPage.tsx">
              <Trophy className="h-8 w-8 text-green-600" data-id="ryx4tmffp" data-path="src/pages/WorkoutPage.tsx" />
            </div>
            <CardTitle className="text-2xl text-green-700" data-id="wewr6buqt" data-path="src/pages/WorkoutPage.tsx">Workout Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6" data-id="9sfhmxk3q" data-path="src/pages/WorkoutPage.tsx">
            <div className="text-center space-y-4" data-id="a5z04w9dv" data-path="src/pages/WorkoutPage.tsx">
              <div className="grid grid-cols-2 gap-4" data-id="kqar0ctqw" data-path="src/pages/WorkoutPage.tsx">
                <div className="bg-purple-50 p-4 rounded-lg" data-id="zie5hsvuc" data-path="src/pages/WorkoutPage.tsx">
                  <div className="text-2xl font-bold text-purple-600" data-id="0r8foxejv" data-path="src/pages/WorkoutPage.tsx">{getOverallScore()}%</div>
                  <div className="text-sm text-gray-600" data-id="ozcyvkeq5" data-path="src/pages/WorkoutPage.tsx">Average Score</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg" data-id="l6ya20c2u" data-path="src/pages/WorkoutPage.tsx">
                  <div className="text-2xl font-bold text-blue-600" data-id="m7wakrk5i" data-path="src/pages/WorkoutPage.tsx">{Math.round(getTotalTime() / 60)}m</div>
                  <div className="text-sm text-gray-600" data-id="6owbyht0i" data-path="src/pages/WorkoutPage.tsx">Total Time</div>
                </div>
              </div>

              <div className="space-y-2" data-id="2phg81k76" data-path="src/pages/WorkoutPage.tsx">
                <h3 className="font-semibold text-gray-700" data-id="dl1sqah5x" data-path="src/pages/WorkoutPage.tsx">Game Results:</h3>
                {workoutResults.map((result, index) =>
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded" data-id="gi9q2eidx" data-path="src/pages/WorkoutPage.tsx">
                    <span className="text-sm font-medium" data-id="ntlcbcg04" data-path="src/pages/WorkoutPage.tsx">{result.name}</span>
                    <div className="flex items-center space-x-2" data-id="tdt5fv4gy" data-path="src/pages/WorkoutPage.tsx">
                      <Badge variant="outline" className="text-xs" data-id="rl3gl288t" data-path="src/pages/WorkoutPage.tsx">
                        {result.accuracy}%
                      </Badge>
                      <CheckCircle className="h-4 w-4 text-green-500" data-id="4k843dvri" data-path="src/pages/WorkoutPage.tsx" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3" data-id="rtfugjtfm" data-path="src/pages/WorkoutPage.tsx">
              <Button
                onClick={() => navigate('/games')}
                className="w-full bg-purple-600 hover:bg-purple-700" data-id="cakjnolxm" data-path="src/pages/WorkoutPage.tsx">

                Explore More Games
              </Button>
              <Button
                onClick={() => {
                  setWorkoutStarted(false);
                  setWorkoutComplete(false);
                  setCurrentGameIndex(0);
                  setWorkoutResults([]);
                }}
                variant="outline"
                className="w-full" data-id="whj10wjhn" data-path="src/pages/WorkoutPage.tsx">

                Start Another Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>);

  }

  if (workoutStarted) {
    const currentGame = workoutGames[currentGameIndex];
    const progress = (currentGameIndex + 1) / workoutGames.length * 100;

    return (
      <div className="min-h-screen p-4 space-y-6" data-id="dhi82cpqv" data-path="src/pages/WorkoutPage.tsx">
        <div className="pt-6" data-id="b8md8mdzo" data-path="src/pages/WorkoutPage.tsx">
          <div className="flex items-center justify-between mb-4" data-id="25htwgcgt" data-path="src/pages/WorkoutPage.tsx">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800" data-id="zdmifuzx6" data-path="src/pages/WorkoutPage.tsx">

              <ArrowLeft className="h-4 w-4 mr-2" data-id="lvs005alj" data-path="src/pages/WorkoutPage.tsx" />
              Exit Workout
            </Button>
            <Badge className="bg-purple-100 text-purple-700" data-id="8wzo9xw1l" data-path="src/pages/WorkoutPage.tsx">
              Game {currentGameIndex + 1} of {workoutGames.length}
            </Badge>
          </div>

          <div className="space-y-2" data-id="yadf6oxm8" data-path="src/pages/WorkoutPage.tsx">
            <div className="flex justify-between text-sm text-gray-600" data-id="qx3kneoie" data-path="src/pages/WorkoutPage.tsx">
              <span data-id="f2r013q15" data-path="src/pages/WorkoutPage.tsx">Workout Progress</span>
              <span data-id="82k03jzmp" data-path="src/pages/WorkoutPage.tsx">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" data-id="7xutq6eae" data-path="src/pages/WorkoutPage.tsx" />
          </div>
        </div>

        <Card className="border-2 border-purple-100" data-id="0f3mh52sh" data-path="src/pages/WorkoutPage.tsx">
          <CardHeader className="text-center" data-id="6hx85btm4" data-path="src/pages/WorkoutPage.tsx">
            <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit" data-id="n795tkt4d" data-path="src/pages/WorkoutPage.tsx">
              <Zap className="h-8 w-8 text-purple-600" data-id="a9qrtfu6z" data-path="src/pages/WorkoutPage.tsx" />
            </div>
            <CardTitle className="text-2xl text-purple-700" data-id="wzqhybiuz" data-path="src/pages/WorkoutPage.tsx">
              {currentGame.name}
            </CardTitle>
            <p className="text-gray-600" data-id="9dpptm1on" data-path="src/pages/WorkoutPage.tsx">{currentGame.description}</p>
          </CardHeader>
          <CardContent className="space-y-6" data-id="q98dvzbyx" data-path="src/pages/WorkoutPage.tsx">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500" data-id="3byycoggk" data-path="src/pages/WorkoutPage.tsx">
              <div className="flex items-center space-x-1" data-id="jybstq9p1" data-path="src/pages/WorkoutPage.tsx">
                <Clock className="h-4 w-4" data-id="tcrpyw7ax" data-path="src/pages/WorkoutPage.tsx" />
                <span data-id="10oavnyhl" data-path="src/pages/WorkoutPage.tsx">{currentGame.duration}s</span>
              </div>
              <div className="flex items-center space-x-1" data-id="21l5j8wn0" data-path="src/pages/WorkoutPage.tsx">
                <Target className="h-4 w-4" data-id="v1odb1ozx" data-path="src/pages/WorkoutPage.tsx" />
                <span data-id="h8hmbhdtv" data-path="src/pages/WorkoutPage.tsx">Quick Game</span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center" data-id="3za7zjxjn" data-path="src/pages/WorkoutPage.tsx">
              <h3 className="text-lg font-semibold mb-2" data-id="4wjopst98" data-path="src/pages/WorkoutPage.tsx">Ready to play?</h3>
              <p className="text-gray-600 mb-4" data-id="rvt134eag" data-path="src/pages/WorkoutPage.tsx">
                This is a simulated game. In a real implementation, this would be the actual game component.
              </p>
              <Button
                onClick={() => {
                  // Simulate game completion with random scores
                  const accuracy = Math.floor(Math.random() * 40) + 60; // 60-100%
                  const score = accuracy * 10;
                  const timeSpent = currentGame.duration;
                  handleGameComplete(score, accuracy, timeSpent);
                }}
                className="bg-purple-600 hover:bg-purple-700" data-id="9crrlivz3" data-path="src/pages/WorkoutPage.tsx">

                <Play className="h-4 w-4 mr-2" data-id="1uf0zpj59" data-path="src/pages/WorkoutPage.tsx" />
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <div className="min-h-screen p-4 space-y-6" data-id="2qe8wf1f1" data-path="src/pages/WorkoutPage.tsx">
      <div className="pt-6" data-id="a0ds1us3x" data-path="src/pages/WorkoutPage.tsx">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-gray-600 hover:text-gray-800" data-id="boj8wvgmd" data-path="src/pages/WorkoutPage.tsx">

          <ArrowLeft className="h-4 w-4 mr-2" data-id="ch3uxkkir" data-path="src/pages/WorkoutPage.tsx" />
          Back to Home
        </Button>

        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-lg" data-id="f4c1cdysy" data-path="src/pages/WorkoutPage.tsx">
          <h1 className="text-3xl font-bold mb-2" data-id="r1lb47qyy" data-path="src/pages/WorkoutPage.tsx">Quick Workout</h1>
          <p className="text-white/90" data-id="fwomogt79" data-path="src/pages/WorkoutPage.tsx">A personalized 5-minute brain training session</p>
        </div>
      </div>

      <Card data-id="kn2el859n" data-path="src/pages/WorkoutPage.tsx">
        <CardHeader data-id="1na3flrx9" data-path="src/pages/WorkoutPage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="vemxjejl7" data-path="src/pages/WorkoutPage.tsx">
            <Zap className="h-5 w-5 text-purple-600" data-id="4g6ghwur0" data-path="src/pages/WorkoutPage.tsx" />
            <span data-id="vg9da4rwg" data-path="src/pages/WorkoutPage.tsx">Today's Workout</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="ryvuli8i9" data-path="src/pages/WorkoutPage.tsx">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg" data-id="gsw2vevia" data-path="src/pages/WorkoutPage.tsx">
            <h3 className="font-semibold text-purple-700 mb-2" data-id="e0ehv3oil" data-path="src/pages/WorkoutPage.tsx">Your Personalized Session</h3>
            <p className="text-sm text-gray-600 mb-3" data-id="tbc2yu4db" data-path="src/pages/WorkoutPage.tsx">
              Based on your goals and current skill level, we've selected 3 games to challenge you today.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500" data-id="1du5e6xek" data-path="src/pages/WorkoutPage.tsx">
              <div className="flex items-center space-x-1" data-id="3f1ot96w9" data-path="src/pages/WorkoutPage.tsx">
                <Clock className="h-4 w-4" data-id="cny3qa9yo" data-path="src/pages/WorkoutPage.tsx" />
                <span data-id="p5itteagt" data-path="src/pages/WorkoutPage.tsx">~5 minutes</span>
              </div>
              <div className="flex items-center space-x-1" data-id="5z0tgg7i1" data-path="src/pages/WorkoutPage.tsx">
                <Target className="h-4 w-4" data-id="f46r8tnm3" data-path="src/pages/WorkoutPage.tsx" />
                <span data-id="56qbfguu9" data-path="src/pages/WorkoutPage.tsx">3 games</span>
              </div>
            </div>
          </div>

          <div className="space-y-3" data-id="5h8qzxks5" data-path="src/pages/WorkoutPage.tsx">
            <h3 className="font-semibold text-gray-700" data-id="h4hnu6shy" data-path="src/pages/WorkoutPage.tsx">Games in this workout:</h3>
            {workoutGames.map((game, index) =>
            <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-id="4r0lh8qzj" data-path="src/pages/WorkoutPage.tsx">
                <div data-id="hyrvn0wq7" data-path="src/pages/WorkoutPage.tsx">
                  <div className="font-medium" data-id="jfrcf9ulx" data-path="src/pages/WorkoutPage.tsx">{game.name}</div>
                  <div className="text-sm text-gray-600" data-id="nww9o6esy" data-path="src/pages/WorkoutPage.tsx">{game.description}</div>
                </div>
                <Badge variant="outline" className="text-xs" data-id="32tzg6qyj" data-path="src/pages/WorkoutPage.tsx">
                  {game.duration}s
                </Badge>
              </div>
            )}
          </div>

          <Button
            onClick={handleStartWorkout}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 py-3 text-lg" data-id="mhy9jysyi" data-path="src/pages/WorkoutPage.tsx">

            <Play className="h-5 w-5 mr-2" data-id="0146jf3qu" data-path="src/pages/WorkoutPage.tsx" />
            Start Workout
          </Button>
        </CardContent>
      </Card>

      {user &&
      <Card data-id="qb9av2seq" data-path="src/pages/WorkoutPage.tsx">
          <CardHeader data-id="g6dx8wz1h" data-path="src/pages/WorkoutPage.tsx">
            <CardTitle className="flex items-center space-x-2" data-id="485o6hmnt" data-path="src/pages/WorkoutPage.tsx">
              <Trophy className="h-5 w-5 text-yellow-500" data-id="3mcsfo0ua" data-path="src/pages/WorkoutPage.tsx" />
              <span data-id="i2o6eseoa" data-path="src/pages/WorkoutPage.tsx">Your Workout Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-id="5osaa2cvb" data-path="src/pages/WorkoutPage.tsx">
            <div className="grid grid-cols-3 gap-4 text-center" data-id="pulyiu9od" data-path="src/pages/WorkoutPage.tsx">
              <div data-id="36j84huww" data-path="src/pages/WorkoutPage.tsx">
                <div className="text-2xl font-bold text-purple-600" data-id="qj5ym6d5h" data-path="src/pages/WorkoutPage.tsx">{user.streak}</div>
                <div className="text-sm text-gray-600" data-id="eizd21la7" data-path="src/pages/WorkoutPage.tsx">Day Streak</div>
              </div>
              <div data-id="b0qytjkar" data-path="src/pages/WorkoutPage.tsx">
                <div className="text-2xl font-bold text-blue-600" data-id="rrrzl5sqt" data-path="src/pages/WorkoutPage.tsx">{user.totalGames}</div>
                <div className="text-sm text-gray-600" data-id="ug2yftuxc" data-path="src/pages/WorkoutPage.tsx">Total Games</div>
              </div>
              <div data-id="15wm2ldaf" data-path="src/pages/WorkoutPage.tsx">
                <div className="text-2xl font-bold text-green-600" data-id="gygk23ajb" data-path="src/pages/WorkoutPage.tsx">Level {user.level}</div>
                <div className="text-sm text-gray-600" data-id="n9m2j2ibp" data-path="src/pages/WorkoutPage.tsx">Current Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default WorkoutPage;