export const safeBase64Decode = (str: string): string => {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            // Illegal base64 string
            return str;
    }
    try {
        return decodeURIComponent(escape(atob(output)));
    } catch (e) {
        try {
            return atob(output)
        } catch (e2) {
            return str;
        }
    }
};

export const parseQueryParams = (url: string): Record<string, string> => {
    const query = url.split('?')[1];
    if (!query) return {};
    return query.split('&').reduce((acc, current) => {
        const [key, value] = current.split('=');
        if (key && value) {
            acc[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        return acc;
    }, {} as Record<string, string>);
};
