// src/pages/TestPage.jsx - For testing responsive design and advanced features
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Settings
} from 'lucide-react';

const TestPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDevice, setSelectedDevice] = useState('desktop');

  // Mock product data for testing
  const mockProduct = {
    _id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium audio experience.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: { name: 'Electronics' },
    rating: 4.5,
    reviewCount: 128,
    countInStock: 15,
    discount: 20
  };

  const mockProducts = Array.from({ length: 8 }, (_, i) => ({
    ...mockProduct,
    _id: `${i + 1}`,
    name: `Product ${i + 1}`,
    price: 99 + (i * 50),
    discount: i % 3 === 0 ? 15 : 0
  }));

  const deviceBreakpoints = {
    mobile: 'w-96 mx-auto',
    tablet: 'w-[768px] mx-auto',
    desktop: 'w-full'
  };

  const TestSection = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="container-responsive">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold mb-4">
              Responsive Design Showcase
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Testing advanced responsive design, modern UI components, and enhanced user experience
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        {/* Device Preview Controls */}
        <TestSection title="Device Preview Controls">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={() => setSelectedDevice('mobile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedDevice === 'mobile' 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile (384px)</span>
            </button>
            <button
              onClick={() => setSelectedDevice('tablet')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedDevice === 'tablet' 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span>Tablet (768px)</span>
            </button>
            <button
              onClick={() => setSelectedDevice('desktop')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedDevice === 'desktop' 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Desktop (Full Width)</span>
            </button>
          </div>
        </TestSection>

        {/* Responsive Container */}
        <div className={`transition-all duration-500 ${deviceBreakpoints[selectedDevice]}`}>
          
          {/* Button Components Showcase */}
          <TestSection title="Button Components">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Primary Buttons</h3>
                <button className="btn-primary w-full">Primary Button</button>
                <button className="btn-primary btn-sm w-full">Small Primary</button>
                <button className="btn-primary btn-lg w-full">Large Primary</button>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Secondary Buttons</h3>
                <button className="btn-secondary w-full">Secondary Button</button>
                <button className="btn-outline w-full">Outline Button</button>
                <button className="btn-ghost w-full">Ghost Button</button>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Status Buttons</h3>
                <button className="btn-success w-full">Success Button</button>
                <button className="btn-warning w-full">Warning Button</button>
                <button className="btn-error w-full">Error Button</button>
              </div>
            </div>
          </TestSection>

          {/* Form Components */}
          <TestSection title="Form Components">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regular Input
                  </label>
                  <input type="text" placeholder="Enter text..." className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Input
                  </label>
                  <input type="text" placeholder="Valid input" className="input-success" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Error Input
                  </label>
                  <input type="text" placeholder="Invalid input" className="input-error" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Dropdown
                  </label>
                  <select className="input">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Textarea
                  </label>
                  <textarea 
                    rows="3" 
                    placeholder="Enter your message..." 
                    className="input resize-none"
                  />
                </div>
              </div>
            </div>
          </TestSection>

          {/* Card Components */}
          <TestSection title="Card Components">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold">Basic Card</h3>
                </div>
                <div className="card-body">
                  <p className="text-gray-600">This is a basic card component with header and body sections.</p>
                </div>
              </div>
              <div className="card-hover">
                <div className="card-body">
                  <h3 className="font-semibold mb-2">Hover Card</h3>
                  <p className="text-gray-600">This card has hover effects with shadow and transform.</p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3 className="font-semibold mb-2">Card with Footer</h3>
                  <p className="text-gray-600">Card content goes here.</p>
                </div>
                <div className="card-footer">
                  <button className="btn-primary btn-sm">Action</button>
                </div>
              </div>
            </div>
          </TestSection>

          {/* Badge Components */}
          <TestSection title="Badge Components">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="badge-primary">Primary Badge</span>
              <span className="badge-secondary">Secondary Badge</span>
              <span className="badge-success">Success Badge</span>
              <span className="badge-warning">Warning Badge</span>
              <span className="badge-error">Error Badge</span>
            </div>
          </TestSection>

          {/* Enhanced Product Cards */}
          <TestSection title="Enhanced Product Cards">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">View Mode:</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`${
              viewMode === 'grid' 
                ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                : 'space-y-4'
            }`}>
              {mockProducts.slice(0, 6).map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  className={viewMode === 'list' ? 'flex flex-row h-48' : ''}
                />
              ))}
            </div>
          </TestSection>

          {/* Animation Examples */}
          <TestSection title="Animation Examples">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-3 animate-bounce-soft"></div>
                <p className="text-sm text-gray-600">Bounce Soft</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full mx-auto mb-3 animate-pulse-slow"></div>
                <p className="text-sm text-gray-600">Pulse Slow</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-success rounded-full mx-auto mb-3 floating"></div>
                <p className="text-sm text-gray-600">Floating</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 shimmer-effect"></div>
                <p className="text-sm text-gray-600">Shimmer</p>
              </div>
            </div>
          </TestSection>

          {/* Utility Classes */}
          <TestSection title="Utility Classes">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Text Gradients</h3>
                <h2 className="text-3xl font-bold text-gradient">Gradient Text Example</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Glass Effects</h3>
                <div className="relative h-32 bg-gradient-primary rounded-lg overflow-hidden">
                  <div className="absolute inset-4 glass-effect rounded-lg flex items-center justify-center">
                    <span className="text-gray-800 font-semibold">Glass Effect Card</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Hover Effects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card hover-lift p-6 text-center cursor-pointer">
                    <Settings className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <p className="text-sm font-medium">Hover Lift</p>
                  </div>
                  <div className="card p-6 text-center cursor-pointer transform transition-transform hover:scale-105">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-accent-600" />
                    <p className="text-sm font-medium">Scale Hover</p>
                  </div>
                  <div className="card p-6 text-center cursor-pointer transition-all hover:shadow-glow">
                    <Star className="w-8 h-8 mx-auto mb-2 text-warning-600" />
                    <p className="text-sm font-medium">Glow Hover</p>
                  </div>
                </div>
              </div>
            </div>
          </TestSection>

          {/* Responsive Grid Showcase */}
          <TestSection title="Responsive Grid System">
            <div className="grid-responsive">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-primary-600 font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Grid Item {i + 1}</h3>
                  <p className="text-sm text-gray-600 mt-1">Responsive grid cell</p>
                </div>
              ))}
            </div>
          </TestSection>

        </div>
      </div>
    </div>
  );
};

export default TestPage;
