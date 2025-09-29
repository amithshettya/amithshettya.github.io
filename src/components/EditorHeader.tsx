import { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const EditorHeader = () => {
  const [activeTab, setActiveTab] = useState('README.md');
  
  const tabs = [
    { name: 'README.md', path: '/', modified: false },
    { name: 'about.md', path: '/about', modified: true },
  ];

  return (
    <header className="h-12 bg-card border-b border-border flex items-center">
      <SidebarTrigger className="ml-2 text-muted-foreground hover:text-foreground" />
      
      <div className="flex-1 flex items-center">
        <div className="flex ml-4">
          {tabs.map((tab) => (
            <div 
              key={tab.name}
              className={`flex items-center px-4 py-2 text-sm font-mono border-r border-border cursor-pointer ${
                activeTab === tab.name 
                  ? 'bg-background text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span>{tab.name}</span>
              {tab.modified && (
                <span className="ml-2 w-2 h-2 bg-gruvbox-yellow rounded-full"></span>
              )}
              <button className="ml-2 text-muted-foreground hover:text-foreground">×</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mr-4">
        <Button variant="ghost" size="sm" className="text-xs font-mono">
          Split Editor
        </Button>
        <Button variant="ghost" size="sm" className="text-xs font-mono">
          Preview
        </Button>
      </div>
    </header>
  );
};

export default EditorHeader;