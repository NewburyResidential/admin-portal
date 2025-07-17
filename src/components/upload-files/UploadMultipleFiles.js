'use client';

import PropTypes from 'prop-types';

import { useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from 'src/hooks/use-boolean';

// components
import { Upload } from 'src/components/upload-files';

// ----------------------------------------------------------------------

export default function UploadMultipleFiles({ files, setFiles, onUpload, accept }) {
  const preview = useBoolean();
  const [duplicateFiles, setDuplicateFiles] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const duplicates = [];
      const uniqueAcceptedFiles = acceptedFiles.filter((newFile) => {
        const isDuplicate = files.some((file) => file.name === newFile.name);
        if (isDuplicate) {
          duplicates.push({
            file: newFile,
            errors: [{ code: 'duplicate-file', message: 'File Can Not Be Duplicate' }],
          });
        }
        return !isDuplicate;
      });
      setDuplicateFiles(duplicates);

      setFiles([
        ...files,
        ...uniqueAcceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files, setFiles]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
    setDuplicateFiles([]);
  };

  const handleRemoveAllFiles = () => {
    setDuplicateFiles([]);
    setFiles([]);
  };

  return (
    <Card>
      <CardHeader
        title="Upload Utility Bills"
        action={<FormControlLabel control={<Switch checked={preview.value} onClick={preview.onToggle} />} label="Expand Files" />}
      />
      <CardContent>
        <Upload
          multiple
          accept={accept}
          thumbnail={!preview.value}
          files={files}
          onDrop={handleDropMultiFile}
          onRemove={handleRemoveFile}
          onRemoveAll={handleRemoveAllFiles}
          onUpload={() => {
            setDuplicateFiles([]);
            onUpload(files);
          }}
          duplicateFiles={duplicateFiles}
        />
      </CardContent>
    </Card>
  );
}

UploadMultipleFiles.propTypes = {
  onUpload: PropTypes.func,
  accept: PropTypes.object,
};
