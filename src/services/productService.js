export async function getProduct(id) {
  const response = await fetch(baseUrl + "products/" + id);
  if (response.ok) return response.json();
  throw response;
}
