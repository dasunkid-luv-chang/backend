export type TokenType = "access" | "refresh" | "activation" | "forgot"

export const tokenExpireTimes = {
  access: "1h",
  refresh: "7d",
  activation: "10m",
  forgot: "5m",
}

export const tokenSecrets = {
  access: "ACCESS_TOKEN_SECRET",
  refresh: "REFRESH_TOKEN_SECRET",
  activation: "ACTIVATION_TOKEN_SECRET",
  forgot: "FORGOT_PASSWORD_TOKEN_SECRET",
}
