export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto">
      <main className="flex flex-1 w-full items-center p-4 space-y-4">
        {children}
      </main>
    </div>
  );
};
