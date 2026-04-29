export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const ok = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const fail = (message: string): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
});
