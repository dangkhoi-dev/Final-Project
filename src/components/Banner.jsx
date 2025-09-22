import React, { useState, useEffect } from 'react';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Khuyến mãi 50%',
      subtitle: 'Tất cả sản phẩm thời trang',
      buttonText: 'Mua ngay',
      buttonLink: '/products'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Sản phẩm mới',
      subtitle: 'Bộ sưu tập mùa hè 2025',
      buttonText: 'Khám phá',
      buttonLink: '/products'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Miễn phí vận chuyển',
      subtitle: 'Đơn hàng từ 500.000đ',
      buttonText: 'Tìm hiểu',
      buttonLink: '/products'
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };


  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '300px', 
      overflow: 'hidden', 
      borderRadius: '8px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      marginBottom: '32px' 
    }}>
      {/* Banner Images */}
      <div style={{ position: 'relative', height: '100%' }}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: index === currentSlide ? 1 : 0,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 0.7s ease-in-out'
            }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.3), transparent)'
            }}></div>
            
            {/* Content */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ 
                color: 'white', 
                paddingLeft: '16px', 
                maxWidth: '400px' 
              }}>
                <div style={{
                  transform: index === currentSlide ? 'translateX(0)' : 'translateX(-32px)',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'all 0.7s ease-in-out 0.2s'
                }}>
                  <h2 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    marginBottom: '12px', 
                    lineHeight: '1.2',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    {banner.title}
                  </h2>
                  <p style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '20px', 
                    color: '#f3f4f6',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    {banner.subtitle}
                  </p>
                  <button 
                    onClick={() => window.location.href = banner.buttonLink}
                    style={{
                      backgroundColor: 'white',
                      color: '#1f2937',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Dots Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px'
      }}>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentSlide ? '32px' : '12px',
              height: '12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (index !== currentSlide) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
              }
            }}
            onMouseOut={(e) => {
              if (index !== currentSlide) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
