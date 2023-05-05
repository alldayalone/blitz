function getCookie(key: string) {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(key + '='));
  const value = cookie ? cookie.split('=')[1] : null;

  return value
}

const setCookie = (name: string, value: string) => {
  const cookie = name + "=" + value + ";path=/";

  document.cookie = document.cookie ? document.cookie + ";" + cookie : cookie;
}

export function useBlitzId(defaultBlitzId?: string) {
  if (defaultBlitzId) return defaultBlitzId;

  const blitzId = getCookie('blitz_uid')

  if (blitzId) return blitzId;
  
  const generatedBlitzId = self.crypto.randomUUID();

  setCookie('blitz_uid', generatedBlitzId);

  return generatedBlitzId;
}