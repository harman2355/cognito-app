import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, Calendar, Brain, Settings, Check, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { mlEngine } from './MLEngine';

interface ReminderSystemProps {
  className?: string;
}

interface Reminder {
  id: string;
  type: 'workout' | 'daily_goal' | 'streak_maintenance' | 'custom';
  title: string;
  message: string;
  scheduledTime: Date;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const ReminderSystem: React.FC<ReminderSystemProps> = ({
  className = ''
}) => {
  const { user } = useUser();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [smartSchedulingEnabled, setSmartSchedulingEnabled] = useState(true);
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
      generateIntelligentReminders();
    }
  }, [user]);

  useEffect(() => {
    if ('Notification' in window && remindersEnabled) {
      requestNotificationPermission();
    }
  }, [remindersEnabled]);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      const { data: prefsData, error } = await window.ezsite.apis.tablePage(9905, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [
        {
          "name": "user_id",
          "op": "Equal",
          "value": user.ID
        }]

      });

      if (!error && prefsData.List.length > 0) {
        setUserPreferences(prefsData.List[0]);
        setRemindersEnabled(prefsData.List[0].reminder_frequency !== 'never');
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const generateIntelligentReminders = async () => {
    if (!user || !userPreferences) return;

    try {
      // Get recent workout sessions to analyze patterns
      const { data: sessionsData, error } = await window.ezsite.apis.tablePage(9904, {
        "PageNo": 1,
        "PageSize": 30,
        "OrderByField": "ID",
        "IsAsc": false,
        "Filters": [
        {
          "name": "user_id",
          "op": "Equal",
          "value": user.ID
        }]

      });

      if (error) throw error;

      // Calculate optimal reminder time using ML
      const optimalTime = mlEngine.calculateOptimalReminderTime(
        sessionsData.List,
        userPreferences
      );

      setNextReminderTime(optimalTime);

      // Generate context-aware reminders
      const intelligentReminders = generateContextualReminders(
        sessionsData.List,
        userPreferences,
        optimalTime
      );

      setReminders(intelligentReminders);

    } catch (error) {
      console.error('Error generating intelligent reminders:', error);
    }
  };

  const generateContextualReminders = (
  recentSessions: any[],
  preferences: any,
  optimalTime: Date)
  : Reminder[] => {
    const reminders: Reminder[] = [];
    const now = new Date();

    // Analyze recent activity patterns
    const daysSinceLastSession = recentSessions.length > 0 ?
    Math.floor((now.getTime() - new Date(recentSessions[0].session_date).getTime()) / (1000 * 3600 * 24)) : 0;

    const averageSessionScore = recentSessions.length > 0 ?
    recentSessions.reduce((sum, session) => sum + session.overall_score, 0) / recentSessions.length : 0;

    // 1. Daily Goal Reminder
    if (preferences.reminder_frequency === 'daily') {
      reminders.push({
        id: 'daily_goal',
        type: 'daily_goal',
        title: 'Daily Brain Training',
        message: `Time for your daily cognitive workout! Your brain is most active around ${optimalTime.getHours()}:00.`,
        scheduledTime: optimalTime,
        isActive: true,
        priority: 'medium'
      });
    }

    // 2. Streak Maintenance (if user has a streak going)
    if (user.streak > 2 && daysSinceLastSession === 0) {
      const streakReminder = new Date(optimalTime);
      streakReminder.setDate(streakReminder.getDate() + 1);

      reminders.push({
        id: 'streak_maintenance',
        type: 'streak_maintenance',
        title: `Maintain Your ${user.streak}-Day Streak!`,
        message: `Don't break your amazing streak! A quick 5-minute session is all you need.`,
        scheduledTime: streakReminder,
        isActive: true,
        priority: 'high'
      });
    }

    // 3. Comeback Reminder (if user hasn't played in a while)
    if (daysSinceLastSession >= 2) {
      const comebackTime = new Date();
      comebackTime.setHours(optimalTime.getHours(), 0, 0, 0);

      reminders.push({
        id: 'comeback',
        type: 'workout',
        title: 'Welcome Back!',
        message: `We miss you! Your brain is ready for some exercise. Let's start with an easy warm-up.`,
        scheduledTime: comebackTime,
        isActive: true,
        priority: 'high'
      });
    }

    // 4. Performance-based Reminders
    if (averageSessionScore < 70 && recentSessions.length >= 3) {
      const practiceTime = new Date(optimalTime);
      practiceTime.setDate(practiceTime.getDate() + 1);

      reminders.push({
        id: 'practice_boost',
        type: 'workout',
        title: 'Practice Makes Perfect',
        message: `Your recent scores suggest some focused practice could help. Try our adaptive difficulty feature!`,
        scheduledTime: practiceTime,
        isActive: true,
        priority: 'medium'
      });
    }

    // 5. Achievement Celebration Reminder
    if (averageSessionScore > 85 && recentSessions.length >= 5) {
      const celebrationTime = new Date(optimalTime);
      celebrationTime.setHours(celebrationTime.getHours() + 1);

      reminders.push({
        id: 'celebration',
        type: 'custom',
        title: 'Outstanding Performance!',
        message: `You're on fire! 🔥 Ready to challenge yourself with harder levels?`,
        scheduledTime: celebrationTime,
        isActive: true,
        priority: 'low'
      });
    }

    return reminders.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
      }
    }
  };

  const scheduleNotification = (reminder: Reminder) => {
    if (!remindersEnabled || !('Notification' in window)) return;

    const now = new Date();
    const delay = reminder.scheduledTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(reminder.title, {
            body: reminder.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: reminder.id,
            requireInteraction: reminder.priority === 'high'
          });
        }
      }, delay);
    }
  };

  const toggleReminder = (reminderId: string) => {
    setReminders((prev) => prev.map((reminder) =>
    reminder.id === reminderId ?
    { ...reminder, isActive: !reminder.isActive } :
    reminder
    ));
  };

  const updateReminderSettings = async (newSettings: Partial<any>) => {
    if (!user || !userPreferences) return;

    try {
      const updatedPrefs = { ...userPreferences, ...newSettings };
      await window.ezsite.apis.tableUpdate(9905, updatedPrefs);
      setUserPreferences(updatedPrefs);

      // Regenerate reminders with new settings
      await generateIntelligentReminders();
    } catch (error) {
      console.error('Error updating reminder settings:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':return 'bg-green-100 text-green-700 border-green-300';
      default:return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className={className} data-id="9opwo3a7w" data-path="src/components/ml/ReminderSystem.tsx">
      <CardHeader data-id="lpaaiaiaw" data-path="src/components/ml/ReminderSystem.tsx">
        <CardTitle className="flex items-center justify-between" data-id="bkddbxw1k" data-path="src/components/ml/ReminderSystem.tsx">
          <div className="flex items-center space-x-2" data-id="ofrtfcxon" data-path="src/components/ml/ReminderSystem.tsx">
            <Bell className="h-5 w-5 text-blue-600" data-id="dubn20kr0" data-path="src/components/ml/ReminderSystem.tsx" />
            <span data-id="dhls4vhmq" data-path="src/components/ml/ReminderSystem.tsx">Smart Reminders</span>
          </div>
          <Switch
            checked={remindersEnabled}
            onCheckedChange={(checked) => {
              setRemindersEnabled(checked);
              updateReminderSettings({
                reminder_frequency: checked ? 'daily' : 'never'
              });
            }} data-id="qmxxm46rn" data-path="src/components/ml/ReminderSystem.tsx" />

        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4" data-id="pgtvfaagt" data-path="src/components/ml/ReminderSystem.tsx">
        {/* Settings */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-3" data-id="k6fvyr7dq" data-path="src/components/ml/ReminderSystem.tsx">
          <div className="flex items-center justify-between" data-id="1srhwr56a" data-path="src/components/ml/ReminderSystem.tsx">
            <div className="flex items-center space-x-2" data-id="4jvzw049e" data-path="src/components/ml/ReminderSystem.tsx">
              <Brain className="h-4 w-4 text-purple-600" data-id="83ag7c303" data-path="src/components/ml/ReminderSystem.tsx" />
              <span className="text-sm font-medium" data-id="l61i0cur6" data-path="src/components/ml/ReminderSystem.tsx">AI-Powered Scheduling</span>
            </div>
            <Switch
              checked={smartSchedulingEnabled}
              onCheckedChange={setSmartSchedulingEnabled}
              disabled={!remindersEnabled} data-id="b6b61kjzm" data-path="src/components/ml/ReminderSystem.tsx" />

          </div>
          
          {nextReminderTime && smartSchedulingEnabled &&
          <div className="text-xs text-gray-600 bg-white p-2 rounded border" data-id="85wdkulh6" data-path="src/components/ml/ReminderSystem.tsx">
              <Clock className="h-3 w-3 inline mr-1" data-id="2h0el7iqr" data-path="src/components/ml/ReminderSystem.tsx" />
              Next optimal reminder: {formatDate(nextReminderTime)} at {formatTime(nextReminderTime)}
            </div>
          }
        </div>

        {/* Active Reminders */}
        {reminders.length > 0 ?
        <div className="space-y-3" data-id="iz7zf4iyq" data-path="src/components/ml/ReminderSystem.tsx">
            <h4 className="text-sm font-medium text-gray-700" data-id="91j9m1cam" data-path="src/components/ml/ReminderSystem.tsx">Scheduled Reminders</h4>
            {reminders.map((reminder) =>
          <div
            key={reminder.id}
            className={`p-3 rounded-lg border ${
            reminder.isActive ? 'bg-white' : 'bg-gray-50 opacity-75'}`
            } data-id="0zledpgfa" data-path="src/components/ml/ReminderSystem.tsx">

                <div className="flex items-start justify-between" data-id="jgoar8st8" data-path="src/components/ml/ReminderSystem.tsx">
                  <div className="flex-1 space-y-1" data-id="743razcbm" data-path="src/components/ml/ReminderSystem.tsx">
                    <div className="flex items-center space-x-2" data-id="n08dvff2c" data-path="src/components/ml/ReminderSystem.tsx">
                      <h5 className="font-medium text-gray-800" data-id="8nuargca4" data-path="src/components/ml/ReminderSystem.tsx">{reminder.title}</h5>
                      <Badge className={getPriorityColor(reminder.priority)} data-id="bmsfbeap9" data-path="src/components/ml/ReminderSystem.tsx">
                        {reminder.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600" data-id="1svnbak0x" data-path="src/components/ml/ReminderSystem.tsx">{reminder.message}</p>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500" data-id="pl4utzpg7" data-path="src/components/ml/ReminderSystem.tsx">
                      <div className="flex items-center space-x-1" data-id="aw4oz8skd" data-path="src/components/ml/ReminderSystem.tsx">
                        <Calendar className="h-3 w-3" data-id="m3w5nqcc7" data-path="src/components/ml/ReminderSystem.tsx" />
                        <span data-id="y0z3t2apj" data-path="src/components/ml/ReminderSystem.tsx">{formatDate(reminder.scheduledTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1" data-id="9ep8iwctq" data-path="src/components/ml/ReminderSystem.tsx">
                        <Clock className="h-3 w-3" data-id="w6u1dbc7u" data-path="src/components/ml/ReminderSystem.tsx" />
                        <span data-id="w6cv97zzl" data-path="src/components/ml/ReminderSystem.tsx">{formatTime(reminder.scheduledTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReminder(reminder.id)}
                className="h-8 w-8 p-0" data-id="l5pvcctk7" data-path="src/components/ml/ReminderSystem.tsx">

                    {reminder.isActive ?
                <Check className="h-4 w-4 text-green-600" data-id="42zdqi59h" data-path="src/components/ml/ReminderSystem.tsx" /> :

                <X className="h-4 w-4 text-gray-400" data-id="j09276wt6" data-path="src/components/ml/ReminderSystem.tsx" />
                }
                  </Button>
                </div>
              </div>
          )}
          </div> :

        <div className="text-center py-6 text-gray-500" data-id="bidmo25nf" data-path="src/components/ml/ReminderSystem.tsx">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" data-id="y2ycavhci" data-path="src/components/ml/ReminderSystem.tsx" />
            <p className="text-sm" data-id="7b4oc561d" data-path="src/components/ml/ReminderSystem.tsx">No reminders scheduled</p>
            <p className="text-xs" data-id="wug31pilc" data-path="src/components/ml/ReminderSystem.tsx">Play some games to get personalized reminders</p>
          </div>
        }

        {/* Schedule all active reminders */}
        {remindersEnabled && reminders.some((r) => r.isActive) &&
        <Button
          onClick={() => {
            reminders.filter((r) => r.isActive).forEach(scheduleNotification);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="sm" data-id="wqw3nq7eo" data-path="src/components/ml/ReminderSystem.tsx">

            <Settings className="h-4 w-4 mr-2" data-id="yuirrfrm7" data-path="src/components/ml/ReminderSystem.tsx" />
            Enable Browser Notifications
          </Button>
        }

        <div className="text-xs text-gray-500 text-center" data-id="5xiq5ej4u" data-path="src/components/ml/ReminderSystem.tsx">
          Reminders are personalized based on your activity patterns and performance
        </div>
      </CardContent>
    </Card>);

};

export default ReminderSystem;