import RootLayout from "@/components/common/layout/RootLayout";
import "@/styles/legal-pages.css";

export const metadata = {
  title: "Privacy Policy | Outlfy",
  description: "Privacy Policy for Outlfy digital agency services",
  openGraph: {
    title: "Privacy Policy | Outlfy",
    description: "Privacy Policy for Outlfy digital agency services",
    url: "https://www.outlfy.com/privacy",
    type: "website",
    images: [
      {
        url: "https://www.outlfy.com/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Outlfy Privacy Policy"
      }
    ],
    siteName: "Outlfy"
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Outlfy",
    description: "Privacy Policy for Outlfy digital agency services",
    images: ["https://www.outlfy.com/assets/og-image.jpg"]
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <RootLayout header="header1" footer="footer1">
        <div className="container mt-5 py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article className="privacy-content">
                <header className="text-center mb-5">
                  <h1 className="display-4 mb-3">Privacy Policy</h1>
                  <p className="lead text-muted">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <section className="mb-5">
                  <h2>1. Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as when you:
                  </p>
                  <ul>
                    <li>Fill out contact forms on our website</li>
                    <li>Request a quote or consultation</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Communicate with us via email or phone</li>
                  </ul>
                  <p>
                    This may include your name, email address, phone number, company information, 
                    and project requirements.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>2. How We Use Your Information</h2>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Monitor and analyze trends and usage</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2>3. Information Sharing</h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    except in the following circumstances:
                  </p>
                  <ul>
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and property</li>
                    <li>With trusted service providers who assist us in operating our website</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2>4. Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction. However, no method of 
                    transmission over the internet is 100% secure.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>5. Cookies and Tracking</h2>
                  <p>
                    Our website may use cookies and similar tracking technologies to enhance your experience. 
                    You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>6. Third-Party Services</h2>
                  <p>
                    Our website may contain links to third-party websites or services. We are not responsible 
                    for the privacy practices of these external sites.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>7. Data Retention</h2>
                  <p>
                    We retain your personal information for as long as necessary to fulfill the purposes 
                    outlined in this privacy policy, unless a longer retention period is required by law.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>8. Your Rights</h2>
                  <p>
                    Depending on your location, you may have the right to:
                  </p>
                  <ul>
                    <li>Access your personal information</li>
                    <li>Update or correct your information</li>
                    <li>Delete your personal information</li>
                    <li>Object to processing of your information</li>
                    <li>Request data portability</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2>9. Children's Privacy</h2>
                  <p>
                    Our services are not directed to children under 13. We do not knowingly collect 
                    personal information from children under 13.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>10. Changes to This Policy</h2>
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any 
                    changes by posting the new policy on this page.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>11. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <p>
                    <strong>Email:</strong> privacy@outlfy.com<br/>
                    <strong>Website:</strong> https://outlfy.com<br/>
                  </p>
                </section>
              </article>
            </div>
          </div>
        </div>
      </RootLayout>
    </main>
  );
}
