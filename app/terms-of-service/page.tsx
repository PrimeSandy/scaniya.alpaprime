import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Scaniya, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Scaniya is a platform for generating, customizing, and managing dynamic QR codes. We reserve the right to modify or discontinue the service at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. User Conduct</h2>
            <p className="mb-4">
              You agree not to use Scaniya to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Create or distribute QR codes linking to malicious, illegal, or harmful content.</li>
              <li>Impersonate any person or entity.</li>
              <li>Interfere with or disrupt the service or servers connected to the service.</li>
            </ul>
            <p className="text-sm text-red-500 mt-2">
              Violation of these rules may result in immediate account termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              All content provided by Scaniya (excluding user-generated QR content) is the intellectual property of Scaniya. You retain ownership over the destination URLs and content you provide for your dynamic QR codes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              Scaniya shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Contact Information</h2>
            <p className="mb-4">
              For any questions regarding these Terms, please contact us at: <a href="mailto:alphaprime.co.in@gmail.com" className="text-primary hover:underline">alphaprime.co.in@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
