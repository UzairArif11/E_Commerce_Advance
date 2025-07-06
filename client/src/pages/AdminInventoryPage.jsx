import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Plus,
  Edit,
  Eye,
  MoreVertical,
  RefreshCw
} from 'lucide-react';

const AdminInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app, this would come from API
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'Electronics',
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      price: 129.99,
      cost: 85.00,
      supplier: 'Tech Suppliers Inc.',
      lastRestocked: '2024-06-15',
      status: 'in_stock'
    },
    {
      id: 2,
      name: 'Smart Watch',
      sku: 'SW-002',
      category: 'Electronics',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      price: 299.99,
      cost: 200.00,
      supplier: 'Smart Devices Co.',
      lastRestocked: '2024-06-10',
      status: 'low_stock'
    },
    {
      id: 3,
      name: 'Coffee Mug',
      sku: 'CM-003',
      category: 'Home & Garden',
      currentStock: 0,
      minStock: 20,
      maxStock: 200,
      price: 19.99,
      cost: 8.50,
      supplier: 'Home Essentials Ltd.',
      lastRestocked: '2024-05-20',
      status: 'out_of_stock'
    },
    {
      id: 4,
      name: 'Running Shoes',
      sku: 'RS-004',
      category: 'Clothing',
      currentStock: 89,
      minStock: 25,
      maxStock: 150,
      price: 159.99,
      cost: 95.00,
      supplier: 'Sports Gear Pro',
      lastRestocked: '2024-06-20',
      status: 'in_stock'
    },
    {
      id: 5,
      name: 'Bluetooth Speaker',
      sku: 'BS-005',
      category: 'Electronics',
      currentStock: 12,
      minStock: 15,
      maxStock: 80,
      price: 89.99,
      cost: 55.00,
      supplier: 'Audio Tech Solutions',
      lastRestocked: '2024-06-18',
      status: 'low_stock'
    }
  ]);

  const categories = ['all', 'Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports'];
  const statuses = ['all', 'in_stock', 'low_stock', 'out_of_stock'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-700';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'out_of_stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock':
        return <Package size={16} className="text-green-600" />;
      case 'low_stock':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'out_of_stock':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const inventoryStats = {
    totalItems: inventory.length,
    inStock: inventory.filter(item => item.status === 'in_stock').length,
    lowStock: inventory.filter(item => item.status === 'low_stock').length,
    outOfStock: inventory.filter(item => item.status === 'out_of_stock').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
  };

  const handleRestockItem = (itemId) => {
    // In real app, this would open a restock modal or form
    toast.success('Restock order initiated');
  };

  const handleQuickUpdate = (itemId, newStock) => {
    setInventory(inventory.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            currentStock: newStock,
            status: newStock === 0 ? 'out_of_stock' : 
                   newStock <= item.minStock ? 'low_stock' : 'in_stock'
          }
        : item
    ));
    toast.success('Stock updated successfully');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600">Track and manage your product inventory levels</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalItems}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{inventoryStats.inStock}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                ${inventoryStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="min-w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Product</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">SKU</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Category</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Current Stock</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Min/Max</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Price</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Last Restocked</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.supplier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900 font-mono text-sm">{item.sku}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={item.currentStock}
                        onChange={(e) => handleQuickUpdate(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {item.currentStock <= item.minStock && (
                        <AlertTriangle size={16} className="text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600 text-sm">
                      {item.minStock} / {item.maxStock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">${item.price}</p>
                      <p className="text-gray-500">Cost: ${item.cost}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(item.lastRestocked).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleRestockItem(item.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Restock"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg mb-2">No inventory items found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      {inventoryStats.lowStock > 0 && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-yellow-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.filter(item => item.status === 'low_stock').map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Current: {item.currentStock} | Min: {item.minStock}</p>
                  </div>
                  <button
                    onClick={() => handleRestockItem(item.id)}
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;
