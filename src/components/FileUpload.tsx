import { useState } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onDataUploaded: () => void;
  onFilesSelected: (excelFile?: File, resumeFiles?: File[]) => void;
  isProcessing: boolean;
  error?: string | null;
}

export const FileUpload = ({
  onDataUploaded,
  onFilesSelected,
  isProcessing,
  error,
}: FileUploadProps) => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExcelFile(file);
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setResumeFiles((prev) => [...prev, ...files]);
  };

  const handleProcess = async () => {
    if (!excelFile && resumeFiles.length === 0) return;

    onFilesSelected(
      excelFile || undefined,
      resumeFiles.length > 0 ? resumeFiles : undefined
    );
    onDataUploaded();
  };

  const removeResumeFile = (index: number) => {
    setResumeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Excel Upload */}
        <Card className="p-6 border-2 border-[#2a2b3d] bg-[#23243a] shadow-lg">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Candidate Data
              </h3>
              <p className="text-sm text-gray-300">
                Upload Excel or CSV file with applicant information
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button
                  variant="outline"
                  className="w-full bg-[#181926] border-[#2a2b3d] text-white hover:bg-blue-900/30"
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2 text-blue-400" />
                    Choose Excel/CSV File
                  </span>
                </Button>
              </label>
              {excelFile && (
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>{excelFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
        {/* Resume Upload */}
        <Card className="p-6 border-2 border-[#2a2b3d] bg-[#23243a] shadow-lg">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Resume Files</h3>
              <p className="text-sm text-gray-300">
                Upload PDF/DOCX resume files
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                multiple
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button
                  variant="outline"
                  className="w-full bg-[#181926] border-[#2a2b3d] text-white hover:bg-blue-900/30"
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2 text-blue-400" />
                    Choose Resume Files
                  </span>
                </Button>
              </label>
              {resumeFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>{resumeFiles.length} files selected</span>
                  </div>
                  <div className="max-h-20 overflow-y-auto space-y-1">
                    {resumeFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs bg-[#181926] px-2 py-1 rounded text-white"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={() => removeResumeFile(index)}
                          className="text-red-400 hover:text-red-600 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {/* Error Message */}
      {error && (
        <Card className="p-4 border-red-700 bg-red-900/30">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Processing Error</span>
          </div>
          <p className="mt-1 text-sm text-red-300">{error}</p>
        </Card>
      )}
      {/* Process Button */}
      {(excelFile || resumeFiles.length > 0) && (
        <div className="flex justify-center">
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg border-0"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Files...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Process & Analyze Data
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
