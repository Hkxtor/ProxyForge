import yaml from 'js-yaml';
import type { Proxy } from './model/proxy';

export interface ConfigOptions {
    template?: string; // Content of the template
    clashType?: 'clash' | 'meta';
}

const DEFAULT_CLASH_TEMPLATE = `
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: :9090
proxies: []
proxy-groups:
  - name: "Select"
    type: select
    proxies:
      - "Auto"
      - "Fallback"
  - name: "Auto"
    type: url-test
    url: "http://www.gstatic.com/generate_204"
    interval: 300
    proxies: []
  - name: "Fallback"
    type: fallback
    url: "http://www.gstatic.com/generate_204"
    interval: 300
    proxies: []
rules:
  - GEOIP,CN,DIRECT
  - MATCH,Select
`;

export const generateConfig = (proxies: Proxy[], options: ConfigOptions = {}): string => {
    try {
        const templateContent = options.template || DEFAULT_CLASH_TEMPLATE;
        const config = yaml.load(templateContent) as any;

        // Populate proxies
        config.proxies = proxies.map(p => ({
            ...p,
            // Ensure no undefined values are present that might break something? 
            // yaml.dump usually handles optional fields well.
        }));

        const proxyNames = proxies.map(p => p.name);

        // Simple strategy: Add all nodes to all groups (except specific ones maybe?) for now
        // A more advanced implementation would respect the <all>, <hk> tags.

        if (config['proxy-groups']) {
            config['proxy-groups'].forEach((group: any) => {
                if (!group.proxies) group.proxies = [];

                // If the group has NO proxies defined, or we want to inject into specific groups
                // For this simple version, let's append ALL proxies to Select, Auto, and Fallback
                if (['Select', 'Auto', 'Fallback'].includes(group.name)) {
                    group.proxies = [...group.proxies, ...proxyNames];
                }
            });
        }

        return yaml.dump(config, { noRefs: true, lineWidth: -1 });

    } catch (e) {
        console.error("Config generation failed", e);
        return "# Config generation failed \n" + e;
    }
}
