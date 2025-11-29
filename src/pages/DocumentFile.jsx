import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PdfViewer from "../components/PdfViewer";

export default function DocumentFile() {
  const { file } = useParams();
  const [fileMap, setFileMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileList = async () => {
      try {
        const response = await fetch('/files/filelist.json');
        if (!response.ok) throw new Error('파일 목록을 불러올 수 없습니다.');
        
        const data = await response.json();
        
        setFileMap(data);
        setError(null);
      } catch (err) {
        setError('파일 목록을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileList();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 파일이 filelist.json에 등록되어 있는지 확인
  const filePath = fileMap[file];
  const isValidFile = filePath !== undefined;

  if (!isValidFile) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-red-600 dark:text-red-400">
            파일을 찾을 수 없습니다: {file}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            🔍 파일 이름:
          </p>
          <ul className="text-gray-600 dark:text-gray-400 mt-2">
            {Object.keys(fileMap).map((key) => (
              <li key={key}>/document/{key}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const pdfFileName = filePath.split('/').pop();

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {pdfFileName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            문서를 확인하세요.
          </p>
        </header>

        <PdfViewer 
          pdfUrl={`/files/${filePath}.pdf`} 
          fileName={`${pdfFileName}.pdf`} 
        />
      </div>
    </div>
  );
}


