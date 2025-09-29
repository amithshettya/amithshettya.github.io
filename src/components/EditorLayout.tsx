const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 bg-background">
      <div className="h-full overflow-auto">
        {children}
      </div>
      
      {/* Status bar */}
      <div className="h-6 bg-card border-t border-border flex items-center justify-between px-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>Markdown</span>
        </div>
        <div className="flex items-center gap-4">
          <span>TypeScript React</span>
          <span className="text-gruvbox-green">● Live</span>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;