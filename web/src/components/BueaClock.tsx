'use client';
import { useEffect, useState } from 'react';

const fmt = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Douala', hour: '2-digit', minute: '2-digit' }).format(new Date());

// Live local time in Buea; static fallback is rendered at build time and without JS.
export default function BueaClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time ? `${time} WAT` : 'WAT, UTC+1'}</span>;
}
