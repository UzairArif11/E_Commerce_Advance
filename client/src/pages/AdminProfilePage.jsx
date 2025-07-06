import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Edit, Save, X, Camera, Shield, Mail, User, Calendar } from 'lucide-react';

const AdminProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    department: userInfo?.department || 'Administration',
    bio: userInfo?.bio || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // API call would go here
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      department: userInfo?.department || 'Administration',
      bio: userInfo?.bio || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
        <p className="text-gray-600">Manage your administrator account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {userInfo?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border hover:bg-gray-50 transition-colors">
                  <Camera size={20} className="text-gray-600" />
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900">{userInfo?.name}</h3>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Shield size={16} className="text-green-500" />
                <span className="text-green-600 font-medium">Super Admin</span>
              </div>
              <p className="text-gray-500 mt-2">Administrator since {new Date().getFullYear()}</p>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Products</span>
                    <span className="font-medium">150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-medium">3,891</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{formData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{formData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{formData.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Administration">Administration</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="IT">IT</option>
                      <option value="Customer Service">Customer Service</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{formData.department}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg min-h-[100px]">
                    {formData.bio || 'No bio provided yet.'}
                  </p>
                )}
              </div>

              {/* Last Login Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Last Login:</span>
                    <span className="ml-2 text-blue-900 font-medium">Today at 2:30 PM</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Account Created:</span>
                    <span className="ml-2 text-blue-900 font-medium">January 15, 2024</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Role:</span>
                    <span className="ml-2 text-blue-900 font-medium">Super Administrator</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Status:</span>
                    <span className="ml-2 text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
