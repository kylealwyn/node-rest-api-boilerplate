export function handleApiError(err, res) {
  res.status(400).send(err);
}
