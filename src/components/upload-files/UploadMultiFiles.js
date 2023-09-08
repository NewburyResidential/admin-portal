'use client';

import { useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from 'src/hooks/use-boolean';

// components
import { Upload } from 'src/components/upload-files';

// ----------------------------------------------------------------------

export default function UploadMultiFiles({ onUpload, accept}) {
  const preview = useBoolean();
  const [files, setFiles] = useState([]);
  const [duplicateFiles, setDuplicateFiles] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const duplicates = [];
      const uniqueAcceptedFiles = acceptedFiles.filter((newFile) => {
        const isDuplicate = files.some((files) => files.name === newFile.name);
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
    [files]
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
    <>
      <Card>
        <CardHeader
          title="Upload Utility Bills"
          action={
            <FormControlLabel
              control={<Switch checked={preview.value} onClick={preview.onToggle} />}
              label="Expand Files"
            />
          }
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
    </>
  );
}
