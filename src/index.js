import { head as injectHead } from './injectors';

/**
 * Fetch Script module.
 */
function fetchInject(scripts, promise) {
  if (!scripts) {
    return Promise.reject(new ReferenceError("Failed to execute 'fetchInject': 1 argument required but only 0 present."));
  }
  if (scripts && !Array.isArray(scripts)) {
    return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 1 must be of type 'Array'."));
  }
  if (promise && promise.constructor !== Promise) {
    return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 2 must be of type 'Promise'."));
  }

  const resources = [];
  const deferreds = promise ? [].concat(promise) : [];
  const thenables = [];

  scripts.forEach((input) => {
    let options;
    let url = input;
    if (typeof input === 'object') {
      ({ options, url } = input);
    }
    deferreds.push(
      window.fetch(url, options)
        .then((res) => [res.clone().text(), res.blob()])
        .then((promises) => Promise.all(promises)
          .then((resolved) => resources.push({ text: resolved[0], blob: resolved[1] }))),
    );
  });

  return Promise.all(deferreds).then(() => {
    resources.forEach((resource) => {
      thenables.push({
        then: (resolve) => {
          if (resource.blob.type.includes('text/css')) {
            injectHead(window, document, 'style', resource, resolve);
          } else {
            injectHead(window, document, 'script', resource, resolve);
          }
        },
      });
    });
    return Promise.all(thenables);
  });
}

export default fetchInject;
