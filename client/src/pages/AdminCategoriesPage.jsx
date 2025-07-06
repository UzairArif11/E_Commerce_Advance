import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  Tag,
  Filter,
  MoreVertical
} from 'lucide-react';

const AdminCategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentCategory: '',
    status: 'active'
  });

  // Mock data - in real app, this would come from API
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      parentCategory: null,
      productsCount: 125,
      status: 'active',
      createdAt: '2024-01-15',
      subcategories: [
        { id: 11, name: 'Smartphones', productsCount: 45 },
        { id: 12, name: 'Laptops', productsCount: 30 },
        { id: 13, name: 'Headphones', productsCount: 25 }
      ]
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashion and apparel items',
      parentCategory: null,
      productsCount: 89,
      status: 'active',
      createdAt: '2024-01-10',
      subcategories: [
        { id: 21, name: 'Men\'s Clothing', productsCount: 35 },
        { id: 22, name: 'Women\'s Clothing', productsCount: 40 },
        { id: 23, name: 'Accessories', productsCount: 14 }
      ]
    },
    {
      id: 3,
      name: 'Books',
      description: 'Books and educational materials',
      parentCategory: null,
      productsCount: 67,
      status: 'active',
      createdAt: '2024-01-05',
      subcategories: [
        { id: 31, name: 'Fiction', productsCount: 25 },
        { id: 32, name: 'Non-Fiction', productsCount: 30 },
        { id: 33, name: 'Educational', productsCount: 12 }
      ]
    },
    {
      id: 4,
      name: 'Sports',
      description: 'Sports equipment and accessories',
      parentCategory: null,
      productsCount: 23,
      status: 'inactive',
      createdAt: '2024-01-01',
      subcategories: []
    }
  ]);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const category = {
      id: Date.now(),
      ...newCategory,
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      subcategories: []
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '', parentCategory: '', status: 'active' });
    setShowAddModal(false);
    toast.success('Category added successfully');
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      parentCategory: category.parentCategory || '',
      status: category.status
    });
    setShowAddModal(true);
  };

  const handleUpdateCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, ...newCategory }
        : cat
    ));

    setEditingCategory(null);
    setNewCategory({ name: '', description: '', parentCategory: '', status: 'active' });
    setShowAddModal(false);
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter category description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              value={newCategory.parentCategory}
              onChange={(e) => setNewCategory({ ...newCategory, parentCategory: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">None (Top Level)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newCategory.status}
              onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
          <button
            onClick={() => {
              setShowAddModal(false);
              setEditingCategory(null);
              setNewCategory({ name: '', description: '', parentCategory: '', status: 'active' });
            }}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
            <p className="text-gray-600">Manage your product categories and subcategories</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Tag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(cat => cat.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.productsCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Subcategories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Filter className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Category</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Description</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Products</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Subcategories</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Created</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Tag className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        {category.subcategories.length > 0 && (
                          <p className="text-sm text-gray-500">
                            {category.subcategories.length} subcategories
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                    {category.description || 'No description'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{category.productsCount}</span>
                  </td>
                  <td className="py-4 px-6">
                    {category.subcategories.length > 0 ? (
                      <div className="text-sm">
                        {category.subcategories.slice(0, 2).map(sub => (
                          <div key={sub.id} className="text-gray-600">
                            {sub.name} ({sub.productsCount})
                          </div>
                        ))}
                        {category.subcategories.length > 2 && (
                          <div className="text-gray-500">
                            +{category.subcategories.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg mb-2">No categories found</p>
            <p className="text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && <CategoryModal />}
    </div>
  );
};

export default AdminCategoriesPage;
