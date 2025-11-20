import React, { useState } from 'react';
import { Asset, AssetStatus } from '../types';
import { Search, Filter, AlertCircle, Calendar, Box, ChevronRight, X } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
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
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            className="border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {Object.values(AssetStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Spec Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Next Service</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        {asset.category.substring(0,2).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{asset.name}</div>
                        <div className="text-xs text-slate-500">{asset.make} - {asset.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600 max-w-xs truncate">
                      {Object.entries(asset.specifications).map(([k, v]) => `${k}: ${v}`).join(', ')}
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
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {asset.nextServiceDueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => setSelectedAsset(asset)}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 w-full"
                    >
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex justify-between items-center">
               <div>
                   <h2 className="text-xl font-bold text-slate-800">{selectedAsset.name}</h2>
                   <p className="text-sm text-slate-500">ID: {selectedAsset.id}</p>
               </div>
               <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-slate-100 rounded-full">
                 <X className="w-6 h-6 text-slate-500" />
               </button>
            </div>
            
            <div className="p-6 space-y-6">
                {/* Status and Critical Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                        <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(selectedAsset.status)}`}>
                            {selectedAsset.status}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> Next Service</span>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{selectedAsset.nextServiceDueDate}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                         <span className="text-xs font-bold text-slate-400 uppercase">Warranty Ends</span>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{selectedAsset.warrantyExpDate}</p>
                    </div>
                </div>

                {/* Specifications */}
                <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-3 border-b pb-1">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedAsset.specifications).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                                <span className="text-xs text-slate-500">{key}</span>
                                <span className="text-sm font-medium text-slate-900">{value}</span>
                            </div>
                        ))}
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500">Manufacturer</span>
                            <span className="text-sm font-medium text-slate-900">{selectedAsset.make}</span>
                        </div>
                         <div className="flex flex-col">
                            <span className="text-xs text-slate-500">Model</span>
                            <span className="text-sm font-medium text-slate-900">{selectedAsset.model}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {selectedAsset.notes && (
                     <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-800">Field Notes</h4>
                            <p className="text-sm text-amber-700 mt-1">{selectedAsset.notes}</p>
                        </div>
                     </div>
                )}

                {/* Spare Parts */}
                <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-3 border-b pb-1 flex items-center gap-2"><Box className="w-4 h-4" /> Spare Parts List</h3>
                    {selectedAsset.spareParts.length > 0 ? (
                        <ul className="space-y-2">
                            {selectedAsset.spareParts.map((part, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded border border-slate-100">
                                    <span className="text-sm text-slate-700 font-medium">{part.name}</span>
                                    <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                                        {part.materialOrMake || 'N/A'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No specific spare parts listed in database.</p>
                    )}
                </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-200">
                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                     Schedule Maintenance
                 </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;