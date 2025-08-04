const uuid = new URL(window.location.href).searchParams.get('query');

export default function useFetch(path, options, params) {
  const url = new URL(`https://stolapp.ru/api/${path}`);
  url.search = new URLSearchParams({
    code: uuid,
    ...params
  });

  return fetch(url, options).then((response) =>
    response.json().then((data) => ({ data, ok: response.ok }))
  );
}
