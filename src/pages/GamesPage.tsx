import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Eye, Lightbulb, Shuffle, Zap, Lock, Star } from 'lucide-react';

const GamesPage = () => {
  const navigate = useNavigate();

  const gameCategories = [
  {
    id: 'memory',
    title: 'Memory',
    icon: Brain,
    color: 'purple',
    description: 'Strengthen your ability to remember and recall information',
    games: [
    { name: 'Pattern Recall', difficulty: 'Easy', premium: false },
    { name: 'Sequence Master', difficulty: 'Medium', premium: false },
    { name: 'Card Pairs', difficulty: 'Easy', premium: true },
    { name: 'Number Span', difficulty: 'Hard', premium: true }],

    benefits: ['Improved working memory', 'Better recall ability', 'Enhanced pattern recognition']
  },
  {
    id: 'attention',
    title: 'Attention',
    icon: Eye,
    color: 'blue',
    description: 'Enhance your focus and concentration abilities',
    games: [
    { name: 'Focus Target', difficulty: 'Easy', premium: false },
    { name: 'Distraction Filter', difficulty: 'Medium', premium: false },
    { name: 'Dual N-Back', difficulty: 'Hard', premium: true },
    { name: 'Visual Search', difficulty: 'Medium', premium: true }],

    benefits: ['Sustained attention', 'Selective focus', 'Reduced distractibility']
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    icon: Lightbulb,
    color: 'green',
    description: 'Develop logical thinking and analytical skills',
    games: [
    { name: 'Logic Puzzles', difficulty: 'Medium', premium: false },
    { name: 'Math Challenge', difficulty: 'Easy', premium: false },
    { name: 'Strategy Games', difficulty: 'Hard', premium: true },
    { name: 'Pattern Logic', difficulty: 'Medium', premium: true }],

    benefits: ['Logical reasoning', 'Analytical thinking', 'Creative problem solving']
  },
  {
    id: 'flexibility',
    title: 'Mental Flexibility',
    icon: Shuffle,
    color: 'orange',
    description: 'Improve your ability to adapt and switch between tasks',
    games: [
    { name: 'Task Switch', difficulty: 'Medium', premium: false },
    { name: 'Rule Changes', difficulty: 'Easy', premium: false },
    { name: 'Color-Word', difficulty: 'Hard', premium: true },
    { name: 'Category Switch', difficulty: 'Medium', premium: true }],

    benefits: ['Cognitive flexibility', 'Adaptation skills', 'Mental agility']
  },
  {
    id: 'speed',
    title: 'Processing Speed',
    icon: Zap,
    color: 'red',
    description: 'Increase your mental processing speed and reaction time',
    games: [
    { name: 'Quick Match', difficulty: 'Easy', premium: false },
    { name: 'Speed Count', difficulty: 'Medium', premium: false },
    { name: 'Rapid Decision', difficulty: 'Hard', premium: true },
    { name: 'Flash Cards', difficulty: 'Easy', premium: true }],

    benefits: ['Faster processing', 'Quick decision making', 'Improved reaction time']
  }];


  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'border-purple-200 hover:border-purple-300 bg-purple-50',
      blue: 'border-blue-200 hover:border-blue-300 bg-blue-50',
      green: 'border-green-200 hover:border-green-300 bg-green-50',
      orange: 'border-orange-200 hover:border-orange-300 bg-orange-50',
      red: 'border-red-200 hover:border-red-300 bg-red-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-gray-200';
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600';
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
    <div className="min-h-screen p-4 space-y-6" data-id="oeoz2xkfp" data-path="src/pages/GamesPage.tsx">
      {/* Header */}
      <div className="pt-6" data-id="y1u5ev75m" data-path="src/pages/GamesPage.tsx">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" data-id="nbqk2b1v1" data-path="src/pages/GamesPage.tsx">Brain Games</h1>
        <p className="text-gray-600 mb-6" data-id="r4nkbkywk" data-path="src/pages/GamesPage.tsx">
          Choose from scientifically-designed games to train specific cognitive skills
        </p>
      </div>

      {/* Game Categories */}
      <div className="space-y-6" data-id="f64jp73nu" data-path="src/pages/GamesPage.tsx">
        {gameCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 ${getColorClasses(category.color)}`}
              onClick={() => navigate(`/games/${category.id}`)} data-id="prctn0qmh" data-path="src/pages/GamesPage.tsx">

              <CardHeader data-id="crl80o6a4" data-path="src/pages/GamesPage.tsx">
                <div className="flex items-center justify-between" data-id="uhls1ia8u" data-path="src/pages/GamesPage.tsx">
                  <div className="flex items-center space-x-3" data-id="7szbnrf21" data-path="src/pages/GamesPage.tsx">
                    <div className={`p-2 rounded-full bg-white shadow-sm`} data-id="wvncdle4l" data-path="src/pages/GamesPage.tsx">
                      <Icon className={`h-6 w-6 ${getIconColor(category.color)}`} data-id="8st329dtt" data-path="src/pages/GamesPage.tsx" />
                    </div>
                    <div data-id="cxdeyi0wf" data-path="src/pages/GamesPage.tsx">
                      <CardTitle className="text-xl" data-id="rv6xq0sd9" data-path="src/pages/GamesPage.tsx">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1" data-id="z2jdrluov" data-path="src/pages/GamesPage.tsx">{category.description}</p>
                    </div>
                  </div>
                  <Badge className={`${getIconColor(category.color)} bg-white border`} data-id="qlaq7m33m" data-path="src/pages/GamesPage.tsx">
                    {category.games.length} games
                  </Badge>
                </div>
              </CardHeader>
              <CardContent data-id="6vy1bin9r" data-path="src/pages/GamesPage.tsx">
                {/* Sample Games */}
                <div className="grid grid-cols-2 gap-3 mb-4" data-id="9yielrw36" data-path="src/pages/GamesPage.tsx">
                  {category.games.slice(0, 4).map((game, index) =>
                  <div key={index} className="bg-white p-3 rounded-lg border" data-id="dmo9g70cv" data-path="src/pages/GamesPage.tsx">
                      <div className="flex items-center justify-between mb-2" data-id="48uoveyyz" data-path="src/pages/GamesPage.tsx">
                        <span className="font-medium text-sm" data-id="v68e4lilt" data-path="src/pages/GamesPage.tsx">{game.name}</span>
                        {game.premium && <Lock className="h-3 w-3 text-orange-500" data-id="idmsku92v" data-path="src/pages/GamesPage.tsx" />}
                      </div>
                      <Badge
                      className={`text-xs ${getDifficultyColor(game.difficulty)}`}
                      variant="secondary" data-id="9l5bc00ad" data-path="src/pages/GamesPage.tsx">

                        {game.difficulty}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="space-y-2" data-id="3hnafo8wv" data-path="src/pages/GamesPage.tsx">
                  <p className="text-sm font-medium text-gray-700" data-id="sx2oojolm" data-path="src/pages/GamesPage.tsx">Cognitive Benefits:</p>
                  <div className="flex flex-wrap gap-2" data-id="7kwj3414m" data-path="src/pages/GamesPage.tsx">
                    {category.benefits.map((benefit, index) =>
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-white" data-id="las7461hn" data-path="src/pages/GamesPage.tsx">

                        {benefit}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>);

        })}
      </div>

      {/* Quick Start Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white" data-id="5uadaja56" data-path="src/pages/GamesPage.tsx">
        <CardContent className="p-6" data-id="v7jseguab" data-path="src/pages/GamesPage.tsx">
          <div className="flex items-center justify-between" data-id="tnb3jmf49" data-path="src/pages/GamesPage.tsx">
            <div data-id="yjc77wlic" data-path="src/pages/GamesPage.tsx">
              <h3 className="text-xl font-bold mb-2" data-id="24p8qx9pv" data-path="src/pages/GamesPage.tsx">Ready for a Quick Workout?</h3>
              <p className="text-purple-100 mb-4" data-id="0n29wsaw9" data-path="src/pages/GamesPage.tsx">
                Get a personalized 5-minute brain training session
              </p>
              <Button
                onClick={() => navigate('/workout')}
                className="bg-white text-purple-600 hover:bg-gray-100" data-id="oa0xpw11i" data-path="src/pages/GamesPage.tsx">

                Start Quick Workout
              </Button>
            </div>
            <div className="text-right" data-id="y2p8koeqz" data-path="src/pages/GamesPage.tsx">
              <Star className="h-12 w-12 text-yellow-300 mb-2" data-id="r3lmdxbv6" data-path="src/pages/GamesPage.tsx" />
              <div className="text-sm text-purple-100" data-id="5ph8kp2r0" data-path="src/pages/GamesPage.tsx">Personalized</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scientific Background */}
      <Card data-id="q39jewnn6" data-path="src/pages/GamesPage.tsx">
        <CardHeader data-id="h2hlzxc38" data-path="src/pages/GamesPage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="m9r60rwdg" data-path="src/pages/GamesPage.tsx">
            <Brain className="h-5 w-5 text-purple-600" data-id="ryyhix1p0" data-path="src/pages/GamesPage.tsx" />
            <span data-id="xjx5leq2p" data-path="src/pages/GamesPage.tsx">Scientific Foundation</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="5np6ycdnr" data-path="src/pages/GamesPage.tsx">
          <p className="text-gray-600 text-sm leading-relaxed" data-id="rgp20che1" data-path="src/pages/GamesPage.tsx">
            Our games are based on peer-reviewed neuroscience research and designed to promote 
            neuroplasticity - your brain's ability to form new neural connections. Regular training 
            has been shown to improve cognitive performance in healthy individuals across all age groups.
          </p>
        </CardContent>
      </Card>
    </div>);

};

export default GamesPage;