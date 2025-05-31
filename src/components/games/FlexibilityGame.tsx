import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shuffle, ArrowLeftRight, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface FlexibilityGameProps {
  level: number;
  difficulty: string;
  onComplete: (result: {score: number;accuracy: number;time: number;}) => void;
  isPaused: boolean;
}

type GamePhase = 'instruction' | 'playing' | 'completed';
type TaskType = 'color' | 'shape' | 'number' | 'size';
type StimulusItem = {
  color: string;
  shape: string;
  number: number;
  size: 'small' | 'medium' | 'large';
};

interface Trial {
  stimulus: StimulusItem;
  currentTask: TaskType;
  options: string[];
  correctAnswer: number;
}

const FlexibilityGame: React.FC<FlexibilityGameProps> = ({ level, difficulty, onComplete, isPaused }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('instruction');
  const [currentTrial, setCurrentTrial] = useState<Trial | null>(null);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentTask, setCurrentTask] = useState<TaskType>('color');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [trialStartTime, setTrialStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(5000);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [taskSwitches, setTaskSwitches] = useState(0);

  const totalTrials = 15;
  const switchProbability = Math.min(0.3 + level * 0.1, 0.8); // 30% to 80% switch probability
  const trialTimeLimit = Math.max(5000 - level * 200, 2500); // 5s to 2.5s

  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'star'];
  const sizes = ['small', 'medium', 'large'];

  const difficultyModifiers = {
    easy: { timeMultiplier: 1.2, switchProbability: 0.8 },
    medium: { timeMultiplier: 1.0, switchProbability: 1.0 },
    hard: { timeMultiplier: 0.8, switchProbability: 1.2 },
    expert: { timeMultiplier: 0.6, switchProbability: 1.4 },
    master: { timeMultiplier: 0.5, switchProbability: 1.6 }
  };

  const currentDifficultyModifier = difficultyModifiers[difficulty as keyof typeof difficultyModifiers] || difficultyModifiers.medium;

  useEffect(() => {
    if (gamePhase === 'playing' && !isPaused && !showFeedback) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            handleAnswerSubmit(null);
            return trialTimeLimit;
          }
          return newTime;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [gamePhase, isPaused, showFeedback, trialTimeLimit]);

  const generateStimulus = useCallback((): StimulusItem => {
    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      number: Math.floor(Math.random() * 9) + 1, // 1-9
      size: sizes[Math.floor(Math.random() * sizes.length)] as 'small' | 'medium' | 'large'
    };
  }, []);

  const generateTrial = useCallback((taskType: TaskType, stimulus: StimulusItem): Trial => {
    let options: string[] = [];
    let correctAnswer: number = 0;

    switch (taskType) {
      case 'color':
        options = [...colors];
        correctAnswer = colors.indexOf(stimulus.color);
        break;
      case 'shape':
        options = [...shapes];
        correctAnswer = shapes.indexOf(stimulus.shape);
        break;
      case 'number':
        options = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        correctAnswer = stimulus.number - 1;
        break;
      case 'size':
        options = [...sizes];
        correctAnswer = sizes.indexOf(stimulus.size);
        break;
    }

    // Shuffle options while keeping track of correct answer
    const shuffledOptions = [...options];
    const correctValue = options[correctAnswer];

    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    correctAnswer = shuffledOptions.indexOf(correctValue);

    return {
      stimulus,
      currentTask: taskType,
      options: shuffledOptions,
      correctAnswer
    };
  }, []);

  const getNextTask = useCallback((currentTask: TaskType, trialIndex: number): TaskType => {
    if (trialIndex === 0) return 'color'; // Start with color

    const shouldSwitch = Math.random() < switchProbability * currentDifficultyModifier.switchProbability;

    if (shouldSwitch) {
      const tasks: TaskType[] = ['color', 'shape', 'number', 'size'];
      const availableTasks = tasks.filter((task) => task !== currentTask);
      return availableTasks[Math.floor(Math.random() * availableTasks.length)];
    }

    return currentTask;
  }, [switchProbability, currentDifficultyModifier]);

  const startGame = () => {
    setGamePhase('playing');
    setStartTime(Date.now());
    setCurrentTrialIndex(0);
    setCurrentTask('color');
    startTrial(0, 'color');
  };

  const startTrial = (trialIndex: number, taskType: TaskType) => {
    const stimulus = generateStimulus();
    const trial = generateTrial(taskType, stimulus);

    setCurrentTrial(trial);
    setTimeRemaining(Math.floor(trialTimeLimit * currentDifficultyModifier.timeMultiplier));
    setTrialStartTime(Date.now());
    setShowFeedback(false);
  };

  const handleAnswerSubmit = (answerIndex: number | null) => {
    if (!currentTrial) return;

    const isCorrect = answerIndex === currentTrial.correctAnswer;
    const timeTaken = Date.now() - trialStartTime;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      const timeBonus = Math.max(trialTimeLimit - timeTaken, 0) / 50;
      const trialScore = Math.floor(50 + timeBonus);
      setScore((prev) => prev + trialScore);
    }

    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentTrialIndex < totalTrials - 1) {
        nextTrial();
      } else {
        completeGame();
      }
    }, 1500);
  };

  const nextTrial = () => {
    const nextIndex = currentTrialIndex + 1;
    const nextTask = getNextTask(currentTask, nextIndex);

    if (nextTask !== currentTask) {
      setTaskSwitches((prev) => prev + 1);
    }

    setCurrentTrialIndex(nextIndex);
    setCurrentTask(nextTask);
    startTrial(nextIndex, nextTask);
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

  const renderStimulus = (stimulus: StimulusItem) => {
    const colorMap: {[key: string]: string;} = {
      red: '#EF4444',
      blue: '#3B82F6',
      green: '#10B981',
      yellow: '#F59E0B',
      purple: '#8B5CF6'
    };

    const sizeMap = {
      small: 'w-8 h-8',
      medium: 'w-12 h-12',
      large: 'w-16 h-16'
    };

    const shapeStyle = {
      color: colorMap[stimulus.color]
    };

    const renderShape = () => {
      const className = `${sizeMap[stimulus.size]} mx-auto`;

      switch (stimulus.shape) {
        case 'circle':
          return <div className={`${className} rounded-full`} style={{ backgroundColor: shapeStyle.color }} data-id="r8wsrk00p" data-path="src/components/games/FlexibilityGame.tsx" />;
        case 'square':
          return <div className={className} style={{ backgroundColor: shapeStyle.color }} data-id="hl2d637q7" data-path="src/components/games/FlexibilityGame.tsx" />;
        case 'triangle':
          return (
            <div className={className} style={{
              width: 0,
              height: 0,
              borderLeft: '20px solid transparent',
              borderRight: '20px solid transparent',
              borderBottom: `40px solid ${shapeStyle.color}`
            }} data-id="5tungnrx8" data-path="src/components/games/FlexibilityGame.tsx" />);

        case 'diamond':
          return (
            <div className={className} style={{
              backgroundColor: shapeStyle.color,
              transform: 'rotate(45deg)'
            }} data-id="ahxt9o5cb" data-path="src/components/games/FlexibilityGame.tsx" />);

        case 'star':
          return <div className={`${className} text-4xl flex items-center justify-center`} style={{ color: shapeStyle.color }} data-id="tf5cxebwi" data-path="src/components/games/FlexibilityGame.tsx">★</div>;
        default:
          return <div className={className} style={{ backgroundColor: shapeStyle.color }} data-id="0a1mlqt6i" data-path="src/components/games/FlexibilityGame.tsx" />;
      }
    };

    return (
      <div className="text-center space-y-2" data-id="b5m8kwmjo" data-path="src/components/games/FlexibilityGame.tsx">
        <div className="flex justify-center items-center h-20" data-id="4w2m96qln" data-path="src/components/games/FlexibilityGame.tsx">
          {renderShape()}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600" data-id="dm0f2oco8" data-path="src/components/games/FlexibilityGame.tsx">
          <div data-id="nk7mmum4b" data-path="src/components/games/FlexibilityGame.tsx">Numbers: {stimulus.number}</div>
        </div>
      </div>);

  };

  const getTaskInstructions = (task: TaskType) => {
    switch (task) {
      case 'color':
        return 'Select the COLOR of the object';
      case 'shape':
        return 'Select the SHAPE of the object';
      case 'number':
        return 'Select the NUMBER shown';
      case 'size':
        return 'Select the SIZE of the object';
    }
  };

  const getTaskColor = (task: TaskType) => {
    switch (task) {
      case 'color':
        return 'bg-red-500';
      case 'shape':
        return 'bg-blue-500';
      case 'number':
        return 'bg-green-500';
      case 'size':
        return 'bg-purple-500';
    }
  };

  const renderPhaseContent = () => {
    switch (gamePhase) {
      case 'instruction':
        return (
          <div className="p-6 text-center space-y-4" data-id="ng1qn96yh" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto" data-id="gh7g08o30" data-path="src/components/games/FlexibilityGame.tsx">
              <Shuffle className="w-8 h-8 text-green-600" data-id="3gwvez7rv" data-path="src/components/games/FlexibilityGame.tsx" />
            </div>
            <div data-id="1zvo59xj4" data-path="src/components/games/FlexibilityGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="ho2i8ta7y" data-path="src/components/games/FlexibilityGame.tsx">Mental Flexibility Training</h3>
              <p className="text-gray-600 text-sm leading-relaxed" data-id="neayzkeok" data-path="src/components/games/FlexibilityGame.tsx">
                Switch between different tasks quickly! Pay attention to the current task instruction 
                and respond accordingly. The task may change between trials.
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-left" data-id="pjr8x5n15" data-path="src/components/games/FlexibilityGame.tsx">
              <div className="text-sm space-y-1" data-id="7b0eh4zyh" data-path="src/components/games/FlexibilityGame.tsx">
                <div data-id="0nwamssdy" data-path="src/components/games/FlexibilityGame.tsx"><strong data-id="mcj8jk200" data-path="src/components/games/FlexibilityGame.tsx">Task Types:</strong> Color, Shape, Number, Size</div>
                <div data-id="h716msedb" data-path="src/components/games/FlexibilityGame.tsx"><strong data-id="g612hiv8q" data-path="src/components/games/FlexibilityGame.tsx">Total Trials:</strong> {totalTrials}</div>
                <div data-id="b1ikpqzjn" data-path="src/components/games/FlexibilityGame.tsx"><strong data-id="fl6yz6jsn" data-path="src/components/games/FlexibilityGame.tsx">Switch Probability:</strong> {Math.round(switchProbability * 100)}%</div>
                <div data-id="6ncgo5iqi" data-path="src/components/games/FlexibilityGame.tsx"><strong data-id="wq5b2ajit" data-path="src/components/games/FlexibilityGame.tsx">Time per trial:</strong> {Math.round(trialTimeLimit * currentDifficultyModifier.timeMultiplier / 1000)}s</div>
              </div>
            </div>
            <div className="flex justify-center gap-1 flex-wrap" data-id="85a33ee1o" data-path="src/components/games/FlexibilityGame.tsx">
              <Badge className="bg-red-500 text-white text-xs" data-id="fb2o9omwn" data-path="src/components/games/FlexibilityGame.tsx">Color</Badge>
              <Badge className="bg-blue-500 text-white text-xs" data-id="4s6h68qni" data-path="src/components/games/FlexibilityGame.tsx">Shape</Badge>
              <Badge className="bg-green-500 text-white text-xs" data-id="okpbyz5na" data-path="src/components/games/FlexibilityGame.tsx">Number</Badge>
              <Badge className="bg-purple-500 text-white text-xs" data-id="vtp16jm34" data-path="src/components/games/FlexibilityGame.tsx">Size</Badge>
            </div>
            <Button
              onClick={startGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white" data-id="fi4w2iw46" data-path="src/components/games/FlexibilityGame.tsx">

              <ArrowLeftRight className="w-4 h-4 mr-2" data-id="sjc758m3x" data-path="src/components/games/FlexibilityGame.tsx" />
              Start Flexibility Training
            </Button>
          </div>);


      case 'playing':
        if (!currentTrial) return null;

        return (
          <div className="p-4 space-y-4" data-id="syoklmpqq" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="flex justify-between items-center" data-id="i5tclse1q" data-path="src/components/games/FlexibilityGame.tsx">
              <div data-id="1ayi3ev4g" data-path="src/components/games/FlexibilityGame.tsx">
                <Badge className={`${getTaskColor(currentTask)} text-white flex items-center gap-1`} data-id="fl9y7p8lz" data-path="src/components/games/FlexibilityGame.tsx">
                  <RefreshCw className="w-3 h-3" data-id="qsvuyw9q5" data-path="src/components/games/FlexibilityGame.tsx" />
                  {currentTask.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right" data-id="eqt7n9qoz" data-path="src/components/games/FlexibilityGame.tsx">
                <div className="text-sm text-gray-600" data-id="eurj13pen" data-path="src/components/games/FlexibilityGame.tsx">
                  Trial {currentTrialIndex + 1} of {totalTrials}
                </div>
                <div className="text-lg font-bold text-green-600" data-id="fb3z9cfiv" data-path="src/components/games/FlexibilityGame.tsx">{score}</div>
              </div>
            </div>
            
            <div className="space-y-2" data-id="tqx9kg661" data-path="src/components/games/FlexibilityGame.tsx">
              <div className="flex justify-between text-sm" data-id="m6r86wkqd" data-path="src/components/games/FlexibilityGame.tsx">
                <span data-id="zf886gv2v" data-path="src/components/games/FlexibilityGame.tsx">Time Remaining</span>
                <span className={timeRemaining < 2000 ? 'text-red-600 font-bold' : 'text-gray-600'} data-id="unf2nc8s8" data-path="src/components/games/FlexibilityGame.tsx">
                  {Math.ceil(timeRemaining / 1000)}s
                </span>
              </div>
              <Progress
                value={timeRemaining / (trialTimeLimit * currentDifficultyModifier.timeMultiplier) * 100}
                className={`h-2 ${timeRemaining < 2000 ? 'bg-red-100' : ''}`} data-id="jtm4g3o95" data-path="src/components/games/FlexibilityGame.tsx" />

            </div>
            
            <Card className="bg-gray-50" data-id="f4g6aagzz" data-path="src/components/games/FlexibilityGame.tsx">
              <CardContent className="p-4" data-id="rand71257" data-path="src/components/games/FlexibilityGame.tsx">
                <div className="text-center mb-3" data-id="6pqi22kiq" data-path="src/components/games/FlexibilityGame.tsx">
                  <h4 className="font-semibold text-gray-800" data-id="u57dbk3gy" data-path="src/components/games/FlexibilityGame.tsx">
                    {getTaskInstructions(currentTask)}
                  </h4>
                </div>
                {renderStimulus(currentTrial.stimulus)}
              </CardContent>
            </Card>
            
            {!showFeedback ?
            <div className="grid grid-cols-2 gap-2" data-id="d4tdno8un" data-path="src/components/games/FlexibilityGame.tsx">
                {currentTrial.options.map((option, index) =>
              <Button
                key={index}
                variant="outline"
                className="p-3 text-center"
                onClick={() => handleAnswerSubmit(index)} data-id="wlgudjv6m" data-path="src/components/games/FlexibilityGame.tsx">

                    {option}
                  </Button>
              )}
              </div> :

            <div className="space-y-3" data-id="nyjh7p76o" data-path="src/components/games/FlexibilityGame.tsx">
                <div className="grid grid-cols-2 gap-2" data-id="q0x0b4rvv" data-path="src/components/games/FlexibilityGame.tsx">
                  {currentTrial.options.map((option, index) => {
                  let buttonClass = "p-3 text-center ";
                  if (index === currentTrial.correctAnswer) {
                    buttonClass += "bg-green-100 border-green-500 text-green-800";
                  } else {
                    buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={buttonClass}
                      disabled data-id="vgdxeh5az" data-path="src/components/games/FlexibilityGame.tsx">

                        {option}
                        {index === currentTrial.correctAnswer &&
                      <CheckCircle className="w-4 h-4 ml-2 inline text-green-600" data-id="7zsmjvkfw" data-path="src/components/games/FlexibilityGame.tsx" />
                      }
                      </Button>);

                })}
                </div>
                
                <Card className={lastAnswerCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} data-id="ooclze5h7" data-path="src/components/games/FlexibilityGame.tsx">
                  <CardContent className="p-3 text-center" data-id="be2prv8pz" data-path="src/components/games/FlexibilityGame.tsx">
                    <div className={`text-sm font-semibold ${lastAnswerCorrect ? 'text-green-800' : 'text-red-800'}`} data-id="8v9znby3j" data-path="src/components/games/FlexibilityGame.tsx">
                      {lastAnswerCorrect ?
                    <span className="flex items-center justify-center gap-1" data-id="2uipcnayh" data-path="src/components/games/FlexibilityGame.tsx">
                          <CheckCircle className="w-4 h-4" data-id="6xxlye7nk" data-path="src/components/games/FlexibilityGame.tsx" />
                          Correct!
                        </span> :

                    <span className="flex items-center justify-center gap-1" data-id="3if0mw4vh" data-path="src/components/games/FlexibilityGame.tsx">
                          <XCircle className="w-4 h-4" data-id="7ugubc9zm" data-path="src/components/games/FlexibilityGame.tsx" />
                          Incorrect
                        </span>
                    }
                    </div>
                  </CardContent>
                </Card>
              </div>
            }
            
            <div className="text-center text-xs text-gray-500" data-id="05qnmkk1z" data-path="src/components/games/FlexibilityGame.tsx">
              Task switches: {taskSwitches}
            </div>
          </div>);


      case 'completed':
        const accuracy = Math.round(correctAnswers / totalTrials * 100);
        const switchCost = taskSwitches > 0 ? Math.round(score / taskSwitches) : 0;

        return (
          <div className="p-6 text-center space-y-4" data-id="4to1gysoo" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto" data-id="nigezpwde" data-path="src/components/games/FlexibilityGame.tsx">
              <CheckCircle className="w-8 h-8 text-green-600" data-id="exwbuinrv" data-path="src/components/games/FlexibilityGame.tsx" />
            </div>
            <div data-id="xk2ew6him" data-path="src/components/games/FlexibilityGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="qlecp9znw" data-path="src/components/games/FlexibilityGame.tsx">Training Complete!</h3>
              <p className="text-gray-600 text-sm" data-id="kmi5ov0mx" data-path="src/components/games/FlexibilityGame.tsx">
                You've completed all {totalTrials} flexibility trials. Excellent work!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center" data-id="819y271mv" data-path="src/components/games/FlexibilityGame.tsx">
              <div data-id="wznxozv7i" data-path="src/components/games/FlexibilityGame.tsx">
                <div className="text-xl font-bold text-green-600" data-id="ye4jmuur2" data-path="src/components/games/FlexibilityGame.tsx">{score}</div>
                <div className="text-xs text-gray-500" data-id="l7s8r35vl" data-path="src/components/games/FlexibilityGame.tsx">Final Score</div>
              </div>
              <div data-id="qsoqolgae" data-path="src/components/games/FlexibilityGame.tsx">
                <div className="text-xl font-bold text-green-600" data-id="enz9t1c6g" data-path="src/components/games/FlexibilityGame.tsx">{accuracy}%</div>
                <div className="text-xs text-gray-500" data-id="aeju4g8if" data-path="src/components/games/FlexibilityGame.tsx">Accuracy</div>
              </div>
              <div data-id="9aign7mcb" data-path="src/components/games/FlexibilityGame.tsx">
                <div className="text-xl font-bold text-green-600" data-id="73dgbyau1" data-path="src/components/games/FlexibilityGame.tsx">{taskSwitches}</div>
                <div className="text-xs text-gray-500" data-id="ypmcb79uz" data-path="src/components/games/FlexibilityGame.tsx">Task Switches</div>
              </div>
              <div data-id="30ec7nsgm" data-path="src/components/games/FlexibilityGame.tsx">
                <div className="text-xl font-bold text-green-600" data-id="u5khndj74" data-path="src/components/games/FlexibilityGame.tsx">{correctAnswers}/{totalTrials}</div>
                <div className="text-xs text-gray-500" data-id="nhfk9slyt" data-path="src/components/games/FlexibilityGame.tsx">Correct</div>
              </div>
            </div>
            <div className="text-sm text-gray-600" data-id="4xevlfjia" data-path="src/components/games/FlexibilityGame.tsx">
              Processing results...
            </div>
          </div>);


      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-id="r3ta10ddz" data-path="src/components/games/FlexibilityGame.tsx">
      <CardContent className="p-0" data-id="hwybo392f" data-path="src/components/games/FlexibilityGame.tsx">
        {renderPhaseContent()}
      </CardContent>
    </Card>);

};

export default FlexibilityGame;