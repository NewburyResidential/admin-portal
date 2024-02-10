'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { uploadS3Utility } from 'src/utils/services/aws/uploadS3Utility';

export default function UploadInput() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const splitPdfAndUpload = async (originalPdf) => {
    const pdfDoc = await PDFDocument.load(originalPdf);
    const numberOfPages = pdfDoc.getPageCount();

    for (let startPage = 0; startPage < numberOfPages; startPage += 2) {
      const endPage = Math.min(startPage + 2, numberOfPages);
      const newPdfDoc = await PDFDocument.create();

      const pages = await newPdfDoc.copyPages(
        pdfDoc,
        Array.from({ length: endPage - startPage }, (_, i) => i + startPage)
      );
      pages.forEach((page) => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob);

      const response = await uploadS3Utility(formData);
      if (!response) {
        alert('Failed to upload a file chunk.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const success = await splitPdfAndUpload(e.target.result);
      if (success) {
        setFile(null);
        alert('All files uploaded successfully!');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="application/pdf" />
        <button type="submit">Upload to S3</button>
      </form>
    </div>
  );
}
