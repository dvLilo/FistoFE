export interface IConfirmationOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  callback?: () => void
}

const useConfirmation: () => (options?: IConfirmationOptions) => Promise<void>

export default useConfirmation