
# Certificates Directory

This directory contains SSL/TLS certificates used for client authentication and secure connections.

## Certificate Files

### Client Certificates
- `client-cert.pfx` - Client certificate in PKCS#12 format
- `client-cert.pem` - Client certificate in PEM format
- `client-key.pem` - Client private key in PEM format

### CA Certificates
- `ca-cert.pem` - Certificate Authority root certificate

## Usage

### Environment Variables
Set the following environment variables to use certificates:

```bash
# Client certificate path
CLIENT_CERT_PATH=./certs/client-cert.pfx
CLIENT_KEY_PATH=./certs/client-key.pem
CLIENT_CERT_PASSPHRASE=your_passphrase

# CA certificate
CA_CERT_PATH=./certs/ca-cert.pem
```

### Playwright Configuration
Certificates are automatically configured in `playwright.config.ts`:

```typescript
clientCertificates: [{
  origin: process.env.BASE_URL,
  certPath: process.env.CLIENT_CERT_PATH,
  keyPath: process.env.CLIENT_KEY_PATH,
  passphrase: process.env.CLIENT_CERT_PASSPHRASE,
}]
```

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit real certificates to version control**
2. **Use placeholder files for repository structure**
3. **Store actual certificates securely (e.g., CI/CD secrets, vault)**
4. **Rotate certificates regularly**
5. **Use different certificates for different environments**

## Certificate Generation

### Self-Signed Certificate (for testing)
```bash
# Generate private key
openssl genrsa -out client-key.pem 2048

# Generate certificate signing request
openssl req -new -key client-key.pem -out client.csr

# Generate self-signed certificate
openssl x509 -req -in client.csr -signkey client-key.pem -out client-cert.pem -days 365

# Convert to PKCS#12 format
openssl pkcs12 -export -out client-cert.pfx -inkey client-key.pem -in client-cert.pem
```

### CA-Signed Certificate
```bash
# Generate private key
openssl genrsa -out client-key.pem 2048

# Generate certificate signing request
openssl req -new -key client-key.pem -out client.csr

# Submit CSR to your Certificate Authority
# Receive signed certificate as client-cert.pem

# Convert to PKCS#12 format if needed
openssl pkcs12 -export -out client-cert.pfx -inkey client-key.pem -in client-cert.pem -certfile ca-cert.pem
```

## Environment-Specific Certificates

### Development
- Use self-signed certificates
- Store in local development environment
- Not committed to repository

### QA/Staging
- Use CA-signed certificates
- Store in CI/CD secrets
- Automatically deployed during pipeline

### Production
- Use production CA-signed certificates
- Store in secure vault (e.g., HashiCorp Vault, AWS Secrets Manager)
- Strict access controls and audit logging

## Troubleshooting

### Common Issues

1. **Certificate not found**
   - Verify file paths in environment variables
   - Check file permissions

2. **Invalid passphrase**
   - Verify CLIENT_CERT_PASSPHRASE environment variable
   - Test passphrase with OpenSSL

3. **Certificate expired**
   - Check certificate validity: `openssl x509 -in client-cert.pem -text -noout`
   - Renew certificate before expiration

4. **Wrong certificate format**
   - Playwright supports PEM and PKCS#12 formats
   - Convert if necessary using OpenSSL

### Validation Commands

```bash
# Check certificate details
openssl x509 -in client-cert.pem -text -noout

# Verify certificate and key match
openssl x509 -noout -modulus -in client-cert.pem | openssl md5
openssl rsa -noout -modulus -in client-key.pem | openssl md5

# Test PKCS#12 file
openssl pkcs12 -info -in client-cert.pfx
```
