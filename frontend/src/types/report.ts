export type Report = {
  success: boolean;
  error: string | null;
  successes: SuccessfulFileReport[];
  failures: FailedFileReport[];
};

export type SuccessfulFileReport = {
  input: string;
  output: string;
  outputSizeBytes: number;
  warnings: ReportWarning[];
};

export type FailedFileReport = {
  input: string;
  error: string;
};

export type ReportWarning = {
  stage: string;
  severity: string;
  code: string;
  message: string;
  context: ReportWarningContext[];
};

export type ReportWarningContext = {
  key: string;
  value: string;
};
