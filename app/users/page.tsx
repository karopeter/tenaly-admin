"use client";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../reusables/Sidebar";
import { FiDownload, FiMoreVertical, FiEye, FiUserX, FiTrash2 } from "react-icons/fi";
import Img from "../reusables/Img";
import api from "@/services/api";
import { UserData, UserFilters, Pagination } from "../types/users-types";
import { toast } from 'react-toastify';
import { Header } from "../reusables/Header";


interface ModalState {
    show: boolean;
    user: UserData | null;
}

export default function Users() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Filter states
    const [filters, setFilters] = useState<UserFilters>({
        search: '',
        subscription: 'all',
        userType: 'all',
        status: 'all'
    });

    // Pagination
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0
    });

    // Modals
    const [suspendModal, setSuspendModal] = useState<ModalState>({ show: false, user: null });
    const [deleteModal, setDeleteModal] = useState<ModalState>({ show: false, user: null });
    const [suspendReason, setSuspendReason] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            
            const queryParams = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...filters
            }).toString();

            const response = await api.get(`/profile/admin/users?${queryParams}`);

            if (response.data.success) {
                setUsers(response.data.data);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.pagination.total,
                    pages: response.data.pagination.pages
                }));
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 403) {
                toast.error('Access denied: Admin only');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user, filters, pagination.page]);

    // Handle filter change
    const handleFilterChange = (key: keyof UserFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            search: '',
            subscription: 'all',
            userType: 'all',
            status: 'all'
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // View profile
    const viewProfile = (userId: string) => {
        router.push(`/admin/users/${userId}`);
        setOpenMenuId(null);
    };

    // Suspend user
    const handleSuspend = async () => {
        if (!suspendModal.user) return;

        if (!suspendModal.user.isSuspended && !suspendReason.trim()) {
            alert('Please provide a reason for suspension');
            return;
        }

        try {
            const response = await api.patch(
                `/profile/admin/users/${suspendModal.user._id}/suspend`,
                { reason: suspendReason }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setSuspendModal({ show: false, user: null });
                setSuspendReason('');
                fetchUsers();
            }
        } catch (error: any) {
            console.error('Error suspending user:', error);
            toast.error(error.response?.data?.message || 'Failed to suspend user');
        }
    };

    // Delete user
    const handleDelete = async () => {
        if (!deleteModal.user) return;

        if (confirmEmail !== deleteModal.user.email) {
            alert('Email confirmation does not match');
            return;
        }

        try {
            const response = await api.delete(
                `/profile/admin/delete-user/${deleteModal.user._id}`,
                { data: { confirmEmail } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setDeleteModal({ show: false, user: null });
                setConfirmEmail('');
                fetchUsers();
            }
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    // Export CSV
    const exportCSV = async () => {
        try {
            const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
            
            const response = await api.get(`/profile/admin/users/export?${queryParams}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting CSV:', error);
            toast.error('Failed to export CSV');
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#FFFFFF]">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} overflow-x-hidden`}>
                <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                <main className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-[20px] font-medium text-[#525252]">Users</h1>
                    </div>

                    {/* User overview section */}
                    <div className="bg-white rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-medium text-[#000087] flex items-center justify-between bg-[#F7F7FF] rounded-[8px] h-[44px] w-[281px] pt-[10px] pr-[16px] pb-[10px] pl-[16px]">
                                Users Overview
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </h2>
                            <button
                                onClick={exportCSV}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer 
                                bg-gradient-to-r from-[#00A8DF] to-[#1031AA] 
                                text-white rounded-lg hover:opacity-90">
                                <FiDownload />
                                Export csv
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                            {/* Search Input */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="
                                      w-[283px] h-[44px]
                                      px-[24px]
                                      border border-[#EDEDED]
                                      rounded-[8px]
                                      focus:outline-none
                                      shadow-[0px_4px_4px_#A79C9C0D]
                                      "
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto lg:mx-auto">
                                <span className="text-[#2C2C2C] font-[400] text-[14px] whitespace-nowrap">Filter By:</span>

                                {/* Subscription Dropdown */}
                                <select
                                    value={filters.subscription}
                                    onChange={(e) => handleFilterChange('subscription', e.target.value)}
                                    className="
                                      px-4 py-2
                                      border border-[#CDCDD7]
                                      rounded-[4px]
                                      w-full sm:w-[96px]
                                      h-[44px]
                                      focus:outline-none
                                    "
                                >
                                    <option value="all">All Subscriptions</option>
                                    <option value="free">Free</option>
                                    <option value="basic">Basic</option>
                                    <option value="premium">Premium</option>
                                    <option value="diamond">Diamond</option>
                                    <option value="vip">VIP</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>

                                {/* User Type Dropdown */}
                                <select
                                    value={filters.userType}
                                    onChange={(e) => handleFilterChange('userType', e.target.value)}
                                    className="
                                      px-4 py-2
                                      border border-[#CDCDD7]
                                      rounded-lg
                                      w-full sm:w-[173px]
                                      focus:outline-none
                                    "
                                >
                                    <option value="all">All User Types</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="seller">Seller</option>
                                    <option value="customer">Customer</option>
                                </select>

                                {/* Status Dropdown */}
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="
                                     px-4 py-2 
                                     border border-[#CDCDD7]
                                     rounded-lg 
                                     w-full sm:w-[173px]
                                     h-[44px]
                                     focus:outline-none
                                    "
                                >
                                    <option value="all">All Status</option>
                                    <option value="verified">Verified</option>
                                    <option value="unverified">Unverified</option>
                                    <option value="suspended">Suspended</option>
                                </select>

                                {/* Clear Filter */}
                                <button
                                    onClick={clearFilters}
                                    className="
                                     flex items-center
                                     gap-1 text-[#525252] font-[400]
                                     text-[14px] whitespace-nowrap
                                    "
                                >
                                    <Img
                                        src="/clear-filter.svg"
                                        alt="Clear Filter"
                                        width={13.33}
                                        height={16.67}
                                    />
                                    Clear Filter
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <div className="">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-[#E7E7E7] border-y border-[#E1E1E1]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <input type="checkbox" className="rounded border-gray-300" />
                                                </th>
                                                <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                                                    User Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                                                    Full Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                                                    Email Address
                                                </th>
                                                <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                                                    Date Joined
                                                </th>
                                                <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                                                    Subscription
                                                </th>
                                                <th className="px-6 py-3 text-left text-[14px] font-[600] text-[#525252] tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                                        No users found
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map((userData) => (
                                                    <tr key={userData._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <input type="checkbox" className="rounded border-gray-300" />
                                                        </td>
                                                        <td className="px-6 py-4 break-words">
                                                            <span className="capitalize text-[14px] text-[#525252]">
                                                                {userData.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    {userData.image ? (
                                                                        <Img
                                                                            className="h-10 w-10 rounded-full object-cover"
                                                                            src={userData.image}
                                                                            width={10}
                                                                            height={10}
                                                                            alt={userData.fullName}
                                                                        />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                            <span className="text-gray-500 font-medium">
                                                                                {userData.fullName?.charAt(0) || 'U'}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-[14px] font-medium text-[#525252]">
                                                                        {userData.fullName}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 break-words  text-[14px] text-[#525252]">
                                                            {userData.email}
                                                        </td>
                                                        <td className="px-6 py-4 break-words text-[14px] text-[#525252]">
                                                            {formatDate(userData.dateJoined)}
                                                        </td>
                                                        <td className="px-4 py-4 break-words">
                                                            <span className="capitalize text-[14px] text-[#525252]">
                                                                {userData.subscription}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {userData.isSuspended ? (
                                                                <span className="inline-flex items-center justify-center px-3 text-xs font-semibold rounded-[28px] h-[31px] bg-red-100 text-red-800">
                                                                    Suspended
                                                                </span>
                                                            ) : userData.isVerified ? (
                                                                <span className="inline-flex items-center justify-center px-3 text-xs font-semibold rounded-[28px] bg-[#238E15] text-[#FAFAFA] w-[79px] h-[31px]">
                                                                    Verified
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center justify-center px-3 text-xs font-semibold rounded-[28px]  w-[79px] h-[31px] bg-[#CAA416] text-[#FAFAFA]">
                                                                    Unverified
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 break-words text-right text-sm font-medium relative">
                                                            <button
                                                                onClick={() => setOpenMenuId(openMenuId === userData._id ? null : userData._id)}
                                                                className="text-gray-400 hover:text-gray-600"
                                                            >
                                                                <FiMoreVertical className="h-5 w-5" />
                                                            </button>

                                                            {/* Action Menu */}
                                                            {openMenuId === userData._id && (
                                                                <div
                                                                    ref={menuRef}
                                                                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-50"
                                                                >
                                                                    <div className="py-1">
                                                                        <button
                                                                            onClick={() => viewProfile(userData._id)}
                                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            <FiEye /> View Profile
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSuspendModal({ show: true, user: userData });
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                                                                        >
                                                                            <FiUserX /> {userData.isSuspended ? 'Unsuspend' : 'Suspend'}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setDeleteModal({ show: true, user: userData });
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                        >
                                                                            <FiTrash2 /> Delete User
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        {pagination.total > 0 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-700">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                    {pagination.total} results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page >= (pagination.pages || 1)}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Suspend Modal */}
            {suspendModal.show && suspendModal.user && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {suspendModal.user.isSuspended ? 'Unsuspend' : 'Suspend'} User
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {suspendModal.user.isSuspended 
                                ? 'Are you sure you want to unsuspend this user?' 
                                : 'Please provide a reason for suspending this user:'}
                        </p>
                        {!suspendModal.user.isSuspended && (
                            <textarea
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                rows={4}
                                placeholder="Enter suspension reason..."
                            />
                        )}
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setSuspendModal({ show: false, user: null });
                                    setSuspendReason('');
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSuspend}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && deleteModal.user && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">Delete User</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            This action is irreversible. All user data including ads, businesses, and messages will be permanently deleted.
                        </p>
                        <p className="text-sm font-medium mb-2">
                            Type <span className="font-bold">{deleteModal.user.email}</span> to confirm:
                        </p>
                        <input
                            type="text"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter email to confirm"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setDeleteModal({ show: false, user: null });
                                    setConfirmEmail('');
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={confirmEmail !== deleteModal.user.email}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}