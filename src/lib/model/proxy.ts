export interface BaseProxy {
  name: string;
  type: string;
}

export interface Shadowsocks extends BaseProxy {
  type: 'ss';
  server: string;
  port: number;
  cipher: string;
  password: string;
  plugin?: string;
  'plugin-opts'?: Record<string, any>;
  udp?: boolean;
}

export interface ShadowsocksR extends BaseProxy {
  type: 'ssr';
  server: string;
  port: number;
  cipher: string;
  password: string;
  obfs: string;
  protocol: string;
  'obfs-param'?: string;
  'protocol-param'?: string;
  udp?: boolean;
}

export interface Vmess extends BaseProxy {
  type: 'vmess';
  server: string;
  port: number;
  uuid: string;
  alterId: number;
  cipher: string;
  tls?: boolean;
  servername?: string;
  network?: string;
  'ws-opts'?: {
    path?: string;
    headers?: Record<string, string>;
  };
  udp?: boolean;
}

export interface Vless extends BaseProxy {
  type: 'vless';
  server: string;
  port: number;
  uuid: string;
  flow?: string;
  tls?: boolean;
  servername?: string;
  network?: string;
  'ws-opts'?: {
    path?: string;
    headers?: Record<string, string>;
  };
  'reality-opts'?: {
    'public-key': string;
    'short-id'?: string;
  };
  'client-fingerprint'?: string;
  udp?: boolean;
}

export interface Trojan extends BaseProxy {
  type: 'trojan';
  server: string;
  port: number;
  password: string;
  sni?: string;
  alpn?: string[];
  'skip-cert-verify'?: boolean;
  udp?: boolean;
  network?: string;
  'ws-opts'?: {
    path?: string;
    headers?: Record<string, string>;
  };
}

export interface Hysteria2 extends BaseProxy {
  type: 'hysteria2';
  server: string;
  port: number;
  password: string;
  sni?: string;
  'skip-cert-verify'?: boolean;
  obfs?: string;
  'obfs-password'?: string;
}

export type Proxy = Shadowsocks | ShadowsocksR | Vmess | Vless | Trojan | Hysteria2;
