import React, { useState, useRef } from 'react';
import { Upload, FileText, Eye, PenLine, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SignaturePad } from '../../components/document-chamber/SignaturePad';
import { useAuth } from '../../context/AuthContext';
import { initialDocuments, DocumentFile, DocumentStatus } from '../../data/documents';

export const DocumentChamberPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocuments);
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);
  const [signingDoc, setSigningDoc] = useState<DocumentFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Naya document upload karna
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    const newDoc: DocumentFile = {
      id: `doc-${Date.now()}`,
      name: file.name,
      uploadedBy: user?.id || 'unknown',
      uploadedByName: user?.name || 'You',
      status: 'draft',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileUrl,
      fileType: file.type,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Status badge ka color
  const getStatusStyles = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'in_review':
        return 'bg-accent-100 text-accent-700';
      case 'signed':
        return 'bg-success-50 text-success-700';
    }
  };

  const getStatusLabel = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'in_review':
        return 'In Review';
      case 'signed':
        return 'Signed';
    }
  };

  // Manual status change (Draft -> In Review)
  const moveToReview = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'in_review' } : d))
    );
  };

  // Signature save hone ke baad
  const handleSignatureSave = (signatureDataUrl: string) => {
    if (!signingDoc) return;
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === signingDoc.id
          ? { ...d, status: 'signed', signatureDataUrl }
          : d
      )
    );
    setSigningDoc(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Chamber</h1>
          <p className="text-gray-600">Upload, review, and sign deal documents</p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="hidden"
            id="doc-upload"
          />
          <Button
            leftIcon={<Upload size={18} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Document
          </Button>
        </div>
      </div>

      <Card className="p-4">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between border border-gray-200 rounded-md p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-md">
                    <FileText size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded by {doc.uploadedByName} on {doc.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyles(doc.status)}`}>
                    {getStatusLabel(doc.status)}
                  </span>

                  {doc.fileUrl && (
                    <Button size="sm" variant="outline" leftIcon={<Eye size={16} />} onClick={() => setPreviewDoc(doc)}>
                      Preview
                    </Button>
                  )}

                  {doc.status === 'draft' && (
                    <Button size="sm" variant="outline" onClick={() => moveToReview(doc.id)}>
                      Send for Review
                    </Button>
                  )}

                  {doc.status === 'in_review' && (
                    <Button size="sm" leftIcon={<PenLine size={16} />} onClick={() => setSigningDoc(doc)}>
                      Sign
                    </Button>
                  )}

                  {doc.status === 'signed' && doc.signatureDataUrl && (
                    <img
                      src={doc.signatureDataUrl}
                      alt="Signature"
                      className="h-8 border border-gray-200 rounded bg-white"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Signature Modal */}
      {signingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sign: {signingDoc.name}</h3>
              <button onClick={() => setSigningDoc(null)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <SignaturePad
              onSave={handleSignatureSave}
              onCancel={() => setSigningDoc(null)}
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{previewDoc.name}</h3>
              <button onClick={() => setPreviewDoc(null)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {previewDoc.fileType.startsWith('image/') ? (
              <img src={previewDoc.fileUrl} alt={previewDoc.name} className="w-full rounded-md" />
            ) : previewDoc.fileType === 'application/pdf' ? (
              <iframe src={previewDoc.fileUrl} className="w-full h-[60vh] rounded-md border" title={previewDoc.name} />
            ) : (
              <p className="text-gray-500">Preview not available for this file type.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};