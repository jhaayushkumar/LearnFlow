import Layout from '../components/Layout'

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy - LearnFlow">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800">1. Introduction</h2>
            <p>Welcome to LearnFlow. We value your privacy and are committed to protecting your personal data. This policy explains how we handle your information when you use our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">2. Information We Collect</h2>
            <p>When you sign in via Google, we collect your name, email address, and profile picture to create your account. If you are a Mentor, we request access to your Google Calendar to facilitate class scheduling.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">3. How We Use Google Data</h2>
            <p><strong>Google Calendar API:</strong> Our app uses the Google Calendar API solely to create and manage meeting events for your scheduled classes. We do not read your private calendar data or share your schedule with third parties.</p>
            <p><strong>Google Meet:</strong> We generate Google Meet links automatically to provide a seamless learning experience for your students.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">4. Data Security</h2>
            <p>Your authentication tokens are stored securely and are only used for the purposes you have authorized. We do not store your private calendar details on our servers beyond what is necessary for class management.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@learnflow.example.com.</p>
          </section>
        </div>
      </div>
    </Layout>
  )
}