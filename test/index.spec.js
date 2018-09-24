/* eslint-env jest */

import fetchInject from '../src';

describe('fetchInject', () => {
  const scriptName = 'test.script.js';
  const cssName = 'test.css';
  const scriptText = 'function theBestTeam() { console.log("Dodgers."); }';
  const cssText = '.baseball{ color: blue; }';
  const networkError = 'Network response was not ok.';

  beforeEach(() => {
    fetch.resetMocks();
  });

  test('should fetch a script in non cors mode', async (done) => {
    const DOMContentLoadedEvent = document.createEvent('Event');
    DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
    const loadEvent = document.createEvent('Event');
    loadEvent.initEvent('load', true, true);
    const contentloadedListener = jest.fn();
    document.addEventListener('DOMContentLoaded', contentloadedListener);

    setTimeout(() => {
      const injectedScriptElement = document.getElementsByTagName('script')[0];
      injectedScriptElement.dispatchEvent(loadEvent);
    }, 10);

    fetchInject([{
      url: `//${scriptName}`,
      options: { method: 'GET', mode: 'no-cors' },
    }]).then(() => {
      expect(document.getElementsByTagName('script')[0].src)
        .toEqual(`http://${scriptName}/`);
      expect(contentloadedListener).toHaveBeenCalledWith(DOMContentLoadedEvent);
      done();
    });
  });

  test('should reject the promise of a script fails to load in non cors mode', async (done) => {
    const loadErrorEvent = document.createEvent('Event');
    loadErrorEvent.initEvent('error', true, true);
    const contentloadedListener = jest.fn();
    document.addEventListener('DOMContentLoaded', contentloadedListener);

    setTimeout(() => {
      const injectedScriptElement = document.getElementsByTagName('script')[0];
      injectedScriptElement.dispatchEvent(loadErrorEvent);
    }, 10);

    fetchInject([{
      url: `//${scriptName}`,
      options: { method: 'GET', mode: 'no-cors' },
    }]).catch((err) => {
      expect(document.getElementsByTagName('script')[0].src)
        .toEqual(`http://${scriptName}/`);
      expect(contentloadedListener).not.toHaveBeenCalled();
      expect(err.message).toEqual(networkError);
      done();
    });
  });

  test('should fetch a script in cors mode', async (done) => {
    fetch.mockResponseOnce(scriptText);

    fetchInject([{
      url: `//${scriptName}`,
      options: { method: 'GET', mode: 'cors' },
    }]).then((res) => {
      expect(res[0].text).toEqual(scriptText);
      expect(fetch.mock.calls.length).toEqual(1);
      done();
    });
  });

  test('should fetch without any options', async (done) => {
    fetch.mockResponseOnce(scriptText);

    fetchInject([{
      url: `//${scriptName}`,
    }]).then((res) => {
      expect(res[0].text).toEqual(scriptText);
      expect(fetch.mock.calls.length).toEqual(1);
      done();
    });
  });

  test('should fetch when only given a url', async (done) => {
    fetch.mockResponseOnce(scriptText);

    fetchInject([`//${scriptName}`]).then((res) => {
      expect(res[0].text).toEqual(scriptText);
      expect(fetch.mock.calls.length).toEqual(1);
      done();
    });
  });

  test('should fetch after passed promise resolves', async (done) => {
    const timeBeforeResolve = Date.now();
    const timeoutTime = 500;
    fetch.mockResponseOnce(scriptText);
    const myPromise = new Promise((resolve) => {
      setTimeout(resolve, timeoutTime);
    });

    fetchInject([`//${scriptName}`], myPromise).then((res) => {
      const timeAfterResolve = Date.now();
      expect(timeAfterResolve - timeBeforeResolve).toBeGreaterThanOrEqual(timeoutTime);
      expect(res[0].text).toEqual(scriptText);
      expect(fetch.mock.calls.length).toEqual(1);
      done();
    });
  });

  test('should fetch css in cors mode', async (done) => {
    fetch.mockResponseOnce(new Blob([cssText], { type: 'text/css' }));

    fetchInject([{
      url: `//${cssName}`,
      options: { method: 'GET', mode: 'cors' },
    }]).then((res) => {
      expect(res[0].text).toEqual(cssText);
      expect(fetch.mock.calls.length).toEqual(1);
      done();
    });
  });

  test('should return an error for a failed fetch in cors mode', async (done) => {
    fetch.mockResponses([
      scriptText,
      { status: 500 },
    ]);

    fetchInject([{
      url: `//${scriptName}`,
      options: { method: 'GET', mode: 'cors' },
    }]).catch((err) => {
      expect(err.message).toEqual(networkError);
      done();
    });
  });

  test('should reject promise, if no scripts are defined', () => {
    expect(fetchInject()).rejects.toThrow("Failed to execute 'fetchInject': 1 argument required but only 0 present.");
  });

  test('should reject promise, if scripts is not an array', () => {
    const errorMessage = "Failed to execute 'fetchInject': argument 1 must be of type 'Array'.";

    expect(fetchInject({ an: 'object' })).rejects.toThrow(errorMessage);
    expect(fetchInject('string')).rejects.toThrow(errorMessage);
    expect(fetchInject(true)).rejects.toThrow(errorMessage);
    expect(fetchInject(42)).rejects.toThrow(errorMessage);
  });

  test('should reject promise, the second argument is not a Promise', () => {
    const errorMessage = "Failed to execute 'fetchInject': argument 2 must be of type 'Promise'.";

    expect(fetchInject([], { an: 'object' })).rejects.toThrow(errorMessage);
    expect(fetchInject([], 'string')).rejects.toThrow(errorMessage);
    expect(fetchInject([], true)).rejects.toThrow(errorMessage);
    expect(fetchInject([], 42)).rejects.toThrow(errorMessage);
    expect(fetchInject([], [])).rejects.toThrow(errorMessage);
  });
});
