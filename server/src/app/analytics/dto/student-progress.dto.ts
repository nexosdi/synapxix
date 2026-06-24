
/**
 * Data transfer object for the student progress.
 */
export class StudentProgressDto {
  /**
   * The student id.
   * @example 'clxvf8g2g000008l5g1g2g3g4'
   */
  student_id: string;

  /**
   * The progress of the student.
   * @example 0.5
   */
  progress: number;
}
