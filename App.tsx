import React, { useState } from 'react';
import { LayoutDashboard, List, MessageSquareText, Settings, Bell, UserCircle, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AssetList from './components/AssetList';
import MaintenanceChat from './components/MaintenanceChat';
import { INITIAL_ASSETS } from './constants';
import { Asset } from './types';

enum View {
  DASHBOARD = 'Dashboard',
  INVENTORY = 'Inventory',
  CHAT = 'Assistant',
  SETTINGS = 'Settings'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);

  const handleAddAsset = (newAsset: Asset) => {
      setAssets(prev => [...prev, newAsset]);
  };

  const handleUpdateAsset = (updatedAsset: Asset) => {
      setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard assets={assets} />;
      case View.INVENTORY:
        return <AssetList assets={assets} onAddAsset={handleAddAsset} onUpdateAsset={handleUpdateAsset} />;
      case View.CHAT:
        return <div className="h-[calc(100vh-8rem)]"><MaintenanceChat assets={assets} /></div>;
      case View.SETTINGS:
        return (
            <div className="p-8 text-center text-slate-500">
                <Settings className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h2 className="text-xl font-medium text-slate-700">System Settings</h2>
                <p className="mt-2">User permissions and API configuration settings would go here.</p>
            </div>
        );
      default:
        return <Dashboard assets={assets} />;
    }
  };

  const NavItem: React.FC<{ view: View; icon: React.ElementType }> = ({ view, icon: Icon }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{view}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">A</div>
             <div>
                 <h1 className="text-lg font-bold tracking-tight">AssetTrack</h1>
                 <p className="text-xs text-slate-400">Industrial Edition</p>
             </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} />
            <NavItem view={View.INVENTORY} icon={List} />
            <NavItem view={View.CHAT} icon={MessageSquareText} />
            
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8">System</p>
            <NavItem view={View.SETTINGS} icon={Settings} />
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-slate-300"/>
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">Plant Manager</p>
                    <p className="text-xs text-slate-500 truncate">admin@facility.com</p>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">{currentView}</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto h-full">
             {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;