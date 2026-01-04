export interface Result<T> {
  data?: T;
  errorMessage?: string | null;
  success: boolean;
}
