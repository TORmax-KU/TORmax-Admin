'use client';

import { useState } from 'react';
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
    LineChart,
    Line,
} from 'recharts';

// Mock data - replace with API calls
const mockTorStats = {
    totalTors: 4562,
    acceptedTors: 3891,
    identifiedContractors: 234,
    pendingTors: 342,
    rejectedTors: 329,
    completionRate: 85.3,
    averageCompletionTime: 4.2, // days
};

const mockTorActivity = [
    { month: 'Jan', submitted: 120, accepted: 98, completed: 85 },
    { month: 'Feb', submitted: 145, accepted: 112, completed: 95 },
    { month: 'Mar', submitted: 98, accepted: 82, completed: 72 },
    { month: 'Apr', submitted: 156, accepted: 134, completed: 118 },
    { month: 'May', submitted: 132, accepted: 108, completed: 94 },
    { month: 'Jun', submitted: 167, accepted: 145, completed: 128 },
];

const mockRiskData = [
    { name: 'Low Risk', value: 2450 },
    { name: 'Medium Risk', value: 890 },
    { name: 'High Risk', value: 340 },
    { name: 'Critical Risk', value: 211 },
];

const RISK_COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

const mockTorList = [
    {
        id: 'TOR-001',
        title: 'Website Redesign Project',
        contractor: 'Alice Johnson',
        status: 'Completed',
        risk: 'Low',
        submitted: '2024-01-15',
        accepted: '2024-01-20',
        completed: '2024-02-10',
        budget: 4500,
        category: 'Design'
    },
    {
        id: 'TOR-002',
        title: 'API Integration Service',
        contractor: 'Bob Smith',
        status: 'In Progress',
        risk: 'Medium',
        submitted: '2024-02-01',
        accepted: '2024-02-05',
        completed: '-',
        budget: 3200,
        category: 'Development'
    },
    {
        id: 'TOR-003',
        title: 'Security Audit',
        contractor: 'Carol White',
        status: 'Pending',
        risk: 'Critical',
        submitted: '2024-03-10',
        accepted: '-',
        completed: '-',
        budget: 5800,
        category: 'Security'
    },
    {
        id: 'TOR-004',
        title: 'Content Migration',
        contractor: 'David Brown',
        status: 'Completed',
        risk: 'Low',
        submitted: '2024-02-15',
        accepted: '2024-02-18',
        completed: '2024-03-01',
        budget: 2100,
        category: 'Content'
    },
    {
        id: 'TOR-005',
        title: 'Mobile App Development',
        contractor: 'Eve Davis',
        status: 'At Risk',
        risk: 'High',
        submitted: '2024-01-05',
        accepted: '2024-01-10',
        completed: '-',
        budget: 12000,
        category: 'Development'
    },
    {
        id: 'TOR-006',
        title: 'Database Optimization',
        contractor: 'Frank Wilson',
        status: 'Completed',
        risk: 'Low',
        submitted: '2023-12-01',
        accepted: '2023-12-05',
        completed: '2023-12-20',
        budget: 3400,
        category: 'Database'
    },
    {
        id: 'TOR-007',
        title: 'UI/UX Research',
        contractor: 'Grace Lee',
        status: 'In Progress',
        risk: 'Medium',
        submitted: '2024-03-01',
        accepted: '2024-03-05',
        completed: '-',
        budget: 2800,
        category: 'Design'
    },
];

