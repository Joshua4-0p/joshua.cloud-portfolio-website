'use client';
import { useEffect } from 'react';
import 'lenis/dist/lenis.css';
import { initMotion } from '@/lib/motion';

export default function MotionInit() {
  useEffect(() => initMotion(), []);
  return null;
}
