import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import ProductCard from '../shared/ProductCard';
import './ProductsPage.css';

const ProductsPage = () => {
  const { products, handleViewDetails } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFullFilters, setShowFullFilters] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const isApproved = product.status === 'approved';
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return isApproved && matchesCategory && matchesSearch;
    });

    // Sort products
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Tất cả sản phẩm</h1>
      
      {/* Compact Search Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.25)'
      }}>
        {/* Compact Search Row */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            flex: '1',
            minWidth: '200px'
          }}>
            <input
              type="text"
              placeholder= "Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 45px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
              }}
            />
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              🔍
            </div>
          </div>

          {/* Quick Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.95)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'All' ? '🏠 Tất cả' : 
                 category === 'Thời trang nam' ? '👔 Nam' :
                 category === 'Thời trang nữ' ? '👗 Nữ' :
                 category === 'Giày dép' ? '👟 Giày' :
                 category === 'Phụ kiện' ? '💼 Phụ kiện' : category}
              </option>
            ))}
          </select>

          {/* Quick Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.95)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            <option value="name">🔤 Tên A-Z</option>
            <option value="price-low">💰 Giá thấp → cao</option>
            <option value="price-high">💰 Giá cao → thấp</option>
            <option value="category">📂 Danh mục</option>
          </select>

          {/* Toggle Full Filters Button */}
          <button
            onClick={() => setShowFullFilters(!showFullFilters)}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#8b5cf6',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            {showFullFilters ? '🔽 Thu gọn' : '🔼 Mở rộng'}
          </button>
        </div>

        {/* Full Filters (when expanded) */}
        {showFullFilters && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Category Pills */}
            <div style={{
              marginBottom: '16px'
            }}>
              <h4 style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                🏷️ Danh mục:
              </h4>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      background: selectedCategory === category 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      color: selectedCategory === category ? '#8b5cf6' : '#374151',
                      fontSize: '12px',
                      fontWeight: selectedCategory === category ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: selectedCategory === category 
                        ? '0 2px 8px rgba(255, 255, 255, 0.3)' 
                        : '0 1px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                      }
                    }}
                  >
                    {category === 'All' ? '🏠 Tất cả' : 
                     category === 'Thời trang nam' ? '👔 Nam' :
                     category === 'Thời trang nữ' ? '👗 Nữ' :
                     category === 'Giày dép' ? '👟 Giày' :
                     category === 'Phụ kiện' ? '💼 Phụ kiện' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Pills */}
            <div>
              <h4 style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                📊 Sắp xếp:
              </h4>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {[
                  { value: 'name', label: '🔤 Tên A-Z' },
                  { value: 'price-low', label: '💰 Giá thấp → cao' },
                  { value: 'price-high', label: '💰 Giá cao → thấp' },
                  { value: 'category', label: '📂 Danh mục' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      background: sortBy === option.value 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      color: sortBy === option.value ? '#8b5cf6' : '#374151',
                      fontSize: '12px',
                      fontWeight: sortBy === option.value ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: sortBy === option.value 
                        ? '0 2px 8px rgba(255, 255, 255, 0.3)' 
                        : '0 1px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      if (sortBy !== option.value) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (sortBy !== option.value) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div style={{
          marginTop: '12px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          {filteredAndSortedProducts.length > 0 ? (
            `📦 Tìm thấy ${filteredAndSortedProducts.length} sản phẩm`
          ) : (
            '🔍 Không tìm thấy sản phẩm nào'
          )}
        </div>
      </div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px'
            }}>
              🔍
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Không tìm thấy sản phẩm nào
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '16px',
              marginBottom: '24px'
            }}>
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSortBy('name');
                setShowFullFilters(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔄 Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
