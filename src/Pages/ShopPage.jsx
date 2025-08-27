import Button from "../Components/UI/button";
import { PlusCircle, Package, ArrowRight } from "lucide-react";

const ShopPage = () => (
    <div className="p-4 md:p-2">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">Bảng điều khiển Cửa hàng</h1>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">Quản lý sản phẩm, đơn hàng và theo dõi hiệu suất kinh doanh của bạn.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 hover:border-indigo-500 transition-colors duration-300">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center">
                    <PlusCircle size={24} />
                </div>
                <h2 className="font-bold text-2xl text-slate-800 mt-4">Đăng sản phẩm mới</h2>
                <p className="text-slate-500 mt-2">Thêm sản phẩm mới vào gian hàng của bạn một cách nhanh chóng.</p>
                <a href="#" className="inline-flex items-center mt-4 font-semibold text-indigo-600 hover:text-indigo-800">Bắt đầu ngay <ArrowRight size={16} className="ml-1"/></a>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 hover:border-teal-500 transition-colors duration-300">
                <div className="bg-teal-100 text-teal-600 rounded-full w-12 h-12 flex items-center justify-center">
                    <Package size={24} />
                </div>
                <h2 className="font-bold text-2xl text-slate-800 mt-4">Quản lý đơn hàng</h2>
                <p className="text-slate-500 mt-2">Xem, xử lý và theo dõi tất cả các đơn hàng từ khách hàng.</p>
                <a href="#" className="inline-flex items-center mt-4 font-semibold text-teal-600 hover:text-teal-800">Xem đơn hàng <ArrowRight size={16} className="ml-1"/></a>
            </div>
        </div>
    </div>
);

export default ShopPage;