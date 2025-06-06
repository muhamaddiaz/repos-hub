import { Input, Button, Carousel } from "@repos-hub/shared-ui";

export function App() {
  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-8">Welcome to Repos Hub!</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shared UI Input Component:</h2>
          <Input />
        </div>

        <Carousel />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Shared UI Button Components:</h2>
          <div className="space-x-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary" size="lg">Secondary Button</Button>
            <Button variant="accent">Accent Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
