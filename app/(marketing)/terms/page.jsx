import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Blockify Builder',
  description: 'Terms of Service for Blockify Builder by Kibbster LLC',
};

export default function TermsPage() {
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
      `}} />

      <div className="header" data-id="terms--section--header">
        <h1>&#x1f7ea; Blockify Builder</h1>
        <Link href="/" data-id="terms--link--home">&larr; Back to Home</Link>
      </div>

      <div className="container" data-id="terms--section--content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {currentDate}</p>

        <p>Welcome to Blockify Builder, a product of Kibbster LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of Blockify Builder, including our website, software, and services (collectively, the &ldquo;Service&rdquo;).</p>

        <p>By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.</p>

        <h2>1. Service Description</h2>
        <p>Blockify Builder is a Shopify page builder that allows users to create visual page layouts and export them as Shopify-compatible Liquid templates.</p>

        <h2>2. Subscription and Payment</h2>
        <h3>2.1 Subscription Plans</h3>
        <p>Blockify Builder is offered as a subscription service at $39 per month. Payment is processed through our third-party payment processor.</p>

        <h3>2.2 Billing</h3>
        <ul>
          <li>Subscriptions renew automatically on a monthly basis</li>
          <li>You will be charged on the same day each month</li>
          <li>All fees are non-refundable except as expressly stated in these Terms</li>
          <li>We reserve the right to change pricing with 30 days&apos; notice</li>
        </ul>

        <h3>2.3 Cancellation</h3>
        <p>You may cancel your subscription at any time. Upon cancellation:</p>
        <ul>
          <li>Your subscription will remain active until the end of your current billing period</li>
          <li>You will not be charged for subsequent billing periods</li>
          <li>You retain ownership of all exported Liquid code files</li>
          <li>Access to the builder application will terminate at the end of your billing period</li>
        </ul>

        <h2>3. License and Ownership</h2>
        <h3>3.1 Your Content</h3>
        <p>You retain all rights to the content you create using Blockify Builder, including all exported Liquid template files. You may use, modify, and distribute your exported code without restriction.</p>

        <h3>3.2 Our Software</h3>
        <p>Blockify Builder grants you a limited, non-exclusive, non-transferable license to access and use the Service during your active subscription period. This license does not grant you ownership of the Blockify Builder software itself.</p>

        <h3>3.3 No Vendor Lock-In</h3>
        <p>All exported code is standard Shopify Liquid format. You own all exported files and may continue to use them even after canceling your subscription.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any illegal or unauthorized purpose</li>
          <li>Attempt to reverse engineer, decompile, or disassemble the Service</li>
          <li>Share your account credentials with others</li>
          <li>Use the Service to create content that infringes on intellectual property rights</li>
          <li>Interfere with or disrupt the Service or servers</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
        </ul>

        <h2>5. Service Availability</h2>
        <p>We strive to provide reliable service but do not guarantee:</p>
        <ul>
          <li>Uninterrupted or error-free operation</li>
          <li>That defects will be corrected immediately</li>
          <li>That the Service is free from viruses or harmful components</li>
        </ul>

        <p>We reserve the right to modify, suspend, or discontinue the Service at any time with reasonable notice.</p>

        <h2>6. Data and Privacy</h2>
        <p>Your use of the Service is also governed by our <Link href="/privacy" style={{ color: '#667eea' }} data-id="terms--link--privacy-inline">Privacy Policy</Link>. By using the Service, you consent to our collection and use of data as described in the Privacy Policy.</p>

        <h2>7. Updates and Modifications</h2>
        <p>We may update the Service from time to time, including adding new features or modifying existing functionality. We will provide notice of significant changes through the Service or via email.</p>

        <h2>8. Warranties and Disclaimers</h2>
        <p><strong>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</strong> We disclaim all warranties, including but not limited to:</p>
        <ul>
          <li>Merchantability</li>
          <li>Fitness for a particular purpose</li>
          <li>Non-infringement</li>
          <li>Accuracy or reliability of results</li>
        </ul>

        <h2>9. Limitation of Liability</h2>
        <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, KIBBSTER LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.</strong></p>

        <p>Our total liability to you for any claims arising from your use of the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim.</p>

        <h2>10. Indemnification</h2>
        <p>You agree to indemnify and hold harmless Kibbster LLC, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
        <ul>
          <li>Your use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another party</li>
          <li>Content you create or export using the Service</li>
        </ul>

        <h2>11. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of [STATE/PROVINCE], [COUNTRY], without regard to its conflict of law provisions.</p>

        <h2>12. Dispute Resolution</h2>
        <p>Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of [ARBITRATION ORGANIZATION]. You agree to waive your right to a jury trial or to participate in a class action lawsuit.</p>

        <h2>13. Changes to Terms</h2>
        <p>We may modify these Terms at any time. We will notify you of material changes via email or through the Service. Your continued use of the Service after such notice constitutes acceptance of the modified Terms.</p>

        <h2>14. Termination</h2>
        <p>We may terminate or suspend your access to the Service immediately, without prior notice, if you breach these Terms. Upon termination:</p>
        <ul>
          <li>Your license to use the Service immediately terminates</li>
          <li>You retain ownership of all previously exported code</li>
          <li>You remain liable for any outstanding payments</li>
        </ul>

        <h2>15. Contact Information</h2>
        <p>For questions about these Terms, please contact us:</p>
        <p>
          <strong>Kibbster LLC</strong><br />
          Email: <a href="mailto:legal@blockifybuilder.com" style={{ color: '#667eea' }}>legal@blockifybuilder.com</a><br />
          Address: [COMPANY ADDRESS]<br />
          Phone: [COMPANY PHONE]
        </p>

        <h2>16. Entire Agreement</h2>
        <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and Kibbster LLC regarding the Service and supersede all prior agreements.</p>

        <h2>17. Severability</h2>
        <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>
      </div>

      <footer data-id="terms--section--footer">
        <p>&copy; {currentYear} Blockify Builder by Kibbster LLC. All rights reserved.</p>
        <p style={{ marginTop: '10px' }}>
          <Link href="/terms" data-id="terms--link--terms">Terms</Link>
          <Link href="/privacy" data-id="terms--link--privacy">Privacy</Link>
          <Link href="/support" data-id="terms--link--support">Support</Link>
        </p>
      </footer>
    </>
  );
}
