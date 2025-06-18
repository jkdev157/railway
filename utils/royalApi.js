import fetch from 'node-fetch';
import { ROYAL_API_KEY } from '../config.js';

// tag should be #ABC123
export async function fetchPlayer(tag) {
  const cleanTag = tag.replace('#', '').toUpperCase();
  const url = `https://cocproxy.royaleapi.dev/v1/players/%23${cleanTag}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${ROYAL_API_KEY}` }
  });
  if (!res.ok) return null;
  return res.json();
}