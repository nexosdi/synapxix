export class TeacherInsightReportResponseDto {
  reportId!: string;
  teacherId!: string;
  periodStart!: Date;
  periodEnd!: Date;
  studentCount!: number;
  activeStudents!: number;
  reportText!: string;
  status!: string;
  createdAt!: Date;
}