export default function TORListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterRisk, setFilterRisk] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPeriod, setSelectedPeriod] = useState('6');
    const torsPerPage = 5;

    // Filter TORs
    const filteredTors = mockTorList.filter(tor => {
        const matchesSearch = tor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tor.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tor.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || tor.status === filterStatus;
        const matchesRisk = filterRisk === 'All' || tor.risk === filterRisk;
        return matchesSearch && matchesStatus && matchesRisk;
    });

    // Pagination
    const indexOfLastTor = currentPage * torsPerPage;
    const indexOfFirstTor = indexOfLastTor - torsPerPage;
    const currentTors = filteredTors.slice(indexOfFirstTor, indexOfLastTor);
    const totalPages = Math.ceil(filteredTors.length / torsPerPage);

    // Get status badge color
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'Completed': 'badge-success',
            'In Progress': 'badge-info',
            'Pending': 'badge-warning',
            'At Risk': 'badge-error',
        };
        return statusMap[status] || 'badge-ghost';
    };

    // Get risk badge color
    const getRiskBadge = (risk: string) => {
        const riskMap: { [key: string]: string } = {
            'Low': 'badge-success',
            'Medium': 'badge-warning',
            'High': 'badge-error',
            'Critical': 'badge-error',
        };
        return riskMap[risk] || 'badge-ghost';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold">📋 TOR Management</h1>
                <button className="btn btn-primary w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New TOR
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="stat-title">Total TORs</div>
                    <div className="stat-value text-primary">{mockTorStats.totalTors.toLocaleString()}</div>
                    <div className="stat-desc">↗︎ {mockTorStats.acceptedTors} accepted</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="stat-title">Accepted TORs</div>
                    <div className="stat-value text-secondary">{mockTorStats.acceptedTors.toLocaleString()}</div>
                    <div className="stat-desc">{mockTorStats.completionRate}% completion rate</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="stat-title">Identified Contractors</div>
                    <div className="stat-value text-accent">{mockTorStats.identifiedContractors.toLocaleString()}</div>
                    <div className="stat-desc">↗︎ 12 new this month</div>
                </div>

                <div className="stat bg-base-100 shadow-lg rounded-box">
                    <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="stat-title">Avg Completion Time</div>
                    <div className="stat-value text-success">{mockTorStats.averageCompletionTime} days</div>
                    <div className="stat-desc">↘︎ 0.8 days faster</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Line Chart - TOR Activity */}
                <div className="lg:col-span-2 bg-base-100 shadow-lg rounded-box p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">📊 TOR Activity Overview</h2>
                        <select
                            className="select select-bordered select-sm"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="3">Last 3 Months</option>
                            <option value="6">Last 6 Months</option>
                            <option value="12">Last 12 Months</option>
                        </select>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockTorActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="submitted" stroke="#8884d8" name="Submitted" />
                                <Line type="monotone" dataKey="accepted" stroke="#82ca9d" name="Accepted" />
                                <Line type="monotone" dataKey="completed" stroke="#ffc658" name="Completed" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Risk Distribution */}
                <div className="bg-base-100 shadow-lg rounded-box p-4">
                    <h2 className="text-xl font-bold mb-4">⚠️ Risk Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockRiskData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {mockRiskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        <span className="badge badge-success">Low: {mockRiskData[0].value}</span>
                        <span className="badge badge-warning">Medium: {mockRiskData[1].value}</span>
                        <span className="badge badge-error">High: {mockRiskData[2].value}</span>
                        <span className="badge badge-error">Critical: {mockRiskData[3].value}</span>
                    </div>
                </div>
            </div>

            {/* TOR Reports & Risk Handling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-base-100 shadow-lg rounded-box p-4">
                    <div className="flex items-center gap-4">
                        <div className="badge badge-error badge-lg">!</div>
                        <div>
                            <h3 className="font-semibold">TOR Reports</h3>
                            <p className="text-2xl font-bold text-error">23</p>
                            <p className="text-sm opacity-70">Needs investigation</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>⏳ Overdue TORs</span>
                            <span className="badge badge-error">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>📋 Pending Review</span>
                            <span className="badge badge-warning">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>✅ Completed On Time</span>
                            <span className="badge badge-success">34</span>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 shadow-lg rounded-box p-4">
                    <div className="flex items-center gap-4">
                        <div className="badge badge-warning badge-lg">⚠</div>
                        <div>
                            <h3 className="font-semibold">Risk Handling</h3>
                            <p className="text-2xl font-bold text-warning">551</p>
                            <p className="text-sm opacity-70">At risk TORs</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>🔴 High Risk Active</span>
                            <span className="badge badge-error">45</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>🟡 Medium Risk Active</span>
                            <span className="badge badge-warning">128</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>🟢 Low Risk Active</span>
                            <span className="badge badge-success">378</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOR List Table */}
            <div className="bg-base-100 shadow-lg rounded-box p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold">📋 TOR List</h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="🔍 Search TORs..."
                            className="input input-bordered input-sm w-full sm:w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="select select-bordered select-sm w-full sm:w-auto"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                            <option value="At Risk">At Risk</option>
                        </select>
                        <select
                            className="select select-bordered select-sm w-full sm:w-auto"
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                        >
                            <option value="All">All Risk</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Contractor</th>
                                <th>Status</th>
                                <th>Risk</th>
                                <th>Budget</th>
                                <th>Category</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTors.map((tor) => (
                                <tr key={tor.id}>
                                    <td className="font-mono text-sm">{tor.id}</td>
                                    <td className="font-medium max-w-xs truncate">{tor.title}</td>
                                    <td>{tor.contractor}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(tor.status)}`}>
                                            {tor.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getRiskBadge(tor.risk)}`}>
                                            {tor.risk}
                                        </span>
                                    </td>
                                    <td>${tor.budget.toLocaleString()}</td>
                                    <td>
                                        <span className="badge badge-ghost">{tor.category}</span>
                                    </td>
                                    <td className="text-sm">{tor.submitted}</td>
                                    <td>
                                        <div className="flex gap-1">
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
                        Showing {indexOfFirstTor + 1}-{Math.min(indexOfLastTor, filteredTors.length)} of {filteredTors.length} TORs
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