import React from 'react';
import Upload from './Uploa';

const UploadSingleFile = ({ accept, file, onFileChange }) => {
  const handleDrop = (acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      const fileWithPreview = Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      });
      onFileChange(fileWithPreview);
    }
  };

  const handleDelete = () => {
    onFileChange(null);
  };

  return <Upload accept={accept} file={file} onDelete={handleDelete} onDrop={handleDrop} multiple={false} />;
};

export default UploadSingleFile;
