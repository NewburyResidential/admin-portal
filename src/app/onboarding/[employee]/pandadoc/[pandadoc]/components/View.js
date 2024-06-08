'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { updateSignedDocument } from 'src/utils/services/employees/updateSignedDocument';

export default function PandaDocView({ session, employee, sk }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const parts = employee.split('-');
  const pk = parts[1];

  useEffect(() => {
    const updateDocument = async () => {
      setLoading(true);
      await updateSignedDocument(pk, sk, '#PENDING');
      router.push(`/onboarding/${employee}`);
      setLoading(false);
    };

    const handleMessage = (event) => {
      const type = event.data && event.data.type;
      const payload = event.data && event.data.payload;

      switch (type) {
        case 'session_view.document.loaded':
          console.log('Session view is loaded');
          break;
        case 'session_view.document.completed':
          console.log('Document is completed');
          console.log(payload);
          updateDocument();

          break;
        case 'session_view.document.exception':
          console.log('Exception during document finalization');
          console.log(payload);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div style={{ width: '100vw', height: '98%', margin: 0, padding: 0 }}>
      <iframe
        src={`https://app.pandadoc.com/s/${session}`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      ></iframe>
    </div>
  );
}
