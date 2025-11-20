import React, { useMemo } from 'react';
import { Asset, AssetStatus } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AlertTriangle, CheckCircle, Wrench, Activity } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
}

const COLORS = {
  [AssetStatus.WORKING]: '#10b981', // Emerald 500
  [AssetStatus.MAINTENANCE]: '#f59e0b', // Amber 500
  [AssetStatus.ATTENTION_NEEDED]: '#ef4444', // Red 500
  [AssetStatus.RETIRED]: '#64748b', // Slate 500
};

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  
  const stats = useMemo(() => {
    const statusCounts = assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAssets = assets.length;
    const workingPercentage = Math.round(((statusCounts[AssetStatus.WORKING] || 0) / totalAssets) * 100);
    
    // Calculate upcoming service (simple logic: check if nextServiceDueDate is within 30 days)
    const today = new Date();
    const upcomingServiceCount = assets.filter(a => {
        const dueDate = new Date(a.nextServiceDueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= -30; // Within 30 days or recently overdue
    }).length;

    return { statusCounts, totalAssets, workingPercentage, upcomingServiceCount };
  }, [assets]);

  const chartData = Object.keys(stats.statusCounts).map(status => ({
    name: status,
    value: stats.statusCounts[status],
  }));

  const categoryData = useMemo(() => {
      const counts: Record<string, number> = {};
      assets.forEach(a => {
          counts[a.category] = (counts[a.category] || 0) + 1;
      });
      return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [assets]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Plant Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Assets</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalAssets}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Operational</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.workingPercentage}%</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Maintenance</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                {(stats.statusCounts[AssetStatus.MAINTENANCE] || 0)}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Wrench className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Service Due</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.upcomingServiceCount}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Due within 30 days</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Asset Status Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as AssetStatus] || '#cbd5e1'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Assets by Category</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;