import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { Brain, Target, Puzzle, Shuffle, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, completeOnboarding, isAuthenticated } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    goals: [] as string[],
    experience: ''
  });

  const goals = [
  { id: 'memory', label: 'Improve Memory', icon: Brain },
  { id: 'attention', label: 'Enhance Focus', icon: Target },
  { id: 'problem-solving', label: 'Better Problem Solving', icon: Puzzle },
  { id: 'flexibility', label: 'Mental Flexibility', icon: Shuffle },
  { id: 'speed', label: 'Processing Speed', icon: Zap }];


  const steps = [
  { title: 'Welcome to Impulse', subtitle: 'Your journey to better cognition starts here' },
  { title: 'Create Account', subtitle: 'Set up your personal brain training profile' },
  { title: 'Tell Us About You', subtitle: 'Help us personalize your experience' },
  { title: 'Your Goals', subtitle: 'What cognitive skills would you like to improve?' },
  { title: 'Ready to Start!', subtitle: 'Your personalized training awaits' }];


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId) ?
      prev.goals.filter((g) => g !== goalId) :
      [...prev.goals, goalId]
    }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Login/Registration step
      if (!formData.email || !formData.password) {
        toast({
          title: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }
      try {
        await login(formData.email, formData.password);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        toast({
          title: "Failed to create account",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } else if (currentStep === 2) {
      // Personal info step
      if (!formData.name || !formData.age) {
        toast({
          title: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Goals step
      if (formData.goals.length === 0) {
        toast({
          title: "Please select at least one goal",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      // Complete onboarding
      completeOnboarding({
        name: formData.name,
        age: parseInt(formData.age),
        goals: formData.goals
      });
      toast({
        title: "Welcome to Impulse!",
        description: "Your brain training journey begins now."
      });
      navigate('/');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6" data-id="34dg12wzz" data-path="src/pages/OnboardingPage.tsx">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto" data-id="wxdsmz7zb" data-path="src/pages/OnboardingPage.tsx">
              <Brain className="w-12 h-12 text-white" data-id="vev01f8we" data-path="src/pages/OnboardingPage.tsx" />
            </div>
            <div data-id="zledtbrgn" data-path="src/pages/OnboardingPage.tsx">
              <h2 className="text-2xl font-bold text-gray-800 mb-2" data-id="3yk88h73y" data-path="src/pages/OnboardingPage.tsx">Welcome to Impulse</h2>
              <p className="text-gray-600 leading-relaxed" data-id="rgmw56sq5" data-path="src/pages/OnboardingPage.tsx">
                Train your brain with scientifically-backed exercises designed to improve memory, 
                attention, problem-solving, and more. Join millions who are enhancing their cognitive abilities.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm" data-id="8pf643mz9" data-path="src/pages/OnboardingPage.tsx">
              <div className="bg-blue-50 p-3 rounded-lg" data-id="4e5gr1mpr" data-path="src/pages/OnboardingPage.tsx">
                <div className="font-semibold text-blue-800" data-id="4k8lh31od" data-path="src/pages/OnboardingPage.tsx">Personalized</div>
                <div className="text-blue-600" data-id="cwkir4ufx" data-path="src/pages/OnboardingPage.tsx">AI-driven training plans</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg" data-id="bacrm4bpz" data-path="src/pages/OnboardingPage.tsx">
                <div className="font-semibold text-purple-800" data-id="h8aymt91v" data-path="src/pages/OnboardingPage.tsx">Scientific</div>
                <div className="text-purple-600" data-id="bdgs7c8i7" data-path="src/pages/OnboardingPage.tsx">Research-backed exercises</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg" data-id="vcm8iujhm" data-path="src/pages/OnboardingPage.tsx">
                <div className="font-semibold text-green-800" data-id="8oxuz34nc" data-path="src/pages/OnboardingPage.tsx">Progressive</div>
                <div className="text-green-600" data-id="hm6tc3vhh" data-path="src/pages/OnboardingPage.tsx">Adaptive difficulty levels</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg" data-id="sdkeyleiz" data-path="src/pages/OnboardingPage.tsx">
                <div className="font-semibold text-orange-800" data-id="e4oxc00xc" data-path="src/pages/OnboardingPage.tsx">Fun</div>
                <div className="text-orange-600" data-id="mq79ec169" data-path="src/pages/OnboardingPage.tsx">Gamified experience</div>
              </div>
            </div>
          </div>);


      case 1:
        return (
          <div className="space-y-4" data-id="72pt4c4iv" data-path="src/pages/OnboardingPage.tsx">
            <div className="space-y-2" data-id="js799po7u" data-path="src/pages/OnboardingPage.tsx">
              <Label htmlFor="email" data-id="pno8kdpar" data-path="src/pages/OnboardingPage.tsx">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)} data-id="ouwcemp1l" data-path="src/pages/OnboardingPage.tsx" />

            </div>
            <div className="space-y-2" data-id="azimsnlh7" data-path="src/pages/OnboardingPage.tsx">
              <Label htmlFor="password" data-id="npub5hjun" data-path="src/pages/OnboardingPage.tsx">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)} data-id="jtr4ea7uz" data-path="src/pages/OnboardingPage.tsx" />

            </div>
            <div className="text-xs text-gray-500 leading-relaxed" data-id="vnaywp2dy" data-path="src/pages/OnboardingPage.tsx">
              By creating an account, you agree to our terms of service and privacy policy. 
              Your data is secure and will be used only to personalize your training experience.
            </div>
          </div>);


      case 2:
        return (
          <div className="space-y-4" data-id="pu8gx6mql" data-path="src/pages/OnboardingPage.tsx">
            <div className="space-y-2" data-id="3odfcq07w" data-path="src/pages/OnboardingPage.tsx">
              <Label htmlFor="name" data-id="pdawf51fr" data-path="src/pages/OnboardingPage.tsx">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)} data-id="91ywgqip3" data-path="src/pages/OnboardingPage.tsx" />

            </div>
            <div className="space-y-2" data-id="3648sb4ct" data-path="src/pages/OnboardingPage.tsx">
              <Label htmlFor="age" data-id="xtpea8wb2" data-path="src/pages/OnboardingPage.tsx">Age</Label>
              <Select onValueChange={(value) => handleInputChange('age', value)} data-id="cm0yevkpd" data-path="src/pages/OnboardingPage.tsx">
                <SelectTrigger data-id="yqg6ovv6p" data-path="src/pages/OnboardingPage.tsx">
                  <SelectValue placeholder="Select your age range" data-id="gjbbyjvwg" data-path="src/pages/OnboardingPage.tsx" />
                </SelectTrigger>
                <SelectContent data-id="ng2m8edi9" data-path="src/pages/OnboardingPage.tsx">
                  <SelectItem value="4-12" data-id="l4cy3cvkv" data-path="src/pages/OnboardingPage.tsx">4-12 years</SelectItem>
                  <SelectItem value="13-17" data-id="ww27qv3dm" data-path="src/pages/OnboardingPage.tsx">13-17 years</SelectItem>
                  <SelectItem value="18-24" data-id="jcyfjxg4f" data-path="src/pages/OnboardingPage.tsx">18-24 years</SelectItem>
                  <SelectItem value="25-34" data-id="p4rja9riy" data-path="src/pages/OnboardingPage.tsx">25-34 years</SelectItem>
                  <SelectItem value="35-44" data-id="rrig0iod8" data-path="src/pages/OnboardingPage.tsx">35-44 years</SelectItem>
                  <SelectItem value="45-54" data-id="wkm3k0cxy" data-path="src/pages/OnboardingPage.tsx">45-54 years</SelectItem>
                  <SelectItem value="55-64" data-id="1tjkfy4gk" data-path="src/pages/OnboardingPage.tsx">55-64 years</SelectItem>
                  <SelectItem value="65+" data-id="ixcftsxyj" data-path="src/pages/OnboardingPage.tsx">65+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2" data-id="b8az4zdmf" data-path="src/pages/OnboardingPage.tsx">
              <Label htmlFor="experience" data-id="dvrkuu6m0" data-path="src/pages/OnboardingPage.tsx">Previous Experience</Label>
              <Select onValueChange={(value) => handleInputChange('experience', value)} data-id="hql0i1bfe" data-path="src/pages/OnboardingPage.tsx">
                <SelectTrigger data-id="yug41mxd4" data-path="src/pages/OnboardingPage.tsx">
                  <SelectValue placeholder="Have you done brain training before?" data-id="btg82eepw" data-path="src/pages/OnboardingPage.tsx" />
                </SelectTrigger>
                <SelectContent data-id="154p20c1f" data-path="src/pages/OnboardingPage.tsx">
                  <SelectItem value="none" data-id="steiijdr8" data-path="src/pages/OnboardingPage.tsx">No previous experience</SelectItem>
                  <SelectItem value="some" data-id="fqa3hcmx1" data-path="src/pages/OnboardingPage.tsx">Some experience</SelectItem>
                  <SelectItem value="experienced" data-id="cigi1lo32" data-path="src/pages/OnboardingPage.tsx">Very experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>);


      case 3:
        return (
          <div className="space-y-4" data-id="9jb1b8rmy" data-path="src/pages/OnboardingPage.tsx">
            <p className="text-gray-600 text-sm" data-id="dos3en7uj" data-path="src/pages/OnboardingPage.tsx">
              Select the cognitive skills you'd like to focus on. We'll personalize your training plan accordingly.
            </p>
            <div className="space-y-3" data-id="hyp9kpjf3" data-path="src/pages/OnboardingPage.tsx">
              {goals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <div
                    key={goal.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.goals.includes(goal.id) ?
                    'border-purple-600 bg-purple-50' :
                    'border-gray-200 hover:border-gray-300'}`
                    }
                    onClick={() => handleGoalToggle(goal.id)} data-id="af7tqd1c0" data-path="src/pages/OnboardingPage.tsx">

                    <div className="flex items-center space-x-3" data-id="7uihk5q5q" data-path="src/pages/OnboardingPage.tsx">
                      <Checkbox
                        checked={formData.goals.includes(goal.id)}
                        onChange={() => handleGoalToggle(goal.id)} data-id="6sxa2niyv" data-path="src/pages/OnboardingPage.tsx" />

                      <Icon className={`w-5 h-5 ${
                      formData.goals.includes(goal.id) ? 'text-purple-600' : 'text-gray-400'}`
                      } data-id="6mng2p9cc" data-path="src/pages/OnboardingPage.tsx" />
                      <span className={`font-medium ${
                      formData.goals.includes(goal.id) ? 'text-purple-800' : 'text-gray-700'}`
                      } data-id="o3f2vdgdn" data-path="src/pages/OnboardingPage.tsx">
                        {goal.label}
                      </span>
                    </div>
                  </div>);

              })}
            </div>
          </div>);


      case 4:
        return (
          <div className="text-center space-y-6" data-id="1b1yovx1p" data-path="src/pages/OnboardingPage.tsx">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto" data-id="zas9m1ojo" data-path="src/pages/OnboardingPage.tsx">
              <CheckCircle className="w-12 h-12 text-white" data-id="ft6zibe5l" data-path="src/pages/OnboardingPage.tsx" />
            </div>
            <div data-id="dp44zdy8v" data-path="src/pages/OnboardingPage.tsx">
              <h2 className="text-2xl font-bold text-gray-800 mb-2" data-id="0uja1w7ib" data-path="src/pages/OnboardingPage.tsx">You're All Set!</h2>
              <p className="text-gray-600 leading-relaxed" data-id="z7w98q3k7" data-path="src/pages/OnboardingPage.tsx">
                Based on your preferences, we've created a personalized training plan. 
                Start with today's challenge or explore our game categories.
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg" data-id="fza9mdi5a" data-path="src/pages/OnboardingPage.tsx">
              <h3 className="font-semibold text-gray-800 mb-2" data-id="3big0lnq6" data-path="src/pages/OnboardingPage.tsx">Your Training Plan Includes:</h3>
              <ul className="text-sm text-gray-600 space-y-1" data-id="3vxon9ch4" data-path="src/pages/OnboardingPage.tsx">
                {formData.goals.map((goalId) => {
                  const goal = goals.find((g) => g.id === goalId);
                  return (
                    <li key={goalId} className="flex items-center gap-2" data-id="522ozbqm4" data-path="src/pages/OnboardingPage.tsx">
                      <CheckCircle className="w-4 h-4 text-green-500" data-id="min7ntgve" data-path="src/pages/OnboardingPage.tsx" />
                      {goal?.label}
                    </li>);

                })}
              </ul>
            </div>
          </div>);


      default:
        return null;
    }
  };

  if (isAuthenticated && currentStep < 2) {
    setCurrentStep(2);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center p-4" data-id="xk91mcfdc" data-path="src/pages/OnboardingPage.tsx">
      <div className="w-full max-w-sm bg-white rounded-[25px] overflow-hidden shadow-2xl min-h-[700px] relative" data-id="v9he9i3fi" data-path="src/pages/OnboardingPage.tsx">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200" data-id="6qsyqp2s6" data-path="src/pages/OnboardingPage.tsx">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep + 1) / steps.length * 100}%` }} data-id="8hrv74zhx" data-path="src/pages/OnboardingPage.tsx" />

        </div>

        {/* Header */}
        <div className="p-6 text-center" data-id="qv5316awt" data-path="src/pages/OnboardingPage.tsx">
          <div className="text-sm text-gray-500 mb-1" data-id="dtr7rd01y" data-path="src/pages/OnboardingPage.tsx">
            Step {currentStep + 1} of {steps.length}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1" data-id="9lht50hn2" data-path="src/pages/OnboardingPage.tsx">
            {steps[currentStep].title}
          </h1>
          <p className="text-sm text-gray-600" data-id="461frimh6" data-path="src/pages/OnboardingPage.tsx">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6" data-id="4hl5uoys9" data-path="src/pages/OnboardingPage.tsx">
          <Card data-id="5dl0lfnfa" data-path="src/pages/OnboardingPage.tsx">
            <CardContent className="p-6" data-id="pngz6db0k" data-path="src/pages/OnboardingPage.tsx">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6" data-id="1h1y2k4pf" data-path="src/pages/OnboardingPage.tsx">
          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            size="lg" data-id="flt3dixga" data-path="src/pages/OnboardingPage.tsx">

            {currentStep === steps.length - 1 ? 'Start Training' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" data-id="tu7kcalip" data-path="src/pages/OnboardingPage.tsx" />
          </Button>
          
          {currentStep > 0 &&
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full mt-2 text-gray-600" data-id="3zgdf72x6" data-path="src/pages/OnboardingPage.tsx">

              Back
            </Button>
          }
        </div>
      </div>
    </div>);

};

export default OnboardingPage;