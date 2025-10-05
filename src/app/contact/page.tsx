'use client';

import { Mail, MessageCircle, Globe, Clock, Heart } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions, suggestions, or found an error? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <Mail className="w-6 h-6 text-green-600" />
                <span>Get in Touch</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-2">
                      For questions, feedback, or error reports, contact me via email:
                    </p>
                    <a 
                      href="mailto:jwlinking@gmail.com" 
                      className="text-green-600 hover:text-green-700 font-medium text-lg"
                    >
                      jwlinking@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
                    <p className="text-gray-600">
                      I typically respond within 24-48 hours. Please be patient as this is a personal project 
                      maintained alongside my own Portuguese learning journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600">
                      Based in Lisbon, Portugal (GMT+1/GMT+2 during daylight saving time)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Contact About */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <span>What to Contact About</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Errors in word definitions or translations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Technical issues or bugs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Suggestions for new features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Feedback on learning methodology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Questions about Portuguese language learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Collaboration opportunities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Community Note */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <Heart className="w-6 h-6 text-red-500" />
                <span>Community & Learning</span>
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Sayola is more than just a learning platform—it's a community of Portuguese language enthusiasts. 
                  As a fellow learner, I understand the challenges you face and am always eager to help where I can.
                </p>
                
                <p>
                  Whether you're struggling with a particular grammar concept, need clarification on European vs. 
                  Brazilian Portuguese differences, or want to share your learning journey, don't hesitate to reach out.
                </p>
                
                <p className="font-medium text-green-700">
                  Together, we can make Portuguese learning more accessible and enjoyable for everyone!
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is Sayola free to use?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes! Sayola is completely free and open for all Portuguese learners. This is a passion project 
                    created to help the learning community.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I contribute to the project?</h3>
                  <p className="text-gray-600 text-sm">
                    Absolutely! I welcome contributions, whether it's reporting errors, suggesting improvements, 
                    or helping with content. Contact me to discuss how you can get involved.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Why focus on European Portuguese?</h3>
                  <p className="text-gray-600 text-sm">
                    Living in Portugal, I've experienced firsthand the lack of quality resources for European Portuguese. 
                    This platform aims to fill that gap while respecting the unique characteristics of the European variant.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How accurate is the content?</h3>
                  <p className="text-gray-600 text-sm">
                    I strive for accuracy but acknowledge that as a learner myself, errors may occur. 
                    This is why community feedback is so valuable—please report any mistakes you find!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}