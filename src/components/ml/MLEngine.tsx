import { useState, useEffect } from 'react';

export interface PerformanceData {
  score: number;
  accuracy: number;
  timeSpent: number;
  reactionTime: number;
  mistakesCount: number;
  difficultyLevel: number;
  gameType: string;
}

export interface DifficultyRecommendation {
  newDifficulty: number;
  reason: string;
  confidence: number;
}

export interface WorkoutRecommendation {
  gameTypes: string[];
  duration: number;
  difficultyLevels: {[gameType: string]: number;};
  reasoning: string;
}

class MLEngine {
  private performanceHistory: PerformanceData[] = [];
  private readonly PERFORMANCE_WINDOW = 10; // Consider last 10 games for trend
  private readonly ADAPTATION_THRESHOLD = 0.7; // 70% accuracy threshold

  // Adaptive Difficulty Algorithm
  calculateAdaptiveDifficulty(
  currentPerformance: PerformanceData,
  historicalData: PerformanceData[])
  : DifficultyRecommendation {
    const recentPerformance = historicalData.
    filter((data) => data.gameType === currentPerformance.gameType).
    slice(-this.PERFORMANCE_WINDOW);

    if (recentPerformance.length < 3) {
      return {
        newDifficulty: currentPerformance.difficultyLevel,
        reason: "Insufficient data for adaptation",
        confidence: 0.5
      };
    }

    // Calculate performance metrics
    const avgAccuracy = recentPerformance.reduce((sum, data) => sum + data.accuracy, 0) / recentPerformance.length;
    const avgReactionTime = recentPerformance.reduce((sum, data) => sum + data.reactionTime, 0) / recentPerformance.length;
    const currentAccuracy = currentPerformance.accuracy;

    // Performance trend analysis
    const isImproving = this.calculateTrend(recentPerformance.map((d) => d.accuracy)) > 0.1;
    const isStable = Math.abs(currentAccuracy - avgAccuracy) < 10;
    const isDeclining = currentAccuracy < avgAccuracy - 15;

    let difficultyAdjustment = 0;
    let reason = "";
    let confidence = 0.8;

    if (currentAccuracy > 85 && avgReactionTime < 1000 && isImproving) {
      difficultyAdjustment = 1;
      reason = "Excellent performance - increasing challenge";
    } else if (currentAccuracy > 80 && isStable) {
      difficultyAdjustment = 0.5;
      reason = "Good performance - slight increase";
    } else if (currentAccuracy < 60 || isDeclining) {
      difficultyAdjustment = -1;
      reason = "Performance declining - reducing difficulty";
    } else if (currentAccuracy < 70) {
      difficultyAdjustment = -0.5;
      reason = "Low accuracy - slight decrease";
    } else {
      difficultyAdjustment = 0;
      reason = "Performance stable - maintaining difficulty";
    }

    const newDifficulty = Math.max(1, Math.min(10,
    currentPerformance.difficultyLevel + difficultyAdjustment));

    return {
      newDifficulty,
      reason,
      confidence
    };
  }

  // Custom Workout Generation
  generateCustomWorkout(
  userPreferences: any,
  recentPerformance: PerformanceData[],
  targetDuration: number = 15)
  : WorkoutRecommendation {
    const gameTypes = ['memory', 'attention', 'problem_solving', 'flexibility', 'speed'];

    // Analyze weak areas
    const performanceByGame = this.analyzeGamePerformance(recentPerformance);

    // Prioritize games that need improvement
    const sortedGames = gameTypes.sort((a, b) => {
      const aPerf = performanceByGame[a] || { avgAccuracy: 50, gamesPlayed: 0 };
      const bPerf = performanceByGame[b] || { avgAccuracy: 50, gamesPlayed: 0 };
      return aPerf.avgAccuracy - bPerf.avgAccuracy;
    });

    // Select games for workout (focus on improvement + preferences)
    const selectedGames = [];
    const difficultyLevels: {[gameType: string]: number;} = {};

    // Add weak areas (first 2-3 games)
    for (let i = 0; i < Math.min(3, sortedGames.length); i++) {
      const gameType = sortedGames[i];
      selectedGames.push(gameType);

      // Set appropriate difficulty based on recent performance
      const recentGameData = recentPerformance.
      filter((p) => p.gameType === gameType).
      slice(-5);

      if (recentGameData.length > 0) {
        const avgPerformance = recentGameData.reduce((sum, d) => sum + d.accuracy, 0) / recentGameData.length;
        difficultyLevels[gameType] = this.calculateOptimalDifficulty(avgPerformance, recentGameData[0]?.difficultyLevel || 1);
      } else {
        difficultyLevels[gameType] = 1;
      }
    }

    // Add user favorites if not already included
    const favorites = userPreferences.favorite_game_types || [];
    for (const favorite of favorites) {
      if (!selectedGames.includes(favorite) && selectedGames.length < 4) {
        selectedGames.push(favorite);
        difficultyLevels[favorite] = userPreferences.preferred_difficulty === 'easy' ? 1 :
        userPreferences.preferred_difficulty === 'hard' ? 3 : 2;
      }
    }

    const reasoning = this.generateWorkoutReasoning(performanceByGame, selectedGames, userPreferences);

    return {
      gameTypes: selectedGames,
      duration: targetDuration,
      difficultyLevels,
      reasoning
    };
  }

