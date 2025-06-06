interface CarouselProps {
  tabIndex: number;
  title: React.ReactNode;
  children: React.ReactNode;
}

export const Carousel = ({ tabIndex, title, children }: CarouselProps) => {
  return (
    <div tabIndex={tabIndex} className="collapse collapse-arrow bg-base-100 border-base-300 border">
      <div className="collapse-title font-semibold">{title}</div>
      <div className="collapse-content text-sm">
        {children}
      </div>
    </div>
  );
};
