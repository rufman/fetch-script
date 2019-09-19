/* eslint-disable */

export const head = function(w, d, t, o, r, c, s) {
  (c = d.createElement(t)), (s = d.getElementsByTagName(t)[0]);
  c.appendChild(d.createTextNode(o.text));
  c.onload = r(o);
  s ? s.parentNode.insertBefore(c, s) : d.appendChild(c);
};

export const headCors = function(w, d, t, u, r, e, c, s) {
  (c = d.createElement(t)), (s = d.head.getElementsByTagName(t)[0]);
  c.src = u;
  c.onload = r;
  c.onerror = e;
  s ? s.parentNode.insertBefore(c, s) : d.head.appendChild(c);
};
