import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import { useState } from 'react';

export default function UploadUtilityBills() {

    const acceptedFiles = ({ 
        'image/png': ['.png'],
        'image/png': ['.jpg','.jpeg'], 
        'application/pdf': ['.pdf'], 
        })

  const onUpload = async (files) => {
    console.log(files);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/documentAI', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse response body as JSON
        console.log('Response data:', responseData);
      } else {
        console.error('File upload failed.');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
    }
  };

  return (
    <>
      <UploadMultiFiles onUpload={onUpload} accept={acceptedFiles}/>
    </>
  );
}
