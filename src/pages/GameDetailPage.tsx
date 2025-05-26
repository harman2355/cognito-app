import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Play, Star, Clock, Target, Award } from 'lucide-react';
import MemoryGame from '../components/games/MemoryGame';
import AttentionGame from '../components/games/AttentionGame';
import ProblemSolvingGame from '../components/games/ProblemSolvingGame';
import FlexibilityGame from '../components/games/FlexibilityGame';
import SpeedGame from '../components/games/SpeedGame';

const GameDetailPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user, addGameSession } = useUser();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);

  const gameCategories: {[key: string]: any;} = {
    memory: {
      title: 'Memory Training',
      description: 'Strengthen your working memory and recall abilities',
      color: 'purple',
      games: [
      {
        id: 'pattern-recall',
        name: 'Pattern Recall',
        description: 'Remember and reproduce visual patterns',
        difficulty: 'Easy',
        duration: '2-3 min',
        component: MemoryGame,
        benefits: ['Visual memory', 'Pattern recognition', 'Spatial awareness']
      },
      {
        id: 'sequence-master',
        name: 'Sequence Master',
        description: 'Recall sequences of numbers or colors',
        difficulty: 'Medium',
        duration: '3-4 min',
        component: MemoryGame,
        benefits: ['Working memory', 'Sequential processing', 'Concentration']
      }]

    },
    attention: {
      title: 'Attention Training',
      description: 'Improve your focus and concentration skills',
      color: 'blue',
      games: [
      {
        id: 'focus-target',
        name: 'Focus Target',
        description: 'Track moving targets while ignoring distractors',
        difficulty: 'Easy',
        duration: '2-3 min',
        component: AttentionGame,
        benefits: ['Selective attention', 'Visual tracking', 'Distraction resistance']
      },
      {
        id: 'distraction-filter',
        name: 'Distraction Filter',
        description: 'Focus on relevant information while filtering distractions',
        difficulty: 'Medium',
        duration: '3-4 min',
        component: AttentionGame,
        benefits: ['Sustained attention', 'Cognitive control', 'Focus stability']
      }]

    },
    'problem-solving': {
      title: 'Problem Solving',
      description: 'Develop logical thinking and analytical skills',
      color: 'green',
      games: [
      {
        id: 'logic-puzzles',
        name: 'Logic Puzzles',
        description: 'Solve pattern-based logic problems',
        difficulty: 'Medium',
        duration: '4-5 min',
        component: ProblemSolvingGame,
        benefits: ['Logical reasoning', 'Pattern analysis', 'Abstract thinking']
      },
      {
        id: 'math-challenge',
        name: 'Math Challenge',
        description: 'Quick arithmetic and number problems',
        difficulty: 'Easy',
        duration: '2-3 min',
        component: ProblemSolvingGame,
        benefits: ['Numerical reasoning', 'Mental math', 'Quick calculation']
      }]

    },
    flexibility: {
      title: 'Mental Flexibility',
      description: 'Enhance your ability to adapt and switch between tasks',
      color: 'orange',
      games: [
      {
        id: 'task-switch',
        name: 'Task Switch',
        description: 'Rapidly switch between different task rules',
        difficulty: 'Medium',
        duration: '3-4 min',
        component: FlexibilityGame,
        benefits: ['Cognitive flexibility', 'Task switching', 'Adaptation']
      },
      {
        id: 'rule-changes',
        name: 'Rule Changes',
        description: 'Adapt to changing game rules and patterns',
        difficulty: 'Easy',
        duration: '2-3 min',
        component: FlexibilityGame,
        benefits: ['Rule learning', 'Mental agility', 'Change adaptation']
      }]

    },
    speed: {
      title: 'Processing Speed',
      description: 'Increase your mental processing speed and reaction time',
      color: 'red',
      games: [
      {
        id: 'quick-match',
        name: 'Quick Match',
        description: 'Match symbols or colors as quickly as possible',
        difficulty: 'Easy',
        duration: '1-2 min',
        component: SpeedGame,
        benefits: ['Reaction speed', 'Visual processing', 'Motor speed']
      },
      {
        id: 'speed-count',
        name: 'Speed Count',
        description: 'Count objects quickly under time pressure',
        difficulty: 'Medium',
        duration: '2-3 min',
        component: SpeedGame,
        benefits: ['Processing speed', 'Numerical fluency', 'Time pressure handling']
      }]

    }
  };

  const currentCategory = gameCategories[category || ''];

  if (!currentCategory) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" data-id="cle2o9utf" data-path="src/pages/GameDetailPage.tsx">
        <div className="text-center" data-id="phm0qi2hv" data-path="src/pages/GameDetailPage.tsx">
          <h2 className="text-2xl font-bold text-gray-800 mb-4" data-id="7x7za6dya" data-path="src/pages/GameDetailPage.tsx">Category Not Found</h2>
          <Button onClick={() => navigate('/games')} data-id="wyj09g5vc" data-path="src/pages/GameDetailPage.tsx">Back to Games</Button>
        </div>
      </div>);

  }

  const handleGameComplete = (score: number, accuracy: number, timeSpent: number) => {
    if (selectedGame) {
      addGameSession({
        gameId: selectedGame,
        category: category || '',
        score,
        accuracy,
        timeSpent,
        difficulty: 'medium',
        date: new Date()
      });
    }
    setGameInProgress(false);
    setSelectedGame(null);
  };

  const handleStartGame = (gameId: string) => {
    setSelectedGame(gameId);
    setGameInProgress(true);
  };

  const getCurrentGame = () => {
    if (!selectedGame) return null;
    return currentCategory.games.find((game: any) => game.id === selectedGame);
  };

  if (gameInProgress && selectedGame) {
    const game = getCurrentGame();
    const GameComponent = game?.component;

    return GameComponent ?
    <GameComponent
      onComplete={handleGameComplete}
      onExit={() => {
        setGameInProgress(false);
        setSelectedGame(null);
      }}
      gameConfig={{
        gameId: selectedGame,
        name: game.name,
        difficulty: game.difficulty
      }} data-id="73y5awfvf" data-path="src/pages/GameDetailPage.tsx" /> :

    null;
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'from-gray-500 to-gray-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':return 'bg-green-100 text-green-700';
      case 'Medium':return 'bg-yellow-100 text-yellow-700';
      case 'Hard':return 'bg-red-100 text-red-700';
      default:return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6" data-id="jvpznopab" data-path="src/pages/GameDetailPage.tsx">
      {/* Header */}
      <div className="pt-6" data-id="vqnxxtufz" data-path="src/pages/GameDetailPage.tsx">
        <Button
          variant="ghost"
          onClick={() => navigate('/games')}
          className="mb-4 text-gray-600 hover:text-gray-800" data-id="z9vhj1l6e" data-path="src/pages/GameDetailPage.tsx">

          <ArrowLeft className="h-4 w-4 mr-2" data-id="8x8x7e1lb" data-path="src/pages/GameDetailPage.tsx" />
          Back to Games
        </Button>
        
        <div className={`bg-gradient-to-r ${getColorClasses(currentCategory.color)} text-white p-6 rounded-lg`} data-id="lguortvy4" data-path="src/pages/GameDetailPage.tsx">
          <h1 className="text-3xl font-bold mb-2" data-id="nqtjbrwul" data-path="src/pages/GameDetailPage.tsx">{currentCategory.title}</h1>
          <p className="text-white/90" data-id="51r4w1dhp" data-path="src/pages/GameDetailPage.tsx">{currentCategory.description}</p>
        </div>
      </div>

      {/* User Progress in Category */}
      {user &&
      <Card data-id="y3em11c6a" data-path="src/pages/GameDetailPage.tsx">
          <CardHeader data-id="70on4qfqy" data-path="src/pages/GameDetailPage.tsx">
            <CardTitle className="flex items-center space-x-2" data-id="2l76zvycr" data-path="src/pages/GameDetailPage.tsx">
              <Award className="h-5 w-5 text-purple-600" data-id="yqs79s2l6" data-path="src/pages/GameDetailPage.tsx" />
              <span data-id="o28n9or4y" data-path="src/pages/GameDetailPage.tsx">Your Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-id="q6bqek2ws" data-path="src/pages/GameDetailPage.tsx">
            <div className="grid grid-cols-3 gap-4 text-center" data-id="u8qolk138" data-path="src/pages/GameDetailPage.tsx">
              <div data-id="iv982kxs7" data-path="src/pages/GameDetailPage.tsx">
                <div className="text-2xl font-bold text-purple-600" data-id="7uoow1yle" data-path="src/pages/GameDetailPage.tsx">
                  {Math.round(user.cognitiveScores[category === 'problem-solving' ? 'problemSolving' : category as keyof typeof user.cognitiveScores] || 50)}
                </div>
                <div className="text-sm text-gray-600" data-id="vtnkaucjt" data-path="src/pages/GameDetailPage.tsx">Skill Level</div>
              </div>
              <div data-id="cju8ks80e" data-path="src/pages/GameDetailPage.tsx">
                <div className="text-2xl font-bold text-blue-600" data-id="kb49j3kam" data-path="src/pages/GameDetailPage.tsx">Level {user.level}</div>
                <div className="text-sm text-gray-600" data-id="45v2tpyz4" data-path="src/pages/GameDetailPage.tsx">Current Level</div>
              </div>
              <div data-id="anv6nv8mf" data-path="src/pages/GameDetailPage.tsx">
                <div className="text-2xl font-bold text-green-600" data-id="rald5zcvv" data-path="src/pages/GameDetailPage.tsx">{user.totalGames}</div>
                <div className="text-sm text-gray-600" data-id="vgjslti3r" data-path="src/pages/GameDetailPage.tsx">Games Played</div>
              </div>
            </div>
          </CardContent>
        </Card>
      }

      {/* Available Games */}
      <div className="space-y-4" data-id="osspd2nl9" data-path="src/pages/GameDetailPage.tsx">
        <h2 className="text-xl font-bold text-gray-800" data-id="pm52hmgq7" data-path="src/pages/GameDetailPage.tsx">Available Games</h2>
        {currentCategory.games.map((game: any, index: number) =>
        <Card key={game.id} className="hover:shadow-md transition-shadow" data-id="7qmox4zrm" data-path="src/pages/GameDetailPage.tsx">
            <CardContent className="p-6" data-id="p1t9ug4n6" data-path="src/pages/GameDetailPage.tsx">
              <div className="flex items-start justify-between mb-4" data-id="zh6bdmgye" data-path="src/pages/GameDetailPage.tsx">
                <div className="flex-1" data-id="ns58160gc" data-path="src/pages/GameDetailPage.tsx">
                  <div className="flex items-center space-x-3 mb-2" data-id="95kaqyb1u" data-path="src/pages/GameDetailPage.tsx">
                    <h3 className="text-xl font-bold text-gray-800" data-id="teibwb6ef" data-path="src/pages/GameDetailPage.tsx">{game.name}</h3>
                    <Badge className={getDifficultyColor(game.difficulty)} variant="secondary" data-id="xfmio6riy" data-path="src/pages/GameDetailPage.tsx">
                      {game.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3" data-id="wstl0a51f" data-path="src/pages/GameDetailPage.tsx">{game.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4" data-id="2qeyviquv" data-path="src/pages/GameDetailPage.tsx">
                    <div className="flex items-center space-x-1" data-id="lri558h05" data-path="src/pages/GameDetailPage.tsx">
                      <Clock className="h-4 w-4" data-id="3io02cqbg" data-path="src/pages/GameDetailPage.tsx" />
                      <span data-id="oaf4svm8m" data-path="src/pages/GameDetailPage.tsx">{game.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1" data-id="8uxupnhx5" data-path="src/pages/GameDetailPage.tsx">
                      <Target className="h-4 w-4" data-id="zbnhox7qv" data-path="src/pages/GameDetailPage.tsx" />
                      <span data-id="t4ipgjqfw" data-path="src/pages/GameDetailPage.tsx">{game.benefits.length} benefits</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2" data-id="tfy0qbc8b" data-path="src/pages/GameDetailPage.tsx">
                    <p className="text-sm font-medium text-gray-700" data-id="6zz6k538y" data-path="src/pages/GameDetailPage.tsx">Cognitive Benefits:</p>
                    <div className="flex flex-wrap gap-2" data-id="5ng1qm45h" data-path="src/pages/GameDetailPage.tsx">
                      {game.benefits.map((benefit: string, idx: number) =>
                    <Badge key={idx} variant="outline" className="text-xs" data-id="ztbx1637d" data-path="src/pages/GameDetailPage.tsx">
                          {benefit}
                        </Badge>
                    )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
              onClick={() => handleStartGame(game.id)}
              className={`w-full bg-gradient-to-r ${getColorClasses(currentCategory.color)} hover:opacity-90`} data-id="83kqsihs7" data-path="src/pages/GameDetailPage.tsx">

                <Play className="h-4 w-4 mr-2" data-id="xo9u1n2p5" data-path="src/pages/GameDetailPage.tsx" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Educational Content */}
      <Card data-id="o5kkkp8zy" data-path="src/pages/GameDetailPage.tsx">
        <CardHeader data-id="k9bm1cqy3" data-path="src/pages/GameDetailPage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="jfhmlpfur" data-path="src/pages/GameDetailPage.tsx">
            <Star className="h-5 w-5 text-yellow-500" data-id="j5mirc5ao" data-path="src/pages/GameDetailPage.tsx" />
            <span data-id="3oputen6x" data-path="src/pages/GameDetailPage.tsx">Did You Know?</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="he0184rqk" data-path="src/pages/GameDetailPage.tsx">
          <p className="text-gray-600 text-sm leading-relaxed" data-id="uofawzcup" data-path="src/pages/GameDetailPage.tsx">
            {category === 'memory' && "Working memory training can improve your ability to hold and manipulate information in your mind, which is crucial for problem-solving, reading comprehension, and learning new skills."}
            {category === 'attention' && "Attention training strengthens your brain's executive control networks, helping you maintain focus in distracting environments and switch attention when needed."}
            {category === 'problem-solving' && "Regular problem-solving practice enhances your prefrontal cortex function, improving logical reasoning, planning, and decision-making abilities."}
            {category === 'flexibility' && "Mental flexibility training helps develop cognitive control, allowing you to adapt to new situations and switch between different mental tasks more efficiently."}
            {category === 'speed' && "Processing speed training can help maintain and improve the efficiency of your neural networks, leading to faster thinking and quicker decision-making."}
          </p>
        </CardContent>
      </Card>
    </div>);

};

export default GameDetailPage;