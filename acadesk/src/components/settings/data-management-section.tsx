"use client";

import { useState, useRef } from "react";
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Check,
  FileJson,
  ShieldCheck,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  exportAllStudentData,
  downloadExportFile,
  validateImportPayload,
  executeDataImport,
  executeDataClear,
} from "@/lib/settings-storage";
import { ImportValidationResult, AcadeskExportPayload } from "@/types/settings";

interface DataManagementSectionProps {
  onDataImported: (payload: AcadeskExportPayload) => void;
  onDataCleared: () => void;
}

export function DataManagementSection({
  onDataImported,
  onDataCleared,
}: DataManagementSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importValidation, setImportValidation] = useState<ImportValidationResult | null>(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Handle Export
  const handleExport = () => {
    const payload = exportAllStudentData();
    downloadExportFile(payload);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };

  // Handle File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateImportPayload(content);
      setImportValidation(result);
      if (result.isValid) {
        setShowImportConfirm(true);
      }
    };
    reader.readAsText(file);

    // Reset input so re-selecting same file triggers change
    e.target.value = "";
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (!importValidation?.payload) return;

    const success = executeDataImport(importValidation.payload);
    if (success) {
      onDataImported(importValidation.payload);
      setShowImportConfirm(false);
      setImportValidation(null);
      setActionSuccessMessage(
        `Backup imported successfully (${importValidation.payload.tasks.length} tasks, ${
          importValidation.payload.wellbeingCheckins?.length || 0
        } well-being check-ins restored)!`
      );
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  // Confirm Clear All Local Data
  const handleConfirmClear = () => {
    executeDataClear();
    onDataCleared();
    setShowClearConfirm(false);
    setActionSuccessMessage(
      "All Acadesk local data has been erased from this browser. Your workspace is reset."
    );
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FileJson className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Student Data Management
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Export portable JSON backups, restore workspace states, or clear browser data.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full self-start sm:self-center">
          Schema v1.0
        </span>
      </div>

      {/* Action Success Toast */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Validation Failure Toast */}
      {importValidation && !importValidation.isValid && (
        <div className="p-4 rounded-[var(--radius-md)] bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Import Rejected: Backup File Validation Failed</span>
            </span>
            <button
              type="button"
              onClick={() => setImportValidation(null)}
              className="text-rose-700 hover:text-rose-900"
              aria-label="Dismiss import error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="list-disc list-inside space-y-0.5 opacity-90 pl-1 text-[11px]">
            {importValidation.errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
          <p className="text-[10px] text-rose-700 italic">
            Existing workspace data was NOT modified. Please ensure you are importing a genuine Acadesk v1.0 backup file.
          </p>
        </div>
      )}

      {/* Data Management Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Export */}
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-[var(--color-text)]">
              <Download className="h-4 w-4 text-[var(--color-primary)]" />
              <span>Export Workspace Data</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Downloads a complete JSON backup including tasks, subtask breakdowns, accepted study plans, adaptation history, well-being records, and preferences.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="w-full text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{exportSuccess ? "Export Downloaded!" : "Export Backup (.json)"}</span>
            </Button>
            <span className="block text-[10px] text-[var(--color-text-muted)] mt-1.5 text-center">
              Unencrypted local JSON format
            </span>
          </div>
        </div>

        {/* 2. Import */}
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-[var(--color-text)]">
              <Upload className="h-4 w-4 text-blue-600" />
              <span>Restore from Backup</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Restore previously exported Acadesk JSON data. Validates schema, timestamps, and relationships before safely updating your state.
            </p>
          </div>

          <div className="pt-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
              aria-label="Select Acadesk JSON backup file to import"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-xs gap-1.5 border-blue-200 text-blue-800 hover:bg-blue-50"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Select Backup File...</span>
            </Button>
            <span className="block text-[10px] text-[var(--color-text-muted)] mt-1.5 text-center">
              Strictly validated before applying
            </span>
          </div>
        </div>

        {/* 3. Clear Data */}
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] border border-rose-200 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
              <Trash2 className="h-4 w-4 text-rose-600" />
              <span>Clear Local Data</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Permanently clears tasks, study plans, well-being records, and preferences stored in this browser. We advise exporting a backup first.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              className="w-full text-xs gap-1.5 text-rose-700 hover:text-rose-800 hover:bg-rose-50 border-rose-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Local Data</span>
            </Button>
            <span className="block text-[10px] text-[var(--color-text-muted)] mt-1.5 text-center">
              Irreversible local browser action
            </span>
          </div>
        </div>
      </div>

      {/* ── Import Confirmation Modal ── */}
      {showImportConfirm && importValidation?.payload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-confirm-title"
        >
          <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-700 pb-2 border-b border-[var(--color-border)]">
              <Upload className="h-5 w-5" />
              <h4 id="import-confirm-title" className="text-base font-bold text-[var(--color-text)]">
                Restore Acadesk Workspace Backup?
              </h4>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              This action will replace your active browser data with the contents of the validated backup file:
            </p>

            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Exported Date:</span>
                <span className="font-bold text-[var(--color-text)]">
                  {importValidation.payload.exportedAt.slice(0, 10)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Academic Tasks:</span>
                <span className="font-bold text-[var(--color-text)]">
                  {importValidation.summary?.taskCount} tasks
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Subtask Breakdowns:</span>
                <span className="font-bold text-[var(--color-text)]">
                  {importValidation.summary?.breakdownCount} breakdowns
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Accepted Study Plan:</span>
                <span className="font-bold text-[var(--color-text)]">
                  {importValidation.summary?.hasAcceptedPlan ? "Yes" : "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Well-being Check-ins:</span>
                <span className="font-bold text-[var(--color-text)]">
                  {importValidation.summary?.wellbeingCount} check-ins
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowImportConfirm(false);
                  setImportValidation(null);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmImport}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Confirm & Restore</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Clear All Confirmation Modal ── */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-all-title"
        >
          <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-rose-300 shadow-[var(--shadow-lg)] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600 pb-2 border-b border-[var(--color-border)]">
              <AlertTriangle className="h-5 w-5" />
              <h4 id="clear-all-title" className="text-base font-bold text-rose-950">
                Erase All Local Acadesk Data?
              </h4>
            </div>

            <p className="text-xs text-[var(--color-text)] leading-relaxed">
              This will permanently delete all local tasks, breakdowns, study plans, calendar records, well-being check-ins, and preferences from this browser profile.
            </p>

            <div className="p-3 rounded-[var(--radius-md)] bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed">
              <strong>Recommendation:</strong> If you have active coursework or study schedules you wish to preserve, click Cancel and export a JSON backup file first.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmClear}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Yes, Permanently Clear All</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
