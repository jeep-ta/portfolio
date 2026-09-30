import { useState } from 'react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { 
  Send, 
  Mail, 
  Copy, 
  Check, 
  Terminal, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../common/BrandIcons';
import { soundFx } from '../../utils/audio';

export const ContactApp: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form state
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSent, setIsSent] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundFx.playSuccess();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;

    soundFx.playClick();
    setIsSubmitting(true);
    setTerminalLogs(['[INIT] Executing contact.sh payload...']);

    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, '[DNS] Resolving mail.jeptha.dev... OK']);
    }, 400);

    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, '[TLS] Establishing 256-bit encrypted handshake...']);
    }, 800);

    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, '[ENCRYPT] Securing message contents...']);
    }, 1200);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[SUCCESS] Message routed to ${PERSONAL_INFO.email}!`,
        '[EXIT] Code 0 - Transmission Complete.',
      ]);
      setIsSubmitting(false);
      setIsSent(true);
      soundFx.playSuccess();
    }, 1800);
  };

  const contacts = [
    {
      key: 'email',
      label: 'Primary Email',
      value: PERSONAL_INFO.email,
      icon: <Mail className="w-4 h-4 text-emerald-400" />,
      href: `mailto:${PERSONAL_INFO.email}`,
    },
    {
      key: 'github',
      label: 'GitHub',
      value: 'github.com/jeptha',
      rawUrl: PERSONAL_INFO.github,
      icon: <GithubIcon className="w-4 h-4 text-sky-400" />,
      href: PERSONAL_INFO.github,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/jeptha',
      rawUrl: PERSONAL_INFO.linkedin,
      icon: <LinkedinIcon className="w-4 h-4 text-blue-400" />,
      href: PERSONAL_INFO.linkedin,
    },
    {
      key: 'twitter',
      label: 'X / Twitter',
      value: '@jepthadev',
      rawUrl: PERSONAL_INFO.twitter,
      icon: <TwitterIcon className="w-4 h-4 text-cyan-400" />,
      href: PERSONAL_INFO.twitter,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0b0e14] text-gray-200 select-text font-mono text-xs">
      {/* Executable Header Bar */}
      <div className="p-3 bg-[#121824] border-b border-white/10 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white text-xs">Contact.sh</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            chmod +x executable
          </span>
        </div>
        <div className="text-[10px] text-gray-500">PID: 4182</div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-5 space-y-5">
        {/* Profile Identity Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="relative shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-[var(--accent)]/50 bg-black/60 shadow-md">
              <img
                src={PERSONAL_INFO.avatar}
                alt={PERSONAL_INFO.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0e14]" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wide">{PERSONAL_INFO.name}</div>
            <div className="text-gray-400 text-xs font-mono">{PERSONAL_INFO.role}</div>
            <div className="text-cyan-400/90 text-[11px] font-mono">{PERSONAL_INFO.degree}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{PERSONAL_INFO.status}</div>
          </div>
        </div>

        {/* Quick Social & Direct Copy Channels */}
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2 font-semibold">
            Direct Channels & Social Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {contacts.map((c) => (
              <div
                key={c.key}
                className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-2.5 truncate mr-2">
                  <div className="p-1.5 rounded-md bg-white/5">{c.icon}</div>
                  <div className="truncate">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{c.label}</div>
                    <div className="text-white font-medium truncate">{c.value}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(c.rawUrl || c.value, c.key)}
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-90"
                    title={`Copy ${c.label}`}
                  >
                    {copiedKey === c.key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* External Link */}
                  {c.href && (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      title="Open link"
                      onClick={() => soundFx.playClick()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Dispatch Form */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/10">
          <div className="flex items-center justify-between mb-3 select-none">
            <h3 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Interactive Message Dispatcher</span>
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">TLS Encrypted</span>
          </div>

          {isSent ? (
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <p className="text-emerald-300 font-bold text-sm">Transmission Acknowledged!</p>
              <p className="text-gray-400 text-xs">
                Thanks for reaching out! I typically respond within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSent(false);
                  setTerminalLogs([]);
                  setSenderName('');
                  setSenderEmail('');
                  setMessage('');
                }}
                className="mt-3 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white"
              >
                Send Another Packet
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Grace Hopper"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">YOUR EMAIL</label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="grace@hopper.org"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">PAYLOAD / MESSAGE</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey Jeptha, let's talk about our high-throughput distributed systems project..."
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] font-mono text-xs resize-none"
                />
              </div>

              {/* Execution Console Feedback */}
              {terminalLogs.length > 0 && (
                <div className="p-2.5 rounded-lg bg-black/80 border border-white/10 font-mono text-[11px] space-y-1 text-emerald-400">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 select-none shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting Payload...' : 'Execute ./send_message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-1 bg-[#121824] border-t border-white/10 text-[10px] text-gray-500 flex items-center justify-between select-none">
        <span>STATUS: SOCKET_READY</span>
        <span>PORT: 587 (SMTPS)</span>
      </div>
    </div>
  );
};