  // Performance Analysis
  private analyzeGamePerformance(performanceData: PerformanceData[]) {
    const gameStats: {[gameType: string]: {avgAccuracy: number;avgScore: number;gamesPlayed: number;};} = {};

    performanceData.forEach((data) => {
      if (!gameStats[data.gameType]) {
        gameStats[data.gameType] = { avgAccuracy: 0, avgScore: 0, gamesPlayed: 0 };
      }

      const stats = gameStats[data.gameType];
      stats.avgAccuracy = (stats.avgAccuracy * stats.gamesPlayed + data.accuracy) / (stats.gamesPlayed + 1);
      stats.avgScore = (stats.avgScore * stats.gamesPlayed + data.score) / (stats.gamesPlayed + 1);
      stats.gamesPlayed++;
    });

    return gameStats;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private calculateOptimalDifficulty(avgAccuracy: number, currentDifficulty: number): number {
    if (avgAccuracy > 85) return Math.min(10, currentDifficulty + 1);
    if (avgAccuracy < 60) return Math.max(1, currentDifficulty - 1);
    return currentDifficulty;
  }

  private generateWorkoutReasoning(performanceStats: any, selectedGames: string[], preferences: any): string {
    const weakAreas = Object.entries(performanceStats).
    filter(([_, stats]: [string, any]) => stats.avgAccuracy < 70).
    map(([game, _]) => game);

    let reasoning = "This workout is tailored for you based on: ";

    if (weakAreas.length > 0) {
      reasoning += `Focusing on improving ${weakAreas.join(', ')} skills. `;
    }

    if (preferences.favorite_game_types?.length > 0) {
      reasoning += `Including your favorite activities. `;
    }

    reasoning += "The difficulty levels are adjusted to challenge you optimally while ensuring progress.";

    return reasoning;
  }

  // Smart Reminder Timing
  calculateOptimalReminderTime(userHistory: any[], userPreferences: any): Date {
    const now = new Date();
    const recentSessions = userHistory.filter((session) => {
      const sessionDate = new Date(session.session_date);
      const daysDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 30; // Last 30 days
    });

    // Analyze when user is most active
    const hourFrequency: {[hour: number]: number;} = {};
    recentSessions.forEach((session) => {
      const hour = new Date(session.session_date).getHours();
      hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
    });

    // Find peak hour
    const peakHour = Object.entries(hourFrequency).
    reduce((max, [hour, freq]) => freq > max[1] ? [parseInt(hour), freq] : max, [9, 0])[0];

    // Schedule next reminder
    const nextReminder = new Date(now);
    nextReminder.setDate(now.getDate() + (userPreferences.reminder_frequency === 'daily' ? 1 :
    userPreferences.reminder_frequency === 'every_other_day' ? 2 : 7));
    nextReminder.setHours(peakHour, 0, 0, 0);

    return nextReminder;
  }
}

export const mlEngine = new MLEngine();

// React Hook for ML Features
export const useMLEngine = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<{
    difficulty?: DifficultyRecommendation;
    workout?: WorkoutRecommendation;
  }>({});

  const analyzePerfomance = async (currentPerformance: PerformanceData, userId: number) => {
    setIsAnalyzing(true);

    try {
      // Fetch user's historical performance
      const { data: historyData, error: historyError } = await window.ezsite.apis.tablePage(9903, {
        "PageNo": 1,
        "PageSize": 50,
        "OrderByField": "ID",
        "IsAsc": false,
        "Filters": [
        {
          "name": "user_id",
          "op": "Equal",
          "value": userId
        }]

      });

      if (historyError) throw historyError;

      const historicalData: PerformanceData[] = historyData.List.map((item: any) => ({
        score: item.score,
        accuracy: item.accuracy,
        timeSpent: item.time_spent,
        reactionTime: item.reaction_time,
        mistakesCount: item.mistakes_count,
        difficultyLevel: item.difficulty_level,
        gameType: item.game_type
      }));

      // Calculate adaptive difficulty
      const difficultyRec = mlEngine.calculateAdaptiveDifficulty(currentPerformance, historicalData);

      // Fetch user preferences for workout generation
      const { data: prefsData, error: prefsError } = await window.ezsite.apis.tablePage(9905, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [
        {
          "name": "user_id",
          "op": "Equal",
          "value": userId
        }]

      });

      if (!prefsError && prefsData.List.length > 0) {
        const preferences = prefsData.List[0];
        const workoutRec = mlEngine.generateCustomWorkout(
          preferences,
          historicalData,
          preferences.workout_duration_preference
        );

        setRecommendations({
          difficulty: difficultyRec,
          workout: workoutRec
        });
      } else {
        setRecommendations({ difficulty: difficultyRec });
      }

    } catch (error) {
      console.error('Error analyzing performance:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    recommendations,
    analyzePerfomance
  };
};