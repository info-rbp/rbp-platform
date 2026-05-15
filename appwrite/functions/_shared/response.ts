export function ok(data: unknown = {}, status = 200) {
  return {
    statusCode: status,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ok: true, data }),
  };
}

export function fail(message: string, status = 400) {
  return {
    statusCode: status,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ok: false, message }),
  };
}
