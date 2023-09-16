import { environment } from '../../environments/environment';

export function buildUrl(template: string, params?: { [K: string]: any }) {
    let url = environment.server + template;

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            url = url.replace(':' + key, value);
        }
    }

    return url;
}
