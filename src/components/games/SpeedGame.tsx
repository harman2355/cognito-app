import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Timer, CheckCircle, XCircle, Target } from 'lucide-react';

interface SpeedGameProps {
  level: number;
  difficulty: string;
  onComplete: (result: {score: number;accuracy: number;time: number;}) => void;
  isPaused: boolean;
}

type GamePhase = 'instruction' | 'playing' | 'completed';
type TaskType = 'reaction' | 'comparison' | 'arithmetic' | 'matching';

interface Trial {
  type: TaskType;
  stimulus: any;
  correctAnswer: string | number;
  options?: string[];
  startTime: number;
}

const SpeedGame: React.FC<SpeedGameProps> = ({ level, difficulty, onComplete, isPaused }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('instruction');
  const [currentTrial, setCurrentTrial] = useState<Trial | null>(null);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [showStimulus, setShowStimulus] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastReactionTime, setLastReactionTime] = useState(0);

  const totalTrials = 20;
  const baseSpeed = Math.max(2000 - level * 150, 800); // 2s to 0.8s

  const difficultyModifiers = {
    easy: { speedMultiplier: 1.3, complexityBonus: 0 },
    medium: { speedMultiplier: 1.0, complexityBonus: 1 },
    hard: { speedMultiplier: 0.8, complexityBonus: 2 },
    expert: { speedMultiplier: 0.6, complexityBonus: 3 },
    master: { speedMultiplier: 0.5, complexityBonus: 4 }
  };

  const currentDifficultyModifier = difficultyModifiers[difficulty as keyof typeof difficultyModifiers] || difficultyModifiers.medium;

  const generateReactionTrial = useCallback((): Trial => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];

    return {
      type: 'reaction',
      stimulus: { color: targetColor, instruction: 'Click when the circle appears!' },
      correctAnswer: 'click',
      startTime: 0
    };
  }, []);

  const generateComparisonTrial = useCallback((): Trial => {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;

    return {
      type: 'comparison',
      stimulus: { num1, num2, question: `${num1} > ${num2}?` },
      correctAnswer: num1 > num2 ? 'yes' : 'no',
      options: ['yes', 'no'],
      startTime: 0
    };
  }, []);

  const generateArithmeticTrial = useCallback((): Trial => {
    const complexity = currentDifficultyModifier.complexityBonus;
    const num1 = Math.floor(Math.random() * (10 + complexity * 5)) + 1;
    const num2 = Math.floor(Math.random() * (10 + complexity * 5)) + 1;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let correctAnswer: number;
    let question: string;

    if (operation === '+') {
      correctAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      correctAnswer = larger - smaller;
      question = `${larger} - ${smaller} = ?`;
    }

    // Generate options
    const options = [
    correctAnswer.toString(),
    (correctAnswer + Math.floor(Math.random() * 5) + 1).toString(),
    (correctAnswer - Math.floor(Math.random() * 5) - 1).toString(),
    (correctAnswer + Math.floor(Math.random() * 10) + 5).toString()].
    sort(() => Math.random() - 0.5);

    return {
      type: 'arithmetic',
      stimulus: { question },
      correctAnswer: correctAnswer.toString(),
      options,
      startTime: 0
    };
  }, [currentDifficultyModifier]);

  const generateMatchingTrial = useCallback((): Trial => {
    const shapes = ['○', '□', '△', '◇', '★'];
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];

    const options = [
    `${targetShape} ${targetColor}`,
    `${shapes[(shapes.indexOf(targetShape) + 1) % shapes.length]} ${targetColor}`,
    `${targetShape} ${colors[(colors.indexOf(targetColor) + 1) % colors.length]}`,
    `${shapes[(shapes.indexOf(targetShape) + 2) % shapes.length]} ${colors[(colors.indexOf(targetColor) + 2) % colors.length]}`].
    sort(() => Math.random() - 0.5);

    return {
      type: 'matching',
      stimulus: {
        target: { shape: targetShape, color: targetColor },
        instruction: `Find: ${targetShape} ${targetColor}`
      },
      correctAnswer: `${targetShape} ${targetColor}`,
      options,
      startTime: 0
    };
  }, []);

  const generateTrial = useCallback((): Trial => {
    const taskTypes: TaskType[] = ['reaction', 'comparison', 'arithmetic', 'matching'];
    const randomType = taskTypes[Math.floor(Math.random() * taskTypes.length)];

    switch (randomType) {
      case 'reaction':
        return generateReactionTrial();
      case 'comparison':
        return generateComparisonTrial();
      case 'arithmetic':
        return generateArithmeticTrial();
      case 'matching':
        return generateMatchingTrial();
      default:
        return generateReactionTrial();
    }
  }, [generateReactionTrial, generateComparisonTrial, generateArithmeticTrial, generateMatchingTrial]);

  const startGame = () => {
    setGamePhase('playing');
    setStartTime(Date.now());
    setCurrentTrialIndex(0);
    startTrial();
  };

  const startTrial = () => {
    const trial = generateTrial();
    setCurrentTrial(trial);
    setShowStimulus(false);
    setWaitingForResponse(false);
    setShowFeedback(false);

    if (trial.type === 'reaction') {
      // Reaction time trial - show after random delay
      const delay = Math.random() * 3000 + 1000; // 1-4 seconds
      setTimeout(() => {
        if (!isPaused) {
          setShowStimulus(true);
          setWaitingForResponse(true);
          setCurrentTrial((prev) => prev ? { ...prev, startTime: Date.now() } : null);
        }
      }, delay);
    } else {
      // Other trials - show immediately
      setShowStimulus(true);
      setWaitingForResponse(true);
      setCurrentTrial((prev) => prev ? { ...prev, startTime: Date.now() } : null);
    }
  };

  const handleResponse = (response: string) => {
    if (!currentTrial || !waitingForResponse) return;

    const reactionTime = Date.now() - currentTrial.startTime;
    const isCorrect = response === currentTrial.correctAnswer.toString();

    setLastReactionTime(reactionTime);
    setLastAnswerCorrect(isCorrect);
    setWaitingForResponse(false);
    setShowFeedback(true);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setTotalReactionTime((prev) => prev + reactionTime);

      // Score based on speed and accuracy
      const speedBonus = Math.max(2000 - reactionTime, 0) / 10;
      const trialScore = Math.floor(100 + speedBonus);
      setScore((prev) => prev + trialScore);
    }

    setTimeout(() => {
      if (currentTrialIndex < totalTrials - 1) {
        setCurrentTrialIndex((prev) => prev + 1);
        startTrial();
      } else {
        completeGame();
      }
    }, 1500);
  };

  const completeGame = () => {
    const finalTime = Date.now() - startTime;
    const accuracy = Math.round(correctAnswers / totalTrials * 100);
    setGamePhase('completed');

    setTimeout(() => {
      onComplete({
        score,
        accuracy,
        time: finalTime
      });
    }, 1000);
  };

  const renderTrialContent = () => {
    if (!currentTrial) return null;

    switch (currentTrial.type) {
      case 'reaction':
        return (
          <div className="text-center space-y-6" data-id="7b2in9s4f" data-path="src/components/games/SpeedGame.tsx">
            {!showStimulus ?
            <div className="space-y-4" data-id="fn772mtde" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-lg font-semibold text-gray-800" data-id="45jdfnxgl" data-path="src/components/games/SpeedGame.tsx">Get Ready...</div>
                <div className="text-sm text-gray-600" data-id="0bnpbvbxy" data-path="src/components/games/SpeedGame.tsx">Click the circle as soon as it appears!</div>
                <div className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-full mx-auto" data-id="5aho3aim3" data-path="src/components/games/SpeedGame.tsx"></div>
              </div> :

            <div className="space-y-4" data-id="1n4l9grxn" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-lg font-semibold text-green-600" data-id="m7l8bngy9" data-path="src/components/games/SpeedGame.tsx">NOW!</div>
                <Button
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white mx-auto"
                onClick={() => handleResponse('click')}
                disabled={!waitingForResponse} data-id="s34dukuu9" data-path="src/components/games/SpeedGame.tsx">

                  CLICK
                </Button>
              </div>
            }
          </div>);


      case 'comparison':
        return (
          <div className="text-center space-y-4" data-id="ow7vm1lp1" data-path="src/components/games/SpeedGame.tsx">
            <div className="text-lg font-semibold text-gray-800" data-id="85u1rlbm5" data-path="src/components/games/SpeedGame.tsx">
              {currentTrial.stimulus.question}
            </div>
            <div className="flex justify-center gap-4" data-id="ftaljt519" data-path="src/components/games/SpeedGame.tsx">
              {currentTrial.options?.map((option, index) =>
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleResponse(option)}
                disabled={!waitingForResponse}
                className="min-w-20" data-id="hvm7muvn7" data-path="src/components/games/SpeedGame.tsx">

                  {option.toUpperCase()}
                </Button>
              )}
            </div>
          </div>);


      case 'arithmetic':
        return (
          <div className="text-center space-y-4" data-id="9i38i380g" data-path="src/components/games/SpeedGame.tsx">
            <div className="text-xl font-semibold text-gray-800" data-id="2h92wbgv9" data-path="src/components/games/SpeedGame.tsx">
              {currentTrial.stimulus.question}
            </div>
            <div className="grid grid-cols-2 gap-2" data-id="km1tfd2ix" data-path="src/components/games/SpeedGame.tsx">
              {currentTrial.options?.map((option, index) =>
              <Button
                key={index}
                variant="outline"
                onClick={() => handleResponse(option)}
                disabled={!waitingForResponse} data-id="r9ayni7bx" data-path="src/components/games/SpeedGame.tsx">

                  {option}
                </Button>
              )}
            </div>
          </div>);


      case 'matching':
        return (
          <div className="text-center space-y-4" data-id="nbk1lh8kj" data-path="src/components/games/SpeedGame.tsx">
            <div className="text-lg font-semibold text-gray-800" data-id="s341we8lr" data-path="src/components/games/SpeedGame.tsx">
              {currentTrial.stimulus.instruction}
            </div>
            <div className="space-y-2" data-id="zpywuzkca" data-path="src/components/games/SpeedGame.tsx">
              {currentTrial.options?.map((option, index) =>
              <Button
                key={index}
                variant="outline"
                className="w-full"
                onClick={() => handleResponse(option)}
                disabled={!waitingForResponse} data-id="chgj2a3hr" data-path="src/components/games/SpeedGame.tsx">

                  {option}
                </Button>
              )}
            </div>
          </div>);


      default:
        return null;
    }
  };

  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'reaction':
        return <Zap className="w-4 h-4" data-id="i3ccpsxk0" data-path="src/components/games/SpeedGame.tsx" />;
      case 'comparison':
        return <Target className="w-4 h-4" data-id="wzm0lskml" data-path="src/components/games/SpeedGame.tsx" />;
      case 'arithmetic':
        return <span className="w-4 h-4 text-center font-bold" data-id="114qrflfz" data-path="src/components/games/SpeedGame.tsx">+</span>;
      case 'matching':
        return <span className="w-4 h-4 text-center" data-id="eslstttwk" data-path="src/components/games/SpeedGame.tsx">◇</span>;
    }
  };

  const getTaskTypeColor = (type: TaskType) => {
    switch (type) {
      case 'reaction':
        return 'bg-red-500';
      case 'comparison':
        return 'bg-blue-500';
      case 'arithmetic':
        return 'bg-green-500';
      case 'matching':
        return 'bg-purple-500';
    }
  };

  const renderPhaseContent = () => {
    switch (gamePhase) {
      case 'instruction':
        return (
          <div className="p-6 text-center space-y-4" data-id="makuqoi4l" data-path="src/components/games/SpeedGame.tsx">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto" data-id="kkty6adxt" data-path="src/components/games/SpeedGame.tsx">
              <Zap className="w-8 h-8 text-blue-600" data-id="xe7yhw1yb" data-path="src/components/games/SpeedGame.tsx" />
            </div>
            <div data-id="opkwvzpuy" data-path="src/components/games/SpeedGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="y781gbaax" data-path="src/components/games/SpeedGame.tsx">Speed Training</h3>
              <p className="text-gray-600 text-sm leading-relaxed" data-id="pspmb3wpx" data-path="src/components/games/SpeedGame.tsx">
                Test your processing speed with quick reaction tasks, comparisons, 
                arithmetic, and matching exercises. Respond as quickly and accurately as possible!
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-left" data-id="53j8yaxm6" data-path="src/components/games/SpeedGame.tsx">
              <div className="text-sm space-y-1" data-id="t0a0xa74b" data-path="src/components/games/SpeedGame.tsx">
                <div data-id="oj01k7kfc" data-path="src/components/games/SpeedGame.tsx"><strong data-id="6x5x2nz49" data-path="src/components/games/SpeedGame.tsx">Task Types:</strong> Reaction, Comparison, Math, Matching</div>
                <div data-id="gji68zv0t" data-path="src/components/games/SpeedGame.tsx"><strong data-id="ahcd6nfsy" data-path="src/components/games/SpeedGame.tsx">Total Trials:</strong> {totalTrials}</div>
                <div data-id="rqwbb98wr" data-path="src/components/games/SpeedGame.tsx"><strong data-id="1nssiify1" data-path="src/components/games/SpeedGame.tsx">Focus:</strong> Speed + Accuracy</div>
                <div data-id="cu3xsmzg2" data-path="src/components/games/SpeedGame.tsx"><strong data-id="vzgw9xrkt" data-path="src/components/games/SpeedGame.tsx">Difficulty:</strong> {difficulty}</div>
              </div>
            </div>
            <div className="flex justify-center gap-1 flex-wrap" data-id="mq70ecixk" data-path="src/components/games/SpeedGame.tsx">
              <Badge className="bg-red-500 text-white text-xs flex items-center gap-1" data-id="x4rb0rovp" data-path="src/components/games/SpeedGame.tsx">
                <Zap className="w-3 h-3" data-id="ewnhny5ex" data-path="src/components/games/SpeedGame.tsx" />
                Reaction
              </Badge>
              <Badge className="bg-blue-500 text-white text-xs flex items-center gap-1" data-id="6gk8vllb9" data-path="src/components/games/SpeedGame.tsx">
                <Target className="w-3 h-3" data-id="0y0tzeq94" data-path="src/components/games/SpeedGame.tsx" />
                Compare
              </Badge>
              <Badge className="bg-green-500 text-white text-xs" data-id="8s6vegqls" data-path="src/components/games/SpeedGame.tsx">Math</Badge>
              <Badge className="bg-purple-500 text-white text-xs" data-id="qnf5ilyyh" data-path="src/components/games/SpeedGame.tsx">Match</Badge>
            </div>
            <Button
              onClick={startGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-id="v2uf4dq0t" data-path="src/components/games/SpeedGame.tsx">

              <Timer className="w-4 h-4 mr-2" data-id="65cf7dv0f" data-path="src/components/games/SpeedGame.tsx" />
              Start Speed Training
            </Button>
          </div>);


      case 'playing':
        if (!currentTrial) return null;

        return (
          <div className="p-4 space-y-4" data-id="71ptmar3z" data-path="src/components/games/SpeedGame.tsx">
            <div className="flex justify-between items-center" data-id="7t00kyrr4" data-path="src/components/games/SpeedGame.tsx">
              <div data-id="9rktk9ehn" data-path="src/components/games/SpeedGame.tsx">
                <Badge className={`${getTaskTypeColor(currentTrial.type)} text-white flex items-center gap-1`} data-id="b46r7phi7" data-path="src/components/games/SpeedGame.tsx">
                  {getTaskTypeIcon(currentTrial.type)}
                  {currentTrial.type.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right" data-id="08b2cmy94" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-sm text-gray-600" data-id="4a769che2" data-path="src/components/games/SpeedGame.tsx">
                  Trial {currentTrialIndex + 1} of {totalTrials}
                </div>
                <div className="text-lg font-bold text-blue-600" data-id="3wknvtw1j" data-path="src/components/games/SpeedGame.tsx">{score}</div>
              </div>
            </div>
            
            <Progress
              value={currentTrialIndex / totalTrials * 100}
              className="h-2" data-id="6q5ver5ae" data-path="src/components/games/SpeedGame.tsx" />

            
            <Card className="bg-gray-50 min-h-48" data-id="przxl0onj" data-path="src/components/games/SpeedGame.tsx">
              <CardContent className="p-6 flex items-center justify-center" data-id="cbk5ixc3z" data-path="src/components/games/SpeedGame.tsx">
                {!showFeedback ?
                renderTrialContent() :

                <div className="text-center space-y-4" data-id="st9unad8o" data-path="src/components/games/SpeedGame.tsx">
                    <div className={`text-lg font-semibold ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`} data-id="k7y8ol7hp" data-path="src/components/games/SpeedGame.tsx">
                      {lastAnswerCorrect ?
                    <span className="flex items-center justify-center gap-2" data-id="2q797fwve" data-path="src/components/games/SpeedGame.tsx">
                          <CheckCircle className="w-6 h-6" data-id="nxh3hgh3v" data-path="src/components/games/SpeedGame.tsx" />
                          Correct!
                        </span> :

                    <span className="flex items-center justify-center gap-2" data-id="ri6vvx4hk" data-path="src/components/games/SpeedGame.tsx">
                          <XCircle className="w-6 h-6" data-id="rsfxwrl9l" data-path="src/components/games/SpeedGame.tsx" />
                          Incorrect
                        </span>
                    }
                    </div>
                    <div className="text-sm text-gray-600" data-id="88tt4nn0o" data-path="src/components/games/SpeedGame.tsx">
                      Reaction Time: {lastReactionTime}ms
                    </div>
                  </div>
                }
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4 text-center text-sm" data-id="sq23r3nyi" data-path="src/components/games/SpeedGame.tsx">
              <div data-id="a4oflz1yj" data-path="src/components/games/SpeedGame.tsx">
                <div className="font-semibold text-blue-600" data-id="fdpgcng8q" data-path="src/components/games/SpeedGame.tsx">{correctAnswers}</div>
                <div className="text-gray-500" data-id="dktwlblyl" data-path="src/components/games/SpeedGame.tsx">Correct</div>
              </div>
              <div data-id="m3zs8ndyx" data-path="src/components/games/SpeedGame.tsx">
                <div className="font-semibold text-blue-600" data-id="95e3mmm4n" data-path="src/components/games/SpeedGame.tsx">
                  {correctAnswers > 0 ? Math.round(totalReactionTime / correctAnswers) : 0}ms
                </div>
                <div className="text-gray-500" data-id="cnxtkbkgf" data-path="src/components/games/SpeedGame.tsx">Avg Speed</div>
              </div>
            </div>
          </div>);


      case 'completed':
        const accuracy = Math.round(correctAnswers / totalTrials * 100);
        const avgReactionTime = correctAnswers > 0 ? Math.round(totalReactionTime / correctAnswers) : 0;

        return (
          <div className="p-6 text-center space-y-4" data-id="ngt817rbn" data-path="src/components/games/SpeedGame.tsx">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto" data-id="i5ov7svio" data-path="src/components/games/SpeedGame.tsx">
              <CheckCircle className="w-8 h-8 text-blue-600" data-id="l6gin9md9" data-path="src/components/games/SpeedGame.tsx" />
            </div>
            <div data-id="3usba0ll5" data-path="src/components/games/SpeedGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="0fjm17wkc" data-path="src/components/games/SpeedGame.tsx">Speed Training Complete!</h3>
              <p className="text-gray-600 text-sm" data-id="y358qiix1" data-path="src/components/games/SpeedGame.tsx">
                You've completed all {totalTrials} speed trials. Fantastic reflexes!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center" data-id="ulkh0xysm" data-path="src/components/games/SpeedGame.tsx">
              <div data-id="msfp5uky1" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-xl font-bold text-blue-600" data-id="324jnsjqj" data-path="src/components/games/SpeedGame.tsx">{score}</div>
                <div className="text-xs text-gray-500" data-id="5ugik283z" data-path="src/components/games/SpeedGame.tsx">Final Score</div>
              </div>
              <div data-id="d4qqap158" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-xl font-bold text-blue-600" data-id="7h15wj481" data-path="src/components/games/SpeedGame.tsx">{accuracy}%</div>
                <div className="text-xs text-gray-500" data-id="y4h07pcn5" data-path="src/components/games/SpeedGame.tsx">Accuracy</div>
              </div>
              <div data-id="3k6abwhcr" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-xl font-bold text-blue-600" data-id="2iinwprx5" data-path="src/components/games/SpeedGame.tsx">{avgReactionTime}ms</div>
                <div className="text-xs text-gray-500" data-id="7j6qne6ll" data-path="src/components/games/SpeedGame.tsx">Avg Speed</div>
              </div>
              <div data-id="1ebllch8q" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-xl font-bold text-blue-600" data-id="k4k6g8etd" data-path="src/components/games/SpeedGame.tsx">{correctAnswers}/{totalTrials}</div>
                <div className="text-xs text-gray-500" data-id="vbljb7iuq" data-path="src/components/games/SpeedGame.tsx">Correct</div>
              </div>
            </div>
            <div className="text-sm text-gray-600" data-id="gftkwtjnq" data-path="src/components/games/SpeedGame.tsx">
              Processing results...
            </div>
          </div>);


      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-id="6429kmseu" data-path="src/components/games/SpeedGame.tsx">
      <CardContent className="p-0" data-id="ihuenm50y" data-path="src/components/games/SpeedGame.tsx">
        {renderPhaseContent()}
      </CardContent>
    </Card>);

};

export default SpeedGame;