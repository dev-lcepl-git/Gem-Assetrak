import React, { useState, useRef } from 'react';
import { Asset, AssetStatus } from '../types';
import { Search, Filter, AlertCircle, Calendar, Box, ChevronRight, X, ShieldCheck, ShieldAlert, Clock, Plus, Upload, Image as ImageIcon, History, PenTool, Check, ChevronLeft } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onUpdateAsset: (asset: Asset) => void;
}

type DetailViewMode = 'info' | 'history' | 'schedule';

const AssetList: React.FC<AssetListProps> = ({ assets, onAddAsset, onUpdateAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [detailViewMode, setDetailViewMode] = useState<DetailViewMode>('info');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Service Schedule Form State
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');

  // Form State
  const [newAssetForm, setNewAssetForm] = useState<Partial<Asset>>({
    category: 'Pump',
    status: AssetStatus.WORKING,
    make: '',
    model: '',
    location: '',
    name: '',
    notes: '',
    imageUrl: ''
  });

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    setNewAssetForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAssetForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const installDate = newAssetForm.installationDate || new Date().toISOString().split('T')[0];
      // Simple logic: Warranty is 1 year from install, Service due in 6 months
      const warrantyDate = new Date(new Date(installDate).setFullYear(new Date(installDate).getFullYear() + 1)).toISOString().split('T')[0];
      const serviceDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0];

      const newAsset: Asset = {
          id: `NEW-${Math.floor(Math.random() * 10000)}`,
          name: newAssetForm.name || 'Unknown Asset',
          category: newAssetForm.category || 'Pump',
          model: newAssetForm.model || 'Unknown',
          make: newAssetForm.make || 'Unknown',
          quantity: 1,
          status: (newAssetForm.status as AssetStatus) || AssetStatus.WORKING,
          location: newAssetForm.location || 'Plant',
          notes: newAssetForm.notes || '',
          specifications: {},
          spareParts: [],
          installationDate: installDate,
          warrantyExpDate: warrantyDate,
          lastServiceDate: installDate,
          nextServiceDueDate: serviceDate,
          imageUrl: newAssetForm.imageUrl,
          ...newAssetForm as any
      };

      onAddAsset(newAsset);
      setIsAddModalOpen(false);
      setNewAssetForm({ category: 'Pump', status: AssetStatus.WORKING, make: '', model: '', location: '', name: '', notes: '', imageUrl: '' });
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedAsset || !scheduleDate) return;

      // Update the asset
      const updatedAsset: Asset = {
          ...selectedAsset,
          nextServiceDueDate: scheduleDate,
          status: AssetStatus.WORKING // Assuming scheduling implies it will be taken care of
      };

      // In a real app, you might want to add a "Scheduled" record to history too
      // but for now we just update the Due Date.
      
      onUpdateAsset(updatedAsset);
      setSelectedAsset(updatedAsset); // Update local state to reflect immediately in modal
      setDetailViewMode('info');
      setScheduleDate('');
      setScheduleNotes('');
  };

  const openDetailModal = (asset: Asset) => {
      setSelectedAsset(asset);
      setDetailViewMode('info');
  };

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
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
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
              {filteredAssets.map((asset) => {
                 const warrantyActive = isWarrantyActive(asset.warrantyExpDate);
                 const serviceOverdue = isServiceOverdue(asset.nextServiceDueDate);
                 
                 return (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openDetailModal(asset)}>
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
                        {/* Warranty Badge */}
                        <div className={`flex items-center gap-1 text-xs font-medium ${warrantyActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {warrantyActive ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                            {warrantyActive ? 'Warranty Active' : 'Warranty Expired'}
                        </div>
                        
                        {/* Service Badge */}
                        <div className={`flex items-center gap-1 text-xs font-medium ${serviceOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                            <Clock className="w-3 h-3" />
                            {serviceOverdue ? 'Service Overdue' : `Due: ${asset.nextServiceDueDate}`}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(asset);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 w-full"
                    >
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-800">Add New Asset</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div 
                        className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors relative overflow-hidden bg-slate-50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {newAssetForm.imageUrl ? (
                          <img src={newAssetForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-500">Click to upload asset image</p>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
                        <input required name="name" value={newAssetForm.name} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Backup Pump A" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select name="category" value={newAssetForm.category} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="Pump">Pump</option>
                                <option value="Motor">Motor</option>
                                <option value="Sensor">Sensor</option>
                                <option value="Actuator">Actuator</option>
                                <option value="Mixer">Mixer</option>
                                <option value="Blower">Blower</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                             <select name="status" value={newAssetForm.status} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
                            <input name="make" value={newAssetForm.make} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Manufacturer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                            <input name="model" value={newAssetForm.model} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Model No." />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input required name="location" value={newAssetForm.location} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. Pump House" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Installation Date</label>
                        <input type="date" name="installationDate" value={newAssetForm.installationDate || ''} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea name="notes" value={newAssetForm.notes} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 h-20 resize-none" placeholder="Additional details..." />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">
                            Save Asset
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
               <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-slate-100 rounded-full">
                 <X className="w-6 h-6 text-slate-500" />
               </button>
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
                                {Object.entries(selectedAsset.specifications).map(([key, value]) => (
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
                            {selectedAsset.spareParts.length > 0 ? (
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
                    <button 
                        onClick={() => setDetailViewMode('schedule')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <PenTool className="w-4 h-4" /> Schedule Service
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;