'use client';

import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// Mock data - replace with API calls
const mockStats = {
    totalUsers: 1247,
    newUsersLast7Days: 89,
    newUsersLast30Days: 342,
    acceptedTors: 3891,
    averageTorPerUser: 3.66,
    userSatisfaction: 4.2,
};

const mockUserGrowth = [
    { day: 'Mon', newUsers: 12 },
    { day: 'Tue', newUsers: 18 },
    { day: 'Wed', newUsers: 8 },
    { day: 'Thu', newUsers: 14 },
    { day: 'Fri', newUsers: 22 },
    { day: 'Sat', newUsers: 10 },
    { day: 'Sun', newUsers: 5 },
];

const mockSuspiciousData = [
    { name: 'Accepted & Not Done', value: 23 },
    { name: 'Invalid Credentials', value: 12 },
    { name: 'Suspicious Behavior', value: 8 },
    { name: 'Reported Users', value: 5 },
];

const COLORS = ['#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0'];

const mockUserList = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', tors: 8, joined: '2024-01-15', lastActive: '2024-04-12' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Suspicious', tors: 3, joined: '2024-02-20', lastActive: '2024-04-10' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', status: 'Active', tors: 12, joined: '2023-11-01', lastActive: '2024-04-13' },
    { id: 4, name: 'David Brown', email: 'david@example.com', status: 'Inactive', tors: 1, joined: '2024-03-10', lastActive: '2024-03-25' },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', status: 'Active', tors: 6, joined: '2024-01-28', lastActive: '2024-04-11' },
    { id: 6, name: 'Frank Wilson', email: 'frank@example.com', status: 'Reported', tors: 0, joined: '2024-04-05', lastActive: '2024-04-05' },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com', status: 'Active', tors: 15, joined: '2023-12-10', lastActive: '2024-04-14' },
    { id: 8, name: 'Henry Taylor', email: 'henry@example.com', status: 'Suspicious', tors: 2, joined: '2024-03-01', lastActive: '2024-04-08' },
];

export default function UserListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('7');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    // Filter users based on search
    const filteredUsers = mockUserList.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">👥 User Management</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value text-primary">{mockStats.totalUsers.toLocaleString()}</div>
                    <div className="stat-desc">↗︎ {mockStats.newUsersLast7Days} new in 7 days</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="stat-title">Accepted TORs</div>
                    <div className="stat-value text-secondary">{mockStats.acceptedTors.toLocaleString()}</div>
                    <div className="stat-desc">↗︎ {Math.round(mockStats.acceptedTors / (mockStats.totalUsers * 5) * 100)}% completion rate</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="stat-title">Avg TORs / User</div>
                    <div className="stat-value text-accent">{mockStats.averageTorPerUser}</div>
                    <div className="stat-desc">↗︎ 3.2% from last month</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-success">
                        <div className="rating rating-sm">
                            <input type="radio" name="rating" className="mask mask-star" checked readOnly />
                            <input type="radio" name="rating" className="mask mask-star" checked readOnly />
                            <input type="radio" name="rating" className="mask mask-star" checked readOnly />
                            <input type="radio" name="rating" className="mask mask-star" checked readOnly />
                            <input type="radio" name="rating" className="mask mask-star" />
                        </div>
                    </div>
                    <div className="stat-title">User Satisfaction</div>
                    <div className="stat-value text-success">{mockStats.userSatisfaction}/5</div>
                    <div className="stat-desc">↗︎ 0.3 increase from last month</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Bar Chart - User Growth */}
                <div className="lg:col-span-2 bg-base-100 shadow-lg rounded-box p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">📈 New Users Growth</h2>
                        <select
                            className="select select-bordered select-sm"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="14">Last 14 Days</option>
                            <option value="30">Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockUserGrowth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="newUsers" fill="#8884d8" name="New Users" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Suspicious Activity */}
                <div className="bg-base-100 shadow-lg rounded-box p-4">
                    <h2 className="text-xl font-bold mb-4">⚠️ Suspicious Behavior</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockSuspiciousData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {mockSuspiciousData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* User List Table */}
            <div className="bg-base-100 shadow-lg rounded-box p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold">📋 User List</h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="🔍 Search users..."
                            className="input input-bordered input-sm w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select className="select select-bordered select-sm w-full sm:w-auto">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Suspicious</option>
                            <option>Reported</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>TORs</th>
                                <th>Joined</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="font-mono">#{user.id}</td>
                                    <td className="font-medium">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.status === 'Active' ? 'badge-success' :
                                                user.status === 'Suspicious' ? 'badge-warning' :
                                                    user.status === 'Reported' ? 'badge-error' :
                                                        'badge-ghost'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{user.tors}</td>
                                    <td>{user.joined}</td>
                                    <td className="text-sm opacity-70">{user.lastActive}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-ghost btn-xs" title="View Details">
                                                👁️
                                            </button>
                                            <button className="btn btn-ghost btn-xs text-warning" title="Edit">
                                                ✏️
                                            </button>
                                            <button className="btn btn-ghost btn-xs text-error" title="Delete">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                    <div className="text-sm text-base-content/70">
                        Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                    </div>
                    <div className="join">
                        <button
                            className="join-item btn btn-sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            «
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={i}
                                    className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && <button className="join-item btn btn-sm btn-disabled">...</button>}
                        <button
                            className="join-item btn btn-sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}