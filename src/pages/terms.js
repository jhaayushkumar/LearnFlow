import Layout from '../components/Layout'

export default function TermsOfService() {
  return (
    <Layout title="Terms of Service - LearnFlow">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">Terms of Service</h1>
        
        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
            <p>By accessing or using LearnFlow, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">2. User Roles</h2>
            <p>Users can register as Mentors or Learners. Mentors are responsible for the content and scheduling of their classes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">3. Google Integration</h2>
            <p>Our service integrates with Google APIs. Your use of these features is subject to Google's own terms and conditions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">4. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate our community guidelines or mis-use the platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">5. Limitation of Liability</h2>
            <p>LearnFlow is provided "as is" without any warranties. We are not responsible for any technical issues arising from Google services.</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}