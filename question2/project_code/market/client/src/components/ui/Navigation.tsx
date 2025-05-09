import { Link, useLocation } from "wouter";

const Navigation = () => {
  const [location] = useLocation();

  const isActiveTab = (path: string): boolean => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-4 -mb-px overflow-x-auto">
        <div className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${isActiveTab('/') ? 'tab-active' : 'text-muted-foreground hover:text-foreground border-transparent hover:border-gray-300'}`}>
          <Link href="/">Stock Analysis</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
