import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, Shuffle, Clock, Sparkles, Play, RefreshCw } from 'lucide-react';
import { mlEngine, WorkoutRecommendation } from './MLEngine';
import { useUser } from '@/contexts/UserContext';

interface WorkoutGeneratorProps {
  onStartWorkout: (workout: WorkoutRecommendation) => void;
  className?: string;
}

const gameIcons = {
  memory: Brain,
  attention: Target,
  problem_solving: Zap,
  flexibility: Shuffle,
  speed: Clock
};

const gameNames = {
  memory: 'Memory Pattern',
  attention: 'Focus Training',
  problem_solving: 'Logic Puzzles',
  flexibility: 'Mental Flexibility',
  speed: 'Speed Training'
};

const difficultyColors = {
  1: 'bg-green-100 text-green-700 border-green-300',
  2: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  3: 'bg-orange-100 text-orange-700 border-orange-300',
  4: 'bg-red-100 text-red-700 border-red-300',
  5: 'bg-purple-100 text-purple-700 border-purple-300'
};

export const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({
  onStartWorkout,
  className = ''
}) => {
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutRecommendation | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load user preferences
      const { data: prefsData, error: prefsError } = await window.ezsite.apis.tablePage(9905, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [
        {
          "name": "user_id",
          "op": "Equal",
          "value": user.ID
        }]

      });

      if (!prefsError && prefsData.List.length > 0) {
        setUserPreferences(prefsData.List[0]);
      } else {
        // Create default preferences if none exist
        await createDefaultPreferences();
      }

      // Load recent performance data
      const { data: perfData, error: perfError } = await window.ezsite.apis.tablePage(9903, {
        "PageNo": 1,
        "PageSize": 30,
        "OrderByField": "ID",
        "IsAsc": false,
        "Filters": [
        {
          "name": "user_id",
          "op": "Equal",
          "value": user.ID
        }]

      });

      if (!perfError) {
        setPerformanceData(perfData.List);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user) return;

    try {
      const defaultPrefs = {
        user_id: user.ID,
        preferred_difficulty: 'medium',
        favorite_game_types: JSON.stringify(['memory', 'attention']),
        workout_duration_preference: 15,
        reminder_frequency: 'daily',
        optimal_time_of_day: 'morning',
        adaptive_difficulty_enabled: true,
        voice_coaching_enabled: false,
        performance_analytics_enabled: true
      };

      const { error } = await window.ezsite.apis.tableCreate(9905, defaultPrefs);
      if (!error) {
        setUserPreferences(defaultPrefs);
      }
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  const generateWorkout = async () => {
    if (!user || !userPreferences) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate AI processing with progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => Math.min(prev + 20, 90));
      }, 200);

      // Convert performance data to the format expected by MLEngine
      const formattedPerformanceData = performanceData.map((item) => ({
        score: item.score,
        accuracy: item.accuracy,
        timeSpent: item.time_spent,
        reactionTime: item.reaction_time,
        mistakesCount: item.mistakes_count,
        difficultyLevel: item.difficulty_level,
        gameType: item.game_type
      }));

      // Parse JSON fields safely
      const parsedPreferences = {
        ...userPreferences,
        favorite_game_types: (() => {
          try {
            return JSON.parse(userPreferences.favorite_game_types || '[]');
          } catch {
            return [];
          }
        })()
      };

      // Generate custom workout using ML engine
      const workout = mlEngine.generateCustomWorkout(
        parsedPreferences,
        formattedPerformanceData,
        parsedPreferences.workout_duration_preference
      );

      clearInterval(progressInterval);
      setGenerationProgress(100);

      setTimeout(() => {
        setCurrentWorkout(workout);
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);

    } catch (error) {
      console.error('Error generating workout:', error);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleStartWorkout = async () => {
    if (!currentWorkout || !user) return;

    try {
      // Save workout session to database
      const sessionData = {
        user_id: user.ID,
        session_date: new Date().toISOString(),
        games_played: JSON.stringify(currentWorkout.gameTypes),
        total_duration: currentWorkout.duration,
        overall_score: 0, // Will be updated as games are completed
        cognitive_areas_focused: JSON.stringify(currentWorkout.gameTypes),
        difficulty_progression: JSON.stringify(currentWorkout.difficultyLevels),
        satisfaction_rating: 3,
        generated_by_ai: true
      };

      await window.ezsite.apis.tableCreate(9904, sessionData);
      onStartWorkout(currentWorkout);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const getDifficultyLabel = (level: number): string => {
    if (level <= 1) return 'Beginner';
    if (level <= 2) return 'Easy';
    if (level <= 3) return 'Medium';
    if (level <= 4) return 'Hard';
    return 'Expert';
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Card className={`${className}`} data-id="3vazdv30w" data-path="src/components/ml/WorkoutGenerator.tsx">
      <CardHeader data-id="wk1239uew" data-path="src/components/ml/WorkoutGenerator.tsx">
        <CardTitle className="flex items-center space-x-2" data-id="bco53m3cd" data-path="src/components/ml/WorkoutGenerator.tsx">
          <Sparkles className="h-5 w-5 text-purple-600" data-id="nc5i38ldj" data-path="src/components/ml/WorkoutGenerator.tsx" />
          <span data-id="6ma72qgeg" data-path="src/components/ml/WorkoutGenerator.tsx">AI Workout Generator</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4" data-id="m7lmtfegb" data-path="src/components/ml/WorkoutGenerator.tsx">
        {!currentWorkout && !isGenerating &&
        <div className="text-center py-6" data-id="cxbo5qwq8" data-path="src/components/ml/WorkoutGenerator.tsx">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" data-id="zxkdabsrm" data-path="src/components/ml/WorkoutGenerator.tsx" />
            <p className="text-gray-600 mb-4" data-id="13lntc25t" data-path="src/components/ml/WorkoutGenerator.tsx">
              Generate a personalized cognitive workout based on your performance and preferences.
            </p>
            <Button
            onClick={generateWorkout}
            disabled={!userPreferences}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" data-id="nn9zzzo4e" data-path="src/components/ml/WorkoutGenerator.tsx">

              <Sparkles className="h-4 w-4 mr-2" data-id="qmynk2f5g" data-path="src/components/ml/WorkoutGenerator.tsx" />
              Generate My Workout
            </Button>
          </div>
        }

        {isGenerating &&
        <div className="text-center py-6 space-y-4" data-id="jc4n9v9bl" data-path="src/components/ml/WorkoutGenerator.tsx">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto" data-id="melqrq2f2" data-path="src/components/ml/WorkoutGenerator.tsx"></div>
            <div className="space-y-2" data-id="7z7uvd9ua" data-path="src/components/ml/WorkoutGenerator.tsx">
              <p className="text-sm text-gray-600" data-id="86ncf3hvs" data-path="src/components/ml/WorkoutGenerator.tsx">Analyzing your performance data...</p>
              <Progress value={generationProgress} className="w-full" data-id="m6xyrgplh" data-path="src/components/ml/WorkoutGenerator.tsx" />
              <p className="text-xs text-gray-500" data-id="16pbrahfn" data-path="src/components/ml/WorkoutGenerator.tsx">
                {generationProgress < 30 && "Analyzing recent games..."}
                {generationProgress >= 30 && generationProgress < 60 && "Identifying improvement areas..."}
                {generationProgress >= 60 && generationProgress < 90 && "Optimizing difficulty levels..."}
                {generationProgress >= 90 && "Finalizing your workout..."}
              </p>
            </div>
          </div>
        }

        {currentWorkout &&
        <div className="space-y-4" data-id="cwpluciqw" data-path="src/components/ml/WorkoutGenerator.tsx">
            {/* Workout Overview */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border" data-id="hi0aqkxi7" data-path="src/components/ml/WorkoutGenerator.tsx">
              <div className="flex items-center justify-between mb-3" data-id="4kokxdnqy" data-path="src/components/ml/WorkoutGenerator.tsx">
                <h3 className="font-semibold text-gray-800" data-id="525rrnjo8" data-path="src/components/ml/WorkoutGenerator.tsx">Your Personalized Workout</h3>
                <Badge className="bg-green-100 text-green-700 border-green-300" data-id="gwmmjngi3" data-path="src/components/ml/WorkoutGenerator.tsx">
                  {formatDuration(currentWorkout.duration)}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3" data-id="xiw6oyenp" data-path="src/components/ml/WorkoutGenerator.tsx">
                {currentWorkout.reasoning}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs" data-id="xcqp962wi" data-path="src/components/ml/WorkoutGenerator.tsx">
                <div data-id="xl3qkevul" data-path="src/components/ml/WorkoutGenerator.tsx">
                  <span className="text-gray-500" data-id="nlj846qpk" data-path="src/components/ml/WorkoutGenerator.tsx">Games:</span>
                  <span className="ml-1 font-medium" data-id="vsgfm95ul" data-path="src/components/ml/WorkoutGenerator.tsx">{currentWorkout.gameTypes.length}</span>
                </div>
                <div data-id="c5r9aphof" data-path="src/components/ml/WorkoutGenerator.tsx">
                  <span className="text-gray-500" data-id="oqd3ahrg1" data-path="src/components/ml/WorkoutGenerator.tsx">Focus Areas:</span>
                  <span className="ml-1 font-medium" data-id="fdm9r8ed7" data-path="src/components/ml/WorkoutGenerator.tsx">{currentWorkout.gameTypes.length}</span>
                </div>
              </div>
            </div>

            {/* Game List */}
            <div className="space-y-3" data-id="36izz2jka" data-path="src/components/ml/WorkoutGenerator.tsx">
              <h4 className="font-medium text-gray-700" data-id="s5prbfb60" data-path="src/components/ml/WorkoutGenerator.tsx">Workout Games</h4>
              {currentWorkout.gameTypes.map((gameType, index) => {
              const Icon = gameIcons[gameType as keyof typeof gameIcons] || Brain;
              const gameName = gameNames[gameType as keyof typeof gameNames] || gameType;
              const difficulty = currentWorkout.difficultyLevels[gameType] || 1;
              const difficultyClass = difficultyColors[Math.min(difficulty, 5) as keyof typeof difficultyColors] || difficultyColors[1];

              return (
                <div
                  key={gameType}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors" data-id="3bopi7r4a" data-path="src/components/ml/WorkoutGenerator.tsx">

                    <div className="flex items-center space-x-3" data-id="bcm673q18" data-path="src/components/ml/WorkoutGenerator.tsx">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100" data-id="gds6xy6si" data-path="src/components/ml/WorkoutGenerator.tsx">
                        <span className="text-sm font-bold text-gray-600" data-id="bi8y0e294" data-path="src/components/ml/WorkoutGenerator.tsx">{index + 1}</span>
                      </div>
                      <Icon className="h-5 w-5 text-purple-600" data-id="o2wqp3y3q" data-path="src/components/ml/WorkoutGenerator.tsx" />
                      <div data-id="3g0o23rla" data-path="src/components/ml/WorkoutGenerator.tsx">
                        <p className="font-medium text-gray-800" data-id="98yq3cuw3" data-path="src/components/ml/WorkoutGenerator.tsx">{gameName}</p>
                        <p className="text-xs text-gray-500 capitalize" data-id="duon6r76d" data-path="src/components/ml/WorkoutGenerator.tsx">{gameType.replace('_', ' ')}</p>
                      </div>
                    </div>
                    
                    <Badge className={difficultyClass} data-id="wsu27ug8y" data-path="src/components/ml/WorkoutGenerator.tsx">
                      {getDifficultyLabel(difficulty)}
                    </Badge>
                  </div>);

            })}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2" data-id="k5qqfx37f" data-path="src/components/ml/WorkoutGenerator.tsx">
              <Button
              onClick={handleStartWorkout}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" data-id="35dp7wgaa" data-path="src/components/ml/WorkoutGenerator.tsx">

                <Play className="h-4 w-4 mr-2" data-id="bpgm7xuxr" data-path="src/components/ml/WorkoutGenerator.tsx" />
                Start Workout
              </Button>
              
              <Button
              variant="outline"
              onClick={() => setCurrentWorkout(null)}
              className="px-3" data-id="yqo7a5zls" data-path="src/components/ml/WorkoutGenerator.tsx">

                <RefreshCw className="h-4 w-4" data-id="jted86s6e" data-path="src/components/ml/WorkoutGenerator.tsx" />
              </Button>
            </div>
          </div>
        }

        {userPreferences &&
        <div className="text-xs text-gray-500 pt-2 border-t" data-id="bfio5tpnr" data-path="src/components/ml/WorkoutGenerator.tsx">
            <p data-id="pxj3uivwb" data-path="src/components/ml/WorkoutGenerator.tsx">Based on your preferences: {userPreferences.preferred_difficulty} difficulty, 
               {formatDuration(userPreferences.workout_duration_preference)} sessions</p>
          </div>
        }
      </CardContent>
    </Card>);

};

export default WorkoutGenerator;