import { useState, useEffect } from 'react';
import { mockStores } from '../data/mockData';

const AdminPage = () => {
    const [stores, setStores] = useState([]);
    useEffect(() => { setTimeout(() => setStores(mockStores), 500); }, []);
    const getStatusClass = (status) => status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-800">Trang quản lý Admin</h1>
            <p className="text-slate-600 mb-6">Quản lý toàn bộ hệ thống cửa hàng và người dùng.</p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Tên cửa hàng</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => (
                            <tr key={store.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-semibold text-slate-800">{store.name}</td>
                                <td className="px-6 py-4">{store.email}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(store.status)}`}>{store.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;