import Layout from '../components/Layout'
export default function Terms() {
  return (
    <Layout title="Terms of Service - LearnFlow">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Last updated: March 17, 2026
            </p>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using LearnFlow, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use LearnFlow for personal, non-commercial educational purposes. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Creating and joining educational classes</li>
                <li>Participating in live learning sessions</li>
                <li>Accessing educational content and materials</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a user of LearnFlow, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Respect other users and maintain appropriate conduct</li>
                <li>Not share inappropriate or harmful content</li>
                <li>Use the platform for educational purposes only</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use LearnFlow for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Any unlawful purpose or activity</li>
                <li>Harassment or abuse of other users</li>
                <li>Sharing copyrighted material without permission</li>
                <li>Attempting to gain unauthorized access to the platform</li>
                <li>Commercial activities without prior approval</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
              <p className="text-gray-700">
                The information on LearnFlow is provided on an 'as is' basis. To the fullest extent permitted by law, LearnFlow excludes all representations, warranties, conditions and terms.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at: ayush.jha01@adypu.edu.in
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}