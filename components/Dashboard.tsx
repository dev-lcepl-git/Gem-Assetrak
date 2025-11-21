import React, { useMemo } from 'react';
import { Asset, AssetStatus } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AlertTriangle, CheckCircle, Wrench, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
}

const COLORS = {
  [AssetStatus.WORKING]: '#10b981', // Emerald 500
  [AssetStatus.MAINTENANCE]: '#f59e0b', // Amber 500
  [AssetStatus.ATTENTION_NEEDED]: '#ef4444', // Red 500
  [AssetStatus.RETIRED]: '#64748b', // Slate 500
};

const WARRANTY_COLORS = {
    Active: '#3b82f6',
    Expired: '#94a3b8'
};

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  
  const stats = useMemo(() => {
    const statusCounts = assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAssets = assets.length;
    const workingPercentage = Math.round(((statusCounts[AssetStatus.WORKING] || 0) / totalAssets) * 100) || 0;
    
    // Service Logic
    const today = new Date();
    let overdueCount = 0;
    let upcomingCount = 0;
    
    // Warranty Logic
    let warrantyActiveCount = 0;

    assets.forEach(a => {
        const dueDate = new Date(a.nextServiceDueDate);
        const warrantyDate = new Date(a.warrantyExpDate);

        // Service Due
        if (dueDate < today) {
            overdueCount++;
        } else {
             const diffTime = dueDate.getTime() - today.getTime();
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             if (diffDays <= 30) upcomingCount++;
        }

        // Warranty
        if (warrantyDate > today) {
            warrantyActiveCount++;
        }
    });

    return { statusCounts, totalAssets, workingPercentage, overdueCount, upcomingCount, warrantyActiveCount };
  }, [assets]);

  const chartData = Object.keys(stats.statusCounts).map(status => ({
    name: status,
    value: stats.statusCounts[status],
  }));

  const warrantyData = [
      { name: 'Active', value: stats.warrantyActiveCount },
      { name: 'Expired', value: stats.totalAssets - stats.warrantyActiveCount }
  ];

  const categoryData = useMemo(() => {
      const counts: Record<string, number> = {};
      assets.forEach(a => {
          counts[a.category] = (counts[a.category] || 0) + 1;
      });
      return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [assets]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Plant Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Operational Health */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Operational Health</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.workingPercentage}%</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Assets in working condition</p>
        </div>

        {/* Maintenance Needs */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Service Overdue</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.overdueCount}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
           <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stats.upcomingCount} due within 30 days</p>
        </div>

        {/* Active Warranty */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Warranty</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.warrantyActiveCount}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{(stats.totalAssets - stats.warrantyActiveCount)} assets expired</p>
        </div>

        {/* Total Assets */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Assets</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.totalAssets}</p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Wrench className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Across {categoryData.length} categories</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Asset Condition</h3>
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
                            stroke="none" // Remove white stroke for dark mode look
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as AssetStatus] || '#cbd5e1'} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

         {/* Warranty Status */}
         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Warranty Coverage</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                         <Pie
                            data={warrantyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                             <Cell fill={WARRANTY_COLORS.Active} />
                             <Cell fill={WARRANTY_COLORS.Expired} />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1">
         {/* Category Distribution */}
         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Inventory by Category</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false}/>
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
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