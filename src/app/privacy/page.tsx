'use client';

import { Shield, Eye, Lock, Users, FileText, Clock, Mail, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="space-y-8">
          {/* GDPR Compliance Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">GDPR Compliance</h2>
                <p className="text-blue-800 text-sm">
                  This privacy policy complies with the General Data Protection Regulation (GDPR) and other applicable 
                  data protection laws. As a user, you have specific rights regarding your personal data, which are 
                  outlined in this policy.
                </p>
              </div>
            </div>
          </div>

          {/* Data Controller */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Users className="w-6 h-6 text-green-600" />
              <span>Data Controller</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The data controller for this website is JW, the creator and maintainer of Sayola. 
                You can contact the data controller at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">Email: <a href="mailto:jwlinking@gmail.com" className="text-green-600 hover:text-green-700">jwlinking@gmail.com</a></p>
                <p>Location: Lisbon, Portugal</p>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <span>Information We Collect</span>
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Browser type and version</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Operating system</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>IP address (anonymized)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Pages visited and time spent on site</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Referring website</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Local Storage Data</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>Learning progress and preferences</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>Saved words and collections</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>User interface preferences</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>Search history (stored locally only)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-3 bg-green-50 p-3 rounded">
                  <strong>Note:</strong> This data is stored locally in your browser and is not transmitted to our servers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Information You Provide</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span>Contact form submissions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span>Email communications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span>Feedback and error reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <FileText className="w-6 h-6 text-purple-600" />
              <span>How We Use Your Information</span>
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Legitimate Interests (GDPR Article 6(1)(f))</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Improve website functionality and user experience</li>
                  <li>• Analyze usage patterns to enhance learning features</li>
                  <li>• Ensure website security and prevent abuse</li>
                  <li>• Provide technical support and respond to inquiries</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Consent (GDPR Article 6(1)(a))</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Send responses to your contact form submissions</li>
                  <li>• Provide updates about significant website changes (if requested)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Sharing and Third Parties */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Lock className="w-6 h-6 text-red-600" />
              <span>Data Sharing and Third Parties</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 mb-2">We do not sell, trade, or rent your personal information to third parties.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limited Third-Party Services</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                    <span>Web hosting services (for website operation)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                    <span>Analytics services (anonymized data only)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                    <span>Email services (for responding to contact forms)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  These services are bound by strict data processing agreements and only process data necessary for their specific function.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights Under GDPR */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-600" />
              <span>Your Rights Under GDPR</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Access</h3>
                  <p className="text-sm text-gray-600">Request a copy of the personal data we hold about you.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Rectification</h3>
                  <p className="text-sm text-gray-600">Request correction of inaccurate or incomplete data.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Erasure</h3>
                  <p className="text-sm text-gray-600">Request deletion of your personal data ("right to be forgotten").</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Restrict Processing</h3>
                  <p className="text-sm text-gray-600">Request limitation of how we process your data.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Data Portability</h3>
                  <p className="text-sm text-gray-600">Request transfer of your data to another service provider.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Object</h3>
                  <p className="text-sm text-gray-600">Object to processing based on legitimate interests.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Withdraw Consent</h3>
                  <p className="text-sm text-gray-600">Withdraw consent for data processing at any time.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Lodge a Complaint</h3>
                  <p className="text-sm text-gray-600">File a complaint with your local data protection authority.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>To exercise any of these rights,</strong> please contact us at 
                <a href="mailto:jwlinking@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium"> jwlinking@gmail.com</a>. 
                We will respond to your request within 30 days as required by GDPR.
              </p>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Clock className="w-6 h-6 text-orange-600" />
              <span>Data Retention</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Local Storage Data</h3>
                  <p className="text-sm text-gray-600">
                    Stored indefinitely in your browser until you clear it manually or uninstall the browser.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Form Data</h3>
                  <p className="text-sm text-gray-600">
                    Retained for up to 2 years for support purposes, then automatically deleted.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Data</h3>
                  <p className="text-sm text-gray-600">
                    Anonymized usage data retained for up to 26 months for improvement purposes.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Email Communications</h3>
                  <p className="text-sm text-gray-600">
                    Retained as long as necessary for ongoing communication or support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Measures */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Lock className="w-6 h-6 text-green-600" />
              <span>Security Measures</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We implement appropriate technical and organizational measures to protect your personal data:</p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>HTTPS encryption for all data transmission</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Regular security updates and monitoring</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Limited access to personal data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Secure hosting infrastructure</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Regular data backups with encryption</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cookies and Tracking */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <span>Cookies and Tracking</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Essential Cookies</h3>
                  <p className="text-sm text-green-800">
                    Required for basic website functionality. These cannot be disabled.
                  </p>
                </div>
                
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-blue-800">
                    Help us understand how visitors use our site. Data is anonymized.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> We do not use advertising cookies or tracking pixels. 
                  You can manage cookie preferences in your browser settings.
                </p>
              </div>
            </div>
          </div>

          {/* International Data Transfers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <span>International Data Transfers</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Some of our service providers may be located outside the European Economic Area (EEA). 
                When we transfer your personal data outside the EEA, we ensure appropriate safeguards are in place:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span>Adequacy decisions by the European Commission</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span>Standard Contractual Clauses (SCCs)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span>Binding Corporate Rules where applicable</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Mail className="w-6 h-6 text-green-600" />
              <span>Contact Information</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights, 
                please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><strong>Email:</strong> <a href="mailto:jwlinking@gmail.com" className="text-green-600 hover:text-green-700">jwlinking@gmail.com</a></p>
                <p><strong>Response Time:</strong> Within 30 days as required by GDPR</p>
                <p><strong>Data Protection Officer:</strong> JW (same contact information)</p>
              </div>
            </div>
          </div>

          {/* Changes to This Policy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <FileText className="w-6 h-6 text-purple-600" />
              <span>Changes to This Policy</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Notification of Changes:</strong> We will notify users of any material changes 
                  by updating the "Last updated" date at the top of this policy. For significant changes 
                  affecting your rights, we may provide additional notice through the website or email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}