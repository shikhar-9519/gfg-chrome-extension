declare module 'process/browser';
declare module 'stream-browserify';
declare module 'crypto-browserify';
declare module 'stream-http';
declare module 'https-browserify';
declare module 'os-browserify/browser';
declare module 'browserify-zlib';

interface Chrome {
  tabs: {
    query: (queryInfo: {
      active: boolean;
      currentWindow: boolean;
    }) => Promise<Array<{
      url: string;
      id: number;
      title?: string;
    }>>;
  };
  runtime: {
    sendMessage: (message: any) => void;
    onMessage: {
      addListener: (callback: (message: any) => void) => void;
    };
  };
}

declare global {
  interface Window {
    chrome: Chrome;
  }
  var chrome: Chrome;
  var process: any;
  var Buffer: any;
}

export {};