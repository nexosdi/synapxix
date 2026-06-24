
    /**
 * Data transfer object for the global cognitive average.
 */
export class GlobalCognitiveAverageDto {
    /**
     * The average accuracy of all users.
     * @example 0.85
     */
    accuracy: number;
  
    /**
     * The average reaction time of all users.
     * @example 1200
     */
    reaction_time: number;
  
    /**
     * The average cognitive load of all users.
     * @example 0.75
     */
    cognitive_load: number;
  }
  