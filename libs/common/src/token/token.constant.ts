export type TokenType = "access" | "refresh" | "activation"

export const tokenExpireTimes = {
  access: "1h",
  refresh: "7d",
  activation: "10m",
}

export const tokenSecrets = {
  access: "ACCESS_TOKEN_SECRET",
  refresh: "REFRESH_TOKEN_SECRET",
  activation: "ACTIVATION_TOKEN_SECRET",
}
