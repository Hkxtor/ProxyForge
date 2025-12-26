import type { Proxy, Shadowsocks, Trojan, Vmess, Vless } from './model/proxy';
import { safeBase64Decode, parseQueryParams } from './utils';

export const parseVless = (url: string): Vless | null => {
    try {
        let link = url.replace('vless://', '');
        const fragmentIndex = link.lastIndexOf('#');
        let name = 'Vless';
        if (fragmentIndex !== -1) {
            name = decodeURIComponent(link.substring(fragmentIndex + 1));
            link = link.substring(0, fragmentIndex);
        }

        const [userInfo, serverInfo] = link.split('@');
        const uuid = userInfo;
        const [serverAddress, paramsStr] = serverInfo.split('?');
        const [server, portStr] = serverAddress.split(':');

        const params = paramsStr ? parseQueryParams('?' + paramsStr) : {};
        const port = parseInt(portStr);

        const vless: Vless = {
            type: 'vless',
            name,
            server,
            port,
            uuid,
            tls: params.security === 'tls' || params.security === 'reality',
            servername: params.sni,
            network: params.type,
            'client-fingerprint': params.fp,
            flow: params.flow,
        };

        if (params.security === 'reality') {
            vless['reality-opts'] = {
                'public-key': params.pbk,
                'short-id': params.sid
            };
        }

        if (params.type === 'ws') {
            vless['ws-opts'] = {
                path: params.path,
                headers: params.host ? { Host: params.host } : undefined
            };
        }

        if (params.type === 'grpc') {
            // TODO: Add grpc opts if needed, typically serviceName
        }

        return vless;

    } catch (e) {
        console.error("Error parsing Vless", e);
        return null;
    }
}

export const parseSS = (url: string): Shadowsocks | null => {
    try {
        let link = url.replace('ss://', '');
        const fragmentIndex = link.lastIndexOf('#');
        let name = 'Shadowsocks';
        if (fragmentIndex !== -1) {
            name = decodeURIComponent(link.substring(fragmentIndex + 1));
            link = link.substring(0, fragmentIndex);
        }

        if (link.includes('@')) {
            // New format
            const [userInfo, serverInfo] = link.split('@');
            const [method, password] = safeBase64Decode(userInfo).split(':');
            const [server, portStr] = serverInfo.split(':');
            return {
                type: 'ss',
                name,
                server,
                port: parseInt(portStr),
                cipher: method,
                password,
            };
        } else {
            // Old format
            const decoded = safeBase64Decode(link);
            const [userInfo, serverInfo] = decoded.split('@');
            const [method, password] = userInfo.split(':');
            const [server, portStr] = serverInfo.split(':');
            return {
                type: 'ss',
                name,
                server,
                port: parseInt(portStr),
                cipher: method,
                password,
            };
        }
    } catch (e) {
        console.error('Error parsing SS:', e);
        return null;
    }
};

export const parseVmess = (url: string): Vmess | null => {
    try {
        const link = url.replace('vmess://', '');
        const decoded = safeBase64Decode(link);
        const config = JSON.parse(decoded);

        return {
            type: 'vmess',
            name: config.ps || 'Vmess',
            server: config.add,
            port: parseInt(config.port),
            uuid: config.id,
            alterId: parseInt(config.aid) || 0,
            cipher: config.scy || 'auto',
            tls: config.tls === 'tls',
            servername: config.sni,
            network: config.net,
            'ws-opts': config.net === 'ws' ? {
                path: config.path,
                headers: { Host: config.host }
            } : undefined
        };

    } catch (e) {
        console.error('Error parsing Vmess:', e);
        return null;
    }
}

export const parseTrojan = (url: string): Trojan | null => {
    try {
        let link = url.replace('trojan://', '');
        const fragmentIndex = link.lastIndexOf('#');
        let name = 'Trojan';
        if (fragmentIndex !== -1) {
            name = decodeURIComponent(link.substring(fragmentIndex + 1));
            link = link.substring(0, fragmentIndex);
        }

        const [userInfo, serverInfo] = link.split('@');
        const password = userInfo;
        const [serverAddress, paramsStr] = serverInfo.split('?');
        const [server, portStr] = serverAddress.split(':');

        const params = paramsStr ? parseQueryParams('?' + paramsStr) : {};

        return {
            type: 'trojan',
            name,
            server,
            port: parseInt(portStr),
            password,
            sni: params.sni || params.peer,
            'skip-cert-verify': params.allowInsecure === '1',
            network: params.type,
            'ws-opts': params.type === 'ws' ? {
                path: params.path,
                headers: params.host ? { Host: params.host } : undefined
            } : undefined
        }

    } catch (e) {
        console.error("Error parsing Trojan", e);
        return null;
    }
}

export const parseProtocol = (line: string): Proxy | null => {
    line = line.trim();
    if (line.startsWith('ss://')) return parseSS(line);
    if (line.startsWith('vmess://')) return parseVmess(line);
    if (line.startsWith('trojan://')) return parseTrojan(line);
    if (line.startsWith('vless://')) return parseVless(line);
    // TODO: Add other protocols
    return null;
}
