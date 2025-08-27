import Button from "../Components/UI/button";
import { PlusCircle, Package } from "lucide-react";

const ShopPage = () => (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Trang quản lý Cửa hàng</h1>
        <p className="text-slate-600 mb-6">Đây là nơi bạn quản lý sản phẩm, đơn hàng và xem báo cáo.</p>
        {/* Ở đây sẽ có các component con như ProductCreatePage, OrderManagementPage,... */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg">Chức năng nhanh</h2>
            <div className="mt-4 flex gap-4">
                <Button><PlusCircle size={16} className="mr-2"/> Đăng sản phẩm</Button>
                <Button variant="secondary"><Package size={16} className="mr-2"/> Quản lý đơn hàng</Button>
            </div>
        </div>
    </div>
);

export default ShopPage;