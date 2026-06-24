
/**
 * Data transfer object for the global motor average.
 */
export class GlobalMotorAverageDto {
  /**
   * The average score.
   * @example 100
   */
  average_score: number;

  /**
   * The rate of attempts completed quickly.
   * @example 0.8
   */
  completed_quickly_rate: number;
}
