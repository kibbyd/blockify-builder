import Link from 'next/link';

export const metadata = {
  title: 'Support - Blockify Builder',
  description: 'Get help with Blockify Builder',
};

export default function SupportPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; }
        .header h1 { font-size: 48px; margin-bottom: 15px; }
        .header p { font-size: 20px; opacity: 0.95; }
        .header a { color: white; text-decoration: none; opacity: 0.9; font-size: 16px; display: inline-block; margin-top: 20px; }
        .header a:hover { opacity: 1; }
        .container { max-width: 1000px; margin: 60px auto; padding: 0 20px; }
        .support-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 60px; }
        .support-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; transition: transform 0.3s; }
        .support-card:hover { transform: translateY(-5px); }
        .support-card .icon { font-size: 48px; margin-bottom: 20px; }
        .support-card h2 { color: #667eea; margin-bottom: 15px; font-size: 24px; }
        .support-card p { color: #666; margin-bottom: 20px; font-size: 16px; }
        .support-card a { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.3s; }
        .support-card a:hover { background: #5568d3; }
        .faq-section { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 60px; }
        .faq-section h2 { color: #667eea; margin-bottom: 30px; font-size: 32px; text-align: center; }
        .faq-item { margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eee; }
        .faq-item:last-child { border-bottom: none; }
        .faq-item h3 { color: #764ba2; margin-bottom: 10px; font-size: 20px; }
        .faq-item p { color: #555; line-height: 1.8; }
        .contact-info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; }
        .contact-info h2 { margin-bottom: 20px; font-size: 32px; }
        .contact-info p { font-size: 18px; margin-bottom: 10px; }
        .contact-info a { color: white; text-decoration: underline; }
        footer { background: #0f0f0f; color: #999; padding: 40px 20px; text-align: center; margin-top: 60px; }
        footer a { color: #999; text-decoration: none; margin: 0 15px; }
        footer a:hover { color: #fff; }
      `}} />

      <div className="header" data-id="support--section--header">
        <h1>&#x1f7ea; Support Center</h1>
        <p>We&apos;re here to help you build amazing Shopify pages</p>
        <Link href="/" data-id="support--link--home">&larr; Back to Home</Link>
      </div>

      <div className="container" data-id="support--section--content">

        <div className="support-grid">
          <div className="support-card">
            <div className="icon">&#x1f4e7;</div>
            <h2>Email Support</h2>
            <p>Get help from our team. We typically respond within 24 hours.</p>
            <a href="mailto:support@blockifybuilder.com" data-id="support--link--email">support@blockifybuilder.com</a>
          </div>

          <div className="support-card">
            <div className="icon">&#x1f4da;</div>
            <h2>Documentation</h2>
            <p>Learn how to use Blockify Builder with our comprehensive guides.</p>
            <a href="/builder" data-id="support--link--docs">View Documentation</a>
          </div>

          <div className="support-card">
            <div className="icon">&#x1f4ac;</div>
            <h2>Community</h2>
            <p>Join our community to share tips and get advice from other users.</p>
            <a href="[DISCORD/SLACK_LINK]" data-id="support--link--community">Join Community</a>
          </div>
        </div>

        <div className="faq-section" data-id="support--section--faq">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>How do I get started with Blockify Builder?</h3>
            <p>Simply click &ldquo;Launch Builder&rdquo; from the homepage, enter your license key, and start building. Use the drag-and-drop interface to add elements, customize their properties, and export your finished design as a Shopify Liquid template.</p>
          </div>

          <div className="faq-item">
            <h3>What&apos;s included in the $39/month subscription?</h3>
            <p>Your subscription includes unlimited page creation, all components and layouts, full responsive design tools (mobile/desktop/fullscreen), export to Liquid templates, and email support. You own all code you export.</p>
          </div>

          <div className="faq-item">
            <h3>Can I cancel my subscription anytime?</h3>
            <p>Yes! You can cancel anytime. Your subscription will remain active until the end of your current billing period. You keep all the Liquid code you&apos;ve exported&mdash;there&apos;s no vendor lock-in.</p>
          </div>

          <div className="faq-item">
            <h3>Do I need coding skills to use Blockify Builder?</h3>
            <p>No coding skills required! The visual drag-and-drop builder makes it easy for anyone to create professional Shopify pages. However, familiarity with Shopify&apos;s theme customizer is helpful for deploying your exported sections.</p>
          </div>

          <div className="faq-item">
            <h3>How does the export work?</h3>
            <p>When you export, Blockify Builder generates clean Shopify Liquid code that includes your layout, styles, and a schema with 100+ merchant-controllable properties. The exported file can be uploaded directly to your Shopify theme.</p>
          </div>

          <div className="faq-item">
            <h3>Can merchants edit the pages after I export them?</h3>
            <p>Yes! This is the revolutionary part. Each section exports with 100+ properties that merchants can adjust in Shopify&apos;s customizer without touching code&mdash;text, colors, spacing, images, fonts, and more across all breakpoints.</p>
          </div>

          <div className="faq-item">
            <h3>What happens to my data if I cancel?</h3>
            <p>Your exported Liquid code files are yours forever. We don&apos;t store your page designs on our servers&mdash;they&apos;re saved locally in your browser. After cancellation, you retain all exported code and can continue using it.</p>
          </div>

          <div className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>We offer a 30-day money-back guarantee. If you&apos;re not satisfied within the first 30 days, contact us at support@blockifybuilder.com for a full refund.</p>
          </div>

          <div className="faq-item">
            <h3>Is my data secure?</h3>
            <p>Yes. We use industry-standard security practices including SSL encryption, secure hosting, and limited data collection. Most of your work is stored locally in your browser. See our <Link href="/privacy" style={{ color: '#667eea' }} data-id="support--link--privacy-inline">Privacy Policy</Link> for details.</p>
          </div>

          <div className="faq-item">
            <h3>Can I use Blockify Builder for client projects?</h3>
            <p>Absolutely! Many agencies and freelancers use Blockify Builder to build pages for their clients. Your clients get full control over 100+ properties without needing to call you for every change.</p>
          </div>

          <div className="faq-item">
            <h3>What Shopify plans does Blockify Builder work with?</h3>
            <p>Blockify Builder exports standard Shopify Liquid code that works with all Shopify plans, including Basic, Shopify, Advanced, and Shopify Plus.</p>
          </div>

          <div className="faq-item">
            <h3>How do I report a bug or request a feature?</h3>
            <p>Email us at support@blockifybuilder.com with details about the bug or feature request. We actively incorporate user feedback into our development roadmap.</p>
          </div>
        </div>

        <div className="contact-info" data-id="support--section--contact">
          <h2>Still Need Help?</h2>
          <p>We&apos;re here for you. Reach out to our support team:</p>
          <p><strong>Email:</strong> <a href="mailto:support@blockifybuilder.com">support@blockifybuilder.com</a></p>
          <p><strong>Business Inquiries:</strong> <a href="mailto:hello@blockifybuilder.com">hello@blockifybuilder.com</a></p>
          <p style={{ marginTop: '20px', fontSize: '16px', opacity: 0.9 }}>
            <strong>Kibbster LLC</strong><br />
            [COMPANY ADDRESS]<br />
            [COMPANY PHONE]
          </p>
        </div>

      </div>

      <footer data-id="support--section--footer">
        <p>&copy; {currentYear} Blockify Builder by Kibbster LLC. All rights reserved.</p>
        <p style={{ marginTop: '10px' }}>
          <Link href="/terms" data-id="support--link--terms">Terms</Link>
          <Link href="/privacy" data-id="support--link--privacy">Privacy</Link>
          <Link href="/support" data-id="support--link--support">Support</Link>
        </p>
      </footer>
    </>
  );
}
