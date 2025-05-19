
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

type MenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  link?: string;
  submenu?: MenuItem[];
};

type MenuSection = {
  label: string;
  items: MenuItem[];
};

interface ClassicMenuBarProps {
  sections: MenuSection[];
}

export function ClassicMenuBar({ sections }: ClassicMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeMenu && menuRefs.current[activeMenu] && 
          !menuRefs.current[activeMenu]?.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);
  
  const handleMenuClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };
  
  const handleItemClick = (item: MenuItem) => {
    setActiveMenu(null);
    if (item.onClick) {
      item.onClick();
    } else if (item.link) {
      navigate(item.link);
    }
  };
  
  return (
    <div className="w-full bg-muted border-b border-border menubar-90s">
      <div className="container mx-auto flex items-center h-10">
        {sections.map((section) => (
          <div 
            key={section.label}
            className="relative"
            ref={(el) => (menuRefs.current[section.label] = el)}
          >
            <div
              className={`px-4 py-1 cursor-pointer hover:bg-primary hover:text-white ${
                activeMenu === section.label ? 'bg-primary text-white' : ''
              }`}
              onClick={() => handleMenuClick(section.label)}
            >
              {section.label}
            </div>
            
            {activeMenu === section.label && (
              <div className="absolute left-0 top-full z-20 min-w-[200px] bg-muted border-outset card-90s py-1">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="px-4 py-1 cursor-pointer hover:bg-primary hover:text-white flex items-center"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {user && (
          <div className="ml-auto px-4 py-1 text-sm">
            Logged in as: <span className="font-bold">{user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassicMenuBar;
