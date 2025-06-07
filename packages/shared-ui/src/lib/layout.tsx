export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto">
      <main className="flex items-center flex-1 p-4 space-y-4">
        {children}
      </main>
    </div>
  );
};
