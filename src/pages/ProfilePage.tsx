import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import MobileLayout from '@/components/MobileLayout';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Crown,
  Bell,
  Moon,
  Volume2,
  Shield,
  HelpCircle,
  LogOut,
  Edit3,
  Calendar,
  Target,
  Mail,
  Phone,
  Save,
  X } from
'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age?.toString() || ''
  });
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    dataSharing: false
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "Thank you for training with Impulse!"
    });
    navigate('/onboarding');
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      toast({
        title: "Name is required",
        variant: "destructive"
      });
      return;
    }

    updateProfile({
      name: editForm.name,
      email: editForm.email,
      age: parseInt(editForm.age) || user?.age
    });

    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully."
    });
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      age: user?.age?.toString() || ''
    });
    setIsEditing(false);
  };

  const menuItems = [
  {
    icon: Crown,
    title: 'Upgrade to Premium',
    description: 'Unlock all features and advanced training',
    action: () => navigate('/subscription'),
    highlight: true
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Daily reminders and achievements',
    toggle: true,
    value: settings.notifications,
    onChange: (value: boolean) => setSettings((prev) => ({ ...prev, notifications: value }))
  },
  {
    icon: Volume2,
    title: 'Sound Effects',
    description: 'Game sounds and audio feedback',
    toggle: true,
    value: settings.soundEffects,
    onChange: (value: boolean) => setSettings((prev) => ({ ...prev, soundEffects: value }))
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Easier on your eyes',
    toggle: true,
    value: settings.darkMode,
    onChange: (value: boolean) => setSettings((prev) => ({ ...prev, darkMode: value }))
  },
  {
    icon: Shield,
    title: 'Privacy & Data',
    description: 'Manage your data and privacy settings',
    action: () => {}
  },
  {
    icon: HelpCircle,
    title: 'Help & Support',
    description: 'Get help and contact support',
    action: () => {}
  }];


  const goals = [
  { id: 'memory', label: 'Memory', active: user?.goals?.includes('memory') },
  { id: 'attention', label: 'Attention', active: user?.goals?.includes('attention') },
  { id: 'problem-solving', label: 'Problem Solving', active: user?.goals?.includes('problem-solving') },
  { id: 'flexibility', label: 'Flexibility', active: user?.goals?.includes('flexibility') },
  { id: 'speed', label: 'Speed', active: user?.goals?.includes('speed') }];


  return (
    <MobileLayout data-id="80ksqjjcq" data-path="src/pages/ProfilePage.tsx">
      <div className="p-5 space-y-6" data-id="f9fga9hij" data-path="src/pages/ProfilePage.tsx">
        {/* Profile Header */}
        <section data-id="pepity9c6" data-path="src/pages/ProfilePage.tsx">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-id="jj8mlym4b" data-path="src/pages/ProfilePage.tsx">
            <CardContent className="p-6" data-id="r9dtpsqhd" data-path="src/pages/ProfilePage.tsx">
              <div className="flex items-center justify-between mb-4" data-id="kcfezdlk7" data-path="src/pages/ProfilePage.tsx">
                <div className="flex items-center gap-4" data-id="330s4xsce" data-path="src/pages/ProfilePage.tsx">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center" data-id="ouwdcaele" data-path="src/pages/ProfilePage.tsx">
                    <User className="w-8 h-8 text-white" data-id="xg2z3k1r8" data-path="src/pages/ProfilePage.tsx" />
                  </div>
                  <div data-id="2qlplbgqk" data-path="src/pages/ProfilePage.tsx">
                    <h2 className="text-xl font-bold" data-id="tlezdtv27" data-path="src/pages/ProfilePage.tsx">{user?.name || 'User'}</h2>
                    <p className="text-white/80 text-sm" data-id="fuxkoqsz6" data-path="src/pages/ProfilePage.tsx">{user?.email}</p>
                    {user?.isPremium &&
                    <Badge className="bg-yellow-500 text-white mt-1" data-id="u1unv6vcd" data-path="src/pages/ProfilePage.tsx">
                        <Crown className="w-3 h-3 mr-1" data-id="6rn5nndmg" data-path="src/pages/ProfilePage.tsx" />
                        Premium
                      </Badge>
                    }
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-white hover:bg-white/20" data-id="hxj7bc3vx" data-path="src/pages/ProfilePage.tsx">

                  <Edit3 className="w-4 h-4" data-id="wtwm5m0kp" data-path="src/pages/ProfilePage.tsx" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center" data-id="eq3qnzvzr" data-path="src/pages/ProfilePage.tsx">
                <div data-id="7w7szqyar" data-path="src/pages/ProfilePage.tsx">
                  <div className="text-2xl font-bold" data-id="7rus5iju2" data-path="src/pages/ProfilePage.tsx">{user?.level || 1}</div>
                  <div className="text-xs text-white/80" data-id="g6h6bjecj" data-path="src/pages/ProfilePage.tsx">Level</div>
                </div>
                <div data-id="l945r85y5" data-path="src/pages/ProfilePage.tsx">
                  <div className="text-2xl font-bold" data-id="tfwpxv53q" data-path="src/pages/ProfilePage.tsx">{user?.streak || 0}</div>
                  <div className="text-xs text-white/80" data-id="f3w625lik" data-path="src/pages/ProfilePage.tsx">Day Streak</div>
                </div>
                <div data-id="dkyzwy8ay" data-path="src/pages/ProfilePage.tsx">
                  <div className="text-2xl font-bold" data-id="susn6xe2w" data-path="src/pages/ProfilePage.tsx">{user?.totalGamesPlayed || 0}</div>
                  <div className="text-xs text-white/80" data-id="6xgvdluyz" data-path="src/pages/ProfilePage.tsx">Games</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Edit Profile Modal */}
        {isEditing &&
        <Card className="border-2 border-purple-200" data-id="bc6uzyg41" data-path="src/pages/ProfilePage.tsx">
            <CardHeader className="pb-3" data-id="n9gohwrgu" data-path="src/pages/ProfilePage.tsx">
              <CardTitle className="text-lg text-gray-800 flex items-center justify-between" data-id="ag43q51zx" data-path="src/pages/ProfilePage.tsx">
                Edit Profile
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} data-id="8amnvriyq" data-path="src/pages/ProfilePage.tsx">
                  <X className="w-4 h-4" data-id="tjycc71pi" data-path="src/pages/ProfilePage.tsx" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="i17xv6hbc" data-path="src/pages/ProfilePage.tsx">
              <div className="space-y-2" data-id="jauluqaan" data-path="src/pages/ProfilePage.tsx">
                <Label htmlFor="name" data-id="yd0hkq02b" data-path="src/pages/ProfilePage.tsx">Full Name</Label>
                <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name" data-id="whcwem9vv" data-path="src/pages/ProfilePage.tsx" />

              </div>
              <div className="space-y-2" data-id="hl05d8400" data-path="src/pages/ProfilePage.tsx">
                <Label htmlFor="email" data-id="2pciswn87" data-path="src/pages/ProfilePage.tsx">Email</Label>
                <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com" data-id="lcecsa3ul" data-path="src/pages/ProfilePage.tsx" />

              </div>
              <div className="space-y-2" data-id="vzqg05406" data-path="src/pages/ProfilePage.tsx">
                <Label htmlFor="age" data-id="piw2iq7ju" data-path="src/pages/ProfilePage.tsx">Age</Label>
                <Input
                id="age"
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm((prev) => ({ ...prev, age: e.target.value }))}
                placeholder="Your age" data-id="8orduskin" data-path="src/pages/ProfilePage.tsx" />

              </div>
              <div className="flex gap-2" data-id="eekxestnp" data-path="src/pages/ProfilePage.tsx">
                <Button onClick={handleSaveProfile} className="flex-1" data-id="wb7fu9wzz" data-path="src/pages/ProfilePage.tsx">
                  <Save className="w-4 h-4 mr-2" data-id="ki0ozxk2s" data-path="src/pages/ProfilePage.tsx" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} className="flex-1" data-id="iia6pup7m" data-path="src/pages/ProfilePage.tsx">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        }

        {/* Training Goals */}
        <section data-id="uv227yjjz" data-path="src/pages/ProfilePage.tsx">
          <Card data-id="8m3wdg4k8" data-path="src/pages/ProfilePage.tsx">
            <CardHeader className="pb-3" data-id="u09chi80i" data-path="src/pages/ProfilePage.tsx">
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2" data-id="jbfwf88ck" data-path="src/pages/ProfilePage.tsx">
                <Target className="w-5 h-5 text-purple-600" data-id="ck5exb7zf" data-path="src/pages/ProfilePage.tsx" />
                Training Goals
              </CardTitle>
            </CardHeader>
            <CardContent data-id="cvj6gr3af" data-path="src/pages/ProfilePage.tsx">
              <div className="flex flex-wrap gap-2" data-id="yprx3c1ae" data-path="src/pages/ProfilePage.tsx">
                {goals.map((goal) =>
                <Badge
                  key={goal.id}
                  variant={goal.active ? "default" : "outline"}
                  className={goal.active ? "bg-purple-600 text-white" : ""} data-id="u6fxkwk1" data-path="src/pages/ProfilePage.tsx">

                    {goal.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3" data-id="grkxjgg83" data-path="src/pages/ProfilePage.tsx">
                Your training plan is personalized based on these goals. 
                Contact support to modify your goals.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Account Details */}
        <section data-id="9e25bugvb" data-path="src/pages/ProfilePage.tsx">
          <Card data-id="o1g0ki841" data-path="src/pages/ProfilePage.tsx">
            <CardHeader className="pb-3" data-id="tw8jtbbyn" data-path="src/pages/ProfilePage.tsx">
              <CardTitle className="text-lg text-gray-800" data-id="hemf5n5iv" data-path="src/pages/ProfilePage.tsx">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3" data-id="o17f3mm9w" data-path="src/pages/ProfilePage.tsx">
              <div className="flex items-center gap-3 p-2" data-id="kc84rlh95" data-path="src/pages/ProfilePage.tsx">
                <Mail className="w-4 h-4 text-gray-500" data-id="t4eqvqsos" data-path="src/pages/ProfilePage.tsx" />
                <div className="flex-1" data-id="szp4x0kte" data-path="src/pages/ProfilePage.tsx">
                  <div className="text-sm font-medium" data-id="ejonyr5kv" data-path="src/pages/ProfilePage.tsx">Email</div>
                  <div className="text-xs text-gray-500" data-id="9znni96cm" data-path="src/pages/ProfilePage.tsx">{user?.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2" data-id="mnviw11la" data-path="src/pages/ProfilePage.tsx">
                <Calendar className="w-4 h-4 text-gray-500" data-id="cczjsfhsg" data-path="src/pages/ProfilePage.tsx" />
                <div className="flex-1" data-id="3n8k0qrof" data-path="src/pages/ProfilePage.tsx">
                  <div className="text-sm font-medium" data-id="zc6uxshxe" data-path="src/pages/ProfilePage.tsx">Member Since</div>
                  <div className="text-xs text-gray-500" data-id="c9exrqpn7" data-path="src/pages/ProfilePage.tsx">
                    {user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2" data-id="0dzn6peb0" data-path="src/pages/ProfilePage.tsx">
                <User className="w-4 h-4 text-gray-500" data-id="3o7k48ap3" data-path="src/pages/ProfilePage.tsx" />
                <div className="flex-1" data-id="hn3q87yay" data-path="src/pages/ProfilePage.tsx">
                  <div className="text-sm font-medium" data-id="6xwqytt26" data-path="src/pages/ProfilePage.tsx">Age Group</div>
                  <div className="text-xs text-gray-500" data-id="e59r1pk27" data-path="src/pages/ProfilePage.tsx">{user?.age} years old</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Settings */}
        <section data-id="2d88u30qb" data-path="src/pages/ProfilePage.tsx">
          <Card data-id="sy47mxjvi" data-path="src/pages/ProfilePage.tsx">
            <CardHeader className="pb-3" data-id="r5bst5b8h" data-path="src/pages/ProfilePage.tsx">
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2" data-id="h59k5zd60" data-path="src/pages/ProfilePage.tsx">
                <Settings className="w-5 h-5 text-gray-600" data-id="03v873b6y" data-path="src/pages/ProfilePage.tsx" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="bv5ttvseb" data-path="src/pages/ProfilePage.tsx">
              {menuItems.map((item, index) => {
                const Icon = item.icon;

                if (item.toggle) {
                  return (
                    <div key={index} className="flex items-center justify-between p-2" data-id="ieeg7v6hn" data-path="src/pages/ProfilePage.tsx">
                      <div className="flex items-center gap-3" data-id="yu61ofm7k" data-path="src/pages/ProfilePage.tsx">
                        <Icon className={`w-5 h-5 ${item.highlight ? 'text-yellow-600' : 'text-gray-500'}`} data-id="oakncxcvy" data-path="src/pages/ProfilePage.tsx" />
                        <div data-id="f7pjg1kmt" data-path="src/pages/ProfilePage.tsx">
                          <div className="text-sm font-medium" data-id="yidrv8owu" data-path="src/pages/ProfilePage.tsx">{item.title}</div>
                          <div className="text-xs text-gray-500" data-id="9b1h3z1d8" data-path="src/pages/ProfilePage.tsx">{item.description}</div>
                        </div>
                      </div>
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange} data-id="4jr8a9x31" data-path="src/pages/ProfilePage.tsx" />

                    </div>);

                }

                return (
                  <div key={index} data-id="wkjvuvkyl" data-path="src/pages/ProfilePage.tsx">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-2 h-auto ${
                      item.highlight ? 'text-yellow-700 hover:bg-yellow-50' : 'text-gray-700 hover:bg-gray-50'}`
                      }
                      onClick={item.action} data-id="5zz5hfs9o" data-path="src/pages/ProfilePage.tsx">

                      <Icon className={`w-5 h-5 mr-3 ${item.highlight ? 'text-yellow-600' : 'text-gray-500'}`} data-id="2577eau5x" data-path="src/pages/ProfilePage.tsx" />
                      <div className="text-left" data-id="suwusfnkc" data-path="src/pages/ProfilePage.tsx">
                        <div className="text-sm font-medium" data-id="fg599sabu" data-path="src/pages/ProfilePage.tsx">{item.title}</div>
                        <div className="text-xs text-gray-500" data-id="5g82qc11w" data-path="src/pages/ProfilePage.tsx">{item.description}</div>
                      </div>
                    </Button>
                    {index < menuItems.length - 1 && <Separator className="my-2" data-id="x0frhzswt" data-path="src/pages/ProfilePage.tsx" />}
                  </div>);

              })}
            </CardContent>
          </Card>
        </section>

        {/* App Info */}
        <section data-id="7dkvlleq0" data-path="src/pages/ProfilePage.tsx">
          <Card className="bg-gray-50" data-id="52n8z2sje" data-path="src/pages/ProfilePage.tsx">
            <CardContent className="p-4 text-center" data-id="g7bucgl7r" data-path="src/pages/ProfilePage.tsx">
              <div className="text-sm text-gray-600 space-y-1" data-id="srrzqway6" data-path="src/pages/ProfilePage.tsx">
                <div data-id="t7g2teqqc" data-path="src/pages/ProfilePage.tsx">Impulse Brain Training v1.0.0</div>
                <div data-id="q0wm1phmr" data-path="src/pages/ProfilePage.tsx">Made with ❤️ for cognitive enhancement</div>
                <div className="text-xs text-gray-500" data-id="f7g9na3n3" data-path="src/pages/ProfilePage.tsx">
                  Based on neuroscience research and cognitive psychology
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Logout */}
        <section data-id="bequauzj1" data-path="src/pages/ProfilePage.tsx">
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout} data-id="dj5mk9ouk" data-path="src/pages/ProfilePage.tsx">

            <LogOut className="w-4 h-4 mr-2" data-id="01pqy1ny5" data-path="src/pages/ProfilePage.tsx" />
            Sign Out
          </Button>
        </section>
      </div>
    </MobileLayout>);

};

export default ProfilePage;