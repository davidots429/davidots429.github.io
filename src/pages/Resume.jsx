import PdfViewer from "../components/PdfViewer";

export default function Resume() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            이력서
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            저의 이력서입니다. 아래에서 확인하실 수 있습니다.
          </p>
        </header>

        <PdfViewer pdfUrl="/files/resume.pdf" fileName="resume.pdf" />
      </div>
    </div>
  );
}
