
import React, { useState, useRef, useEffect } from 'react';
import { Asset, AssetStatus, SparePart, Module, UserRole } from '../types';
import { Search, Filter, AlertCircle, Calendar, Box, ChevronRight, X, ShieldCheck, ShieldAlert, Clock, Plus, Upload, Image as ImageIcon, History, PenTool, Check, ChevronLeft, Trash2, Save, Edit, Link as LinkIcon, Lock } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  modules?: Module[];
  categories?: string[];
  userRole: UserRole;
  onAddAsset: (asset: Asset) => void;
  onUpdateAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
}

type DetailViewMode = 'info' | 'history' | 'schedule';

const AssetList: React.FC<AssetListProps> = ({ assets, modules = [], categories = [], userRole, onAddAsset, onUpdateAsset, onDeleteAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [detailViewMode, setDetailViewMode] = useState<DetailViewMode>('info');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Permissions Logic
  const canAdd = userRole === 'Admin';
  const canEdit = userRole === 'Admin';
  const canDelete = userRole === 'Admin';
  // Schedule service is allowed for Admin, ServiceMan, and Operator
  const canSchedule = ['Admin', 'ServiceMan', 'Operator'].includes(userRole);
  
  // Service Schedule Form State
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');

  // Form State
  const initialFormState: Partial<Asset> = {
    category: categories[0] || 'Pump',
    status: AssetStatus.WORKING,
    make: '',
    model: '',
    location: '',
    moduleId: '',
    subModuleId: '',
    name: '',
    notes: '',
    imageUrl: '',
    spareParts: [],
    specifications: {},
    installationDate: '',
    warrantyExpDate: '',
    nextServiceDueDate: ''
  };

  const [assetForm, setAssetForm] = useState<Partial<Asset>>(initialFormState);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryValue, setCustomCategoryValue] = useState('');

  // Spare Part Input State
  const [tempPartName, setTempPartName] = useState('');
  const [tempPartMake, setTempPartMake] = useState('');
  
  // Spec Input State
  const [tempSpecKey, setTempSpecKey] = useState('');
  const [tempSpecValue, setTempSpecValue] = useState('');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Effect to update selectedAsset if the underlying asset in list changes (e.g. after edit)
  useEffect(() => {
      if (selectedAsset) {
          const updated = assets.find(a => a.id === selectedAsset.id);
          if (updated) setSelectedAsset(updated);
      }
  }, [assets]);

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.WORKING: return 'bg-emerald-100 text-emerald-800';
      case AssetStatus.MAINTENANCE: return 'bg-amber-100 text-amber-800';
      case AssetStatus.ATTENTION_NEEDED: return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const isWarrantyActive = (dateStr: string) => {
      return new Date(dateStr) > new Date();
  };

  const isServiceOverdue = (dateStr: string) => {
      return new Date(dateStr) < new Date();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssetForm(prev => ({ ...prev, [name]: value }));
    
    // If changing module, clear submodule
    if (name === 'moduleId') {
        setAssetForm(prev => ({ ...prev, subModuleId: '' }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === 'Other') {
          setIsCustomCategory(true);
          setAssetForm(prev => ({ ...prev, category: val }));
      } else {
          setIsCustomCategory(false);
          setAssetForm(prev => ({ ...prev, category: val }));
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAssetForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Spare Parts Management
  const handleAddSparePart = () => {
    if (!tempPartName.trim()) return;
    const newPart: SparePart = {
        name: tempPartName,
        materialOrMake: tempPartMake
    };
    setAssetForm(prev => ({
        ...prev,
        spareParts: [...(prev.spareParts || []), newPart]
    }));
    setTempPartName('');
    setTempPartMake('');
  };

  const handleRemoveSparePart = (index: number) => {
    setAssetForm(prev => ({
        ...prev,
        spareParts: (prev.spareParts || []).filter((_, i) => i !== index)
    }));
  };

  // Specifications Management
  const handleAddSpec = () => {
      if (!tempSpecKey.trim() || !tempSpecValue.trim()) return;
      setAssetForm(prev => ({
          ...prev,
          specifications: {
              ...(prev.specifications || {}),
              [tempSpecKey]: tempSpecValue
          }
      }));
      setTempSpecKey('');
      setTempSpecValue('');
  };

  const handleRemoveSpec = (key: string) => {
      setAssetForm(prev => {
          const newSpecs = { ...prev.specifications };
          delete newSpecs[key];
          return { ...prev, specifications: newSpecs };
      });
  };

  const handleOpenCreateModal = () => {
      setAssetForm(initialFormState);
      setIsEditing(false);
      setIsCustomCategory(false);
      setCustomCategoryValue('');
      setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (asset: Asset) => {
      setAssetForm({ ...asset });
      setIsEditing(true);
      
      // Check if current category is in the known list
      const knownCategories = categories;
      if (!knownCategories.includes(asset.category)) {
          setIsCustomCategory(true);
          setCustomCategoryValue(asset.category);
          setAssetForm(prev => ({...prev, category: 'Other'}));
      } else {
          setIsCustomCategory(false);
          setCustomCategoryValue('');
      }
      
      setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Capture any pending spare part
      let finalSpareParts = [...(assetForm.spareParts || [])];
      if (tempPartName.trim()) {
          finalSpareParts.push({
              name: tempPartName,
              materialOrMake: tempPartMake
          });
      }

       // Capture any pending spec
       let finalSpecs = { ...(assetForm.specifications || {}) };
       if (tempSpecKey.trim() && tempSpecValue.trim()) {
           finalSpecs[tempSpecKey] = tempSpecValue;
       }

      const installDate = assetForm.installationDate || new Date().toISOString().split('T')[0];
      // Defaults if not set
      const warrantyDate = assetForm.warrantyExpDate || new Date(new Date(installDate).setFullYear(new Date(installDate).getFullYear() + 1)).toISOString().split('T')[0];
      const serviceDate = assetForm.nextServiceDueDate || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0];

      // Resolve Hierarchy Location Name
      let locationName = assetForm.location || 'Plant';
      if (assetForm.moduleId) {
          const mod = modules.find(m => m.id === assetForm.moduleId);
          if (mod) {
              locationName = mod.name;
              if (assetForm.subModuleId) {
                  const sub = mod.subModules.find(s => s.id === assetForm.subModuleId);
                  if (sub) locationName += ` - ${sub.name}`;
              }
          }
      }

      // Resolve Category
      const finalCategory = isCustomCategory ? customCategoryValue : assetForm.category;

      const submittedAsset: Asset = {
          id: isEditing && assetForm.id ? assetForm.id : `ASSET-${Math.floor(Math.random() * 100000)}`,
          name: assetForm.name || 'Unknown Asset',
          category: finalCategory || 'Unknown',
          model: assetForm.model || 'Unknown',
          make: assetForm.make || 'Unknown',
          quantity: assetForm.quantity || 1,
          status: (assetForm.status as AssetStatus) || AssetStatus.WORKING,
          location: locationName,
          moduleId: assetForm.moduleId,
          subModuleId: assetForm.subModuleId,
          notes: assetForm.notes || '',
          specifications: finalSpecs,
          spareParts: finalSpareParts,
          installationDate: installDate,
          warrantyExpDate: warrantyDate,
          lastServiceDate: assetForm.lastServiceDate || installDate,
          nextServiceDueDate: serviceDate,
          imageUrl: assetForm.imageUrl,
          serviceHistory: assetForm.serviceHistory || []
      };

      if (isEditing) {
          onUpdateAsset(submittedAsset);
      } else {
          onAddAsset(submittedAsset);
      }

      setIsFormModalOpen(false);
      setAssetForm(initialFormState);
      setTempPartName('');
      setTempPartMake('');
      setTempSpecKey('');
      setTempSpecValue('');
      setIsCustomCategory(false);
  };

  const handleDeleteClick = (id: string) => {
      onDeleteAsset(id);
      if (selectedAsset?.id === id) {
          setSelectedAsset(null);
      }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedAsset || !scheduleDate) return;

      const updatedAsset: Asset = {
          ...selectedAsset,
          nextServiceDueDate: scheduleDate,
          status: AssetStatus.WORKING,
          // Add a service record entry
          serviceHistory: [
              {
                  id: `SR-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  type: 'Preventive',
                  performer: `Scheduled by ${userRole}`,
                  notes: scheduleNotes || 'Service scheduled'
              },
              ...(selectedAsset.serviceHistory || [])
          ]
      };
      
      onUpdateAsset(updatedAsset);
      setDetailViewMode('info');
      setScheduleDate('');
      setScheduleNotes('');
  };

  // Helper to get active submodule list based on selected module
  const activeSubModules = modules.find(m => m.id === assetForm.moduleId)?.subModules || [];

  return (
    <div className="h-full flex flex-col">
      {/* Filters & Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center flex-shrink-0">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search assets by name, model, or ID..."
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
             <Filter className="h-4 w-4 text-slate-500" />
             <select
                className="border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
             >
                <option value="All">All Statuses</option>
                {Object.values(AssetStatus).map(s => (
                <option key={s} value={s}>{s}</option>
                ))}
             </select>
          </div>
          {canAdd && (
            <button 
                onClick={handleOpenCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
            >
                <Plus className="w-4 h-4" />
                Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200 relative">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Operational Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Warranty & Service</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredAssets.length > 0 ? filteredAssets.map((asset) => {
                 const warrantyActive = isWarrantyActive(asset.warrantyExpDate);
                 const serviceOverdue = isServiceOverdue(asset.nextServiceDueDate);
                 
                 return (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => {
                    setSelectedAsset(asset);
                    setDetailViewMode('info');
                }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {asset.imageUrl ? (
                        <img src={asset.imageUrl} alt={asset.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${
                            asset.category === 'Pump' ? 'bg-blue-100 text-blue-600' :
                            asset.category === 'Sensor' ? 'bg-purple-100 text-purple-600' :
                            asset.category === 'Mixer' ? 'bg-orange-100 text-orange-600' :
                            'bg-slate-200 text-slate-600'
                        }`}>
                          {asset.category.substring(0,2).toUpperCase()}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{asset.name}</div>
                        <div className="text-xs text-slate-500">{asset.make} - {asset.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {asset.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-1 text-xs font-medium ${warrantyActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {warrantyActive ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                            {warrantyActive ? 'Warranty Active' : 'Warranty Expired'}
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-medium ${serviceOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                            <Clock className="w-3 h-3" />
                            {serviceOverdue ? 'Service Overdue' : `Due: ${asset.nextServiceDueDate}`}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                        {canEdit && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(asset);
                                }}
                                className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Edit Asset"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                        {canDelete && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(asset.id);
                                }}
                                className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Asset"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-300 mt-2" />
                    </div>
                  </td>
                </tr>
              )}) : (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          <Box className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium">No assets found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Asset Modal */}
      {isFormModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Asset' : 'Add New Asset'}</h2>
                    <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                    {/* Top Section: Image & Core Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Image Upload */}
                        <div className="md:col-span-1">
                            <div 
                                className="w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors relative overflow-hidden bg-slate-50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {assetForm.imageUrl ? (
                                <img src={assetForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                <>
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <p className="text-xs text-center text-slate-500 px-2">Click to upload image</p>
                                </>
                                )}
                                <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                />
                            </div>
                            {assetForm.imageUrl && (
                                <button 
                                    type="button" 
                                    onClick={() => setAssetForm(prev => ({...prev, imageUrl: ''}))}
                                    className="text-xs text-red-500 mt-2 w-full text-center hover:underline"
                                >
                                    Remove Image
                                </button>
                            )}
                        </div>
                        
                        {/* Core Fields */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Asset Name</label>
                                <input required name="name" value={assetForm.name} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Backup Pump A" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                                    <select name="category" value={assetForm.category} onChange={handleCategoryChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="Other">Other...</option>
                                    </select>
                                    {isCustomCategory && (
                                        <input 
                                            type="text"
                                            value={customCategoryValue}
                                            onChange={(e) => setCustomCategoryValue(e.target.value)}
                                            placeholder="Enter Category Name"
                                            className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                            autoFocus
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
                                    <select name="status" value={assetForm.status} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                        {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                             
                             {/* Dynamic Hierarchy / Location */}
                             <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location / Module</label>
                                {modules && modules.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <select 
                                            name="moduleId" 
                                            value={assetForm.moduleId} 
                                            onChange={handleFormChange} 
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        >
                                            <option value="">Select Module...</option>
                                            {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                        
                                        <select 
                                            name="subModuleId" 
                                            value={assetForm.subModuleId} 
                                            onChange={handleFormChange} 
                                            disabled={!assetForm.moduleId}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-slate-100 disabled:text-slate-400"
                                        >
                                            <option value="">Select Sub-module...</option>
                                            {activeSubModules.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <input 
                                            name="location" 
                                            value={assetForm.location} 
                                            onChange={handleFormChange} 
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2" 
                                            placeholder="e.g. Pump House" 
                                        />
                                        <p className="text-xs text-amber-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> 
                                            Define Modules in Settings to enable hierarchy.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="space-y-4 border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-bold text-slate-800">Technical Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Make</label>
                                <input name="make" value={assetForm.make} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Model</label>
                                <input name="model" value={assetForm.model} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Installation Date</label>
                                <input type="date" name="installationDate" value={assetForm.installationDate || ''} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Warranty Exp.</label>
                                <input type="date" name="warrantyExpDate" value={assetForm.warrantyExpDate || ''} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                            </div>
                        </div>
                        
                        {/* Dynamic Specifications */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Additional Specifications</label>
                            <div className="space-y-2">
                                {assetForm.specifications && Object.entries(assetForm.specifications).map(([key, val]) => (
                                    <div key={key} className="flex gap-2 items-center">
                                        <input readOnly value={key} className="flex-1 text-sm bg-white border border-slate-200 rounded px-2 py-1 text-slate-500" />
                                        <input readOnly value={val} className="flex-1 text-sm bg-white border border-slate-200 rounded px-2 py-1 text-slate-800" />
                                        <button type="button" onClick={() => handleRemoveSpec(key)} className="text-red-400 hover:text-red-600 p-1">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex gap-2 mt-2">
                                    <input 
                                        placeholder="Spec Name (e.g. HP)" 
                                        value={tempSpecKey} 
                                        onChange={e => setTempSpecKey(e.target.value)}
                                        className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <input 
                                        placeholder="Value (e.g. 10)" 
                                        value={tempSpecValue} 
                                        onChange={e => setTempSpecValue(e.target.value)}
                                        className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddSpec} 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Spare Parts Section */}
                    <div className="space-y-2 border-t border-slate-100 pt-4">
                        <label className="block text-sm font-bold text-slate-800">Recommended Spare Parts</label>
                        {assetForm.spareParts && assetForm.spareParts.length > 0 && (
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 space-y-1 max-h-32 overflow-y-auto">
                                {assetForm.spareParts.map((part, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-slate-100 text-sm">
                                        <span className="text-slate-700 font-medium">
                                            {part.name} <span className="text-slate-400 font-normal">({part.materialOrMake || 'Generic'})</span>
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveSparePart(idx)} 
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input 
                                placeholder="Part Name" 
                                value={tempPartName} 
                                onChange={e => setTempPartName(e.target.value)}
                                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <input 
                                placeholder="Material/Make" 
                                value={tempPartMake} 
                                onChange={e => setTempPartMake(e.target.value)}
                                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button 
                                type="button" 
                                onClick={handleAddSparePart} 
                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg border border-blue-200 transition-colors"
                                title="Add this part"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Notes</label>
                        <textarea name="notes" value={assetForm.notes} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 h-20 resize-none" placeholder="Additional details..." />
                    </div>

                    <div className="pt-4 flex gap-3">
                         <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">
                            {isEditing ? 'Update Asset' : 'Save Asset'}
                        </button>
                    </div>
                </form>
            </div>
          </div>
      )}

      {/* Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex justify-between items-center z-10 rounded-t-xl">
               <div className="flex items-center gap-3">
                   {detailViewMode !== 'info' && (
                       <button 
                        onClick={() => setDetailViewMode('info')}
                        className="p-1 hover:bg-slate-100 rounded-full mr-2"
                       >
                           <ChevronLeft className="w-5 h-5 text-slate-500" />
                       </button>
                   )}
                   <div>
                        <h2 className="text-xl font-bold text-slate-800">{selectedAsset.name}</h2>
                        <p className="text-sm text-slate-500">ID: {selectedAsset.id} | Category: {selectedAsset.category}</p>
                   </div>
               </div>
               <div className="flex items-center gap-2">
                   {detailViewMode === 'info' && (
                       <>
                        {canEdit && (
                            <button 
                                onClick={() => handleOpenEditModal(selectedAsset)}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-full"
                                title="Edit"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                        )}
                        {canDelete && (
                            <button 
                                onClick={() => handleDeleteClick(selectedAsset.id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-full"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                       </>
                   )}
                   <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-6 h-6 text-slate-500" />
                   </button>
               </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {detailViewMode === 'info' && (
                    <div className="space-y-6">
                        {/* Image Display if available */}
                        {selectedAsset.imageUrl && (
                        <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden mb-4 border border-slate-200">
                            <img src={selectedAsset.imageUrl} alt={selectedAsset.name} className="w-full h-full object-contain" />
                        </div>
                        )}

                        {/* Status and Critical Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase">Condition</span>
                                <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(selectedAsset.status)}`}>
                                    {selectedAsset.status}
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-lg border ${isServiceOverdue(selectedAsset.nextServiceDueDate) ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                    <Calendar className="w-3 h-3"/> Next Service
                                </span>
                                <p className={`mt-1 text-sm font-semibold ${isServiceOverdue(selectedAsset.nextServiceDueDate) ? 'text-red-700' : 'text-slate-800'}`}>
                                    {selectedAsset.nextServiceDueDate}
                                </p>
                                {isServiceOverdue(selectedAsset.nextServiceDueDate) && (
                                    <span className="text-[10px] text-red-600 font-bold uppercase">Overdue</span>
                                )}
                            </div>

                            <div className={`p-4 rounded-lg border ${isWarrantyActive(selectedAsset.warrantyExpDate) ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                    {isWarrantyActive(selectedAsset.warrantyExpDate) ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} Warranty
                                </span>
                                <p className={`mt-1 text-sm font-semibold ${isWarrantyActive(selectedAsset.warrantyExpDate) ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {isWarrantyActive(selectedAsset.warrantyExpDate) ? 'Active' : 'Expired'}
                                </p>
                                <span className="text-[10px] text-slate-400">Ends: {selectedAsset.warrantyExpDate}</span>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase mb-3 border-b pb-1">Technical Specifications</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500">Manufacturer</span>
                                    <span className="text-sm font-medium text-slate-900">{selectedAsset.make}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500">Model</span>
                                    <span className="text-sm font-medium text-slate-900">{selectedAsset.model}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500">Installed</span>
                                    <span className="text-sm font-medium text-slate-900">{selectedAsset.installationDate}</span>
                                </div>
                                {Object.entries(selectedAsset.specifications || {}).map(([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                        <span className="text-xs text-slate-500">{key}</span>
                                        <span className="text-sm font-medium text-slate-900">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedAsset.notes && (
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-800">Field Observations</h4>
                                    <p className="text-sm text-amber-700 mt-1">{selectedAsset.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Spare Parts */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase mb-3 border-b pb-1 flex items-center gap-2"><Box className="w-4 h-4" /> Recommended Spare Parts</h3>
                            {selectedAsset.spareParts && selectedAsset.spareParts.length > 0 ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {selectedAsset.spareParts.map((part, idx) => (
                                        <li key={idx} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded border border-slate-100">
                                            <span className="text-sm text-slate-700 font-medium">{part.name}</span>
                                            <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                                                {part.materialOrMake || 'Generic'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No specific spare parts listed in database. Refer to manufacturer manual.</p>
                            )}
                        </div>
                    </div>
                )}

                {detailViewMode === 'history' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-500" /> Service History
                        </h3>
                        {selectedAsset.serviceHistory && selectedAsset.serviceHistory.length > 0 ? (
                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 py-4">
                                {selectedAsset.serviceHistory.map((record) => (
                                    <div key={record.id} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                            <span className="text-sm font-bold text-slate-800">{record.date}</span>
                                            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200 w-fit">
                                                {record.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 italic mb-1">Technician: {record.performer}</p>
                                        <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            {record.notes}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                 <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                 <p className="text-slate-500 font-medium">No service history recorded.</p>
                                 <p className="text-xs text-slate-400">Maintenance records will appear here once logged.</p>
                             </div>
                        )}
                    </div>
                )}

                {detailViewMode === 'schedule' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" /> Schedule Service
                        </h3>
                        <form onSubmit={handleScheduleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Next Service Date</label>
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={scheduleDate} 
                                    onChange={(e) => setScheduleDate(e.target.value)} 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                                <p className="text-xs text-slate-500 mt-1">Current Due Date: {selectedAsset.nextServiceDueDate}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance Notes (Optional)</label>
                                <textarea 
                                    value={scheduleNotes}
                                    onChange={(e) => setScheduleNotes(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none" 
                                    placeholder="Describe planned activities or reason for scheduling..." 
                                />
                            </div>
                            <div className="pt-2 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-xs mb-4">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Scheduling a new service date implies that the asset will be inspected or serviced on this date.</span>
                            </div>
                            <button 
                                type="submit" 
                                disabled={!scheduleDate}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                <Check className="w-4 h-4" /> Confirm Schedule
                            </button>
                        </form>
                    </div>
                )}
            </div>
            
            {/* Footer Actions (Only visible in 'info' mode) */}
            {detailViewMode === 'info' && (
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3 rounded-b-xl">
                    <button 
                        onClick={() => setDetailViewMode('history')}
                        className="bg-white hover:bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                        <History className="w-4 h-4" /> View History
                    </button>
                    {canSchedule && (
                        <button 
                            onClick={() => setDetailViewMode('schedule')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <PenTool className="w-4 h-4" /> Schedule Service
                        </button>
                    )}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;
