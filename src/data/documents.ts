export type DocumentStatus = 'draft' | 'in_review' | 'signed';

export interface DocumentFile {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedByName: string;
  status: DocumentStatus;
  uploadedAt: string;
  fileUrl: string;      // preview ke liye (blob URL banega upload ke waqt)
  fileType: string;      // "application/pdf" ya "image/png" waghera
  signatureDataUrl?: string;   // signature save hone ke baad yahan aayegi
}

// Dummy documents (demo ke liye)
export const initialDocuments: DocumentFile[] = [
  {
    id: 'doc-1',
    name: 'Investment_Agreement_TechWave.pdf',
    uploadedBy: 'e1',
    uploadedByName: 'Sarah Johnson',
    status: 'in_review',
    uploadedAt: '2026-07-08',
    fileUrl: '',
    fileType: 'application/pdf',
  },
  {
    id: 'doc-2',
    name: 'NDA_Jennifer_Lee.pdf',
    uploadedBy: 'i2',
    uploadedByName: 'Jennifer Lee',
    status: 'signed',
    uploadedAt: '2026-07-05',
    fileUrl: '',
    fileType: 'application/pdf',
  },
];