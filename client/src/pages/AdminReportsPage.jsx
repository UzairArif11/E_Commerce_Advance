import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Users, 
  DollarSign,
  Package,
  ShoppingCart,
  Eye,
  Filter
} from 'lucide-react';

const AdminReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('30d');
  const [reportFormat, setReportFormat] = useState('pdf');

  const reportTypes = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Detailed sales analytics and revenue tracking',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'customers',
      name: 'Customer Report',
      description: 'Customer behavior and demographics analysis',
      icon: Users,
      color: 'green'
    },
    {
      id: 'products',
      name: 'Product Report',
      description: 'Product performance and inventory insights',
      icon: Package,
      color: 'purple'
    },
    {
      id: 'orders',
      name: 'Order Report',
      description: 'Order processing and fulfillment statistics',
      icon: ShoppingCart,
      color: 'orange'
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, costs, and profit analysis',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      id: 'traffic',
      name: 'Traffic Report',
      description: 'Website visits and user engagement metrics',
      icon: Eye,
      color: 'pink'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Monthly Sales Report - June 2024',
      type: 'Sales',
      generatedAt: '2024-07-01T10:30:00Z',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Customer Analytics - Q2 2024',
      type: 'Customer',
      generatedAt: '2024-06-30T15:45:00Z',
      format: 'Excel',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Product Performance - May 2024',
      type: 'Product',
      generatedAt: '2024-06-01T09:15:00Z',
      format: 'PDF',
      size: '3.1 MB'
    },
    {
      id: 4,
      name: 'Financial Summary - Q2 2024',
      type: 'Financial',
      generatedAt: '2024-05-31T16:20:00Z',
      format: 'Excel',
      size: '2.9 MB'
    }
  ];

  const quickStats = [
    {
      label: 'Total Revenue',
      value: '$125,430',
      change: '+12.5%',
      color: 'green'
    },
    {
      label: 'Total Orders',
      value: '1,247',
      change: '-2.3%',
      color: 'red'
    },
    {
      label: 'New Customers',
      value: '389',
      change: '+8.7%',
      color: 'green'
    },
    {
      label: 'Products Sold',
      value: '2,156',
      change: '+15.2%',
      color: 'green'
    }
  ];

  const handleGenerateReport = () => {
    // In real app, this would trigger report generation
    alert(`Generating ${reportTypes.find(r => r.id === selectedReport)?.name} in ${reportFormat.toUpperCase()} format for the last ${dateRange}`);
  };

  const handleDownloadReport = (reportId) => {
    // In real app, this would trigger download
    alert(`Downloading report ${reportId}`);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      pink: 'bg-pink-50 text-pink-600 border-pink-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and download detailed business reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.color === 'green' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last period</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Report Generator */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FileText size={20} className="mr-2 text-blue-600" />
            Generate New Report
          </h2>

          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Report Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        selectedReport === report.id
                          ? getColorClasses(report.color)
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon size={20} className="mr-3" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm opacity-75">{report.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="pdf"
                    checked={reportFormat === 'pdf'}
                    onChange={(e) => setReportFormat(e.target.value)}
                    className="mr-2"
                  />
                  PDF
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="excel"
                    checked={reportFormat === 'excel'}
                    onChange={(e) => setReportFormat(e.target.value)}
                    className="mr-2"
                  />
                  Excel
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={reportFormat === 'csv'}
                    onChange={(e) => setReportFormat(e.target.value)}
                    className="mr-2"
                  />
                  CSV
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FileText size={20} className="mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar size={20} className="mr-2 text-green-600" />
            Recent Reports
          </h2>

          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </span>
                      <span>{report.format}</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    className="ml-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {recentReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="text-gray-500">No reports generated yet</p>
              <p className="text-gray-400 text-sm">Generate your first report to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Filter size={20} className="mr-2 text-purple-600" />
          Quick Report Templates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <h3 className="font-medium text-gray-900 ml-3">Weekly Sales Summary</h3>
            </div>
            <p className="text-gray-600 text-sm">Quick overview of this week's sales performance</p>
            <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700">
              Generate Now →
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="text-green-600" size={20} />
              </div>
              <h3 className="font-medium text-gray-900 ml-3">Customer Insights</h3>
            </div>
            <p className="text-gray-600 text-sm">Monthly customer behavior and engagement report</p>
            <button className="mt-3 text-green-600 text-sm font-medium hover:text-green-700">
              Generate Now →
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Package className="text-purple-600" size={20} />
              </div>
              <h3 className="font-medium text-gray-900 ml-3">Inventory Status</h3>
            </div>
            <p className="text-gray-600 text-sm">Current stock levels and reorder recommendations</p>
            <button className="mt-3 text-purple-600 text-sm font-medium hover:text-purple-700">
              Generate Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
