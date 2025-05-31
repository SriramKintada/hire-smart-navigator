
import { useState } from 'react';
import { Upload, FileText, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onDataUploaded: () => void;
  onFilesSelected: (excelFile?: File, resumeFiles?: File[]) => void;
  isProcessing: boolean;
  error?: string | null;
}

export const FileUpload = ({ onDataUploaded, onFilesSelected, isProcessing, error }: FileUploadProps) => {
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
    setResumeFiles(prev => [...prev, ...files]);
  };

  const handleProcess = async () => {
    if (!excelFile && resumeFiles.length === 0) return;
    
    onFilesSelected(excelFile || undefined, resumeFiles.length > 0 ? resumeFiles : undefined);
    onDataUploaded();
  };

  const removeResumeFile = (index: number) => {
    setResumeFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Excel Upload */}
        <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Candidate Data</h3>
              <p className="text-sm text-gray-600">Upload Excel file with applicant information</p>
            </div>

            <div className="space-y-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button variant="outline" className="w-full" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Excel File
                  </span>
                </Button>
              </label>
              
              {excelFile && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{excelFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Resume Upload */}
        <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resume Files</h3>
              <p className="text-sm text-gray-600">Upload PDF/DOCX resume files</p>
            </div>

            <div className="space-y-3">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                multiple
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" className="w-full" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Resume Files
                  </span>
                </Button>
              </label>
              
              {resumeFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{resumeFiles.length} files selected</span>
                  </div>
                  <div className="max-h-20 overflow-y-auto space-y-1">
                    {resumeFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded">
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={() => removeResumeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
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
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Processing Error</span>
          </div>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </Card>
      )}

      {/* Process Button */}
      {(excelFile || resumeFiles.length > 0) && (
        <div className="flex justify-center">
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-8 py-3 text-lg"
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
