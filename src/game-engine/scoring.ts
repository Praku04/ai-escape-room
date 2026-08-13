export class ScoringEngine {
  public static BASE_SCORE = 1000;
  public static SPEED_BONUS_MULTIPLIER = 5;

  /**
   * Calculates story completion score based on time taken vs time limit.
   */
  public static calculateStoryScore(timeLimitSeconds: number, completionSeconds: number): number {
    const elapsed = Math.min(Math.max(0, completionSeconds), timeLimitSeconds);
    const timeRemaining = Math.max(0, timeLimitSeconds - elapsed);
    const speedBonus = Math.round(timeRemaining * this.SPEED_BONUS_MULTIPLIER);
    return this.BASE_SCORE + speedBonus;
  }
}
