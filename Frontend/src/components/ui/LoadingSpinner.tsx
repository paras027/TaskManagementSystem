interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  return (
    <div className="loading-spinner">
      <div />
    </div>
  );
};