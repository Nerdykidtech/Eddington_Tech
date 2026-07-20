'use client';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0">
      <div className="max-w-[8.5in] mx-auto bg-white dark:bg-gray-800 p-8 print:p-0 print:shadow-none print:max-w-full">
        
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-[22pt] font-semibold text-gray-900 dark:text-white mb-1 tracking-tight">
            Hunter Eddington
          </h1>
          <p className="text-[9.5pt] text-gray-600 dark:text-gray-400">
            Identity and Access Management Engineer II | White Oak, TX | hunter@eddington.tech | linkedin.com/in/hunter-e-578660371 | github.com/Nerdykidtech
          </p>
        </header>

        {/* Professional Summary */}
        <section className="mb-5">
          <h2 className="text-[11pt] font-semibold text-gray-900 dark:text-white uppercase tracking-wide border-b-2 border-gray-800 dark:border-gray-600 pb-1 mb-3">
            Professional Summary
          </h2>
          <p className="text-[10pt] text-gray-700 dark:text-gray-300 leading-relaxed">
            Identity and Access Management professional with over 11 years of progressive experience in systems 
            administration, cloud operations, and IAM engineering. Proven track record of architecting scalable cloud 
            solutions, implementing zero trust architectures, and managing enterprise identity governance. Self-directed 
            learner with expertise across Microsoft Azure, PowerShell automation, and cross-platform system management.
          </p>
        </section>

        {/* Technical Skills */}
        <section className="mb-5">
          <h2 className="text-[11pt] font-semibold text-gray-900 dark:text-white uppercase tracking-wide border-b-2 border-gray-800 dark:border-gray-600 pb-1 mb-3">
            Technical Skills
          </h2>
          <div className="text-[9.5pt] text-gray-700 dark:text-gray-300 grid grid-cols-[140px_1fr] gap-1.5 gap-x-3">
            <div className="font-semibold text-gray-900 dark:text-white">Identity &amp; Security:</div>
            <div>IAM, Identity Governance, Zero Trust Architecture, Cloud Security, Azure AD, Conditional Access, Privileged Access Management</div>
            
            <div className="font-semibold text-gray-900 dark:text-white">Cloud Platforms:</div>
            <div>Microsoft Azure, Azure Bicep, Azure Resource Manager, Cloud Infrastructure</div>
            
            <div className="font-semibold text-gray-900 dark:text-white">Systems &amp; Administration:</div>
            <div>Windows Server, Windows 10/11, Active Directory, Group Policy, Server Administration</div>
            
            <div className="font-semibold text-gray-900 dark:text-white">Scripting &amp; Automation:</div>
            <div>PowerShell, Bash, Azure Automation, Infrastructure as Code</div>
            
            <div className="font-semibold text-gray-900 dark:text-white">Networking:</div>
            <div>Network Administration, TCP/IP, VPN, Firewall Management</div>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-5">
          <h2 className="text-[11pt] font-semibold text-gray-900 dark:text-white uppercase tracking-wide border-b-2 border-gray-800 dark:border-gray-600 pb-1 mb-3">
            Professional Experience
          </h2>

          {/* American Specialty Health */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
              <h3 className="text-[11pt] font-semibold text-gray-900 dark:text-white">
                American Specialty Health
                <span className="font-normal text-gray-600 dark:text-gray-400"> | Remote</span>
              </h3>
            </div>
            <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-2">
              Full-time | September 2022 – Present (5 years 1 month)
            </div>

            <div className="mb-2">
              <h4 className="text-[10pt] font-semibold text-gray-800 dark:text-gray-200">Identity and Access Management Engineer II</h4>
              <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-1">March 2026 – Present (5 months)</div>
              <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
                <li>Design and implement enterprise-scale identity governance workflows</li>
                <li>Architect zero trust security components and cloud automation solutions</li>
                <li>Develop internal security documentation and threat analysis</li>
                <li>Lead cross-functional initiatives to harden cloud infrastructure across multi-provider environments</li>
              </ul>
            </div>

            <div className="mb-2">
              <h4 className="text-[10pt] font-semibold text-gray-800 dark:text-gray-200">System Engineer I</h4>
              <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-1">July 2025 – March 2026 (9 months)</div>
              <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
                <li>Engineered system solutions supporting enterprise infrastructure</li>
                <li>Automated deployment processes and system configurations</li>
                <li>Collaborated with security teams to implement compliance controls</li>
              </ul>
            </div>

            <div className="mb-2">
              <h4 className="text-[10pt] font-semibold text-gray-800 dark:text-gray-200">System Administrator II – Cloud Operations</h4>
              <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-1">September 2022 – July 2025 (2 years 11 months)</div>
              <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
                <li>Architected and deployed scalable solutions on Microsoft Azure Cloud platform</li>
                <li>Optimized cloud infrastructure for performance and cost efficiency</li>
                <li>Implemented Infrastructure as Code using Azure Bicep templates</li>
                <li>Managed Azure resources including VMs, networking, storage, and security configurations</li>
                <li>Reduced deployment time by 40% through automation and standardization</li>
              </ul>
            </div>

            <div className="mb-2">
              <h4 className="text-[10pt] font-semibold text-gray-800 dark:text-gray-200">System Administrator I</h4>
              <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-1">July 2021 – September 2022 (1 year 3 months)</div>
              <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
                <li>Administered Windows Server environments and Active Directory</li>
                <li>Managed group policies, user accounts, and access controls</li>
                <li>Provided Tier 2/3 support for infrastructure issues</li>
                <li>Maintained system uptime of 99.9% across critical business systems</li>
              </ul>
            </div>
          </div>

          {/* At Home Healthcare */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
              <h3 className="text-[11pt] font-semibold text-gray-900 dark:text-white">
                At Home Healthcare
                <span className="font-normal text-gray-600 dark:text-gray-400"> | Tyler, TX</span>
              </h3>
            </div>
            <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-2">
              Full-time | March 2017 – August 2021 (4 years 6 months)
            </div>
            <h4 className="text-[10pt] font-semibold text-gray-800 dark:text-gray-200">Information System Specialist – 2</h4>
            <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1 mt-1">
              <li>Managed and maintained enterprise systems including Windows 10 and Windows Servers</li>
              <li>Administered Active Directory, Exchange, and domain infrastructure</li>
              <li>Implemented Azure cloud solutions for backup and disaster recovery</li>
              <li>Developed PowerShell scripts to automate user provisioning and system maintenance</li>
              <li>Reduced manual IT tasks by 60% through automation initiatives</li>
              <li>Served as primary escalation point for complex technical issues</li>
            </ul>
          </div>

          {/* Drug & Alcohol Testing */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
              <h3 className="text-[11pt] font-semibold text-gray-900 dark:text-white">
                Drug &amp; Alcohol Testing Compliance Services
                <span className="font-normal text-gray-600 dark:text-gray-400"> | Longview, TX</span>
              </h3>
            </div>
            <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-2">
              Full-time | February 2015 – March 2017 (2 years 2 months)
            </div>
            <h4 className="text-[10pt] font-semibold text-gray-800 dark:text-gray-200">Computer Systems and Network Administrator</h4>
            <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1 mt-1">
              <li>Provided critical system and network administration for servers and infrastructure</li>
              <li>Managed Windows Server environments and network security</li>
              <li>Configured and maintained routers, switches, and firewalls</li>
              <li>Implemented backup and disaster recovery solutions</li>
              <li>Ensured HIPAA compliance for sensitive data handling</li>
            </ul>
          </div>

          {/* SHATTERED ER */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
              <h3 className="text-[11pt] font-semibold text-gray-900 dark:text-white">
                SHATTERED ER LLC
                <span className="font-normal text-gray-600 dark:text-gray-400"> | Longview, TX</span>
              </h3>
            </div>
            <div className="text-[9pt] text-gray-600 dark:text-gray-400 italic mb-2">
              Full-time | August 2013 – February 2015 (1 year 7 months)
            </div>
            <h4 className="text-[10pt] font-semibold text-gray-800 dark:text-gray-200">Computer Repair Technician</h4>
            <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1 mt-1">
              <li>Resolved complex customer issues including virus removal and malware remediation</li>
              <li>Performed software and hardware installations, upgrades, and repairs</li>
              <li>Managed warranty repairs and vendor relationships</li>
              <li>Maintained detailed service records and documentation</li>
              <li>Delivered excellent customer service with high satisfaction ratings</li>
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-5">
          <h2 className="text-[11pt] font-semibold text-gray-900 dark:text-white uppercase tracking-wide border-b-2 border-gray-800 dark:border-gray-600 pb-1 mb-3">
            Projects
          </h2>

          <div className="mb-3">
            <p className="text-[9.5pt] text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Nuvio</strong> – Streaming channel for Roku and Android Automotive app
            </p>
            <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
              <li>Built complete streaming solution from scratch using SceneGraph architecture</li>
              <li>Implemented QR authentication system for seamless user onboarding</li>
              <li>Optimized launch time to under 2.5 seconds through performance profiling</li>
              <li>Developed Android Automotive variant meeting in-vehicle distribution requirements</li>
            </ul>
          </div>

          <div className="mb-3">
            <p className="text-[9.5pt] text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Autheris</strong> – iOS 2FA Token Manager (Open Source)
            </p>
            <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
              <li>SwiftUI-based privacy-focused TOTP generator using secure enclave storage</li>
              <li>Published on App Store with zero cloud dependencies or tracking</li>
              <li><a href="https://github.com/Nerdykidtech/Autheris" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">→ github.com/Nerdykidtech/Autheris</a></li>
            </ul>
          </div>

          <div className="mb-3">
            <p className="text-[9.5pt] text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Security Blog Automation Pipeline</strong> – Automated content system
            </p>
            <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
              <li>Python pipeline monitoring RSS feeds and publishing to LinkedIn</li>
              <li>Self-hosted infrastructure with cron scheduling and duplicate detection</li>
              <li><a href="https://Eddington.Tech" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">→ Eddington.Tech (live site)</a></li>
            </ul>
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="mb-5">
          <h2 className="text-[11pt] font-semibold text-gray-900 dark:text-white uppercase tracking-wide border-b-2 border-gray-800 dark:border-gray-600 pb-1 mb-3">
            Education &amp; Certifications
          </h2>
          
          <p className="text-[9.5pt] font-semibold text-gray-900 dark:text-white mb-1">Self-Directed Technical Education</p>
          <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1 mb-3">
            <li>Continuous professional development through hands-on projects and industry research</li>
            <li>Specialized training in Azure cloud services, identity management, and security frameworks</li>
          </ul>
          
          <p className="text-[9.5pt] font-semibold text-gray-900 dark:text-white mb-1">Technical Certifications (In Progress)</p>
          <ul className="text-[9.5pt] text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
            <li>Microsoft Azure Administrator (AZ-104) – Target: Q3 2026</li>
            <li>CompTIA Security+ – Target: Q4 2026</li>
          </ul>
        </section>

        {/* Professional Development */}
        <section className="mb-5">
          <h2 className="text-[11pt] font-semibold text-gray-900 dark:text-white uppercase tracking-wide border-b-2 border-gray-800 dark:border-gray-600 pb-1 mb-3">
            Professional Development
          </h2>
          
          <p className="text-[9.5pt] text-gray-700 dark:text-gray-300 mb-2">
            <strong className="text-gray-900 dark:text-white">Regular Contributor</strong> – Publish security content on IAM hardening, threat analysis, and practical security guides including topics on BitLocker bypasses, AI-driven social engineering, and zero trust implementation.
          </p>
          
          <p className="text-[9.5pt] text-gray-700 dark:text-gray-300">
            <strong className="text-gray-900 dark:text-white">Open Source Contributions</strong> – Active GitHub presence with focus on security tools and automation.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 print:hidden">
          <div className="flex flex-wrap gap-4">
            <a
              href="/resume.pdf"
              download="Hunter_Eddington_Resume.pdf"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Download PDF
            </a>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Print
            </button>
          </div>
          
          <p className="text-[9pt] text-gray-600 dark:text-gray-400 italic mt-4">
            References available upon request. Open to discussing IAM architecture, cloud security, and infrastructure engineering opportunities.
          </p>
        </footer>

      </div>
    </div>
  );
}
