export async function fetchProductApi(path: string, options: RequestInit = {}) {
  const baseUrl = process.env.PRODUCT_API_URL || "http://product-api.customer.svc.cluster.local:8080";
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch from product.api: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
