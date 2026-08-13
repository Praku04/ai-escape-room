import { ThemeType, DifficultyLevel, StoryConfig } from '../types/game';
import { STORY_TEMPLATES, StoryTemplate } from './storyTemplates';

export class StoryGenerator {
  /**
   * Generates a sequence of stories for a room given theme, difficulty, and story count.
   */
  public static generateStories(
    theme: ThemeType,
    difficulty: DifficultyLevel,
    storiesCount: number = 3,
    timePerStorySeconds: number = 120
  ): StoryConfig[] {
    // Filter templates for chosen theme or fallback to all
    const matchingTemplates = STORY_TEMPLATES.filter((t) => t.theme === theme);
    const pool = matchingTemplates.length >= storiesCount ? matchingTemplates : STORY_TEMPLATES;

    // Shuffle pool predictably or randomly
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedTemplates = shuffled.slice(0, storiesCount);

    return selectedTemplates.map((tmpl, index) => {
      // Inject difficulty-based adjustments
      const diffMultiplier = difficulty === 'EASY' ? 1.2 : difficulty === 'HARD' ? 0.8 : 1.0;
      const adjustedTime = Math.round(timePerStorySeconds * diffMultiplier);

      return {
        id: `story_${theme.toLowerCase()}_${index + 1}_${Date.now().toString(36)}`,
        theme: tmpl.theme,
        difficulty,
        order: index + 1,
        title: tmpl.title,
        description: tmpl.description,
        character: { ...tmpl.character },
        openingMessage: tmpl.openingMessageTemplate,
        hiddenObjective: tmpl.hiddenObjectiveTemplate,
        requiredFacts: [...tmpl.requiredFactsTemplates],
        successCriteria: [...tmpl.successCriteriaTemplates],
        clues: [...tmpl.cluesTemplates],
        timeLimitSeconds: adjustedTime
      };
    });
  }

  /**
   * Strip sensitive backend fields before broadcasting story config to clients.
   */
  public static sanitizeStoryForClient(story: StoryConfig): StoryConfig {
    const sanitized = { ...story };
    delete sanitized.hiddenObjective;
    delete sanitized.requiredFacts;
    delete sanitized.successCriteria;
    return sanitized;
  }
}
