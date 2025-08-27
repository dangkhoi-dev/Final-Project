import Button from "../UI/button";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      <div className="overflow-hidden"><img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" /></div>
      <div className="p-4">
        <p className="text-sm text-slate-500">{product.storeName}</p>
        <h3 className="font-semibold text-slate-800 truncate mt-1">{product.name}</h3>
        <p className="text-lg font-bold text-slate-900 mt-2">{product.price.toLocaleString('vi-VN')} ₫</p>
        <Button className="w-full mt-4 flex items-center justify-center gap-2"><ShoppingCart size={18} />Thêm vào giỏ</Button>
      </div>
    </div>
  );

export default ProductCard;