import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import EditorLayout from '@/components/EditorLayout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <EditorLayout>
      <div className="p-8 font-mono">
        <div className="max-w-4xl">
          <div className="text-sm text-muted-foreground mb-4">
            1 │ # 404 - File Not Found
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            2 │
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            3 │ The file `{location.pathname}` does not exist in this repository.
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            4 │
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            5 │ ## Available files:
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            6 │
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            7 │ - [README.md](/)
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            8 │ - [about.md](/about)
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            9 │ - [experience.md](/experience)
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            10 │ - [blog/](/blog)
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            11 │
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            12 │ Use the file explorer on the left to navigate.
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};

export default NotFound;
