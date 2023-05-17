import { useEffect, useState } from "react";

function getCookie(key: string) {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(key + '='));
  const value = cookie ? cookie.split('=')[1] : undefined;

  return value;
}

const setCookie = (name: string, value: string) => {
  document.cookie = name + "=" + value + "; path=/";
}

function useCookie(key: string, initialValue: () => string) {
  const [value, setValue] = useState(() => {
    const cookieValue = getCookie(key);
    if (cookieValue !== undefined) {
      return cookieValue;
    }
    return initialValue();
  });

  useEffect(() => {
    setCookie(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export function useBlitzId(defaultBlitzId?: string) {
  const [cookie] = useCookie('blitz_uid', () => self.crypto.randomUUID());

  return defaultBlitzId ?? cookie;
}