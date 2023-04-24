import { useCookies } from "react-cookie";
import splitbee from "@splitbee/web";

function ensureBlitzId(blitzId?: string) {
  if (blitzId) return blitzId;

  return self.crypto.randomUUID();
}

export function useBlitzId() {
  const [cookies, setCookie] = useCookies(['blitz_uid']);
  const blitzId = ensureBlitzId(cookies.blitz_uid);

  setCookie('blitz_uid', blitzId, { path: '/' });
  splitbee.user.set({ blitzId: blitzId });

  return blitzId;
}