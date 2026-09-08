'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

// Types
export interface Division {
  id: string;
  name: string;
  code?: string;
}

export interface Organization {
  id: string;
  name: string;
  code?: string;
  divisions: Division[];
}

// Initial Mock Data
const INITIAL_ORGS: Organization[] = [
  {
    id: 'org-1',
    name: 'สำนักงานการคลัง',
    code: 'FIN',
    divisions: [
      { id: 'div-101', name: 'สำนักงานการคลังแผนกการลงทุน', code: 'FIN-INV' },
      { id: 'div-102', name: 'ฝ่ายบัญชีและงบประมาณ', code: 'FIN-ACC' },
      { id: 'div-103', name: 'ฝ่ายจัดซื้อและพัสดุ', code: 'FIN-PROC' },
    ],
  },
  {
    id: 'org-2',
    name: 'สำนักเทคโนโลยีสารสนเทศ',
    code: 'IT',
    divisions: [
      { id: 'div-201', name: 'ฝ่ายพัฒนาระบบสารสนเทศ', code: 'IT-DEV' },
      { id: 'div-202', name: 'ฝ่ายโครงสร้างพื้นฐานและเครือข่าย', code: 'IT-INFRA' },
    ],
  },
];

// SSR-safe client helper
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function OrganizationsAdminPage() {
  const isClient = useIsClient();
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isDivModalOpen, setIsDivModalOpen] = useState(false);
  
  // Active target states
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  
  // Form Drafts
  const [orgForm, setOrgForm] = useState({ name: '', code: '' });
  const [divForm, setDivForm] = useState({ name: '', code: '' });

  // Filter Logic
  const filteredOrganizations = organizations.filter((org) => {
    const matchesOrg = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (org.code && org.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiv = org.divisions.some(div => 
      div.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (div.code && div.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchesOrg || matchesDiv;
  });

  // Handlers
  const handleAddOrganization = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!orgForm.name.trim()) return;

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: orgForm.name.trim(),
      code: orgForm.code.trim().toUpperCase() || undefined,
      divisions: [],
    };

    setOrganizations([newOrg, ...organizations]);
    setOrgForm({ name: '', code: '' });
    setIsOrgModalOpen(false);
  };

  const handleAddDivision = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedOrgId || !divForm.name.trim()) return;

    const newDiv: Division = {
      id: `div-${Date.now()}`,
      name: divForm.name.trim(),
      code: divForm.code.trim().toUpperCase() || undefined,
    };

    setOrganizations(organizations.map(org => {
      if (org.id === selectedOrgId) {
        return {
          ...org,
          divisions: [...org.divisions, newDiv],
        };
      }
      return org;
    }));

    setDivForm({ name: '', code: '' });
    setIsDivModalOpen(false);
    setSelectedOrgId(null);
  };

  const handleDeleteOrganization = (orgId: string) => {
    if (confirm('คุณต้องการลบหน่วยงานนี้พร้อมแผนกทั้งหมดใช่หรือไม่?')) {
      setOrganizations(organizations.filter(o => o.id !== orgId));
    }
  };

  const handleDeleteDivision = (orgId: string, divId: string) => {
    if (confirm('คุณต้องการลบแผนกนี้ใช่หรือไม่?')) {
      setOrganizations(organizations.map(org => {
        if (org.id === orgId) {
          return {
            ...org,
            divisions: org.divisions.filter(d => d.id !== divId),
          };
        }
        return org;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i className="ri-building-4-line text-primary" />
              จัดการข้อมูลหน่วยงานและแผนก
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              เพิ่ม แก้ไข และจัดการโครงสร้างองค์กร (Organization & Division) สำหรับระบบจัดซื้อจัดจ้าง
            </p>
          </div>

          <button
            onClick={() => setIsOrgModalOpen(true)}
            className="btn btn-primary btn-sm gap-2 rounded-xl text-white font-bold"
          >
            <i className="ri-add-line text-lg" />
            เพิ่มหน่วยงานหลัก
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="ค้นหาชื่อหน่วยงาน, แผนก หรือ รหัส..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Organizations & Divisions List */}
        <div className="space-y-4">
          {filteredOrganizations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <i className="ri-inbox-line text-4xl text-slate-300 dark:text-slate-700 block mb-2" />
              <p className="text-xs text-slate-500 font-semibold">ไม่พบข้อมูลหน่วยงานหรือแผนกที่ตรงกับการค้นหา</p>
            </div>
          ) : (
            filteredOrganizations.map((org) => (
              <div 
                key={org.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
              >
                {/* Organization Header */}
                <div className="p-4 sm:p-5 bg-slate-100/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      <i className="ri-community-line" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {org.name}
                        </h3>
                        {org.code && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold">
                            {org.code}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        มีทั้งหมด {org.divisions.length} แผนก
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrgId(org.id);
                        setIsDivModalOpen(true);
                      }}
                      className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 gap-1 rounded-lg font-bold"
                    >
                      <i className="ri-add-circle-line" />
                      เพิ่มแผนก
                    </button>
                    <button
                      onClick={() => handleDeleteOrganization(org.id)}
                      className="btn btn-ghost btn-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                      title="ลบหน่วยงาน"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                </div>

                {/* Divisions Sub-list */}
                <div className="p-4 sm:p-5">
                  {org.divisions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">
                      ยังไม่มีแผนกย่อยในหน่วยงานนี้
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {org.divisions.map((div) => (
                        <div
                          key={div.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 group hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <i className="ri-[#git-commit-line] text-slate-400 rotate-90" />
                            <div>
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                                {div.name}
                              </span>
                              {div.code && (
                                <span className="text-[10px] font-mono font-medium text-slate-400">
                                  {div.code}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteDivision(org.id, div.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-1"
                            title="ลบแผนก"
                          >
                            <i className="ri-close-line text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Organization Modal */}
      {isClient && isOrgModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] min-h-[100svh] w-full flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setIsOrgModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-5 relative z-[10000] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="ri-building-line text-primary" />
                เพิ่มหน่วยงานหลักใหม่
              </h3>
              <button 
                type="button" 
                onClick={() => setIsOrgModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOrganization} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-300 font-semibold">ชื่อหน่วยงานหลัก *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สำนักงานการคลัง"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-300 font-semibold">รหัสหน่วยงาน (ย่อ)</label>
                <input
                  type="text"
                  placeholder="เช่น FIN"
                  value={orgForm.code}
                  onChange={(e) => setOrgForm({ ...orgForm, code: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOrgModalOpen(false)}
                  className="btn btn-ghost btn-sm text-slate-600 dark:text-slate-300"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary btn-sm text-white">
                  บันทึกหน่วยงาน
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add Division Modal */}
      {isClient && isDivModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] min-h-[100svh] w-full flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setIsDivModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-5 relative z-[10000] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="ri-git-branch-line text-primary" />
                เพิ่มแผนกย่อย
              </h3>
              <button 
                type="button" 
                onClick={() => setIsDivModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDivision} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-300 font-semibold">ชื่อแผนกย่อย *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สำนักงานการคลังแผนกการลงทุน"
                  value={divForm.name}
                  onChange={(e) => setDivForm({ ...divForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-300 font-semibold">รหัสแผนก (ย่อ)</label>
                <input
                  type="text"
                  placeholder="เช่น FIN-INV"
                  value={divForm.code}
                  onChange={(e) => setDivForm({ ...divForm, code: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDivModalOpen(false)}
                  className="btn btn-ghost btn-sm text-slate-600 dark:text-slate-300"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary btn-sm text-white">
                  บันทึกแผนก
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}