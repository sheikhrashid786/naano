'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Users,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  Building2,
  Contact,
  CheckCircle2,
  X,
  Lock,
  Mail,
  User,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  users: any[];
}

export default function AdminUsersClient({ initialUser, users: initialUsers }: Props) {
  const [usersList, setUsersList] = useState<any[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'COMPANY' | 'CREATOR' | 'ADMIN'>('COMPANY');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.company?.name && u.company.name.toLowerCase().includes(query)) ||
        (u.creator?.niche && u.creator.niche.toLowerCase().includes(query));
      return matchesRole && matchesSearch;
    });
  }, [usersList, selectedRole, searchQuery]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast(`User role successfully changed to ${newRole}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDeleteUser(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) {
      return;
    }

    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      showToast(`User "${userName}" deleted successfully`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      setUsersList((prev) => [data.user, ...prev]);
      setIsAddModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('COMPANY');
      showToast(`User "${data.user.name}" created successfully`);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header
        balance={0}
        user={{
          name: initialUser.name,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Title and Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Super Admin</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {usersList.length} Total Users in Database
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              User &amp; Role Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Change permission levels, create administrators, or manage registered accounts across Naano.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New User</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Role Filter Pills */}
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 overflow-x-auto max-w-full">
            {[
              { id: 'ALL', label: 'All Roles', count: usersList.length },
              { id: 'COMPANY', label: 'Companies', count: usersList.filter((u) => u.role === 'COMPANY').length },
              { id: 'CREATOR', label: 'Creators', count: usersList.filter((u) => u.role === 'CREATOR').length },
              { id: 'ADMIN', label: 'Super Admins', count: usersList.filter((u) => u.role === 'ADMIN').length },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRole === role.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{role.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${selectedRole === role.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {role.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6">Associated Profile</th>
                  <th className="py-4 px-6">Permission Authority</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No users match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-200/80">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                            user.role === 'ADMIN'
                              ? 'bg-slate-900 text-white'
                              : user.role === 'COMPANY'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200/80'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}
                        >
                          {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                          {user.role === 'COMPANY' && <Building2 className="w-3 h-3 text-teal-700" />}
                          {user.role === 'CREATOR' && <Contact className="w-3 h-3 text-emerald-600" />}
                          <span>{user.role}</span>
                        </span>
                      </td>

                      {/* Associated Profile Info */}
                      <td className="py-4 px-6">
                        {user.company ? (
                          <div>
                            <div className="font-bold text-slate-800">{user.company.name}</div>
                            <div className="text-[11px] text-teal-800 font-mono">Brand Partner</div>
                          </div>
                        ) : user.creator ? (
                          <div>
                            <div className="font-bold text-slate-800">{user.creator.niche || 'Creator'}</div>
                            <div className="text-[11px] text-emerald-600 font-mono">
                              {(user.creator.followersCount / 1000).toFixed(1)}k followers
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">System Staff</span>
                        )}
                      </td>

                      {/* Role Switcher */}
                      <td className="py-4 px-6">
                        <select
                          value={user.role}
                          disabled={loadingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer disabled:opacity-50"
                        >
                          <option value="COMPANY">COMPANY</option>
                          <option value="CREATOR">CREATOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          disabled={loadingId === user.id || user.email === initialUser.email}
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          title={user.email === initialUser.email ? 'Cannot delete yourself' : 'Delete user'}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Provision User</h3>
                <p className="text-xs text-slate-500">Add an administrator, brand, or creator account</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@domain.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Permission</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 font-bold text-slate-800"
                >
                  <option value="COMPANY">COMPANY (Brand Customer)</option>
                  <option value="CREATOR">CREATOR (Marketplace Partner)</option>
                  <option value="ADMIN">ADMIN (Super Administrator)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  {formSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
