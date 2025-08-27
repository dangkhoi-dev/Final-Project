import { useState, useEffect } from 'react';
import { mockProducts } from '../data/mockData';
import ProductCard from '../Components/Shared/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => { setTimeout(() => setProducts(mockProducts), 500); }, []);
    return (
        <div className="p-4 md:p-2">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">Khám Phá Sản Phẩm</h1>
                <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">Hàng ngàn sản phẩm chất lượng từ các thương hiệu hàng đầu đang chờ bạn.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </div>
    );
};
export default HomePage;