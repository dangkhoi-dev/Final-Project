import Button from "../UI/button";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/80 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="overflow-hidden aspect-[4/5]">
      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-4">
      <p className="text-xs font-medium text-indigo-600">{product.storeName}</p>
      <h3 className="font-bold text-slate-800 text-base truncate mt-1">{product.name}</h3>
      <p className="text-lg font-extrabold text-slate-900 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
        {product.price.toLocaleString('vi-VN')} ₫
      </p>
      <Button className="w-full mt-3 !py-2.5 group/btn">
        <ShoppingCart size={16} className="mr-2 transition-transform duration-300 group-hover/btn:rotate-[-15deg]" />
        Thêm vào giỏ
      </Button>
    </div>
  </div>
);

export default ProductCard;