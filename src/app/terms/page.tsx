import RootLayout from "@/components/common/layout/RootLayout";
import "@/styles/legal-pages.css";

export const metadata = {
  title: "Terms of Service | Outlfy",
  description: "Terms of Service for Outlfy digital agency services",
  openGraph: {
    title: "Terms of Service | Outlfy",
    description: "Terms of Service for Outlfy digital agency services",
    url: "https://www.outlfy.com/terms",
    type: "website",
    images: [
      {
        url: "https://www.outlfy.com/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Outlfy Terms of Service"
      }
    ],
    siteName: "Outlfy"
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Outlfy",
    description: "Terms of Service for Outlfy digital agency services",
    images: ["https://www.outlfy.com/assets/og-image.jpg"]
  }
};

export default function TermsOfServicePage() {
  return (
    <main>
      <RootLayout header="header1" footer="footer1">
        <div className="container mt-5 py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article className="terms-content">
                <header className="text-center mb-5">
                  <h1 className="display-4 mb-3">Terms of Service</h1>
                  <p className="lead text-muted">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <section className="mb-5">
                  <h2>1. Agreement to Terms</h2>
                  <p>
                    By accessing and using Outlfy's services, you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not 
                    use this service.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>2. Services</h2>
                  <p>
                    Outlfy provides digital agency services including but not limited to:
                  </p>
                  <ul>
                    <li>Web development and design</li>
                    <li>Mobile application development</li>
                    <li>E-commerce solutions</li>
                    <li>Custom software development</li>
                    <li>AI/ML solutions</li>
                    <li>API integrations</li>
                    <li>UI/UX design</li>
                    <li>Technical consulting</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2>3. Payment Terms</h2>
                  <p>
                    Payment terms will be agreed upon in writing before project commencement. Standard terms include:
                  </p>
                  <ul>
                    <li>15% deposit required before project start (Negotiable)</li>
                    <li>Remaining balance due upon project completion</li>
                    <li>Late payments may incur additional fees</li>
                    <li>All prices are in USD unless otherwise specified</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2>4. Intellectual Property</h2>
                  <p>
                    Upon full payment, clients receive ownership of custom-developed code and designs created 
                    specifically for their project. Outlfy retains rights to general methodologies, techniques, 
                    and pre-existing intellectual property.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>5. Warranties and Disclaimers</h2>
                  <p>
                    Outlfy provides services "as is" without warranty of any kind. We warrant that services 
                    will be performed in a professional manner consistent with industry standards.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>6. Limitation of Liability</h2>
                  <p>
                    Outlfy's liability shall not exceed the total amount paid for the specific service that 
                    gave rise to the claim. We are not liable for any indirect, incidental, or consequential damages.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>7. Termination</h2>
                  <p>
                    Either party may terminate the agreement with written notice. Upon termination, payment 
                    for completed work is due, and each party retains their respective intellectual property rights.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>8. Privacy</h2>
                  <p>
                    Your privacy is important to us. Please review our Privacy Policy, which also governs 
                    your use of our services.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>9. Changes to Terms</h2>
                  <p>
                    Outlfy reserves the right to modify these terms at any time. Changes will be effective 
                    immediately upon posting on our website.
                  </p>
                </section>

                <section className="mb-5">
                  <h2>10. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <p>
                    <strong>Email:</strong> info@outlfy.com<br/>
                    <strong>Website:</strong> https://outlfy.com
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
