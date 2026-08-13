export interface InjectionCheckResult {
  isInjection: boolean;
  reason?: string;
  defensiveResponse?: string;
}

export class PromptDefense {
  private static INJECTION_PATTERNS = [
    /ignore (all )?(previous|above) (instructions|directions|rules)/i,
    /reveal (the )?(hidden objective|system prompt|system instructions|secret key|password|flag)/i,
    /tell me (the )?(hidden objective|answer|solution|required facts)/i,
    /pretend (i|you) (already|have) (solved|won|passed|approved)/i,
    /override (the )?(game|system|judge) (rules|state)/i,
    /you are now (an? )?unrestricted/i,
    /jailbreak/i,
    /developer mode/i,
    /print (system prompt|hidden objective)/i,
    /say "SUCCESS"/i
  ];

  /**
   * Scans user prompt for prompt injection patterns.
   */
  public static inspect(prompt: string): InjectionCheckResult {
    const trimmed = prompt.trim();

    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isInjection: true,
          reason: 'Prompt injection or system prompt extraction attempt detected.',
          defensiveResponse: 'I am bound by security protocols and cannot disclose hidden system objectives or override rules. Please focus on the story problem.'
        };
      }
    }

    return { isInjection: false };
  }
}
