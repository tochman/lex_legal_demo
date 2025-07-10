export default function Header() {
  return (
    <header className="bg-slate-800 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">LexLegal Demo</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <span>Demo Guest</span>
          </div>
        </div>
      </div>
    </header>
  );
}
