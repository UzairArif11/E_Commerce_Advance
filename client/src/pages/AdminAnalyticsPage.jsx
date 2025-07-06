import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalRevenue: 125430,
      revenueChange: 12.5,
      totalOrders: 1247,
      ordersChange: -2.3,
      totalCustomers: 3891,
      customersChange: 8.7,
      totalProducts: 156,
      productsChange: 3.2
    },
    salesData: [
      { date: '2024-01-01', sales: 12000, orders: 45 },
      { date: '2024-01-02', sales: 15000, orders: 52 },
      { date: '2024-01-03', sales: 18000, orders: 61 },
      { date: '2024-01-04', sales: 14000, orders: 48 },
      { date: '2024-01-05', sales: 22000, orders: 67 },
      { date: '2024-01-06', sales: 19000, orders: 58 },
      { date: '2024-01-07', sales: 25000, orders: 73 }
    ],
    topProducts: [
      { name: 'Wireless Headphones', sales: 342, revenue: 45600 },
      { name: 'Smart Watch', sales: 289, revenue: 38200 },
      { name: 'Laptop Stand', sales: 234, revenue: 15600 },
      { name: 'USB-C Cable', sales: 189, revenue: 3780 },
      { name: 'Bluetooth Speaker', sales: 156, revenue: 12480 }
    ],
    categoryData: [
      { category: 'Electronics', percentage: 45, value: 56475 },
      { category: 'Accessories', percentage: 25, value: 31358 },
      { category: 'Clothing', percentage: 20, value: 25086 },
      { category: 'Books', percentage: 10, value: 12511 }
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const isPositive = change > 0;
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600'
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp size={16} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs last period</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your business performance and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
          change={analyticsData.overview.revenueChange}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={analyticsData.overview.totalOrders.toLocaleString()}
          change={analyticsData.overview.ordersChange}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Customers"
          value={analyticsData.overview.totalCustomers.toLocaleString()}
          change={analyticsData.overview.customersChange}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Total Products"
          value={analyticsData.overview.totalProducts.toLocaleString()}
          change={analyticsData.overview.productsChange}
          icon={Package}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 size={20} className="mr-2 text-blue-600" />
              Sales Overview
            </h3>
          </div>
          
          {/* Simple Bar Chart Visualization */}
          <div className="space-y-4">
            {analyticsData.salesData.map((item, index) => {
              const maxSales = Math.max(...analyticsData.salesData.map(d => d.sales));
              const width = (item.sales / maxSales) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-sm font-medium text-gray-900 text-right">
                    ${item.sales.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart size={20} className="mr-2 text-green-600" />
              Category Distribution
            </h3>
          </div>
          
          <div className="space-y-4">
            {analyticsData.categoryData.map((item, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colors[index]}`}></div>
                    <span className="text-gray-700 font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index]}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {item.percentage}%
                    </span>
                    <span className="text-sm text-gray-600 w-20 text-right">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Activity size={20} className="mr-2 text-purple-600" />
          Top Performing Products
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.map((product, index) => {
                const maxSales = Math.max(...analyticsData.topProducts.map(p => p.sales));
                const performance = (product.sales / maxSales) * 100;
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{product.sales} units</td>
                    <td className="py-4 px-4 text-gray-900 font-medium">${product.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(performance)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h4 className="font-semibold text-gray-900 mb-4">Average Order Value</h4>
          <div className="text-3xl font-bold text-blue-600 mb-2">$89.50</div>
          <div className="flex items-center text-sm">
            <TrendingUp size={16} className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+5.2%</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h4 className="font-semibold text-gray-900 mb-4">Conversion Rate</h4>
          <div className="text-3xl font-bold text-green-600 mb-2">3.4%</div>
          <div className="flex items-center text-sm">
            <TrendingUp size={16} className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+0.8%</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h4 className="font-semibold text-gray-900 mb-4">Customer Retention</h4>
          <div className="text-3xl font-bold text-purple-600 mb-2">78.2%</div>
          <div className="flex items-center text-sm">
            <TrendingDown size={16} className="text-red-500 mr-1" />
            <span className="text-red-500 font-medium">-1.5%</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
