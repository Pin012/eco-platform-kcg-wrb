import { LucideIcon } from 'lucide-react';

export interface ToolModule {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  isExternal?: boolean;
  status: 'active' | 'development' | 'planned';
}
