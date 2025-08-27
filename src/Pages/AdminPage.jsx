import { useState, useEffect } from 'react';
import { mockStores } from '../data/mockData';
import { Edit, Trash2 } from 'lucide-react';

const AdminPage = () => {
    const [stores, setStores] = useState([]);
    useEffect(() => { setTimeout(() => setStores(mockStores), 500); }, []);
    const getStatusClass = (status) => status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    return (
        <div className="p-4 md:p-2">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800">Quản lý Hệ thống</h1>
                <p className="text-slate-500 mt-2">Theo dõi và quản lý toàn bộ cửa hàng trên nền tảng.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200/80">
                <table className="w-full text-base">
                    <thead className="text-sm font-semibold text-slate-600 bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left">Tên cửa hàng</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">Doanh thu</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {stores.map(store => (
                            <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-800">{store.name}</td>
                                <td className="px-6 py-4 text-slate-600">{store.email}</td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{store.revenue.toLocaleString('vi-VN')} ₫</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(store.status)}`}>{store.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-md"><Edit size={16} /></button>
                                        <button className="p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-md"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;