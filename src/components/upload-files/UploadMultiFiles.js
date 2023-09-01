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

export default function UploadMultiFiles() {
  const preview = useBoolean();

  const [files, setFiles] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
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
  };

  const handleRemoveAllFiles = () => {
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
                accept={{'application/pdf': ['.pdf']}}
                thumbnail={!preview.value}
                files={files}
                onDrop={handleDropMultiFile}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}

              />
            </CardContent>
          </Card>
    </>
  );
}
