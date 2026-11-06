import { DRUM_MESSAGES } from '@/content/site';

/** Screen-reader / text alternative: the decoded messages (all 8 in Stage Mode). */
export default function MessageList({ indices, id }: { indices: number[]; id: string }) {
  const sorted = [...indices].sort((a, b) => a - b);
  return (
    <div id={id} data-testid="message-list" className="mx-auto mt-6 max-w-2xl text-left">
      {sorted.length === 0 ? (
        <p className="text-sm text-ash">No messages decoded yet — play four beats.</p>
      ) : (
        <ol className="space-y-3 border-t border-bone/10 pt-4">
          {sorted.map((i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 text-[15px] leading-relaxed">
              <span className="font-mono text-xs text-copper-hi">{String(i + 1).padStart(2, '0')}</span>
              <span>{DRUM_MESSAGES[i]}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
