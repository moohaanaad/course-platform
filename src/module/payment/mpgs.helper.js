


export function getAuthHeader() {
  const username = process.env.MPGS_USERNAME;
  const password = process.env.MPGS_PASSWORD;
  const token = Buffer.from(`${username}:${password}`).toString("base64");

  return {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  };
}
