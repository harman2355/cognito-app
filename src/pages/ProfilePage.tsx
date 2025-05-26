import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useUser } from '../contexts/UserContext';
import { User, Settings, Target, Crown, Bell, Shield, Edit3, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReminderSystem from '@/components/ml/ReminderSystem';

const ProfilePage = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    age: user?.age || 25,
    reminderTime: user?.preferences.reminderTime || '18:00',
    sessionLength: user?.preferences.sessionLength || 15
  });

  if (!user) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" data-id="cnj9deldw" data-path="src/pages/ProfilePage.tsx">
        <Card className="w-full max-w-md" data-id="m2y5dmwjw" data-path="src/pages/ProfilePage.tsx">
          <CardContent className="text-center p-6" data-id="1egjbg73e" data-path="src/pages/ProfilePage.tsx">
            <p className="text-gray-600" data-id="jx59aj5t5" data-path="src/pages/ProfilePage.tsx">Please complete onboarding to access your profile.</p>
          </CardContent>
        </Card>
      </div>);

  }

  const handleSaveProfile = () => {
    updateUser({
      name: editForm.name,
      age: editForm.age,
      preferences: {
        ...user.preferences,
        reminderTime: editForm.reminderTime,
        sessionLength: editForm.sessionLength
      }
    });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully."
    });
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name,
      age: user.age,
      reminderTime: user.preferences.reminderTime,
      sessionLength: user.preferences.sessionLength
    });
    setIsEditing(false);
  };

  const getLevelProgress = () => {
    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = user.level * 100;
    const userXP = user.totalGames * 10; // Assuming 10 XP per game
    const progressInLevel = (userXP - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100;
    return Math.max(0, Math.min(100, progressInLevel));
  };

  return (
    <div className="min-h-screen p-4 space-y-6" data-id="gl8oskafn" data-path="src/pages/ProfilePage.tsx">
      {/* Header */}
      <div className="pt-6" data-id="gkjba97bk" data-path="src/pages/ProfilePage.tsx">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" data-id="ufgpn1nfe" data-path="src/pages/ProfilePage.tsx">Profile</h1>
        <p className="text-gray-600" data-id="p9cq91win" data-path="src/pages/ProfilePage.tsx">Manage your account and preferences</p>
      </div>

      {/* Profile Overview */}
      <Card data-id="a8zv76y4m" data-path="src/pages/ProfilePage.tsx">
        <CardHeader data-id="zh6swpxb2" data-path="src/pages/ProfilePage.tsx">
          <div className="flex items-center justify-between" data-id="bh1fqbpzs" data-path="src/pages/ProfilePage.tsx">
            <CardTitle className="flex items-center space-x-2" data-id="842kn8423" data-path="src/pages/ProfilePage.tsx">
              <User className="h-5 w-5 text-purple-600" data-id="4dbyvc3xx" data-path="src/pages/ProfilePage.tsx" />
              <span data-id="w72slwmnu" data-path="src/pages/ProfilePage.tsx">Profile Information</span>
            </CardTitle>
            {!isEditing ?
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)} data-id="udemwbn8v" data-path="src/pages/ProfilePage.tsx">

                <Edit3 className="h-4 w-4 mr-2" data-id="b3jmq3p9v" data-path="src/pages/ProfilePage.tsx" />
                Edit
              </Button> :

            <div className="flex space-x-2" data-id="r7iw9mwwm" data-path="src/pages/ProfilePage.tsx">
                <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit} data-id="2pm8h3zr9" data-path="src/pages/ProfilePage.tsx">

                  <X className="h-4 w-4 mr-2" data-id="hzpg3v1kx" data-path="src/pages/ProfilePage.tsx" />
                  Cancel
                </Button>
                <Button
                size="sm"
                onClick={handleSaveProfile}
                className="bg-purple-600 hover:bg-purple-700" data-id="xjqwwf93u" data-path="src/pages/ProfilePage.tsx">

                  <Save className="h-4 w-4 mr-2" data-id="8ljbzrrw0" data-path="src/pages/ProfilePage.tsx" />
                  Save
                </Button>
              </div>
            }
          </div>
        </CardHeader>
        <CardContent className="space-y-4" data-id="6ac6fzvls" data-path="src/pages/ProfilePage.tsx">
          {isEditing ?
          <div className="space-y-4" data-id="a5qwajs9n" data-path="src/pages/ProfilePage.tsx">
              <div data-id="zm7tdftdi" data-path="src/pages/ProfilePage.tsx">
                <Label htmlFor="name" data-id="b10vxs3t1" data-path="src/pages/ProfilePage.tsx">Name</Label>
                <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} data-id="7wsn03ejx" data-path="src/pages/ProfilePage.tsx" />

              </div>
              <div data-id="wd7mxpb7b" data-path="src/pages/ProfilePage.tsx">
                <Label htmlFor="age" data-id="0utdm3jiv" data-path="src/pages/ProfilePage.tsx">Age</Label>
                <Input
                id="age"
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm((prev) => ({ ...prev, age: parseInt(e.target.value) }))}
                min="4"
                max="120" data-id="qkzy57nrs" data-path="src/pages/ProfilePage.tsx" />

              </div>
            </div> :

          <div className="grid grid-cols-2 gap-4" data-id="guu06onh9" data-path="src/pages/ProfilePage.tsx">
              <div data-id="fdxpu3bvx" data-path="src/pages/ProfilePage.tsx">
                <Label className="text-sm text-gray-600" data-id="ptrveusny" data-path="src/pages/ProfilePage.tsx">Name</Label>
                <p className="font-medium" data-id="0yu1w2ps4" data-path="src/pages/ProfilePage.tsx">{user.name}</p>
              </div>
              <div data-id="70q0pngod" data-path="src/pages/ProfilePage.tsx">
                <Label className="text-sm text-gray-600" data-id="vlqd0v83j" data-path="src/pages/ProfilePage.tsx">Age</Label>
                <p className="font-medium" data-id="6kfqluifn" data-path="src/pages/ProfilePage.tsx">{user.age}</p>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Level & Progress */}
      <Card data-id="8zpnrowd6" data-path="src/pages/ProfilePage.tsx">
        <CardHeader data-id="9mwfji9ih" data-path="src/pages/ProfilePage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="swj2pqo5k" data-path="src/pages/ProfilePage.tsx">
            <Crown className="h-5 w-5 text-yellow-500" data-id="8mrbl3m8z" data-path="src/pages/ProfilePage.tsx" />
            <span data-id="62fzoefma" data-path="src/pages/ProfilePage.tsx">Level & Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="sre517yjt" data-path="src/pages/ProfilePage.tsx">
          <div className="flex items-center justify-between" data-id="ytl87xium" data-path="src/pages/ProfilePage.tsx">
            <div data-id="567f7h7fl" data-path="src/pages/ProfilePage.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="olfzkrsno" data-path="src/pages/ProfilePage.tsx">Level {user.level}</div>
              <div className="text-sm text-gray-600" data-id="1quts7r4d" data-path="src/pages/ProfilePage.tsx">{user.totalGames * 10} XP earned</div>
            </div>
            {user.isPremium &&
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" data-id="bhfkps7jb" data-path="src/pages/ProfilePage.tsx">
                Premium
              </Badge>
            }
          </div>
          
          <div className="space-y-2" data-id="w9i9jw5hh" data-path="src/pages/ProfilePage.tsx">
            <div className="flex justify-between text-sm text-gray-600" data-id="m7uqlnajp" data-path="src/pages/ProfilePage.tsx">
              <span data-id="am1sw6lyd" data-path="src/pages/ProfilePage.tsx">Progress to Level {user.level + 1}</span>
              <span data-id="a8zyhzsx9" data-path="src/pages/ProfilePage.tsx">{Math.round(getLevelProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2" data-id="fpe8jerxh" data-path="src/pages/ProfilePage.tsx">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress()}%` }} data-id="ynhf8v13o" data-path="src/pages/ProfilePage.tsx" />

            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t" data-id="glhm5k46g" data-path="src/pages/ProfilePage.tsx">
            <div data-id="xcyh5qjkk" data-path="src/pages/ProfilePage.tsx">
              <div className="text-lg font-bold text-blue-600" data-id="7reurcobo" data-path="src/pages/ProfilePage.tsx">{user.totalGames}</div>
              <div className="text-xs text-gray-600" data-id="p7gry8m0d" data-path="src/pages/ProfilePage.tsx">Games Played</div>
            </div>
            <div data-id="5hrx7zkxf" data-path="src/pages/ProfilePage.tsx">
              <div className="text-lg font-bold text-green-600" data-id="7t94fzm8q" data-path="src/pages/ProfilePage.tsx">{user.streak}</div>
              <div className="text-xs text-gray-600" data-id="2x78dmlqe" data-path="src/pages/ProfilePage.tsx">Day Streak</div>
            </div>
            <div data-id="gbgiz21k2" data-path="src/pages/ProfilePage.tsx">
              <div className="text-lg font-bold text-purple-600" data-id="kep4bfm9g" data-path="src/pages/ProfilePage.tsx">
                {Math.round(Object.values(user.cognitiveScores).reduce((a, b) => a + b, 0) / Object.values(user.cognitiveScores).length)}
              </div>
              <div className="text-xs text-gray-600" data-id="ua4v4cpgf" data-path="src/pages/ProfilePage.tsx">Avg Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card data-id="u9cz9gl1y" data-path="src/pages/ProfilePage.tsx">
        <CardHeader data-id="o3pzb20pl" data-path="src/pages/ProfilePage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="0fu08s0wz" data-path="src/pages/ProfilePage.tsx">
            <Target className="h-5 w-5 text-green-600" data-id="wwvaepmfj" data-path="src/pages/ProfilePage.tsx" />
            <span data-id="4d7gzj6wu" data-path="src/pages/ProfilePage.tsx">Your Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="m06m1fjoo" data-path="src/pages/ProfilePage.tsx">
          {user.goals && user.goals.length > 0 ?
          <div className="flex flex-wrap gap-2" data-id="ixhtrk2vd" data-path="src/pages/ProfilePage.tsx">
              {user.goals.map((goal, index) =>
            <Badge key={index} className="bg-green-100 text-green-700" data-id="wogxvbf0c" data-path="src/pages/ProfilePage.tsx">
                  {goal}
                </Badge>
            )}
            </div> :

          <p className="text-gray-600" data-id="hdhvbm2i7" data-path="src/pages/ProfilePage.tsx">No goals set yet.</p>
          }
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card data-id="nwzj6a4nl" data-path="src/pages/ProfilePage.tsx">
        <CardHeader data-id="p7ju2j254" data-path="src/pages/ProfilePage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="0ff65umvs" data-path="src/pages/ProfilePage.tsx">
            <Settings className="h-5 w-5 text-gray-600" data-id="ent0oel6u" data-path="src/pages/ProfilePage.tsx" />
            <span data-id="7cy0jv281" data-path="src/pages/ProfilePage.tsx">Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6" data-id="hn48712m7" data-path="src/pages/ProfilePage.tsx">
          {isEditing ?
          <div className="space-y-4" data-id="347mp45yk" data-path="src/pages/ProfilePage.tsx">
              <div data-id="xgrbxoz25" data-path="src/pages/ProfilePage.tsx">
                <Label htmlFor="sessionLength" data-id="tnumgrljc" data-path="src/pages/ProfilePage.tsx">Default Session Length (minutes)</Label>
                <Input
                id="sessionLength"
                type="number"
                value={editForm.sessionLength}
                onChange={(e) => setEditForm((prev) => ({ ...prev, sessionLength: parseInt(e.target.value) }))}
                min="5"
                max="60" data-id="zqkhqbvah" data-path="src/pages/ProfilePage.tsx" />

              </div>
              <div data-id="a3ozi79y1" data-path="src/pages/ProfilePage.tsx">
                <Label htmlFor="reminderTime" data-id="wig1qx9qs" data-path="src/pages/ProfilePage.tsx">Daily Reminder Time</Label>
                <Input
                id="reminderTime"
                type="time"
                value={editForm.reminderTime}
                onChange={(e) => setEditForm((prev) => ({ ...prev, reminderTime: e.target.value }))} data-id="mn3v2et2m" data-path="src/pages/ProfilePage.tsx" />

              </div>
            </div> :

          <div className="space-y-4" data-id="squ7d0pe1" data-path="src/pages/ProfilePage.tsx">
              <div className="flex items-center justify-between" data-id="z4nxb8pf7" data-path="src/pages/ProfilePage.tsx">
                <div data-id="msy2ioox7" data-path="src/pages/ProfilePage.tsx">
                  <div className="font-medium" data-id="782on1p20" data-path="src/pages/ProfilePage.tsx">Session Length</div>
                  <div className="text-sm text-gray-600" data-id="qiuvz8pdy" data-path="src/pages/ProfilePage.tsx">{user.preferences.sessionLength} minutes</div>
                </div>
              </div>
              <div className="flex items-center justify-between" data-id="39gnf1fxe" data-path="src/pages/ProfilePage.tsx">
                <div data-id="0er7p91h1" data-path="src/pages/ProfilePage.tsx">
                  <div className="font-medium" data-id="ogg7q1cji" data-path="src/pages/ProfilePage.tsx">Daily Reminder</div>
                  <div className="text-sm text-gray-600" data-id="62rpvvpa4" data-path="src/pages/ProfilePage.tsx">{user.preferences.reminderTime}</div>
                </div>
              </div>
              <div className="flex items-center justify-between" data-id="ywbzbe7te" data-path="src/pages/ProfilePage.tsx">
                <div data-id="79dd89dd1" data-path="src/pages/ProfilePage.tsx">
                  <div className="font-medium" data-id="ueqgtjx2f" data-path="src/pages/ProfilePage.tsx">Difficulty</div>
                  <div className="text-sm text-gray-600 capitalize" data-id="r68qyirh3" data-path="src/pages/ProfilePage.tsx">{user.preferences.difficulty}</div>
                </div>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Smart Reminders */}
      <ReminderSystem data-id="05hv93tpj" data-path="src/pages/ProfilePage.tsx" />

      {/* Account Security */}
      <Card data-id="vlbkoi0oj" data-path="src/pages/ProfilePage.tsx">
        <CardHeader data-id="nobhx0ouf" data-path="src/pages/ProfilePage.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="ql8ymolm6" data-path="src/pages/ProfilePage.tsx">
            <Shield className="h-5 w-5 text-red-600" data-id="1xh6djk65" data-path="src/pages/ProfilePage.tsx" />
            <span data-id="z3eastqlm" data-path="src/pages/ProfilePage.tsx">Account & Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="k0x5aai6r" data-path="src/pages/ProfilePage.tsx">
          <Button variant="outline" className="w-full justify-start" data-id="3iso10tk3" data-path="src/pages/ProfilePage.tsx">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start" data-id="tpd2rsjcf" data-path="src/pages/ProfilePage.tsx">
            Export Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" data-id="7vmekg84h" data-path="src/pages/ProfilePage.tsx">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>);

};

export default ProfilePage;