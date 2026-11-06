'use client';
import { useEffect, useState } from 'react';
import { getCount } from '@/lib/telegraph';

export const Rhythms = ({ n }: { n: number }) => <>{n} {n === 1 ? 'rhythm has' : 'rhythms have'} crossed the cloud</>;

/** Live rhythm count from GET /drum; renders nothing until (and unless) the API answers. */
export default function LiveCounter() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    getCount().then((c) => { if (live) setN(c); });
    return () => { live = false; };
  }, []);
  return n === null ? null : <span className="text-signal"><Rhythms n={n} /></span>;
}
