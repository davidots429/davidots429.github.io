import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function PdfViewer({ pdfUrl, fileName }) {
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.print();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full">
      {/* 컨트롤 버튼 */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {/* 뒤로 가기 */}
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          뒤로 가기
        </button>

        {/* 저장하기 */}
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          저장하기
        </button>

        {/* 프린트하기 */}
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          프린트하기
        </button>
      </div>

      {/* PDF 뷰어 */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full h-[600px] md:h-[700px] lg:h-[800px]"
          title="PDF Viewer"
        />
      </div>

      {/* 다운로드 링크 */}
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          PDF가 제대로 표시되지 않으신가요?
        </p>
        <a
          href={pdfUrl}
          download={fileName}
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          여기를 클릭하여 다운로드하세요
        </a>
      </div>
    </div>
  );
}
