import { useState, useEffect } from 'react';
import { mockProducts } from '../data/mockData';
import ProductCard from '../Components/Shared/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => { setTimeout(() => setProducts(mockProducts), 500); }, []);
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Khám phá sản phẩm</h1>
            <p className="text-slate-600 mb-6">Tìm kiếm hàng ngàn sản phẩm từ các cửa hàng uy tín.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </div>
    );
};

export default HomePage;