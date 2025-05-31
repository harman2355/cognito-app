import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff } from 'lucide-react';

interface MemoryGameProps {
  level: number;
  difficulty: string;
  onComplete: (result: {score: number;accuracy: number;time: number;}) => void;
  isPaused: boolean;
}

type GamePhase = 'instruction' | 'memorize' | 'recall' | 'result';

const MemoryGame: React.FC<MemoryGameProps> = ({ level, difficulty, onComplete, isPaused }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('instruction');
  const [currentRound, setCurrentRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameTime, setGameTime] = useState(0);

  const gridSize = Math.min(3 + Math.floor(level / 2), 6); // 3x3 to 6x6 grid
  const sequenceLength = Math.min(3 + level + Math.floor(difficulty === 'hard' ? 2 : difficulty === 'expert' ? 4 : difficulty === 'master' ? 6 : 0), 12);
  const totalRounds = 5;
  const memorizeTime = Math.max(2000 - level * 100, 1000); // 2s to 1s

  useEffect(() => {
    if (gamePhase === 'instruction') {
      setStartTime(Date.now());
    }
  }, [gamePhase]);

  useEffect(() => {
    if (!isPaused && (gamePhase === 'memorize' || gamePhase === 'recall')) {
      const timer = setInterval(() => {
        setGameTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isPaused, gamePhase, startTime]);

  const generateSequence = useCallback(() => {
    const newSequence: number[] = [];
    const maxIndex = gridSize * gridSize;

    for (let i = 0; i < sequenceLength; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * maxIndex);
      } while (newSequence.includes(randomIndex));
      newSequence.push(randomIndex);
    }

    return newSequence;
  }, [gridSize, sequenceLength]);

  const startRound = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setPlayerSequence([]);
    setGamePhase('memorize');
    setShowingSequence(true);

    // Show sequence
    let currentIndex = 0;
    const showNextInSequence = () => {
      if (currentIndex < newSequence.length) {
        setActiveIndex(newSequence[currentIndex]);
        setTimeout(() => {
          setActiveIndex(null);
          currentIndex++;
          setTimeout(showNextInSequence, 200);
        }, 600);
      } else {
        setTimeout(() => {
          setShowingSequence(false);
          setGamePhase('recall');
        }, 500);
      }
    };

    setTimeout(showNextInSequence, 1000);
  };

  const handleTileClick = (index: number) => {
    if (gamePhase !== 'recall' || isPaused) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check if correct so far
    const isCorrect = sequence[newPlayerSequence.length - 1] === index;

    if (!isCorrect) {
      // Wrong answer - end round
      evaluateRound(newPlayerSequence);
    } else if (newPlayerSequence.length === sequence.length) {
      // Complete sequence correct
      evaluateRound(newPlayerSequence);
    }
  };

  const evaluateRound = (playerSeq: number[]) => {
    const correctCount = playerSeq.filter((value, index) => value === sequence[index]).length;
    const roundScore = Math.floor(correctCount / sequence.length * 100 * (level * 0.5 + 1));

    setScore((prev) => prev + roundScore);
    if (correctCount === sequence.length) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setGamePhase('result');

    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound((prev) => prev + 1);
        setGamePhase('memorize');
        startRound();
      } else {
        // Game complete
        const finalTime = Date.now() - startTime;
        const accuracy = Math.round((correctAnswers + (correctCount === sequence.length ? 1 : 0)) / totalRounds * 100);
        onComplete({
          score: score + roundScore,
          accuracy,
          time: finalTime
        });
      }
    }, 2000);
  };

  const renderGrid = () => {
    const tiles = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const isActive = activeIndex === i;
      const isInPlayerSequence = playerSequence.includes(i);
      const isInCorrectSequence = sequence.includes(i);

      let tileColor = 'bg-gray-200 hover:bg-gray-300';

      if (gamePhase === 'recall') {
        if (isInPlayerSequence) {
          const playerIndex = playerSequence.indexOf(i);
          const isCorrectPosition = sequence[playerIndex] === i;
          tileColor = isCorrectPosition ? 'bg-green-400' : 'bg-red-400';
        } else {
          tileColor = 'bg-blue-100 hover:bg-blue-200 cursor-pointer';
        }
      } else if (gamePhase === 'result') {
        if (isInCorrectSequence) {
          tileColor = 'bg-green-400';
        }
      }

      if (isActive && showingSequence) {
        tileColor = 'bg-purple-500';
      }

      tiles.push(
        <button
          key={i}
          className={`aspect-square rounded-lg transition-all duration-300 ${tileColor} ${
          gamePhase === 'recall' && !isInPlayerSequence ? 'transform hover:scale-105' : ''}`
          }
          onClick={() => handleTileClick(i)}
          disabled={gamePhase !== 'recall' || isPaused} data-id="1gdvf76nb" data-path="src/components/games/MemoryGame.tsx">

          {gamePhase === 'result' && isInCorrectSequence &&
          <span className="text-white font-bold" data-id="cw63orsfa" data-path="src/components/games/MemoryGame.tsx">{sequence.indexOf(i) + 1}</span>
          }
        </button>
      );
    }

    return (
      <div
        className={`grid gap-2 p-4`}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }} data-id="496k68a9p" data-path="src/components/games/MemoryGame.tsx">

        {tiles}
      </div>);

  };

  const renderPhaseContent = () => {
    switch (gamePhase) {
      case 'instruction':
        return (
          <div className="p-6 text-center space-y-4" data-id="zr7foy4tm" data-path="src/components/games/MemoryGame.tsx">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto" data-id="6tyyb03jg" data-path="src/components/games/MemoryGame.tsx">
              <Eye className="w-8 h-8 text-purple-600" data-id="zjaof8yah" data-path="src/components/games/MemoryGame.tsx" />
            </div>
            <div data-id="eg9kmcrd6" data-path="src/components/games/MemoryGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="chpd3iyzr" data-path="src/components/games/MemoryGame.tsx">Memory Challenge</h3>
              <p className="text-gray-600 text-sm leading-relaxed" data-id="9zb2pd7xa" data-path="src/components/games/MemoryGame.tsx">
                Watch the sequence of tiles that light up, then tap them in the same order. 
                Each round gets progressively harder!
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-left" data-id="wgy8vt8q1" data-path="src/components/games/MemoryGame.tsx">
              <div className="text-sm space-y-1" data-id="4jh2usoqo" data-path="src/components/games/MemoryGame.tsx">
                <div data-id="ryj52qy43" data-path="src/components/games/MemoryGame.tsx"><strong data-id="iltr6jgc6" data-path="src/components/games/MemoryGame.tsx">Level:</strong> {level}</div>
                <div data-id="repglji13" data-path="src/components/games/MemoryGame.tsx"><strong data-id="bi9ryy9mq" data-path="src/components/games/MemoryGame.tsx">Grid Size:</strong> {gridSize}×{gridSize}</div>
                <div data-id="6qj326pnr" data-path="src/components/games/MemoryGame.tsx"><strong data-id="h31ifhb4w" data-path="src/components/games/MemoryGame.tsx">Sequence Length:</strong> {sequenceLength}</div>
                <div data-id="u6dhvv1jp" data-path="src/components/games/MemoryGame.tsx"><strong data-id="ifkmecbn9" data-path="src/components/games/MemoryGame.tsx">Rounds:</strong> {totalRounds}</div>
              </div>
            </div>
            <Button
              onClick={startRound}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white" data-id="zxxuq01ig" data-path="src/components/games/MemoryGame.tsx">

              Start Memory Challenge
            </Button>
          </div>);


      case 'memorize':
        return (
          <div className="p-4 space-y-4" data-id="dtab4dltc" data-path="src/components/games/MemoryGame.tsx">
            <div className="text-center" data-id="twfhazsob" data-path="src/components/games/MemoryGame.tsx">
              <Badge className="bg-blue-500 text-white mb-2" data-id="dy4xcrkvh" data-path="src/components/games/MemoryGame.tsx">
                {showingSequence ? 'Memorize the sequence...' : 'Get ready...'}
              </Badge>
              <div className="text-sm text-gray-600" data-id="9lybohuoz" data-path="src/components/games/MemoryGame.tsx">
                Round {currentRound} of {totalRounds}
              </div>
            </div>
            {renderGrid()}
            <div className="text-center text-xs text-gray-500" data-id="jy3st423d" data-path="src/components/games/MemoryGame.tsx">
              Watch carefully - the sequence will only be shown once!
            </div>
          </div>);


      case 'recall':
        return (
          <div className="p-4 space-y-4" data-id="j7d78om06" data-path="src/components/games/MemoryGame.tsx">
            <div className="text-center" data-id="r4q326dhd" data-path="src/components/games/MemoryGame.tsx">
              <Badge className="bg-green-500 text-white mb-2" data-id="m9ya7c1cf" data-path="src/components/games/MemoryGame.tsx">
                <EyeOff className="w-4 h-4 mr-1" data-id="481e386o0" data-path="src/components/games/MemoryGame.tsx" />
                Tap the tiles in order
              </Badge>
              <div className="text-sm text-gray-600" data-id="ld2hsea99" data-path="src/components/games/MemoryGame.tsx">
                {playerSequence.length} of {sequence.length} tiles
              </div>
              <Progress
                value={playerSequence.length / sequence.length * 100}
                className="mt-2 h-2" data-id="29wng1x10" data-path="src/components/games/MemoryGame.tsx" />

            </div>
            {renderGrid()}
            <div className="text-center text-xs text-gray-500" data-id="hma2jgf56" data-path="src/components/games/MemoryGame.tsx">
              Tap the tiles in the same order you saw them light up
            </div>
          </div>);


      case 'result':
        const wasCorrect = playerSequence.length === sequence.length &&
        playerSequence.every((value, index) => value === sequence[index]);

        return (
          <div className="p-4 space-y-4" data-id="51k8gex33" data-path="src/components/games/MemoryGame.tsx">
            <div className="text-center" data-id="qzpocukqj" data-path="src/components/games/MemoryGame.tsx">
              <Badge className={wasCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"} data-id="kwvb3imgn" data-path="src/components/games/MemoryGame.tsx">
                {wasCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </Badge>
              <div className="text-sm text-gray-600 mt-2" data-id="bom9xa0yi" data-path="src/components/games/MemoryGame.tsx">
                Round {currentRound} of {totalRounds}
              </div>
            </div>
            {renderGrid()}
            <div className="text-center" data-id="tplsosyhu" data-path="src/components/games/MemoryGame.tsx">
              <div className="text-sm text-gray-600" data-id="vmjqq2eca" data-path="src/components/games/MemoryGame.tsx">
                {wasCorrect ?
                'Perfect! Moving to next round...' :
                'The correct sequence is highlighted above'
                }
              </div>
              <div className="text-lg font-bold text-purple-600 mt-2" data-id="729mgygmj" data-path="src/components/games/MemoryGame.tsx">
                Score: {score}
              </div>
            </div>
          </div>);


      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-id="vo500i3d9" data-path="src/components/games/MemoryGame.tsx">
      <CardContent className="p-0" data-id="tsqjg8qgf" data-path="src/components/games/MemoryGame.tsx">
        {renderPhaseContent()}
      </CardContent>
    </Card>);

};

export default MemoryGame;