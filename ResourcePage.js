// src/pages/ResourcePage.js

import React, { useEffect } from 'react';
import '../styles/ResourcePage.css';

function ResourcePage() {
  useEffect(() => {
    document.title = 'Resources - Harassment Reporting System';
  }, []);

  return (
    <div className="resource-container">
      <h1>Resources and Support</h1>

      {/* Understanding Harassment */}
      <section>
        <h2>Understanding Harassment and Misconduct</h2>
        <p>
          Harassment takes many forms—verbal, physical, and online. It's any unwanted behavior that makes someone feel intimidated, degraded, or humiliated.
        </p>
        <p>
          <strong>Types of Harassment Include:</strong>
        </p>
        <ul>
          <li>Verbal Abuse</li>
          <li>Physical Acts</li>
          <li>Cyberbullying</li>
          <li>Discrimination</li>
        </ul>
      </section>

      {/* Reporting Process Overview */}
      <section>
        <h2>Reporting Process Overview</h2>
        <p>Our reporting process is designed to be confidential and straightforward.</p>
        {/* ASCII Flowchart */}
        <pre className="flowchart">
{`[Start] --> [Experience Incident] --> [Decide to Report] --> [Submit Report]
     |                                           |
 [Seek Support]                              [Receive Confirmation]
     |                                           |
 [Access Resources] <-- [Follow-Up Communication] <-- [Investigation Begins]`}
        </pre>
      </section>

      {/* Support Services */}
      <section>
        <h2>Support Services</h2>
        <p>If you need someone to talk to, the following services are available:</p>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Counseling Center</td>
              <td><a href="tel:+1234567890">+1 (234) 567-890</a></td>
            </tr>
            <tr>
              <td>Campus Security</td>
              <td><a href="tel:+1987654321">+1 (987) 654-321</a></td>
            </tr>
            <tr>
              <td>Harassment Hotline</td>
              <td><a href="tel:+1123456789">+1 (123) 456-789</a></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Policies and Legal Information */}
      <section>
        <h2>Policies and Legal Information</h2>
        <p>
          Familiarize yourself with our <a href="/policies/conduct">Code of Conduct</a> and <a href="/policies/harassment">Anti-Harassment Policies</a>.
        </p>
        <p>
          Understanding your rights is crucial. Visit our <a href="/legal/rights">Legal Rights</a> page for more information.
        </p>
      </section>

      {/* FAQs */}
      <section>
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>Will my report remain anonymous?</summary>
          <p>Yes, all reports can be submitted anonymously if you choose.</p>
        </details>
        <details>
          <summary>What happens after I submit a report?</summary>
          <p>Our team will review your report and begin a confidential investigation.</p>
        </details> 
      </section>

      {/* Contact Information */}
      <section>
        <h2>Contact Information</h2>
        <p>
          If you have any questions or need further assistance, please reach out to:
        </p>
        <ul>
          <li>Email: <a href="mailto:support@harassmentreporting.com">support@harassmentreporting.com</a></li>
          <li>Phone: <a href="tel:+9988545345">+1 (012) 345-6789</a></li>
          <li>Office: Room 101, Main Building</li>
        </ul>
      </section>

    </div>
  );
}

export default ResourcePage;
