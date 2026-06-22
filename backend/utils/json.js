// mysql2 sometimes returns JSON columns already parsed (as arrays/objects)
// and sometimes as raw strings depending on driver/version configuration.
// These helpers make every model defensive either way.

function parseJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== 'string') return value; // already parsed by driver
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toJSON(value) {
  // Always store as a JSON string so MySQL JSON columns stay valid
  // regardless of driver auto-parsing behaviour.
  return JSON.stringify(value ?? null);
}

module.exports = { parseJSON, toJSON };
