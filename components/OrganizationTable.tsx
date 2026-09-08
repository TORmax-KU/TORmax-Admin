'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

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

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function OrganizationTable() {
  const isClient = useIsClient();
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isDivModalOpen, setIsDivModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  
  const [orgForm, setOrgForm] = useState({ name: '', code: '' });
  const [divForm, setDivForm] = useState({ name: '', code: '' });

  const filteredOrganizations = organizations.filter((org) => {
    const matchesOrg = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (org.code && org.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiv = org.divisions.some(div => 
      div.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (div.code && div.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchesOrg || matchesDiv;
  });

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
        return { ...org, divisions: [...org.divisions, newDiv] };
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
          return { ...org, divisions: org.divisions.filter(d => d.id !== divId) };
        }
        return org;
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <h3 className="font-bold text-base text-base-content flex items-center gap-2">
            <i className="ri-building-4-line text-primary" />
            จัดการข้อมูลหน่วยงานและแผนก
          </h3>
          <p className="text-xs text-base-content/70 mt-1">
            เพิ่ม แก้ไข และจัดการโครงสร้างองค์กร (Organization & Division) สำหรับระบบจัดซื้อจัดจ้าง
          </p>
        </div>

        <button
          onClick={() => setIsOrgModalOpen(true)}
          className="btn btn-primary btn-sm gap-2 font-bold"
        >
          <i className="ri-add-line text-base" />
          เพิ่มหน่วยงานหลัก
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50 text-sm" />
        <input
          type="text"
          placeholder="ค้นหาชื่อหน่วยงาน, แผนก หรือ รหัส..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-300 rounded-xl text-xs font-semibold text-base-content focus:outline-none focus:border-primary transition-all"
        />
      </div>

      {/* Organizations List */}
      <div className="space-y-4">
        {filteredOrganizations.length === 0 ? (
          <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-300">
            <i className="ri-inbox-line text-4xl text-base-content/30 block mb-2" />
            <p className="text-xs text-base-content/60 font-semibold">ไม่พบข้อมูลหน่วยงานหรือแผนกที่ตรงกับการค้นหา</p>
          </div>
        ) : (
          filteredOrganizations.map((org) => (
            <div key={org.id} className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
              <div className="p-4 sm:p-5 bg-base-200/50 border-b border-base-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    <i className="ri-community-line" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-base-content">{org.name}</h4>
                      {org.code && (
                        <span className="badge badge-sm badge-ghost font-mono text-[10px] font-bold">{org.code}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-base-content/60 font-medium mt-0.5">
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
                    className="btn btn-ghost btn-xs text-primary gap-1 font-bold"
                  >
                    <i className="ri-add-circle-line" />
                    เพิ่มแผนก
                  </button>
                  <button
                    onClick={() => handleDeleteOrganization(org.id)}
                    className="btn btn-ghost btn-xs text-error"
                    title="ลบหน่วยงาน"
                  >
                    <i className="ri-delete-bin-line" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {org.divisions.length === 0 ? (
                  <p className="text-xs text-base-content/50 italic text-center py-2">
                    ยังไม่มีแผนกย่อยในหน่วยงานนี้
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {org.divisions.map((div) => (
                      <div
                        key={div.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-base-200/30 border border-base-300 group hover:border-base-content/20 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <i className="ri-node-tree text-base-content/40 text-xs" />
                          <div>
                            <span className="text-xs font-semibold text-base-content block">{div.name}</span>
                            {div.code && (
                              <span className="text-[10px] font-mono text-base-content/50">{div.code}</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteDivision(org.id, div.id)}
                          className="opacity-0 group-hover:opacity-100 text-base-content/40 hover:text-error transition-opacity p-1"
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

      {/* Add Org Modal */}
      {isClient && isOrgModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => setIsOrgModalOpen(false)}>
          <div className="bg-base-100 border border-base-300 max-w-md w-full rounded-2xl shadow-xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <i className="ri-building-line text-primary" />
              เพิ่มหน่วยงานหลักใหม่
            </h3>
            <form onSubmit={handleAddOrganization} className="space-y-4 text-xs font-medium">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">ชื่อหน่วยงานหลัก *</span></label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สำนักงานการคลัง"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="input input-sm input-bordered w-full font-sans"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">รหัสหน่วยงาน (ย่อ)</span></label>
                <input
                  type="text"
                  placeholder="เช่น FIN"
                  value={orgForm.code}
                  onChange={(e) => setOrgForm({ ...orgForm, code: e.target.value })}
                  className="input input-sm input-bordered w-full font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsOrgModalOpen(false)} className="btn btn-ghost btn-sm">ยกเลิก</button>
                <button type="submit" className="btn btn-primary btn-sm">บันทึกหน่วยงาน</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add Division Modal */}
      {isClient && isDivModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => setIsDivModalOpen(false)}>
          <div className="bg-base-100 border border-base-300 max-w-md w-full rounded-2xl shadow-xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <i className="ri-git-branch-line text-primary" />
              เพิ่มแผนกย่อย
            </h3>
            <form onSubmit={handleAddDivision} className="space-y-4 text-xs font-medium">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">ชื่อแผนกย่อย *</span></label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ฝ่ายบัญชีและงบประมาณ"
                  value={divForm.name}
                  onChange={(e) => setDivForm({ ...divForm, name: e.target.value })}
                  className="input input-sm input-bordered w-full font-sans"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">รหัสแผนก (ย่อ)</span></label>
                <input
                  type="text"
                  placeholder="เช่น FIN-ACC"
                  value={divForm.code}
                  onChange={(e) => setDivForm({ ...divForm, code: e.target.value })}
                  className="input input-sm input-bordered w-full font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsDivModalOpen(false)} className="btn btn-ghost btn-sm">ยกเลิก</button>
                <button type="submit" className="btn btn-primary btn-sm">บันทึกแผนก</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}