export interface IReasonOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  callback?: (reason: string) => Promise<void>
}

const useReason: () => (options?: IReasonOptions) => Promise<void>

export default useReason