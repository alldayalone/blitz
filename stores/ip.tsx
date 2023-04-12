import { createContext, useContext, useEffect, useState } from "react";

const ipContext = createContext<string>('');

export const useIp = () => {
  return useContext(ipContext);
}

export const IpProvider = ({ children }: { children: React.ReactNode }) => {
  const [ip, setIp] = useState<string>('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((json) => setIp(json.ip));
  }, []);

  return (
    <ipContext.Provider value={ip}>
      {children}
    </ipContext.Provider>
  );
}
