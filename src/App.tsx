import { useState } from 'react';
import { safeBase64Decode } from './lib/utils';
import { parseProtocol } from './lib/parser';
import { generateConfig } from './lib/generator';
import type { Proxy } from './lib/model/proxy';
import { Download, Copy, RefreshCw, Command, CheckCircle, AlertCircle, List, Github } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  const handleConvert = () => {
    setError(null);
    setOutput('');
    try {
      let content = input.trim();

      if (!content) {
        setError("Please enter some content to convert.");
        return;
      }

      // Try base64 decode if it looks like a subscription response
      if (!content.startsWith('ss://') && !content.startsWith('vmess://') && !content.startsWith('trojan://')) {
        try {
          content = safeBase64Decode(content);
        } catch (e) {
          // ignore
        }
      }

      const lines = content.split('\n');
      const proxies: Proxy[] = [];

      lines.forEach(line => {
        const p = parseProtocol(line);
        if (p) proxies.push(p);
      });

      if (proxies.length === 0) {
        setError("No valid proxies/nodes found in the input.");
        return;
      }

      const config = generateConfig(proxies);
      setOutput(config);
      setActiveTab('output');

    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadConfig = () => {
    const blob = new Blob([output], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sub2clash_config.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="relative text-center space-y-2 pt-8">
          <div className="absolute top-0 right-0 pt-4 pr-1">
            <a
              href="https://github.com/Hkxtor/ProxyForge"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 mb-4">
            <Command className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Proxy<span className="text-blue-600">Forge</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Transform your V2Ray/Shadowsocks subscriptions into Clash configurations instantly.
            <span className="hidden md:inline"> Client-side processing for maximum privacy.</span>
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 backdrop-blur-sm bg-opacity-90">
          {/* Tabs (Mobile only mainly, or structural) */}
          <div className="border-b border-gray-100 flex">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 py-4 text-center font-medium text-sm transition-colors relative ${activeTab === 'input' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <List className="w-4 h-4" />
                <span>Input Subscription</span>
              </div>
              {activeTab === 'input' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
            <button
              onClick={() => activeTab === 'output' && setActiveTab('output')}
              disabled={!output}
              className={`flex-1 py-4 text-center font-medium text-sm transition-colors relative ${activeTab === 'output' ? 'text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Generated Config</span>
              </div>
              {activeTab === 'output' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">

            {activeTab === 'input' ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subscription Content / Link List
                  </label>
                  <textarea
                    className="w-full h-64 p-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none font-mono text-sm leading-relaxed"
                    placeholder={`Paste content here...\n\nExample:\nvmess://...\nss://...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur">
                    {input.split('\n').filter(l => l.trim()).length} lines
                  </div>
                </div>

                {error && (
                  <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-shake">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleConvert}
                    disabled={!input.trim()}
                    className="group flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Convert to Clash
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-green-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Conversion Successful
                  </label>
                  <div className="flex space-x-3">
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                    >
                      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadConfig}
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download .yaml
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    readOnly
                    className="w-full h-96 p-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-mono text-xs md:text-sm leading-relaxed focus:ring-0 focus:outline-none scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
                    value={output}
                  />
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none rounded-t-xl" />
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => setActiveTab('input')}
                    className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-4"
                  >
                    ← Convert another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-sm text-gray-400 pb-8">
          <p>© {new Date().getFullYear()} ProxyForge. Open Source.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
