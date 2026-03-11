// OTP generation and validation
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function isOTPExpired(expiryTime) {
  return new Date() > new Date(expiryTime)
}

export function createOTPWithExpiry() {
  const otp = generateOTP()
  const expiryTime = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  return { otp, expiryTime: expiryTime.toISOString() }
}

