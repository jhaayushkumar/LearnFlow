import Layout from '../components/Layout'

export default function Privacy() {
  return (
    <Layout title="Privacy Policy - LearnFlow">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Last updated: March 17, 2026
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                LearnFlow collects minimal information to provide our educational platform service:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Email address and name from Google authentication</li>
                <li>Profile picture from your Google account</li>
                <li>Class enrollment and attendance data</li>
                <li>Classes you create or join on our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide access to our learning platform</li>
                <li>Display your enrolled classes and schedule</li>
                <li>Facilitate communication between mentors and learners</li>
                <li>Send notifications about your classes</li>
                <li>Improve our platform and user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Security</h2>
              <p className="text-gray-700 mb-4">
                We are committed to protecting your privacy:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We do not sell or share your personal information with third parties</li>
                <li>Your data is stored securely using industry-standard practices</li>
                <li>We only share necessary information with Google Calendar for class scheduling</li>
                <li>Class information is only visible to enrolled participants</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access your personal data</li>
                <li>Request deletion of your account and data</li>
                <li>Withdraw consent for data processing</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> ayush.jha01@adypu.edu.in<br/>
                <strong>Platform:</strong> LearnFlow Educational Platform
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}