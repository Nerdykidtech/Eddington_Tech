'use client';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[8.5in] mx-auto bg-white p-8 print:p-0">
        
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-1">
            Hunter Eddington
          </h1>
          <p className="text-base font-semibold text-black mb-2">
            Identity and Access Management Engineer II
          </p>
          <p className="text-sm text-gray-800">
            White Oak, TX | hunter@eddington.tech | linkedin.com/in/hunter-e-578660371 | github.com/Nerdykidtech
          </p>
        </header>

        {/* Professional Summary */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black uppercase border-b border-black pb-1 mb-3">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-900 leading-relaxed">
            IAM Engineer with 11 years of hands-on experience in systems administration, cloud operations, 
            and identity management. Currently designing enterprise-scale identity governance workflows 
            and zero trust architectures at American Specialty Health. Track record includes reducing 
            deployment times by 40%, automating 60% of manual IT tasks, and maintaining 99.9% uptime 
            across critical systems. Strong background in Microsoft Azure, Active Directory, PowerShell 
            automation, and cross-platform infrastructure management.
          </p>
        </section>

        {/* Technical Skills */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black uppercase border-b border-black pb-1 mb-3">
            Technical Skills
          </h2>
          <div className="text-sm text-gray-900 space-y-1">
            <p><span className="font-bold">Identity and Access Management:</span> IAM, Identity Governance, Zero Trust Architecture, Azure Active Directory, Conditional Access, Privileged Access Management, Cloud Security</p>
            <p><span className="font-bold">Cloud Platforms:</span> Microsoft Azure, Azure Bicep, Azure Resource Manager, Infrastructure as Code</p>
            <p><span className="font-bold">Systems Administration:</span> Windows Server, Windows 10/11, Active Directory, Group Policy, Exchange, DNS, DHCP</p>
            <p><span className="font-bold">Scripting and Automation:</span> PowerShell, Bash, Azure Automation, automated deployment pipelines</p>
            <p><span className="font-bold">Networking:</span> TCP/IP, VPN, Firewall Management, Network Security, Router and Switch Configuration</p>
            <p><span className="font-bold">Tools:</span> SIEM, Vulnerability Management, Compliance Frameworks, Incident Response, Backup and Disaster Recovery</p>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black uppercase border-b border-black pb-1 mb-3">
            Professional Experience
          </h2>

          {/* American Specialty Health */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-black">
              American Specialty Health
              <span className="font-normal text-gray-700"> | Remote</span>
            </h3>
            <p className="text-sm italic text-gray-700 mb-2">Full-time | September 2022 – Present (5 years 1 month)</p>

            <div className="mb-3">
              <p className="text-sm font-bold text-black">Identity and Access Management Engineer II | March 2026 – Present</p>
              <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
                <li>Design and implement enterprise-scale identity governance workflows for 5,000+ user organization</li>
                <li>Architect zero trust security components and cloud automation solutions using Azure AD</li>
                <li>Develop internal security documentation and threat analysis procedures</li>
                <li>Lead cross-functional initiatives to harden cloud infrastructure across multi-provider environments</li>
              </ul>
            </div>

            <div className="mb-3">
              <p className="text-sm font-bold text-black">System Engineer I | July 2025 – March 2026</p>
              <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
                <li>Engineered system solutions supporting enterprise infrastructure with focus on scalability</li>
                <li>Automated deployment processes and system configurations using PowerShell and Azure DevOps</li>
                <li>Collaborated with security teams to implement compliance controls and audit requirements</li>
              </ul>
            </div>

            <div className="mb-3">
              <p className="text-sm font-bold text-black">System Administrator II – Cloud Operations | September 2022 – July 2025</p>
              <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
                <li>Architected and deployed scalable solutions on Microsoft Azure Cloud platform</li>
                <li>Optimized cloud infrastructure for performance and cost efficiency across 50+ virtual machines</li>
                <li>Implemented Infrastructure as Code using Azure Bicep templates, reducing deployment time by 40%</li>
                <li>Managed Azure resources including VMs, networking, storage, and security configurations</li>
                <li>Maintained 99.9% system uptime across critical business systems through proactive monitoring</li>
              </ul>
            </div>

            <div className="mb-3">
              <p className="text-sm font-bold text-black">System Administrator I | July 2021 – September 2022</p>
              <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
                <li>Administered Windows Server environments and Active Directory for 500+ endpoints</li>
                <li>Managed group policies, user accounts, and access controls across multiple domains</li>
                <li>Provided Tier 2/3 support for infrastructure issues with average resolution time under 2 hours</li>
                <li>Implemented backup and disaster recovery solutions with successful quarterly testing</li>
              </ul>
            </div>
          </div>

          {/* At Home Healthcare */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-black">
              At Home Healthcare
              <span className="font-normal text-gray-700"> | Tyler, TX</span>
            </h3>
            <p className="text-sm italic text-gray-700 mb-2">Full-time | March 2017 – August 2021 (4 years 6 months)</p>
            
            <p className="text-sm font-bold text-black">Information System Specialist II</p>
            <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
              <li>Managed and maintained enterprise systems including Windows 10 and Windows Servers</li>
              <li>Administered Active Directory, Exchange, and domain infrastructure for 200+ users</li>
              <li>Implemented Azure cloud solutions for backup and disaster recovery</li>
              <li>Developed PowerShell scripts to automate user provisioning and system maintenance</li>
              <li>Reduced manual IT tasks by 60% through automation initiatives and workflow optimization</li>
              <li>Served as primary escalation point for complex technical issues and system failures</li>
            </ul>
          </div>

          {/* Drug & Alcohol Testing */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-black">
              Drug and Alcohol Testing Compliance Services
              <span className="font-normal text-gray-700"> | Longview, TX</span>
            </h3>
            <p className="text-sm italic text-gray-700 mb-2">Full-time | February 2015 – March 2017 (2 years 2 months)</p>
            
            <p className="text-sm font-bold text-black">Computer Systems and Network Administrator</p>
            <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
              <li>Provided system and network administration for servers and infrastructure supporting 100+ employees</li>
              <li>Managed Windows Server environments and network security across three office locations</li>
              <li>Configured and maintained routers, switches, and firewalls for secure connectivity</li>
              <li>Implemented backup and disaster recovery solutions with offsite replication</li>
              <li>Ensured HIPAA compliance for sensitive data handling and regulatory requirements</li>
            </ul>
          </div>

          {/* SHATTERED ER */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-black">
              SHATTERED ER LLC
              <span className="font-normal text-gray-700"> | Longview, TX</span>
            </h3>
            <p className="text-sm italic text-gray-700 mb-2">Full-time | August 2013 – February 2015 (1 year 7 months)</p>
            
            <p className="text-sm font-bold text-black">Computer Repair Technician</p>
            <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
              <li>Resolved complex technical issues including virus removal and malware remediation</li>
              <li>Performed software and hardware installations, upgrades, and repairs for residential and business clients</li>
              <li>Managed warranty repairs and vendor relationships with Dell, HP, and Lenovo</li>
              <li>Maintained detailed service records and documentation in ticketing system</li>
              <li>Achieved 95% first-call resolution rate with high customer satisfaction ratings</li>
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black uppercase border-b border-black pb-1 mb-3">
            Projects
          </h2>

          <div className="mb-3">
            <p className="text-sm font-bold text-black">Autheris – iOS 2FA Token Manager | github.com/Nerdykidtech/Autheris</p>
            <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
              <li>Built privacy-focused TOTP generator using SwiftUI and secure enclave storage</li>
              <li>Published on App Store with zero cloud dependencies or tracking</li>
            </ul>
          </div>

          <div className="mb-3">
            <p className="text-sm font-bold text-black">Security Blog Automation Pipeline | Eddington.Tech</p>
            <ul className="text-sm text-gray-900 list-disc ml-5 space-y-1 mt-1">
              <li>Developed Python pipeline monitoring RSS feeds and auto-publishing to LinkedIn</li>
              <li>Self-hosted infrastructure with cron scheduling and duplicate detection</li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-black uppercase border-b border-black pb-1 mb-3">
            Education
          </h2>
          <ul className="text-sm text-gray-900 list-disc ml-5 space-y-2">
            <li>Self-Directed Technical Education with focus on hands-on projects and industry research</li>
            <li>Specialized training in Azure cloud services, identity management, and security frameworks</li>
            <li>Active GitHub contributor with focus on security tools and automation</li>
            <li>Regularly publish security content on IAM hardening, threat analysis, and practical security guides</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-gray-300 print:hidden">
          <div className="flex flex-wrap gap-4">
            <a
              href="/resume.pdf"
              download="Hunter_Eddington_Resume.pdf"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded"
            >
              Download PDF
            </a>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded"
            >
              Print
            </button>
          </div>
          
          <p className="text-sm text-gray-600 italic mt-4">
            References available upon request.
          </p>
        </footer>

      </div>
    </div>
  );
}
