import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MobileLayout from '@/components/MobileLayout';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Check,
  X,
  Star,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Gift,
  CreditCard,
  Smartphone,
  ChevronRight } from
'lucide-react';
import { toast } from '@/hooks/use-toast';

const SubscriptionPage: React.FC = () => {
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      name: 'Monthly Premium',
      price: '$9.99',
      period: '/month',
      savings: null,
      popular: false
    },
    yearly: {
      name: 'Yearly Premium',
      price: '$79.99',
      period: '/year',
      savings: 'Save 33%',
      popular: true
    }
  };

  const freeFeatures = [
  'Basic memory games',
  'Limited daily challenges',
  '3 cognitive skill categories',
  'Basic progress tracking',
  'Simple difficulty levels'];


  const premiumFeatures = [
  'All 50+ brain training games',
  'Unlimited daily challenges',
  'All 5 cognitive skill categories',
  'Advanced progress analytics',
  'Adaptive difficulty system',
  'Personalized workout plans',
  'Detailed performance insights',
  'Priority customer support',
  'Ad-free experience',
  'Offline game access',
  'Export progress data',
  'Advanced achievement system'];


  const handleUpgrade = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update user to premium
    updateProfile({ isPremium: true });

    toast({
      title: "Welcome to Premium! 🎉",
      description: "You now have access to all advanced features."
    });

    setIsProcessing(false);
    navigate('/');
  };

  const testimonials = [
  {
    name: "Sarah M.",
    age: 34,
    quote: "My memory has improved significantly in just 2 weeks!",
    improvement: "+25% memory score"
  },
  {
    name: "David L.",
    age: 45,
    quote: "The personalized workouts are exactly what I needed.",
    improvement: "+18% attention span"
  },
  {
    name: "Emma R.",
    age: 28,
    quote: "I feel sharper and more focused at work now.",
    improvement: "+30% processing speed"
  }];


  if (user?.isPremium) {
    return (
      <MobileLayout data-id="5xbhvfesl" data-path="src/pages/SubscriptionPage.tsx">
        <div className="p-5 space-y-6" data-id="c0fbdyovo" data-path="src/pages/SubscriptionPage.tsx">
          {/* Premium Status */}
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800" data-id="v21jehsla" data-path="src/pages/SubscriptionPage.tsx">
            <CardContent className="p-6 text-center" data-id="84n93ubjr" data-path="src/pages/SubscriptionPage.tsx">
              <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-700" data-id="g8cma1zq6" data-path="src/pages/SubscriptionPage.tsx" />
              <h2 className="text-xl font-bold mb-2" data-id="6cu5z9v92" data-path="src/pages/SubscriptionPage.tsx">You're Premium!</h2>
              <p className="text-sm text-gray-700" data-id="aluiz32ij" data-path="src/pages/SubscriptionPage.tsx">
                Enjoy unlimited access to all brain training features.
              </p>
            </CardContent>
          </Card>

          {/* Premium Benefits */}
          <Card data-id="01fskz9za" data-path="src/pages/SubscriptionPage.tsx">
            <CardHeader data-id="kbanxegir" data-path="src/pages/SubscriptionPage.tsx">
              <CardTitle className="text-lg text-gray-800" data-id="3uiue4qs1" data-path="src/pages/SubscriptionPage.tsx">Your Premium Benefits</CardTitle>
            </CardHeader>
            <CardContent data-id="ft1b0us99" data-path="src/pages/SubscriptionPage.tsx">
              <div className="space-y-3" data-id="a82c7gzuw" data-path="src/pages/SubscriptionPage.tsx">
                {premiumFeatures.slice(0, 6).map((feature, index) =>
                <div key={index} className="flex items-center gap-3" data-id="0enmgvp61" data-path="src/pages/SubscriptionPage.tsx">
                    <Check className="w-5 h-5 text-green-600" data-id="im6te92vv" data-path="src/pages/SubscriptionPage.tsx" />
                    <span className="text-sm text-gray-700" data-id="tx5yl5r3p" data-path="src/pages/SubscriptionPage.tsx">{feature}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card data-id="i3bzu1vij" data-path="src/pages/SubscriptionPage.tsx">
            <CardHeader data-id="2oz0sxj1k" data-path="src/pages/SubscriptionPage.tsx">
              <CardTitle className="text-lg text-gray-800" data-id="iip6qvgrt" data-path="src/pages/SubscriptionPage.tsx">Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="d9e1ryck9" data-path="src/pages/SubscriptionPage.tsx">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-id="uinzcsmft" data-path="src/pages/SubscriptionPage.tsx">
                <div data-id="pzd4aqpgr" data-path="src/pages/SubscriptionPage.tsx">
                  <div className="font-medium" data-id="gi4wojx6i" data-path="src/pages/SubscriptionPage.tsx">Premium Plan</div>
                  <div className="text-sm text-gray-500" data-id="rr72re1vq" data-path="src/pages/SubscriptionPage.tsx">Active until Dec 2024</div>
                </div>
                <Badge className="bg-green-500 text-white" data-id="uhke0xgoa" data-path="src/pages/SubscriptionPage.tsx">Active</Badge>
              </div>
              
              <Button variant="outline" className="w-full" data-id="rb6ipv57r" data-path="src/pages/SubscriptionPage.tsx">
                <CreditCard className="w-4 h-4 mr-2" data-id="lvz7ie567" data-path="src/pages/SubscriptionPage.tsx" />
                Update Payment Method
              </Button>
              
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" data-id="4nw1axnml" data-path="src/pages/SubscriptionPage.tsx">
                Cancel Subscription
              </Button>
            </CardContent>
          </Card>

          <Button onClick={() => navigate('/')} className="w-full" data-id="rnotixsvb" data-path="src/pages/SubscriptionPage.tsx">
            Back to Training
          </Button>
        </div>
      </MobileLayout>);

  }

  return (
    <MobileLayout showNavigation={false} data-id="vz6sbw40a" data-path="src/pages/SubscriptionPage.tsx">
      <div className="p-5 space-y-6" data-id="b62izyyln" data-path="src/pages/SubscriptionPage.tsx">
        {/* Header */}
        <section className="text-center" data-id="rexdwmu11" data-path="src/pages/SubscriptionPage.tsx">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4" data-id="li8wk0n7x" data-path="src/pages/SubscriptionPage.tsx">
            <Crown className="w-8 h-8 text-yellow-700" data-id="uwnxwyi69" data-path="src/pages/SubscriptionPage.tsx" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2" data-id="bh3wgszsn" data-path="src/pages/SubscriptionPage.tsx">Unlock Your Brain's Potential</h1>
          <p className="text-gray-600 text-sm leading-relaxed" data-id="qy6ndzrfi" data-path="src/pages/SubscriptionPage.tsx">
            Get unlimited access to scientifically-designed brain training exercises and advanced features.
          </p>
        </section>

        {/* Features Comparison */}
        <section data-id="ou5moraf8" data-path="src/pages/SubscriptionPage.tsx">
          <Card data-id="9pjzt9ptl" data-path="src/pages/SubscriptionPage.tsx">
            <CardHeader data-id="61qmum4l9" data-path="src/pages/SubscriptionPage.tsx">
              <CardTitle className="text-lg text-gray-800 text-center" data-id="w4k8hk9ci" data-path="src/pages/SubscriptionPage.tsx">
                What You Get with Premium
              </CardTitle>
            </CardHeader>
            <CardContent data-id="oizid1cfc" data-path="src/pages/SubscriptionPage.tsx">
              <div className="grid grid-cols-2 gap-4 mb-6" data-id="clssci1np" data-path="src/pages/SubscriptionPage.tsx">
                <div data-id="7jaowx1ls" data-path="src/pages/SubscriptionPage.tsx">
                  <h4 className="font-semibold text-gray-700 mb-3 text-center" data-id="ophd4u57q" data-path="src/pages/SubscriptionPage.tsx">Free</h4>
                  <div className="space-y-2" data-id="3qpl0e7be" data-path="src/pages/SubscriptionPage.tsx">
                    {freeFeatures.map((feature, index) =>
                    <div key={index} className="flex items-start gap-2" data-id="r3uvxj4yh" data-path="src/pages/SubscriptionPage.tsx">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" data-id="1civp0rob" data-path="src/pages/SubscriptionPage.tsx" />
                        <span className="text-xs text-gray-600" data-id="7zq6rneij" data-path="src/pages/SubscriptionPage.tsx">{feature}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div data-id="w8dlitv5r" data-path="src/pages/SubscriptionPage.tsx">
                  <h4 className="font-semibold text-yellow-600 mb-3 text-center flex items-center justify-center gap-1" data-id="ps2dnwg3e" data-path="src/pages/SubscriptionPage.tsx">
                    <Crown className="w-4 h-4" data-id="7jlo37qef" data-path="src/pages/SubscriptionPage.tsx" />
                    Premium
                  </h4>
                  <div className="space-y-2" data-id="k9ywmr25l" data-path="src/pages/SubscriptionPage.tsx">
                    {premiumFeatures.slice(0, 5).map((feature, index) =>
                    <div key={index} className="flex items-start gap-2" data-id="ejykftz7h" data-path="src/pages/SubscriptionPage.tsx">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" data-id="cskiri5ex" data-path="src/pages/SubscriptionPage.tsx" />
                        <span className="text-xs text-gray-700" data-id="ysvtc1aqc" data-path="src/pages/SubscriptionPage.tsx">{feature}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Plans */}
        <section data-id="lbibc1sr1" data-path="src/pages/SubscriptionPage.tsx">
          <div className="space-y-3" data-id="80gyc25ic" data-path="src/pages/SubscriptionPage.tsx">
            {Object.entries(plans).map(([key, plan]) =>
            <Card
              key={key}
              className={`cursor-pointer transition-all ${
              selectedPlan === key ?
              'border-purple-500 bg-purple-50' :
              'border-gray-200 hover:border-gray-300'} ${
              plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')} data-id="3v14kefr0" data-path="src/pages/SubscriptionPage.tsx">

                <CardContent className="p-4" data-id="yns1a3x8a" data-path="src/pages/SubscriptionPage.tsx">
                  <div className="flex items-center justify-between" data-id="wihpqzddm" data-path="src/pages/SubscriptionPage.tsx">
                    <div className="flex-1" data-id="5n08l2lkq" data-path="src/pages/SubscriptionPage.tsx">
                      <div className="flex items-center gap-2 mb-1" data-id="3swf2ry9d" data-path="src/pages/SubscriptionPage.tsx">
                        <h3 className="font-semibold text-gray-800" data-id="ga4pm4rps" data-path="src/pages/SubscriptionPage.tsx">{plan.name}</h3>
                        {plan.popular &&
                      <Badge className="bg-yellow-500 text-white text-xs" data-id="fybuxm4oh" data-path="src/pages/SubscriptionPage.tsx">
                            Most Popular
                          </Badge>
                      }
                      </div>
                      <div className="flex items-baseline gap-1" data-id="jpcusrc7w" data-path="src/pages/SubscriptionPage.tsx">
                        <span className="text-2xl font-bold text-purple-600" data-id="ppw89l9um" data-path="src/pages/SubscriptionPage.tsx">{plan.price}</span>
                        <span className="text-sm text-gray-500" data-id="mi7wubn2l" data-path="src/pages/SubscriptionPage.tsx">{plan.period}</span>
                      </div>
                      {plan.savings &&
                    <div className="text-xs text-green-600 font-medium mt-1" data-id="hj6iwcjky" data-path="src/pages/SubscriptionPage.tsx">
                          {plan.savings}
                        </div>
                    }
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedPlan === key ?
                  'border-purple-500 bg-purple-500' :
                  'border-gray-300'}`
                  } data-id="dv0arh4jr" data-path="src/pages/SubscriptionPage.tsx">
                      {selectedPlan === key &&
                    <Check className="w-3 h-3 text-white m-0.5" data-id="6o6uxjo0g" data-path="src/pages/SubscriptionPage.tsx" />
                    }
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Key Benefits */}
        <section data-id="y65qiakf8" data-path="src/pages/SubscriptionPage.tsx">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" data-id="r1m76pmxz" data-path="src/pages/SubscriptionPage.tsx">
            <CardContent className="p-4" data-id="rsq8dwxtx" data-path="src/pages/SubscriptionPage.tsx">
              <h3 className="font-semibold text-gray-800 mb-3 text-center" data-id="7aiid7a1w" data-path="src/pages/SubscriptionPage.tsx">
                Why Choose Premium?
              </h3>
              <div className="grid grid-cols-2 gap-4" data-id="vjfrpwdhj" data-path="src/pages/SubscriptionPage.tsx">
                <div className="text-center" data-id="a8m4i7tml" data-path="src/pages/SubscriptionPage.tsx">
                  <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" data-id="eqtk7cz1y" data-path="src/pages/SubscriptionPage.tsx" />
                  <div className="text-xs font-medium text-gray-800" data-id="uidkx965j" data-path="src/pages/SubscriptionPage.tsx">50+ Games</div>
                  <div className="text-xs text-gray-600" data-id="bo0uxrpth" data-path="src/pages/SubscriptionPage.tsx">Complete library</div>
                </div>
                <div className="text-center" data-id="0tcb7a8ah" data-path="src/pages/SubscriptionPage.tsx">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" data-id="211wuqa7y" data-path="src/pages/SubscriptionPage.tsx" />
                  <div className="text-xs font-medium text-gray-800" data-id="2hydb5pxr" data-path="src/pages/SubscriptionPage.tsx">Advanced Analytics</div>
                  <div className="text-xs text-gray-600" data-id="na880a1a0" data-path="src/pages/SubscriptionPage.tsx">Track improvement</div>
                </div>
                <div className="text-center" data-id="bn13ot2hn" data-path="src/pages/SubscriptionPage.tsx">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" data-id="0rpa2ypak" data-path="src/pages/SubscriptionPage.tsx" />
                  <div className="text-xs font-medium text-gray-800" data-id="7z8jy7bua" data-path="src/pages/SubscriptionPage.tsx">Personalized</div>
                  <div className="text-xs text-gray-600" data-id="x9x2zuj0f" data-path="src/pages/SubscriptionPage.tsx">AI-driven plans</div>
                </div>
                <div className="text-center" data-id="1xmfxv6h7" data-path="src/pages/SubscriptionPage.tsx">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" data-id="w070eby38" data-path="src/pages/SubscriptionPage.tsx" />
                  <div className="text-xs font-medium text-gray-800" data-id="wt7aswvh8" data-path="src/pages/SubscriptionPage.tsx">Ad-Free</div>
                  <div className="text-xs text-gray-600" data-id="45qw3vkl1" data-path="src/pages/SubscriptionPage.tsx">Uninterrupted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section data-id="wokmgaawj" data-path="src/pages/SubscriptionPage.tsx">
          <Card data-id="b81jy33uq" data-path="src/pages/SubscriptionPage.tsx">
            <CardHeader data-id="g9ffawrsj" data-path="src/pages/SubscriptionPage.tsx">
              <CardTitle className="text-lg text-gray-800 text-center flex items-center justify-center gap-2" data-id="wx2dt8zqo" data-path="src/pages/SubscriptionPage.tsx">
                <Star className="w-5 h-5 text-yellow-500" data-id="qyf1ptji2" data-path="src/pages/SubscriptionPage.tsx" />
                What Users Say
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="mt5tpisw6" data-path="src/pages/SubscriptionPage.tsx">
              {testimonials.map((testimonial, index) =>
              <div key={index} className="p-3 bg-gray-50 rounded-lg" data-id="gvu5rtyix" data-path="src/pages/SubscriptionPage.tsx">
                  <div className="flex justify-between items-start mb-2" data-id="5x6mekicm" data-path="src/pages/SubscriptionPage.tsx">
                    <div data-id="podmd9uia" data-path="src/pages/SubscriptionPage.tsx">
                      <div className="font-medium text-gray-800 text-sm" data-id="g4he3eoul" data-path="src/pages/SubscriptionPage.tsx">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500" data-id="u9tq1lfdq" data-path="src/pages/SubscriptionPage.tsx">Age {testimonial.age}</div>
                    </div>
                    <Badge className="bg-green-500 text-white text-xs" data-id="utdap1pn4" data-path="src/pages/SubscriptionPage.tsx">
                      {testimonial.improvement}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 italic" data-id="rwrqnqt6c" data-path="src/pages/SubscriptionPage.tsx">
                    "{testimonial.quote}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="space-y-3" data-id="61pshg82a" data-path="src/pages/SubscriptionPage.tsx">
          <Button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
            size="lg" data-id="k04xq0axz" data-path="src/pages/SubscriptionPage.tsx">

            {isProcessing ?
            <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" data-id="bov7dv9t8" data-path="src/pages/SubscriptionPage.tsx"></div>
                Processing...
              </> :

            <>
                <Crown className="w-5 h-5 mr-2" data-id="p6ls3gqv5" data-path="src/pages/SubscriptionPage.tsx" />
                Upgrade to Premium {plans[selectedPlan].price}
              </>
            }
          </Button>
          
          <div className="text-center space-y-2" data-id="1mmtw35sk" data-path="src/pages/SubscriptionPage.tsx">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500" data-id="xdt5dwvva" data-path="src/pages/SubscriptionPage.tsx">
              <div className="flex items-center gap-1" data-id="eq4vmidb6" data-path="src/pages/SubscriptionPage.tsx">
                <CreditCard className="w-3 h-3" data-id="ocjvb9gsb" data-path="src/pages/SubscriptionPage.tsx" />
                Secure Payment
              </div>
              <div className="flex items-center gap-1" data-id="n4568sv1q" data-path="src/pages/SubscriptionPage.tsx">
                <Shield className="w-3 h-3" data-id="v1dh9jehj" data-path="src/pages/SubscriptionPage.tsx" />
                30-Day Guarantee
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 text-sm" data-id="ljwyr5lwp" data-path="src/pages/SubscriptionPage.tsx">

              Continue with Free Version
            </Button>
          </div>
        </section>

        {/* Fine Print */}
        <section data-id="ic6sdeia0" data-path="src/pages/SubscriptionPage.tsx">
          <Card className="bg-gray-50" data-id="smlymv1wi" data-path="src/pages/SubscriptionPage.tsx">
            <CardContent className="p-3 text-xs text-gray-500 text-center space-y-1" data-id="8i1tgd3wd" data-path="src/pages/SubscriptionPage.tsx">
              <div data-id="3te90qf7l" data-path="src/pages/SubscriptionPage.tsx">Cancel anytime. No hidden fees.</div>
              <div data-id="7h9uti2yn" data-path="src/pages/SubscriptionPage.tsx">Subscription automatically renews unless cancelled.</div>
              <div data-id="b09d3lhhr" data-path="src/pages/SubscriptionPage.tsx">Prices shown in USD.</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </MobileLayout>);

};

export default SubscriptionPage;