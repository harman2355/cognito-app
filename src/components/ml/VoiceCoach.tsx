import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface VoiceCoachProps {
  gameType: string;
  currentLevel: number;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  performance?: {
    accuracy: number;
    score: number;
    streak: number;
  };
}

export const VoiceCoach: React.FC<VoiceCoachProps> = ({
  gameType,
  currentLevel,
  isEnabled,
  onToggle,
  performance
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const speechRecognition = useRef<any>(null);

  useEffect(() => {
    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
      setVoiceSupported(true);
    }

    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = 'en-US';

      speechRecognition.current.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setLastCommand(command);
        handleVoiceCommand(command);
      };

      speechRecognition.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);

  const speak = (text: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (!isEnabled || !speechSynthesis.current) return;

    // Cancel current speech for high priority messages
    if (priority === 'high') {
      speechSynthesis.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.7;

    // Choose voice based on priority
    const voices = speechSynthesis.current.getVoices();
    const preferredVoice = voices.find((voice) =>
    voice.name.includes('Google') || voice.name.includes('Microsoft')
    ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.current.speak(utterance);
  };

  const handleVoiceCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().trim();

    if (normalizedCommand.includes('help') || normalizedCommand.includes('instructions')) {
      provideGameInstructions();
    } else if (normalizedCommand.includes('hint') || normalizedCommand.includes('tip')) {
      provideHint();
    } else if (normalizedCommand.includes('repeat') || normalizedCommand.includes('again')) {
      repeatLastInstruction();
    } else if (normalizedCommand.includes('stats') || normalizedCommand.includes('score')) {
      providePerfomanceUpdate();
    } else {
      speak("I didn't understand that command. Try saying 'help', 'hint', 'repeat', or 'stats'.");
    }
  };

  const startListening = () => {
    if (!speechRecognition.current || isListening) return;

    setIsListening(true);
    speechRecognition.current.start();
  };

  const stopListening = () => {
    if (!speechRecognition.current || !isListening) return;

    speechRecognition.current.stop();
    setIsListening(false);
  };

  // Coaching Methods
  const provideGameInstructions = () => {
    const instructions = getGameInstructions(gameType);
    speak(instructions, 'high');
  };

  const provideHint = () => {
    const hints = getGameHints(gameType, currentLevel);
    speak(hints, 'medium');
  };

  const repeatLastInstruction = () => {
    const instruction = getLastInstruction(gameType);
    speak(instruction, 'medium');
  };

  const providePerfomanceUpdate = () => {
    if (performance) {
      const update = `Your current accuracy is ${Math.round(performance.accuracy)}%. 
                     Your score is ${performance.score}. 
                     ${performance.streak > 2 ? `Great job! You're on a ${performance.streak} correct streak!` : 'Keep going!'}`;
      speak(update, 'medium');
    }
  };

  // Adaptive Coaching Messages
  const provideEncouragement = (accuracyLevel: 'high' | 'medium' | 'low') => {
    const messages = {
      high: [
      "Excellent work! Your focus is sharp today.",
      "Outstanding! You're really mastering this challenge.",
      "Perfect! Your cognitive skills are improving."],

      medium: [
      "Good job! You're making steady progress.",
      "Nice work! Keep up that concentration.",
      "Well done! You're getting the hang of this."],

      low: [
      "Don't worry, everyone learns at their own pace.",
      "Take a deep breath and focus on the pattern.",
      "You've got this! Try to concentrate on one element at a time."]

    };

    const messageArray = messages[accuracyLevel];
    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    speak(randomMessage, 'medium');
  };

  const provideStrategy = (gameType: string, difficultyLevel: number) => {
    const strategies = getStrategies(gameType, difficultyLevel);
    speak(strategies, 'medium');
  };

  // Game-specific content
  const getGameInstructions = (gameType: string): string => {
    const instructions = {
      memory: "In this memory game, watch carefully as squares light up in sequence. Then, tap the squares in the exact same order. The pattern gets longer as you progress.",
      attention: "Focus on the target stimuli and ignore distractions. React quickly when you see the correct target appear.",
      problem_solving: "Use logical thinking to solve each puzzle. Break down complex problems into smaller steps.",
      flexibility: "Adapt to changing rules and patterns. Stay flexible in your thinking approach.",
      speed: "React as quickly as possible while maintaining accuracy. Speed and precision are both important."
    };
    return instructions[gameType as keyof typeof instructions] || "Follow the game instructions on screen.";
  };

  const getGameHints = (gameType: string, level: number): string => {
    const hints = {
      memory: level <= 2 ? "Try saying the sequence out loud as you watch it." : "Use visual associations to remember longer patterns.",
      attention: "Focus on the center and use your peripheral vision to catch targets.",
      problem_solving: "Start with what you know and work step by step.",
      flexibility: "When rules change, take a moment to understand the new pattern.",
      speed: "Find a rhythm and maintain steady, quick responses."
    };
    return hints[gameType as keyof typeof hints] || "Stay focused and take your time.";
  };

  const getLastInstruction = (gameType: string): string => {
    return `Remember: ${getGameInstructions(gameType)}`;
  };

  const getStrategies = (gameType: string, level: number): string => {
    if (gameType === 'memory' && level > 3) {
      return "For longer patterns, try grouping the sequence into chunks of 2 or 3 elements.";
    }
    if (gameType === 'attention' && level > 2) {
      return "As distractions increase, maintain focus on the center and trust your peripheral vision.";
    }
    return "Focus on accuracy first, then work on improving your speed.";
  };

  // Auto-coaching based on performance
  useEffect(() => {
    if (!isEnabled || !performance) return;

    const { accuracy, streak } = performance;

    if (streak >= 5) {
      provideEncouragement('high');
    } else if (accuracy < 50 && Math.random() < 0.3) {
      provideStrategy(gameType, currentLevel);
    }
  }, [performance?.streak, performance?.accuracy]);

  if (!voiceSupported) {
    return (
      <div className="text-sm text-gray-500 p-2" data-id="mt5dj73lw" data-path="src/components/ml/VoiceCoach.tsx">
        Voice coaching not supported in this browser
      </div>);

  }

  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200" data-id="qix5qdeda" data-path="src/components/ml/VoiceCoach.tsx">
      <div className="flex items-center justify-between mb-2" data-id="d002561wz" data-path="src/components/ml/VoiceCoach.tsx">
        <div className="flex items-center space-x-2" data-id="kvpow4h6e" data-path="src/components/ml/VoiceCoach.tsx">
          <div className="flex items-center space-x-1" data-id="l2pbowfyh" data-path="src/components/ml/VoiceCoach.tsx">
            <Volume2 className="h-4 w-4 text-blue-600" data-id="6jrr9q1j1" data-path="src/components/ml/VoiceCoach.tsx" />
            <span className="text-sm font-medium text-blue-700" data-id="74jswww14" data-path="src/components/ml/VoiceCoach.tsx">Voice Coach</span>
          </div>
          {isEnabled &&
          <Badge variant="secondary" className="text-xs" data-id="vcz8k2444" data-path="src/components/ml/VoiceCoach.tsx">
              Active
            </Badge>
          }
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggle(!isEnabled)}
          className="h-7" data-id="tixvpdtyu" data-path="src/components/ml/VoiceCoach.tsx">

          {isEnabled ?
          <Volume2 className="h-3 w-3" data-id="7s7w8zhz1" data-path="src/components/ml/VoiceCoach.tsx" /> :

          <VolumeX className="h-3 w-3" data-id="y6bn0k0s5" data-path="src/components/ml/VoiceCoach.tsx" />
          }
        </Button>
      </div>

      {isEnabled &&
      <div className="space-y-2" data-id="7d0y6ml7x" data-path="src/components/ml/VoiceCoach.tsx">
          <div className="flex items-center space-x-2" data-id="gx842kckm" data-path="src/components/ml/VoiceCoach.tsx">
            <Button
            variant="outline"
            size="sm"
            onClick={isListening ? stopListening : startListening}
            className="h-7 text-xs"
            disabled={!speechRecognition.current} data-id="anfevgh20" data-path="src/components/ml/VoiceCoach.tsx">

              {isListening ?
            <>
                  <MicOff className="h-3 w-3 mr-1" data-id="w3sp8a8le" data-path="src/components/ml/VoiceCoach.tsx" />
                  Stop
                </> :

            <>
                  <Mic className="h-3 w-3 mr-1" data-id="jz11uo3x8" data-path="src/components/ml/VoiceCoach.tsx" />
                  Listen
                </>
            }
            </Button>
            
            <Button
            variant="outline"
            size="sm"
            onClick={provideGameInstructions}
            className="h-7 text-xs" data-id="6jvvgcjoo" data-path="src/components/ml/VoiceCoach.tsx">

              Instructions
            </Button>
            
            <Button
            variant="outline"
            size="sm"
            onClick={provideHint}
            className="h-7 text-xs" data-id="noikr50yh" data-path="src/components/ml/VoiceCoach.tsx">

              Hint
            </Button>
          </div>

          {lastCommand &&
        <div className="text-xs text-gray-600 bg-white p-2 rounded border" data-id="oh3zkrcem" data-path="src/components/ml/VoiceCoach.tsx">
              Last command: "{lastCommand}"
            </div>
        }

          <div className="text-xs text-gray-500" data-id="huigh1axr" data-path="src/components/ml/VoiceCoach.tsx">
            Say "help", "hint", "repeat", or "stats"
          </div>
        </div>
      }
    </div>);

};

export default VoiceCoach;