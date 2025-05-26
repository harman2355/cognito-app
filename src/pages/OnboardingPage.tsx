import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Brain, Target, Users, Calendar } from 'lucide-react';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    goals: [] as string[],
    experience: ''
  });

  const totalSteps = 4;
  const progressValue = step / totalSteps * 100;

  const goalOptions = [
  'Improve Memory',
  'Enhance Focus',
  'Boost Problem Solving',
  'Increase Mental Speed',
  'Better Concentration',
  'Brain Health'];


  const handleGoalToggle = (goal: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ?
      prev.goals.filter((g) => g !== goal) :
      [...prev.goals, goal]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    completeOnboarding({
      name: profile.name,
      age: parseInt(profile.age) || 25,
      goals: profile.goals
    });
    navigate('/');
  };

  const canProceed = () => {
    switch (step) {
      case 1:return true; // Welcome step
      case 2:return profile.name.trim().length > 0;
      case 3:return profile.age.trim().length > 0;
      case 4:return profile.goals.length > 0;
      default:return false;
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center" data-id="f3mme2imy" data-path="src/pages/OnboardingPage.tsx">
      <div className="w-full max-w-md space-y-6" data-id="784fwnr86" data-path="src/pages/OnboardingPage.tsx">
        {/* Progress Bar */}
        <div className="space-y-2" data-id="ljqkgw4ui" data-path="src/pages/OnboardingPage.tsx">
          <div className="flex justify-between text-sm text-gray-600" data-id="hbg22lw1r" data-path="src/pages/OnboardingPage.tsx">
            <span data-id="alvhq9kpa" data-path="src/pages/OnboardingPage.tsx">Step {step} of {totalSteps}</span>
            <span data-id="yfsu07mhm" data-path="src/pages/OnboardingPage.tsx">{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" data-id="zti05ea7j" data-path="src/pages/OnboardingPage.tsx" />
        </div>

        {/* Step Content */}
        <Card className="border-2 border-purple-100" data-id="zn7gak0oo" data-path="src/pages/OnboardingPage.tsx">
          <CardHeader className="text-center" data-id="n2a5kt32l" data-path="src/pages/OnboardingPage.tsx">
            <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit" data-id="4l235y2sg" data-path="src/pages/OnboardingPage.tsx">
              {step === 1 && <Brain className="h-8 w-8 text-purple-600" data-id="xxny18x97" data-path="src/pages/OnboardingPage.tsx" />}
              {step === 2 && <Users className="h-8 w-8 text-purple-600" data-id="scq2furzy" data-path="src/pages/OnboardingPage.tsx" />}
              {step === 3 && <Calendar className="h-8 w-8 text-purple-600" data-id="abdk524qu" data-path="src/pages/OnboardingPage.tsx" />}
              {step === 4 && <Target className="h-8 w-8 text-purple-600" data-id="5yyfxwhj0" data-path="src/pages/OnboardingPage.tsx" />}
            </div>
            <CardTitle className="text-2xl text-purple-700" data-id="blzo87k41" data-path="src/pages/OnboardingPage.tsx">
              {step === 1 && 'Welcome to Cognito!'}
              {step === 2 && 'What\'s your name?'}
              {step === 3 && 'How old are you?'}
              {step === 4 && 'What are your goals?'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6" data-id="sueae9r56" data-path="src/pages/OnboardingPage.tsx">
            {step === 1 &&
            <div className="text-center space-y-4" data-id="nax94gtxh" data-path="src/pages/OnboardingPage.tsx">
                <p className="text-gray-600" data-id="5mrq1mq9y" data-path="src/pages/OnboardingPage.tsx">
                  Train your brain with scientifically-backed exercises designed to improve 
                  memory, attention, problem-solving, and more!
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg" data-id="xxz33bx0x" data-path="src/pages/OnboardingPage.tsx">
                  <h3 className="font-semibold text-purple-700 mb-2" data-id="fsycl6qbb" data-path="src/pages/OnboardingPage.tsx">What you'll get:</h3>
                  <ul className="text-sm text-gray-600 space-y-1" data-id="eh9qxr18t" data-path="src/pages/OnboardingPage.tsx">
                    <li data-id="lyzrbq4gx" data-path="src/pages/OnboardingPage.tsx">• Personalized brain training workouts</li>
                    <li data-id="y7a77jog9" data-path="src/pages/OnboardingPage.tsx">• Progress tracking and analytics</li>
                    <li data-id="xcrzpn94i" data-path="src/pages/OnboardingPage.tsx">• Daily challenges and streaks</li>
                    <li data-id="4xepdceoz" data-path="src/pages/OnboardingPage.tsx">• Games for all cognitive skills</li>
                  </ul>
                </div>
              </div>
            }

            {step === 2 &&
            <div className="space-y-4" data-id="nf7mff5lf" data-path="src/pages/OnboardingPage.tsx">
                <Label htmlFor="name" data-id="w6k2klzkt" data-path="src/pages/OnboardingPage.tsx">Your Name</Label>
                <Input
                id="name"
                placeholder="Enter your name"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                className="text-lg p-4" data-id="runai19rz" data-path="src/pages/OnboardingPage.tsx" />

                <p className="text-sm text-gray-600" data-id="22si5qzks" data-path="src/pages/OnboardingPage.tsx">
                  We'll use this to personalize your experience and celebrate your achievements!
                </p>
              </div>
            }

            {step === 3 &&
            <div className="space-y-4" data-id="wtftdb2ev" data-path="src/pages/OnboardingPage.tsx">
                <Label htmlFor="age" data-id="wp2n68t6o" data-path="src/pages/OnboardingPage.tsx">Your Age</Label>
                <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={profile.age}
                onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value }))}
                className="text-lg p-4"
                min="4"
                max="120" data-id="1s4zd30ks" data-path="src/pages/OnboardingPage.tsx" />

                <p className="text-sm text-gray-600" data-id="p5ouqokcz" data-path="src/pages/OnboardingPage.tsx">
                  This helps us customize the difficulty and content appropriate for you.
                </p>
              </div>
            }

            {step === 4 &&
            <div className="space-y-4" data-id="3ekdos7bv" data-path="src/pages/OnboardingPage.tsx">
                <p className="text-gray-600 text-center" data-id="intqv3hwg" data-path="src/pages/OnboardingPage.tsx">
                  Select the cognitive skills you'd like to focus on:
                </p>
                <div className="grid grid-cols-2 gap-3" data-id="itcz4x8wh" data-path="src/pages/OnboardingPage.tsx">
                  {goalOptions.map((goal) =>
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                  profile.goals.includes(goal) ?
                  'border-purple-500 bg-purple-50 text-purple-700' :
                  'border-gray-200 hover:border-purple-300'}`
                  } data-id="xwl9k5mqo" data-path="src/pages/OnboardingPage.tsx">

                      <div className="text-sm font-medium" data-id="dmfw3vxkn" data-path="src/pages/OnboardingPage.tsx">{goal}</div>
                    </button>
                )}
                </div>
                {profile.goals.length > 0 &&
              <div className="space-y-2" data-id="fkknelwiv" data-path="src/pages/OnboardingPage.tsx">
                    <p className="text-sm font-medium text-gray-700" data-id="ooahkeae9" data-path="src/pages/OnboardingPage.tsx">Selected goals:</p>
                    <div className="flex flex-wrap gap-2" data-id="2pmmvd2hz" data-path="src/pages/OnboardingPage.tsx">
                      {profile.goals.map((goal) =>
                  <Badge key={goal} className="bg-purple-100 text-purple-700" data-id="ergj0jkxp" data-path="src/pages/OnboardingPage.tsx">
                          {goal}
                        </Badge>
                  )}
                    </div>
                  </div>
              }
              </div>
            }

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 text-lg" data-id="frzt9gzww" data-path="src/pages/OnboardingPage.tsx">

              {step === totalSteps ? 'Start Training!' : 'Continue'}
            </Button>

            {step > 1 &&
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="w-full" data-id="ioagttl8f" data-path="src/pages/OnboardingPage.tsx">

                Back
              </Button>
            }
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default OnboardingPage;