import Button from "../UI/button";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="overflow-hidden aspect-square">
      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-5">
      <p className="text-sm font-medium text-indigo-600">{product.storeName}</p>
      <h3 className="font-bold text-slate-800 text-lg truncate mt-1">{product.name}</h3>
      <p className="text-xl font-extrabold text-slate-900 mt-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
        {product.price.toLocaleString('vi-VN')} ₫
      </p>
      <Button className="w-full mt-4 !py-3 group/btn">
        <ShoppingCart size={18} className="mr-2 transition-transform duration-300 group-hover/btn:rotate-[-15deg]" />
        Thêm vào giỏ
      </Button>
    </div>
  </div>
);

export default ProductCard;