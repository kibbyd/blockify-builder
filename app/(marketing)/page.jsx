import Link from 'next/link';

export const metadata = {
  title: 'Blockify Builder - The Only Shopify Builder Where You Own the Code',
  description: 'Build Shopify sections visually and export clean native Liquid. 5-viewport responsive control, auto schema export, no app dependency. Free 7-day trial.',
  openGraph: {
    title: 'Blockify Builder - The Only Shopify Builder Where You Own the Code',
    description: 'Build Shopify sections visually and export clean native Liquid. No lock-in. Cancel anytime, keep everything.',
    images: ['/images/og-image.png'],
  },
};

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; overflow-x: hidden; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 120px 20px 80px; text-align: center; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></svg>'); background-size: 50px 50px; opacity: 0.3; }
        .hero-content { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
        .hero h1 { font-size: 58px; font-weight: 800; margin-bottom: 20px; line-height: 1.2; }
        .hero .subtitle { font-size: 24px; margin-bottom: 40px; opacity: 0.95; font-weight: 400; }
        .cta-primary { display: inline-block; background: #22c55e; color: white; padding: 20px 50px; font-size: 20px; font-weight: bold; text-decoration: none; border-radius: 12px; transition: all 0.3s; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4); margin: 10px; }
        .cta-primary:hover { background: #16a34a; transform: translateY(-2px); box-shadow: 0 15px 40px rgba(34, 197, 94, 0.5); }
        .cta-secondary { display: inline-block; background: rgba(255, 255, 255, 0.2); color: white; padding: 20px 50px; font-size: 20px; font-weight: bold; text-decoration: none; border-radius: 12px; transition: all 0.3s; border: 2px solid white; margin: 10px; }
        .cta-secondary:hover { background: rgba(255, 255, 255, 0.3); transform: translateY(-2px); }
        .container { max-width: 1200px; margin: 0 auto; }
        .section-title { text-align: center; font-size: 42px; font-weight: 800; margin-bottom: 60px; color: #1a1a1a; }
        .problem { padding: 80px 20px; background: #fff5f5; }
        .pain-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-bottom: 40px; }
        .pain-item { background: white; padding: 35px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
        .pain-item .icon { font-size: 48px; margin-bottom: 20px; }
        .pain-item h3 { font-size: 22px; margin-bottom: 12px; color: #dc2626; font-weight: 700; }
        .pain-item p { color: #666; font-size: 16px; line-height: 1.8; }
        .solution { padding: 80px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); }
        .solution-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
        .solution-item { background: white; padding: 35px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border-left: 5px solid #667eea; transition: transform 0.3s; }
        .solution-item:hover { transform: translateY(-5px); }
        .solution-item .icon { font-size: 42px; margin-bottom: 15px; }
        .solution-item h3 { font-size: 22px; margin-bottom: 12px; color: #667eea; font-weight: 700; }
        .solution-item p { color: #444; font-size: 15px; line-height: 1.7; }
        .how-it-works { padding: 80px 20px; background: white; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; max-width: 1000px; margin: 0 auto; }
        .step-item { text-align: center; padding: 40px 30px; }
        .step-number { display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 28px; font-weight: 800; margin-bottom: 20px; }
        .step-item h3 { font-size: 22px; margin-bottom: 12px; color: #1a1a1a; font-weight: 700; }
        .step-item p { color: #666; font-size: 16px; line-height: 1.7; }
        .demo { padding: 80px 20px; background: #f8f9fa; }
        .video-container { max-width: 900px; margin: 0 auto 40px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); }
        .video-placeholder { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 200px 40px; text-align: center; color: white; font-size: 24px; cursor: pointer; transition: opacity 0.3s; }
        .video-placeholder:hover { opacity: 0.9; }
        .comparison { padding: 80px 20px; background: white; }
        .comparison-table { max-width: 800px; margin: 0 auto; border-collapse: collapse; width: 100%; }
        .comparison-table th, .comparison-table td { padding: 18px 24px; text-align: left; font-size: 17px; border-bottom: 1px solid #e5e7eb; }
        .comparison-table th { font-weight: 700; color: #1a1a1a; }
        .comparison-table thead th { background: #f8f9fa; font-size: 18px; }
        .comparison-table thead th:last-child { color: #667eea; }
        .comparison-table td:first-child { color: #666; font-weight: 500; }
        .comparison-table td:nth-child(2) { color: #dc2626; }
        .comparison-table td:last-child { color: #22c55e; font-weight: 600; }
        .benefits { padding: 80px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); }
        .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px; }
        .benefit-item { background: white; padding: 35px; border-radius: 16px; transition: transform 0.3s; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
        .benefit-item:hover { transform: translateY(-5px); }
        .benefit-item .icon { font-size: 42px; margin-bottom: 15px; }
        .benefit-item h3 { font-size: 22px; margin-bottom: 12px; color: #1a1a1a; font-weight: 700; }
        .benefit-item p { color: #444; font-size: 15px; line-height: 1.7; }
        .pricing { padding: 80px 20px; background: #f8f9fa; text-align: center; }
        .pricing-card { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; border-radius: 20px; color: white; box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3); }
        .pricing-card h2 { font-size: 32px; margin-bottom: 20px; }
        .pricing-price { font-size: 72px; font-weight: 800; margin-bottom: 10px; }
        .pricing-price span { font-size: 28px; opacity: 0.9; }
        .pricing-features { list-style: none; margin: 40px 0; text-align: left; }
        .pricing-features li { padding: 12px 0; font-size: 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); }
        .pricing-features li:last-child { border-bottom: none; }
        .roi { padding: 80px 20px; background: white; text-align: center; }
        .roi-card { max-width: 700px; margin: 0 auto; background: #1a1a1a; color: white; padding: 60px 40px; border-radius: 20px; }
        .roi-card h2 { font-size: 32px; margin-bottom: 20px; font-weight: 800; }
        .roi-card p { font-size: 20px; line-height: 1.7; opacity: 0.9; }
        .roi-card .highlight { color: #22c55e; font-weight: 700; font-size: 28px; display: block; margin: 20px 0; }
        .social-proof { padding: 80px 20px; background: #f8f9fa; }
        .testimonial { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); position: relative; }
        .testimonial::before { content: '\\201C'; position: absolute; top: 20px; left: 30px; font-size: 80px; color: #667eea; opacity: 0.2; font-family: Georgia, serif; }
        .testimonial-text { font-size: 18px; line-height: 1.8; margin-bottom: 20px; color: #444; position: relative; z-index: 1; font-style: italic; }
        .testimonial-author { font-size: 16px; font-weight: 600; color: #666; }
        .faq { padding: 80px 20px; background: white; }
        .faq-list { max-width: 700px; margin: 0 auto; }
        .faq-item { margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 16px; }
        .faq-item h3 { font-size: 20px; margin-bottom: 10px; color: #1a1a1a; font-weight: 700; }
        .faq-item p { color: #444; font-size: 16px; line-height: 1.7; }
        .final-cta { padding: 100px 20px; background: #1a1a1a; color: white; text-align: center; }
        .final-cta h2 { font-size: 48px; margin-bottom: 30px; font-weight: 800; }
        .final-cta p { font-size: 20px; margin-bottom: 40px; opacity: 0.9; }
        @media (max-width: 768px) { .hero h1 { font-size: 36px; } .hero .subtitle { font-size: 18px; } .section-title { font-size: 32px; } .cta-primary, .cta-secondary { padding: 16px 30px; font-size: 18px; display: block; margin: 10px auto; max-width: 300px; } .pain-grid, .solution-grid, .steps-grid, .benefits-grid { grid-template-columns: 1fr; } .pricing-price { font-size: 56px; } .final-cta h2 { font-size: 32px; } .roi-card h2 { font-size: 26px; } .roi-card .highlight { font-size: 22px; } .comparison-table th, .comparison-table td { padding: 12px 14px; font-size: 14px; } }
      `}} />

      {/* Hero Section */}
      <section className="hero" data-id="landing--section--hero">
        <div className="hero-content">
          <h1 data-id="landing--heading--title">The Only Shopify Builder Where You Own the Code</h1>
          <p className="subtitle">
            Build sections visually. Export clean native Liquid. Control 5 viewports.<br />
            <strong>Cancel anytime &mdash; your pages stay.</strong>
          </p>

          <div style={{ margin: '40px 0' }}>
            <Link href="/signup" className="cta-primary" data-id="landing--cta--start-trial">
              Start Free 7-Day Trial &rarr;
            </Link>
          </div>

          <p style={{ fontSize: '16px', opacity: 0.8 }}>No credit card required</p>
          <Link href="/login" className="cta-secondary" style={{ marginTop: '10px', padding: '14px 40px', fontSize: '16px' }} data-id="landing--cta--login">
            Log in
          </Link>
        </div>
      </section>

      {/* Problem Section: The Rental Trap */}
      <section className="problem" data-id="landing--section--problem">
        <div className="container">
          <h2 className="section-title">The Rental Trap</h2>
          <p style={{ textAlign: 'center', fontSize: '20px', color: '#666', marginBottom: '50px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Most Shopify page builders have a dirty secret:
          </p>

          <div className="pain-grid">
            <div className="pain-item" data-id="landing--card--pain-hostage">
              <div className="icon">&#x1f512;</div>
              <h3>Your Pages Are Held Hostage</h3>
              <p>Uninstall the app and your pages vanish. Every section, every layout, every hour of work &mdash; gone. You never owned them.</p>
            </div>

            <div className="pain-item" data-id="landing--card--pain-performance">
              <div className="icon">&#x1f422;</div>
              <h3>App-Rendered = Slow</h3>
              <p>Other builders inject their own scripts and render pages through their servers. Your store pays the performance tax on every page load.</p>
            </div>

            <div className="pain-item" data-id="landing--card--pain-lockin">
              <div className="icon">&#x1f4b8;</div>
              <h3>Locked Into Monthly Fees Forever</h3>
              <p>You can&apos;t leave without losing your work. So you keep paying &mdash; month after month &mdash; for pages you built yourself.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <p style={{ fontSize: '22px', color: '#dc2626', fontWeight: 700 }}>
              You&apos;re not buying a tool. You&apos;re renting your own pages.
            </p>
            <p style={{ fontSize: '20px', color: '#667eea', marginTop: '10px', fontWeight: 600 }}>
              Blockify is different.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section: Build It. Own It. */}
      <section className="solution" data-id="landing--section--solution">
        <div className="container">
          <h2 className="section-title">Build It. Own It.</h2>
          <p style={{ textAlign: 'center', fontSize: '20px', color: '#666', marginBottom: '50px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            Blockify exports native Liquid directly to your theme. No app dependency. No performance hit. Cancel and keep everything.
          </p>

          <div className="solution-grid">
            <div className="solution-item" data-id="landing--card--solution-own">
              <div className="icon">&#x1f511;</div>
              <h3>Own the Code</h3>
              <p>Every section exports as clean, native Shopify Liquid that lives in your theme. Uninstall Blockify and your pages stay exactly where they are.</p>
            </div>

            <div className="solution-item" data-id="landing--card--solution-viewports">
              <div className="icon">&#x1f4f1;</div>
              <h3>5-Viewport Responsive</h3>
              <p>Control layouts across mobile, tablet portrait, tablet landscape, desktop, and large desktop. No other builder gives you this level of precision.</p>
            </div>

            <div className="solution-item" data-id="landing--card--solution-schema">
              <div className="icon">&#x2699;&#xfe0f;</div>
              <h3>Auto Schema Export</h3>
              <p>Every setting you configure is automatically exported as Shopify schema JSON. Merchants can tweak content directly in the theme editor.</p>
            </div>

            <div className="solution-item" data-id="landing--card--solution-liquid">
              <div className="icon">&#x2705;</div>
              <h3>Clean Native Liquid</h3>
              <p>No injected scripts, no external dependencies, no app-rendered markup. Just standards-compliant Liquid that runs natively in Shopify.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" data-id="landing--section--how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>

          <div className="steps-grid">
            <div className="step-item" data-id="landing--card--step-1">
              <div className="step-number">1</div>
              <h3>Design Visually</h3>
              <p>Build your section in the visual editor. Drag, drop, and style &mdash; no code required to get started.</p>
            </div>

            <div className="step-item" data-id="landing--card--step-2">
              <div className="step-number">2</div>
              <h3>Tweak Across 5 Viewports</h3>
              <p>Fine-tune your layout for every screen size. Adjust spacing, visibility, and typography per viewport.</p>
            </div>

            <div className="step-item" data-id="landing--card--step-3">
              <div className="step-number">3</div>
              <h3>Export Clean Liquid + Schema</h3>
              <p>One click. You get a production-ready Liquid file with auto-generated schema. Drop it in your theme and go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="demo" id="demo" data-id="landing--section--demo">
        <div className="container">
          <h2 className="section-title">See It In Action</h2>

          <div className="video-container">
            <div className="video-placeholder" data-id="landing--video--demo">
              &#x1f3ac; Product Demo<br />
              <small style={{ fontSize: '16px', opacity: 0.8 }}>Click to play</small>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
            Build visually. Export natively. Own it forever.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison" data-id="landing--section--comparison">
        <div className="container">
          <h2 className="section-title">Other Builders vs Blockify</h2>

          <table className="comparison-table" data-id="landing--table--comparison">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Other Builders</th>
                <th>Blockify</th>
              </tr>
            </thead>
            <tbody>
              <tr data-id="landing--row--rendering">
                <td>Rendering</td>
                <td>App-rendered</td>
                <td>Native Liquid</td>
              </tr>
              <tr data-id="landing--row--ownership">
                <td>Code ownership</td>
                <td>Locked to app</td>
                <td>You own it</td>
              </tr>
              <tr data-id="landing--row--breakpoints">
                <td>Responsive breakpoints</td>
                <td>3 breakpoints</td>
                <td>5 viewports</td>
              </tr>
              <tr data-id="landing--row--schema">
                <td>Schema export</td>
                <td>None</td>
                <td>Auto-generated</td>
              </tr>
              <tr data-id="landing--row--uninstall">
                <td>Uninstall the app</td>
                <td>Pages disappear</td>
                <td>Pages stay</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" data-id="landing--section--benefits">
        <div className="container">
          <h2 className="section-title">Built for Agencies &amp; Freelancers</h2>

          <div className="benefits-grid">
            <div className="benefit-item" data-id="landing--card--benefit-handoff">
              <div className="icon">&#x1f91d;</div>
              <h3>Hand Off Clean Code</h3>
              <p>Deliver native Liquid to clients &mdash; no app dependency, no ongoing subscription they need to maintain.</p>
            </div>

            <div className="benefit-item" data-id="landing--card--benefit-liability">
              <div className="icon">&#x1f6e1;&#xfe0f;</div>
              <h3>No App Dependency Liability</h3>
              <p>Your client&apos;s store doesn&apos;t break if a third-party app goes down or changes pricing. The code lives in the theme.</p>
            </div>

            <div className="benefit-item" data-id="landing--card--benefit-precision">
              <div className="icon">&#x1f3af;</div>
              <h3>5-Viewport Precision</h3>
              <p>Pixel-perfect control across every device. Deliver responsive builds that match the design comp exactly.</p>
            </div>

            <div className="benefit-item" data-id="landing--card--benefit-speed">
              <div className="icon">&#x26a1;</div>
              <h3>Faster Than Hand-Coding</h3>
              <p>Visual building with schema auto-export means you ship sections in minutes, not hours. More projects, more revenue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" data-id="landing--section--pricing">
        <div className="container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>

          <div className="pricing-card">
            <h2>Blockify Builder</h2>
            <div className="pricing-price">
              $39<span>/month</span>
            </div>

            <ul className="pricing-features">
              <li>&#x2705; Unlimited exports</li>
              <li>&#x2705; Unlimited projects</li>
              <li>&#x2705; 5-viewport responsive</li>
              <li>&#x2705; Auto schema export</li>
              <li>&#x2705; Free updates</li>
            </ul>

            <Link href="/signup" className="cta-primary" style={{ marginTop: '30px' }} data-id="landing--cta--start-trial-pricing">
              Start Free 7-Day Trial &rarr;
            </Link>

            <p style={{ fontSize: '14px', marginTop: '20px', opacity: 0.8 }}>Cancel anytime. Keep everything you built.</p>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="roi" data-id="landing--section--roi">
        <div className="container">
          <div className="roi-card">
            <h2>If Blockify Saves You Just 1 Hour Per Month, It Pays for Itself</h2>
            <p>Most Shopify developers charge:</p>
            <span className="highlight">$50&ndash;$150/hour</span>
            <p>Blockify often saves 5&ndash;10+ hours monthly.</p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof" data-id="landing--section--social-proof">
        <div className="container">
          <h2 className="section-title">What Developers Are Saying</h2>

          <div className="testimonial" data-id="landing--card--testimonial-placeholder">
            <p className="testimonial-text">
              &ldquo;Finally, a builder where I own the output. I hand clean Liquid to clients and they never need to worry about app dependencies.&rdquo;
            </p>
            <p className="testimonial-author">&mdash; Shopify Agency Developer</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" data-id="landing--section--faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>

          <div className="faq-list">
            <div className="faq-item" data-id="landing--card--faq-cancel">
              <h3>What happens if I cancel?</h3>
              <p>You keep everything. All exported Liquid files live in your theme &mdash; they don&apos;t depend on Blockify to render. Cancel anytime and your pages stay exactly as they are.</p>
            </div>

            <div className="faq-item" data-id="landing--card--faq-coding">
              <h3>Do I need coding experience?</h3>
              <p>The visual builder requires no code to use. However, Blockify is designed for developers and agencies who understand Shopify themes and want production-quality Liquid output.</p>
            </div>

            <div className="faq-item" data-id="landing--card--faq-os2">
              <h3>Is it compatible with Online Store 2.0?</h3>
              <p>Yes. All output is fully compatible with Shopify&apos;s Online Store 2.0 architecture, including sections, blocks, and schema settings.</p>
            </div>

            <div className="faq-item" data-id="landing--card--faq-viewports">
              <h3>What are the 5 viewports?</h3>
              <p>Mobile, tablet portrait, tablet landscape, desktop, and large desktop. You can control layout, spacing, visibility, and typography independently for each viewport.</p>
            </div>

            <div className="faq-item" data-id="landing--card--faq-refunds">
              <h3>Do you offer refunds?</h3>
              <p>Yes, within 7 days of purchase. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta" data-id="landing--section--final-cta">
        <div className="container">
          <h2>Stop Renting Your Pages. Start Owning Them.</h2>
          <p>Build visually. Export clean Liquid. Keep everything &mdash; even if you cancel.</p>
          <Link href="/signup" className="cta-primary" data-id="landing--cta--start-trial-footer">
            Start Free 7-Day Trial &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f0f0f', color: '#999', padding: '40px 20px', textAlign: 'center' }} data-id="landing--section--footer">
        <p>&copy; {currentYear} Blockify Builder by Kibbster LLC. All rights reserved.</p>
        <p style={{ marginTop: '10px' }}>
          <Link href="/terms" style={{ color: '#999', textDecoration: 'none', margin: '0 15px' }} data-id="landing--link--terms">Terms</Link>
          <Link href="/privacy" style={{ color: '#999', textDecoration: 'none', margin: '0 15px' }} data-id="landing--link--privacy">Privacy</Link>
          <Link href="/support" style={{ color: '#999', textDecoration: 'none', margin: '0 15px' }} data-id="landing--link--support">Support</Link>
        </p>
      </footer>
    </>
  );
}
