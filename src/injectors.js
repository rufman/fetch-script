/* eslint-disable */

export const head = function(w, d, t, o, r, c, s) {
  (c = d.createElement(t)), (s = d.getElementsByTagName(t)[0]);
  c.appendChild(d.createTextNode(o.text));
  c.onload = r(o);
  if (o.nonce) {
    c.nonce = o.nonce;
  }
  s ? s.parentNode.insertBefore(c, s) : d.appendChild(c);
};

export const headCors = function(w, d, t, u, r, e, c, s, n) {
  (c = d.createElement(t)), (s = d.head.getElementsByTagName(t)[0]);
  c.src = u;
  c.onload = r;
  c.onerror = e;
  if (n) {
    c.nonce = n;
  }
  s ? s.parentNode.insertBefore(c, s) : d.head.appendChild(c);
};
