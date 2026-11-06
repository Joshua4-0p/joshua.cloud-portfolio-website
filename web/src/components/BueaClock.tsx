'use client';
import { useSyncExternalStore } from 'react';

const fmt = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Douala', hour: '2-digit', minute: '2-digit' }).format(new Date());
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};

// Live local time in Buea; the static fallback is what the build (and no-JS visitors) get.
export default function BueaClock() {
  const time = useSyncExternalStore(subscribe, fmt, () => null);
  return <span>{time ? `${time} WAT` : 'WAT, UTC+1'}</span>;
}
