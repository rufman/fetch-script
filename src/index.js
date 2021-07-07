import { head, headCors } from './injectors';

const networkError = 'Network response was not ok.';

function contentLoadedEvent() {
  const DOMContentLoadedEvent = document.createEvent('Event');
  DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
  document.dispatchEvent(DOMContentLoadedEvent);
}
/**
 * Fetch Script module.
 */
function fetchInject(scripts, promise) {
  if (!scripts) {
    return Promise.reject(
      new ReferenceError(
        "Failed to execute 'fetchInject': 1 argument required but only 0 present.",
      ),
    );
  }
  if (scripts && !Array.isArray(scripts)) {
    return Promise.reject(
      new TypeError("Failed to execute 'fetchInject': argument 1 must be of type 'Array'."),
    );
  }
  if (promise && promise.constructor !== Promise) {
    return Promise.reject(
      new TypeError("Failed to execute 'fetchInject': argument 2 must be of type 'Promise'."),
    );
  }

  const resources = [];
  const deferreds = promise ? [].concat(promise) : [];
  const thenables = [];

  scripts.forEach((input) => {
    let nonce;
    let options;
    let url = input;
    if (typeof input === 'object') {
      ({ nonce, options, url } = input);
    }
    if (options && options.mode === 'no-cors' && options.method === 'GET') {
      // can not use fetch, inject the script into the head
      deferreds.push(
        new Promise((resolve, reject) => {
          headCors(
            window,
            document,
            'script',
            url,
            () => {
              contentLoadedEvent();
              resolve();
            },
            () => {
              reject(new Error(networkError));
            },
            null,
            null,
            nonce,
          );
        }),
      );
    } else {
      deferreds.push(
        window
          .fetch(url, options)
          .then((res) => {
            if (!res.ok) {
              throw Error(networkError);
            }
            return [res.clone().text(), res.blob()];
          })
          .then((promises) =>
            Promise.all(promises).then((resolved) =>
              resources.push({ text: resolved[0], blob: resolved[1], nonce }),
            ),
          ),
      );
    }
  });

  return Promise.all(deferreds).then(() => {
    resources.forEach((resource) => {
      thenables.push({
        then: (resolve) => {
          if (resource.blob.type.includes('text/css')) {
            head(window, document, 'style', resource, resolve);
          } else {
            head(window, document, 'script', resource, resolve);
          }
        },
      });
    });
    return Promise.all(thenables);
  });
}

export default fetchInject;
