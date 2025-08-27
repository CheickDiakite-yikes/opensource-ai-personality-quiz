# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

The Who Am I team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

To report a security issue, please use the GitHub Security Advisory ["Report a Vulnerability"](https://github.com/yourusername/who-am-i/security/advisories/new) tab.

The Who Am I team will send a response indicating the next steps in handling your report. After the initial reply to your report, the security team will keep you informed of the progress towards a fix and full announcement, and may ask for additional information or guidance.

Report security bugs in third-party modules to the person or team maintaining the module.

## Security Measures

### Data Protection
- All user data is stored securely using Supabase with Row Level Security (RLS)
- Personal information is encrypted in transit and at rest
- User passwords are handled by Supabase Auth with industry-standard security

### API Security
- All API keys are stored as secure secrets in Supabase Edge Functions
- No sensitive credentials are exposed in the frontend code
- CORS policies are properly configured
- Rate limiting is implemented on all API endpoints

### Authentication
- Secure authentication flow using Supabase Auth
- JWT tokens with proper expiration
- Secure session management
- Protection against common attack vectors (CSRF, XSS)

### Infrastructure
- Backend infrastructure managed by Supabase with enterprise-grade security
- Regular security updates and patches
- Secure deployment practices
- Environment separation (development/staging/production)

## Security Best Practices for Contributors

When contributing to this project, please:

1. **Never commit sensitive data**
   - API keys, passwords, or tokens
   - Personal information or real user data
   - Database credentials

2. **Follow secure coding practices**
   - Validate all user inputs
   - Use parameterized queries
   - Implement proper error handling
   - Follow the principle of least privilege

3. **Dependencies**
   - Keep dependencies up to date
   - Use `npm audit` to check for vulnerabilities
   - Review security advisories for used packages

4. **Environment Variables**
   - Use environment variables for configuration
   - Never hardcode sensitive values
   - Follow the `.env.example` file structure

## Security Updates

We will notify users of security updates through:

- GitHub Security Advisories
- Release notes with security labels
- Direct notification for critical vulnerabilities

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Documentation](https://supabase.com/docs/guides/platform/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

Thank you for helping keep Who Am I and our users safe!