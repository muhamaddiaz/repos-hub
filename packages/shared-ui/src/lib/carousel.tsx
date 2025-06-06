export const Carousel = () => {
  return (
    <div className="space-y-2">
      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">How do I create an account?</div>
        <div className="collapse-content text-sm">
          Click the "Sign Up" button in the top right corner and follow the registration process.
        </div>
      </div>
      <div tabIndex={1} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">How do I create an account?</div>
        <div className="collapse-content text-sm">
          Click the "Sign Up" button in the top right corner and follow the registration process.
        </div>
      </div>
    </div>
  );
};
