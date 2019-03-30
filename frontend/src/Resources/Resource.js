/* eslint-disable no-console  */
export class Resource {
  static config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    base: ''
  };

  static GET = 'get';
  static POST = 'post';
  static PUT = 'put';
  static DELETE = 'delete';

  static init(base) {
    Resource.config.base = base;
  }

  static setSession(session) {
    Resource.config.headers.Authorization = session.sessionStr;
  }

  static clearSession() {
    delete Resource.config.headers.Authorization;
  }

  constructor(specs, options) {
    Object.keys(specs).forEach((key) => {
      const {method, url} = specs[key];
      this[method.toLocaleLowerCase()](key, url);
    });
    this.options = options || {};
  }

  get(name, url) {
    this[name] = this.actionBuilderNoBody(url, Resource.GET);
  }

  post(name, url) {
    this[name] = this.actionBuilder(url, Resource.POST);
  }

  put(name, url) {
    this[name] = this.actionBuilder(url, Resource.PUT);
  }

  delete(name, url) {
    this[name] = this.actionBuilderNoBody(url, Resource.DELETE);
  }

  base() {
    return Resource.config.base + (this.options.base || '');
  }

  static headers() {
    return Resource.config.headers;
  }

  async fetch(url, options) {
    const timeoutId = setTimeout(() => {
      throw new Error(`Fetch timeout:${url}${JSON.stringify(options)}`);
    }, 30000);
    try {
      const res = await fetch(url, options);
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  static async handleResult(res) {
    const json = await Resource.parseBody(res);
    if (res.ok) return json;
    const error = new Error(json.message);
    error.httpStatusCode = res.status;
    throw error;
  }

  static async parseBody(res) {
    const text = (res.text && await res.text()) || null;
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(text);
    }
  }

  actionBuilderNoBody(template, method) {
    const buildUrl = this.getUrlBuilder(template);
    return async (params) => {
      const url = buildUrl(params);
      const res = await this.fetch(url, {
        method, headers: Resource.headers()
      });
      return Resource.handleResult(res);
    };
  }

  actionBuilder(template, method) {
    const buildUrl = this.getUrlBuilder(template);
    return async (params, body) => {
      let paramsToBuild = params;
      let payloadBody = body;
      if (!body) {
        payloadBody = params;
        paramsToBuild = {};
      }
      const url = buildUrl(paramsToBuild);
      const res = await this.fetch(url, {
        method, headers: Resource.headers(), body: JSON.stringify(payloadBody)
      });
      return Resource.handleResult(res);
    };
  }

  getUrlBuilder(template) {
    return (params) => {
      let res = template;
      const query = [];
      Object.entries(params || {}).forEach(([key, param]) => {
        if (res.indexOf(`:${key}`) !== -1) {
          res = res.replace(`:${key}`, param);
        } else {
          let queryStr = `${key}=`;
          if (param !== null && param !== undefined) {
            queryStr += param;
          }
          query.push(queryStr);
        }
      });
      if (query.length) {
        res += `?${query.join('&')}`;
      }
      return this.base() + res;
    };
  }
}
