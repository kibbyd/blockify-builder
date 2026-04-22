import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Blockify Builder',
  description: 'Privacy Policy for Blockify Builder by Kibbster LLC',
};

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { font-size: 42px; margin-bottom: 10px; }
        .header a { color: white; text-decoration: none; opacity: 0.9; font-size: 16px; }
        .header a:hover { opacity: 1; }
        .container { max-width: 900px; margin: 40px auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        h2 { color: #667eea; margin-top: 30px; margin-bottom: 15px; font-size: 28px; }
        h3 { color: #764ba2; margin-top: 20px; margin-bottom: 10px; font-size: 20px; }
        p { margin-bottom: 15px; color: #555; }
        ul, ol { margin-bottom: 15px; margin-left: 30px; color: #555; }
        li { margin-bottom: 8px; }
        .last-updated { color: #999; font-size: 14px; margin-bottom: 30px; }
        footer { background: #0f0f0f; color: #999; padding: 40px 20px; text-align: center; margin-top: 60px; }
        footer a { color: #999; text-decoration: none; margin: 0 15px; }
        footer a:hover { color: #fff; }
        .highlight { background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
      `}} />

      <div className="header" data-id="privacy--section--header">
        <h1>&#x1f7ea; Blockify Builder</h1>
        <Link href="/" data-id="privacy--link--home">&larr; Back to Home</Link>
      </div>

      <div className="container" data-id="privacy--section--content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {currentDate}</p>

        <div className="highlight">
          <p><strong>Your Privacy Matters:</strong> Blockify Builder is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we use it.</p>
        </div>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Account Information</h3>
        <p>When you create an account, we collect:</p>
        <ul>
          <li>Email address</li>
          <li>License key</li>
          <li>Payment information (processed through our payment provider)</li>
        </ul>

        <h3>1.2 Usage Data</h3>
        <p>We automatically collect information about how you use the Service:</p>
        <ul>
          <li>Pages and sections you create</li>
          <li>Features you use</li>
          <li>Time and date of access</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>IP address</li>
        </ul>

        <h3>1.3 Content You Create</h3>
        <p>Blockify Builder stores your page designs and configurations locally in your browser using localStorage. We do NOT store your design content on our servers unless you explicitly upload files or images.</p>

        <h3>1.4 Cookies and Tracking</h3>
        <p>We use cookies and similar technologies to:</p>
        <ul>
          <li>Keep you logged in</li>
          <li>Remember your preferences</li>
          <li>Analyze how you use our Service</li>
          <li>Improve user experience</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li><strong>Provide the Service:</strong> Enable you to use Blockify Builder and export Liquid templates</li>
          <li><strong>Process Payments:</strong> Handle subscription billing through our payment processor</li>
          <li><strong>Communicate:</strong> Send important updates, security alerts, and support messages</li>
          <li><strong>Improve:</strong> Analyze usage patterns to enhance features and fix bugs</li>
          <li><strong>Prevent Fraud:</strong> Detect and prevent unauthorized access or abuse</li>
          <li><strong>Legal Compliance:</strong> Meet legal obligations and enforce our Terms of Service</li>
        </ul>

        <h2>3. Data Storage and Retention</h2>

        <h3>3.1 Local Storage</h3>
        <p>Most of your design work is stored locally in your browser&apos;s localStorage. This data:</p>
        <ul>
          <li>Remains on your device</li>
          <li>Is not transmitted to our servers</li>
          <li>Can be cleared by you at any time</li>
        </ul>

        <h3>3.2 Server Storage</h3>
        <p>We store minimal data on our servers:</p>
        <ul>
          <li>Account credentials (encrypted)</li>
          <li>License validation data</li>
          <li>Usage analytics (anonymized)</li>
        </ul>

        <h3>3.3 Retention Period</h3>
        <p>We retain your data:</p>
        <ul>
          <li><strong>Active accounts:</strong> For the duration of your subscription</li>
          <li><strong>Canceled accounts:</strong> For 30 days, then deleted (except as required by law)</li>
          <li><strong>Financial records:</strong> As required by tax and accounting regulations</li>
        </ul>

        <h2>4. Data Sharing and Disclosure</h2>
        <p>We do NOT sell your personal information. We only share data in these limited circumstances:</p>

        <h3>4.1 Service Providers</h3>
        <p>We share data with trusted third parties who help us operate:</p>
        <ul>
          <li><strong>Payment Processing:</strong> Stripe or similar payment providers</li>
          <li><strong>Hosting:</strong> Cloud infrastructure providers</li>
          <li><strong>Analytics:</strong> Anonymous usage analytics</li>
        </ul>

        <h3>4.2 Legal Requirements</h3>
        <p>We may disclose information if required by law or to:</p>
        <ul>
          <li>Comply with legal process (subpoenas, court orders)</li>
          <li>Protect rights, property, or safety</li>
          <li>Prevent fraud or security issues</li>
          <li>Enforce our Terms of Service</li>
        </ul>

        <h3>4.3 Business Transfers</h3>
        <p>If Kibbster LLC is acquired or merged, your information may be transferred to the new entity. We will notify you of any such change.</p>

        <h2>5. Your Rights and Choices</h2>

        <h3>5.1 Access and Control</h3>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correct:</strong> Update inaccurate information</li>
          <li><strong>Delete:</strong> Request deletion of your account and data</li>
          <li><strong>Export:</strong> Download your data in a portable format</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
        </ul>

        <h3>5.2 Cookie Management</h3>
        <p>You can control cookies through your browser settings. Note that disabling cookies may limit functionality.</p>

        <h3>5.3 Do Not Track</h3>
        <p>We currently do not respond to &ldquo;Do Not Track&rdquo; signals as there is no industry standard for compliance.</p>

        <h2>6. Security</h2>
        <p>We take security seriously and implement measures to protect your data:</p>
        <ul>
          <li><strong>Encryption:</strong> HTTPS/SSL for all data transmission</li>
          <li><strong>Access Controls:</strong> Limited employee access to personal data</li>
          <li><strong>Secure Hosting:</strong> Industry-standard cloud infrastructure</li>
          <li><strong>Regular Audits:</strong> Periodic security reviews and updates</li>
        </ul>

        <p><strong>However, no method of transmission over the Internet is 100% secure.</strong> We cannot guarantee absolute security.</p>

        <h2>7. Children&apos;s Privacy</h2>
        <p>Blockify Builder is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we learn we have collected data from a child under 13, we will delete it immediately.</p>

        <h2>8. International Data Transfers</h2>
        <p>Your information may be transferred to and processed in countries other than your own. By using the Service, you consent to such transfers. We ensure appropriate safeguards are in place to protect your data.</p>

        <h2>9. California Privacy Rights (CCPA)</h2>
        <p>If you are a California resident, you have additional rights:</p>
        <ul>
          <li>Right to know what personal information is collected</li>
          <li>Right to know if personal information is sold or disclosed</li>
          <li>Right to opt-out of the sale of personal information</li>
          <li>Right to deletion of personal information</li>
          <li>Right to non-discrimination for exercising CCPA rights</li>
        </ul>
        <p><strong>We do NOT sell personal information.</strong></p>

        <h2>10. GDPR Rights (European Users)</h2>
        <p>If you are in the European Economic Area, you have rights under GDPR:</p>
        <ul>
          <li>Right to access your personal data</li>
          <li>Right to rectification of inaccurate data</li>
          <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
          <li>Right to withdraw consent</li>
        </ul>

        <h2>11. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of material changes by:</p>
        <ul>
          <li>Updating the &ldquo;Last Updated&rdquo; date</li>
          <li>Sending an email notification</li>
          <li>Displaying a prominent notice in the Service</li>
        </ul>
        <p>Your continued use of the Service after such notice constitutes acceptance of the updated policy.</p>

        <h2>12. Contact Us</h2>
        <p>For questions about this Privacy Policy or to exercise your rights, contact us:</p>
        <p>
          <strong>Kibbster LLC</strong><br />
          Email: <a href="mailto:privacy@blockifybuilder.com" style={{ color: '#667eea' }}>privacy@blockifybuilder.com</a><br />
          Address: [COMPANY ADDRESS]<br />
          Phone: [COMPANY PHONE]
        </p>

        <h2>13. Data Protection Officer</h2>
        <p>For GDPR-related inquiries, you may contact our Data Protection Officer at:</p>
        <p>Email: <a href="mailto:dpo@blockifybuilder.com" style={{ color: '#667eea' }}>dpo@blockifybuilder.com</a></p>
      </div>

      <footer data-id="privacy--section--footer">
        <p>&copy; {currentYear} Blockify Builder by Kibbster LLC. All rights reserved.</p>
        <p style={{ marginTop: '10px' }}>
          <Link href="/terms" data-id="privacy--link--terms">Terms</Link>
          <Link href="/privacy" data-id="privacy--link--privacy">Privacy</Link>
          <Link href="/support" data-id="privacy--link--support">Support</Link>
        </p>
      </footer>
    </>
  );
}
