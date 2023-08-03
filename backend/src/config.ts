const getEnv = (name: string, defaultVal?: string): string => {
  const env = process.env[name];
  if (!env) {
    if (defaultVal) {
      return defaultVal;
    }
    throw new Error(`Missing env variable ${name}`);
  }

  return env ?? defaultVal;
};

export const config = {
  port: +getEnv("PORT", "3001"),
  corsOrigin: getEnv("CORS_ORIGIN", "*"),
};
