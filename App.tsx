
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, MessageSquareText, Settings, Bell, UserCircle, Menu, X, FolderKanban, Plus, Trash2, Check, Lock, Shield, Tag } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AssetList from './components/AssetList';
import MaintenanceChat from './components/MaintenanceChat';
import { INITIAL_ASSETS, INITIAL_MODULES, DEFAULT_CATEGORIES } from './constants';
import { Asset, Project, Module, UserRole } from './types';

enum View {
  DASHBOARD = 'Dashboard',
  INVENTORY = 'Inventory',
  CHAT = 'Assistant',
  SETTINGS = 'Settings'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  // RBAC State
  const [userRole, setUserRole] = useState<UserRole>('Admin');

  // Project State with LocalStorage Persistence
  const [projects, setProjects] = useState<Project[]>(() => {
      const savedProjects = localStorage.getItem('assetTrackProjects');
      if (savedProjects) {
          try {
              return JSON.parse(savedProjects);
          } catch (e) {
              console.error("Failed to parse projects from local storage", e);
          }
      }
      // Default initial state if nothing in local storage
      return [{ 
          id: 'default-project', 
          name: 'Main Plant', 
          assets: INITIAL_ASSETS, 
          modules: INITIAL_MODULES,
          categories: DEFAULT_CATEGORIES
      }];
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(() => {
      return localStorage.getItem('assetTrackCurrentProjectId') || 'default-project';
  });

  // Save to LocalStorage whenever projects change
  useEffect(() => {
      localStorage.setItem('assetTrackProjects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
      localStorage.setItem('assetTrackCurrentProjectId', currentProjectId);
  }, [currentProjectId]);

  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];
  const assets = currentProject.assets;
  const modules = currentProject.modules || [];
  const categories = currentProject.categories || DEFAULT_CATEGORIES;

  const handleCreateProject = (e: React.FormEvent) => {
      e.preventDefault();
      if (newProjectName.trim()) {
          const newProject: Project = {
              id: `proj-${Date.now()}`,
              name: newProjectName,
              assets: [],
              modules: [],
              categories: DEFAULT_CATEGORIES
          };
          setProjects(prev => [...prev, newProject]);
          setCurrentProjectId(newProject.id);
          setNewProjectName('');
          setIsProjectModalOpen(false);
      }
  };

  const handleAddAsset = (newAsset: Asset) => {
      setProjects(prev => prev.map(p => {
          if (p.id === currentProjectId) {
              return { ...p, assets: [...p.assets, newAsset] };
          }
          return p;
      }));
  };

  const handleUpdateAsset = (updatedAsset: Asset) => {
      setProjects(prev => prev.map(p => {
          if (p.id === currentProjectId) {
              return { 
                  ...p, 
                  assets: p.assets.map(a => a.id === updatedAsset.id ? updatedAsset : a) 
              };
          }
          return p;
      }));
  };

  const handleDeleteAsset = (assetId: string) => {
      if (window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
          setProjects(prev => prev.map(p => {
            if (p.id === currentProjectId) {
                return {
                    ...p,
                    assets: p.assets.filter(a => a.id !== assetId)
                };
            }
            return p;
          }));
      }
  };

  // --- Structure / Module Management ---
  
  const handleAddModule = (moduleName: string) => {
      if (!moduleName.trim()) return;
      const newModule: Module = { id: `mod-${Date.now()}`, name: moduleName, subModules: [] };
      setProjects(prev => prev.map(p => 
          p.id === currentProjectId ? { ...p, modules: [...(p.modules || []), newModule] } : p
      ));
  };

  const handleDeleteModule = (moduleId: string) => {
      if(!window.confirm("Delete this module and its submodules? Assets linked to this module will lose their hierarchy link.")) return;
      setProjects(prev => prev.map(p => 
          p.id === currentProjectId ? { ...p, modules: (p.modules || []).filter(m => m.id !== moduleId) } : p
      ));
  };

  const handleAddSubModule = (moduleId: string, subModuleName: string) => {
       if (!subModuleName.trim()) return;
       const newSub: {id: string, name: string} = { id: `sub-${Date.now()}`, name: subModuleName };
       setProjects(prev => prev.map(p => {
           if (p.id !== currentProjectId) return p;
           const updatedModules = (p.modules || []).map(m => 
               m.id === moduleId ? { ...m, subModules: [...m.subModules, newSub] } : m
           );
           return { ...p, modules: updatedModules };
       }));
  };

   const handleDeleteSubModule = (moduleId: string, subModuleId: string) => {
       setProjects(prev => prev.map(p => {
           if (p.id !== currentProjectId) return p;
           const updatedModules = (p.modules || []).map(m => 
               m.id === moduleId ? { ...m, subModules: m.subModules.filter(s => s.id !== subModuleId) } : m
           );
           return { ...p, modules: updatedModules };
       }));
  };

  // --- Category Management ---
  const handleAddCategory = (catName: string) => {
      if (!catName.trim() || categories.includes(catName)) return;
      setProjects(prev => prev.map(p => 
        p.id === currentProjectId ? { ...p, categories: [...(p.categories || []), catName] } : p
      ));
  };

  const handleDeleteCategory = (catName: string) => {
      if (!window.confirm(`Remove "${catName}" from categories? Assets using this category will keep the text but it won't appear in the list.`)) return;
      setProjects(prev => prev.map(p => 
        p.id === currentProjectId ? { ...p, categories: (p.categories || []).filter(c => c !== catName) } : p
      ));
  };

  // --- Settings View Component ---
  const SettingsView = () => {
      const [newModName, setNewModName] = useState('');
      const [newSubName, setNewSubName] = useState('');
      const [newCatName, setNewCatName] = useState('');
      const [activeModForSub, setActiveModForSub] = useState<string | null>(null);

      if (userRole !== 'Admin') {
          return (
              <div className="flex flex-col items-center justify-center h-96 text-slate-500">
                  <Lock className="w-12 h-12 mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-700">Access Restricted</h3>
                  <p>Only Administrators can modify system settings.</p>
              </div>
          );
      }

      return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-blue-800">Admin Settings</h3>
                    <p className="text-sm text-blue-700">You are editing settings for project: <span className="font-semibold">{currentProject.name}</span></p>
                </div>
            </div>

            {/* Category Management */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex items-center gap-3 mb-6">
                    <Tag className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-slate-800">Asset Categories</h2>
                </div>
                <p className="text-slate-500 text-sm mb-6">Manage the list of asset categories available in the dropdown menu for this project.</p>
                
                <div className="flex gap-2 mb-6">
                    <input 
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="New Category (e.g. Generator)"
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button 
                        onClick={() => { handleAddCategory(newCatName); setNewCatName(''); }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-sm font-medium text-slate-700 flex items-center gap-2">
                            {cat}
                            <button onClick={() => handleDeleteCategory(cat)} className="text-slate-400 hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Module Management */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <FolderKanban className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-800">Plant Structure & Hierarchy</h2>
                </div>
                <p className="text-slate-500 text-sm mb-6">Define the physical or logical structure of your facility. Create Modules (e.g. Areas) and Sub-modules (e.g. Systems) to organize your assets.</p>
                
                <div className="space-y-6">
                    {/* Add Module */}
                    <div className="flex gap-2">
                        <input 
                            value={newModName}
                            onChange={(e) => setNewModName(e.target.value)}
                            placeholder="New Module Name (e.g. Raw Water Section)"
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button 
                            onClick={() => { handleAddModule(newModName); setNewModName(''); }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Add Module
                        </button>
                    </div>

                    {/* List Modules */}
                    <div className="grid grid-cols-1 gap-4">
                        {modules.length === 0 && (
                            <p className="text-center text-slate-400 py-8 italic bg-slate-50 rounded-lg border border-dashed border-slate-300">No modules defined yet.</p>
                        )}
                        {modules.map(mod => (
                            <div key={mod.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                        <FolderKanban className="w-4 h-4 text-slate-400" />
                                        {mod.name}
                                    </div>
                                    <button onClick={() => handleDeleteModule(mod.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-3">
                                    {/* Submodules List */}
                                    <div className="space-y-2 pl-4 border-l-2 border-slate-200 ml-1">
                                        {mod.subModules.map(sub => (
                                            <div key={sub.id} className="flex justify-between items-center text-sm group">
                                                <span className="text-slate-600">{sub.name}</span>
                                                <button onClick={() => handleDeleteSubModule(mod.id, sub.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {mod.subModules.length === 0 && <p className="text-xs text-slate-400 italic">No sub-modules</p>}
                                    </div>
                                    
                                    {/* Add Submodule Input */}
                                    <div className="flex gap-2 mt-3 pl-4">
                                        <input 
                                            placeholder="New Sub-module..."
                                            value={activeModForSub === mod.id ? newSubName : ''}
                                            onChange={(e) => { setActiveModForSub(mod.id); setNewSubName(e.target.value); }}
                                            className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <button 
                                            onClick={() => { if(activeModForSub === mod.id) { handleAddSubModule(mod.id, newSubName); setNewSubName(''); } }}
                                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 py-1 rounded text-xs font-medium"
                                        >
                                            Add Sub
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard assets={assets} />;
      case View.INVENTORY:
        return (
            <AssetList 
                assets={assets} 
                modules={modules}
                categories={categories}
                userRole={userRole}
                onAddAsset={handleAddAsset} 
                onUpdateAsset={handleUpdateAsset} 
                onDeleteAsset={handleDeleteAsset}
            />
        );
      case View.CHAT:
        return <div className="h-[calc(100vh-8rem)]"><MaintenanceChat assets={assets} userRole={userRole} /></div>;
      case View.SETTINGS:
        return <SettingsView />;
      default:
        return <Dashboard assets={assets} />;
    }
  };

  const NavItem: React.FC<{ view: View; icon: React.ElementType; restricted?: boolean }> = ({ view, icon: Icon, restricted }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      disabled={restricted}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-md'
          : restricted 
             ? 'text-slate-600 opacity-50 cursor-not-allowed' 
             : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{view} {restricted && <Lock className="w-3 h-3 inline ml-1" />}</span>
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

          {/* Project Switcher */}
          <div className="px-4 pt-4">
              <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Project</p>
              <div className="relative">
                  <select 
                    value={currentProjectId}
                    onChange={(e) => setCurrentProjectId(e.target.value)}
                    className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg p-2.5 border border-slate-700 focus:ring-blue-500 focus:border-blue-500 block appearance-none"
                  >
                      {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                  </select>
                  <FolderKanban className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
              {userRole === 'Admin' && (
                <button 
                    onClick={() => setIsProjectModalOpen(true)}
                    className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-blue-400 hover:text-blue-300 py-1 hover:bg-slate-800 rounded transition-colors"
                >
                    <Plus className="w-3 h-3" /> New Project
                </button>
              )}
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Menu</p>
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} />
            <NavItem view={View.INVENTORY} icon={List} />
            <NavItem view={View.CHAT} icon={MessageSquareText} />
            
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8">System</p>
            <NavItem view={View.SETTINGS} icon={Settings} restricted={userRole !== 'Admin'} />
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-slate-300"/>
                </div>
                <div className="overflow-hidden flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">Logged in as:</p>
                    <select 
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as UserRole)}
                        className="w-full bg-transparent text-sm font-medium text-white border-none p-0 focus:ring-0 cursor-pointer"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                        <option value="ServiceMan">ServiceMan</option>
                        <option value="Tester">Tester</option>
                        <option value="Customer">Customer</option>
                    </select>
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
            <div>
                <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">{currentView}</h2>
                <p className="text-xs text-slate-500 sm:hidden">{currentProject.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full">
                 {currentProject.name}
             </div>
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

      {/* Create Project Modal */}
      {isProjectModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800">Create New Project</h3>
                      <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                          <input 
                              autoFocus
                              required
                              value={newProjectName}
                              onChange={(e) => setNewProjectName(e.target.value)}
                              placeholder="e.g. West Wing Expansion"
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                      </div>
                      <div className="flex gap-3 justify-end mt-6">
                          <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Create Project</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
