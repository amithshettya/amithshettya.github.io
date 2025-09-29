import { useState } from "react";
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Home, 
  User, 
  Briefcase,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface FileItem {
  name: string;
  path: string;
  type: 'file';
}

interface FolderItem {
  name: string;
  type: 'folder';
  children: (FileItem | FolderItem)[];
  expanded?: boolean;
}

const projectStructure: (FileItem | FolderItem)[] = [
  { name: "README.md", path: "/", type: 'file' },
  { name: "about.md", path: "/about", type: 'file' },
  { name: "experience.md", path: "/experience", type: 'file' },
  {
    name: "blog",
    type: 'folder',
    expanded: true,
    children: [
      { name: "building-scalable-react.md", path: "/blog/building-scalable-react", type: 'file' },
      { name: "future-of-web-dev.md", path: "/blog/future-of-web-dev", type: 'file' },
      { name: "database-optimization.md", path: "/blog/database-optimization", type: 'file' },
      { name: "typescript-intro.md", path: "/blog/typescript-intro", type: 'file' },
      { name: "docker-deployment.md", path: "/blog/docker-deployment", type: 'file' },
      { name: "modern-css.md", path: "/blog/modern-css", type: 'file' },
    ]
  },
  {
    name: "projects",
    type: 'folder',
    expanded: false,
    children: [
      { name: "portfolio-website.md", path: "/projects/portfolio", type: 'file' },
      { name: "task-manager.md", path: "/projects/task-manager", type: 'file' },
      { name: "chat-app.md", path: "/projects/chat-app", type: 'file' },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['blog']));

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const renderItem = (item: FileItem | FolderItem, depth = 0) => {
    if (item.type === 'file') {
      const isActive = currentPath === item.path;
      return (
        <SidebarMenuItem key={item.name} className={`ml-${depth * 4}`}>
          <SidebarMenuButton asChild>
            <NavLink 
              to={item.path} 
              className={`flex items-center gap-2 text-sm ${
                isActive 
                  ? 'bg-gruvbox-yellow/20 text-gruvbox-yellow border-l-2 border-gruvbox-yellow' 
                  : 'text-foreground hover:bg-muted/50'
              }`}
            >
              <FileText className="h-4 w-4 text-gruvbox-blue" />
              {!state || state === "expanded" ? <span className="font-mono">{item.name}</span> : null}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    } else {
      const isExpanded = expandedFolders.has(item.name);
      return (
        <div key={item.name} className={`ml-${depth * 4}`}>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleFolder(item.name)}
              className="flex items-center gap-2 text-sm text-foreground hover:bg-muted/50"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-gruvbox-orange" />
              ) : (
                <Folder className="h-4 w-4 text-gruvbox-orange" />
              )}
              {!state || state === "expanded" ? <span className="font-mono">{item.name}/</span> : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isExpanded && (
            <div className="ml-4">
              {item.children.map(child => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-80"} bg-card border-r border-border font-mono`}
    >
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gruvbox-yellow font-mono text-xs uppercase tracking-wider">
            {!state || state === "expanded" ? "📁 EXPLORER" : "📁"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {projectStructure.map(item => renderItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(!state || state === "expanded") && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="text-xs text-muted-foreground font-mono">
              <div className="flex justify-between">
                <span>Lines: 247</span>
                <span>UTF-8</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Markdown</span>
                <span>LF</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}