import { ref } from 'vue';

const uuid = new URL(window.location.href).searchParams.get('query');

export default function useFetch(type, params, options) {
  const url = new URL(`https://stolapp.ru/api/${type}`);
  if (params) {
    url.search = new URLSearchParams(params);
  }
  url.searchParams.set('code', uuid);

  return fetch(url, options)
    .then((response) => response.json().then((data) => ({ data, ok: response.ok })));
}
