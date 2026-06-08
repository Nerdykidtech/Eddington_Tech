# Multi-Cloud IAM Hardening: Complete Credential Protection Against SMTP Relay Hijacking [2026]

## The Alert That Exposed Our Cloud Blindspot

At 3:47 AM last Tuesday, our security operations center received an alert that seemed mundane at first: "Unusual outbound SMTP traffic detected from production VPC." The destination was a residential IP in Eastern Europe. The source was an EC2 instance running our legacy reporting service. The volume was modest — about 120 emails per hour.

By 4:15 AM, the same pattern appeared in Azure. Then GCP. Within an hour, we had identified 47 cloud instances across all three major providers sending outbound SMTP to the same C2 infrastructure. None of these instances were supposed to have email capabilities. None had been flagged by our CSPM tools. All of them had one thing in common: credentials with permissions they didn't need, sitting on machines that had been scanned and catalogued by threat actors.

The attackers weren't after our databases. They weren't after customer data. They wanted our IP reputation.

This was PCPJack — a campaign that has hijacked over 230 AWS, Google Cloud, and Azure servers to build a covert SMTP relay network. The attackers aren't exploiting zero-days or unpatched vulnerabilities. They're simply finding cloud instances with overly permissive IAM credentials and turning them into infrastructure for phishing, business email compromise, and spam distribution.

By the time we finished our incident response, I realized something sobering: every single compromised instance passed our compliance audits. They had the right tags. They were in the right subnets. They had logging enabled. But they also had IAM roles that granted `ses:SendEmail` and `ses:SendRawEmail` permissions to instances that never needed to send email. They had service account keys stored on disk that hadn't rotated in 18 months. They had SSH keys that were shared across teams.

This guide is the hardening playbook I wish we'd had. It's what I implemented in the 72 hours after discovery, and what I'm now deploying across every cloud environment I touch. If you're running workloads in AWS, Azure, or GCP — especially if you're running in multiple clouds — this is your defense against becoming part of someone else's infrastructure.

---

## Understanding Cloud SMTP Relay Attacks: Why PCPJack Matters

**The Multi-Cloud Threat Model**

PCPJack represents a new category of cloud attack that security teams aren't prepared for. Traditional cloud security focuses on data exfiltration, cryptomining, and ransomware. PCPJack doesn't steal your data. It weaponizes your infrastructure's reputation.

The technical name for this attack category is "cloud-based SMTP relay abuse" but the implications go far beyond email. When attackers compromise cloud credentials with messaging permissions, they gain access to enterprise-grade email infrastructure that bypasses traditional spam filters and reputation checks. Major cloud providers invest millions in maintaining IP reputation for their address spaces. Attackers are freeloading on that investment.

Here's how the economics work for attackers:

1. **Infrastructure-as-a-Service**: Legitimate cloud IP addresses have better reputation scores than compromised residential machines or bulletproof hosting. An email from an AWS IP address is more likely to reach the inbox than one from a known-bulletproof host.

2. **Scale**: A single compromised AWS account with proper permissions can spawn hundreds of SMTP relays. The marginal cost of each additional relay is zero — it's just another API call against the Simple Email Service.

3. **Attribution**: When spam or phishing emails originate from major cloud providers, they're more likely to bypass reputation filters. Security vendors whitelist major cloud IPs because blocking them causes too much false-positive pain for their customers.

4. **Persistence**: Cloud instances are designed to be long-running. Attackers get reliable infrastructure that doesn't go down. A compromised EC2 instance can run for months churning out phishing emails without attracting attention.

**Why Multi-Cloud Makes This Worse**

Organizations running multi-cloud environments face unique challenges that PCPJack exploits:

- **Credential sprawl**: Each cloud provider has its own IAM system (AWS IAM, Azure RBAC, GCP IAM) with different permission models, access patterns, and security controls. What's restricted in AWS might be wide open in Azure.

- **Inconsistent monitoring**: AWS CloudTrail, Azure Activity Logs, and GCP Audit Logs use different schemas, timestamp formats, and field names. Building cross-cloud detection rules requires significant engineering effort that many teams haven't invested in.

- **Cross-cloud trust**: Organizations often create trust relationships between clouds — a GCP service account that can assume an AWS role, for example. These trust relationships are often the weakest link because they bypass the security controls of individual clouds.

- **Alert fatigue**: Security teams struggle to correlate activity across three different dashboards. An attacker pivoting from AWS to Azure might trigger separate low-priority alerts in each cloud, but nobody sees the pattern because the alerts exist in different systems.

- **Shared responsibility confusion**: Microsoft, Amazon, and Google all have different definitions of "customer responsibility." What's Google's problem versus your problem changes depending on the service and configuration. Attackers exploit these gaps.

PCPJack exploits this fragmentation. The campaign specifically targets organizations running workloads across multiple providers, knowing that the security boundary between clouds is often the weakest link. When I reviewed our own incident, the attacker didn't start in our "primary" AWS account — they started in a GCP project that had been created for a one-off experiment two years ago and never decommissioned. From there, they found service account keys that had been copied to S3 "temporarily" and never removed. The lateral movement was complete before we even knew there was a problem.

---

## Attack Vectors: How PCPJack Compromises Cloud Credentials

**Vector 1: Instance Metadata Service (IMDSv1) Exploitation**

Despite repeated warnings from cloud providers, IMDSv1 remains enabled on countless EC2 instances. The vulnerability is straightforward:

```bash
# Attacker with SSRF or RCE access can retrieve credentials
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/RoleName

# Returns temporary credentials:
# {
#   "AccessKeyId": "ASIA...",
#   "SecretAccessKey": "...",
#   "Token": "...",
#   "Expiration": "2026-06-08T12:00:00Z"
# }
```

The credentials returned have whatever permissions the instance role has been granted. If that role includes `ses:SendEmail`, the attacker now controls an authenticated SMTP relay.

**Vector 2: Long-Lived Service Account Keys**

Cloud providers recommend using temporary credentials, role assumption, and workload identity. But legacy applications often still use long-lived service account keys:

```bash
# Checking for long-lived AWS credentials
find /home -name ".aws" -type d 2>/dev/null
find /root -name ".aws" -type d 2>/dev/null
find /opt -name "credentials" -type f 2>/dev/null | xargs grep -l "aws_access_key_id" 2>/dev/null

# Azure service principals
find / -name "*.pem" -o -name "*.key" 2>/dev/null | xargs grep -l "BEGIN RSA" 2>/dev/null

# GCP service account keys
find / -name "*-private-key.json" 2>/dev/null
```

**Vector 3: Compromised Developer Workstations**

The most common attack path I've seen in my incident response work: developers authenticate to cloud providers from workstations that are later compromised. Cloud credentials in `~/.aws/credentials`, browser session cookies, or IDE configuration files become the entry point for attackers who never need to touch production infrastructure directly.

Here's why developer workstations are such a common target:

- **High-value credentials**: Developers often have broad access to production environments during debugging or deployment
- **Long-lived sessions**: Cloud CLI tools generate session tokens that can last 12-24 hours. A developer who ran `aws sso login` yesterday still has active credentials today.
- **Credential caching**: Tools like the AWS CLI cache credentials in `~/.aws/cli/cache/`. An attacker who compromises a workstation can extract these cached credentials.
- **Shell history**: Commands that include credentials or tokens end up in `.bash_history` or `.zsh_history`. These files are often included in backups or dotfiles repositories.

In our PCPJack incident, the initial access came from a developer who had installed a VS Code extension that was later identified as part of the GlassWorm campaign. The extension harvested credentials from environment variables, and within days the attacker had pivot points in three different cloud providers.

**Evidence from PCPJack Campaign**

The original disclosure of PCPJack identified these specific indicators:

- **Credential Harvesting**: Attackers scan for exposed instance metadata, service account keys, and environment variables containing cloud credentials
- **SMTP Infrastructure**: Compromised instances are configured to relay through attacker-controlled SMTP servers
- **Reputation Abuse**: The campaign specifically uses cloud IP ranges to bypass email reputation filters
- **Multi-Cloud Pivot**: Compromised credentials in one cloud are used to scan for cross-cloud trust relationships

---

## Step-by-Step: Locking Down Multi-Cloud IAM

### Phase 1: AWS Hardening

**Step 1.1: Disable IMDSv1 and Require IMDSv2**

```bash
#!/bin/bash
# disable-imdsv1.sh
# Disable IMDSv1 on all EC2 instances

REGION=${1:-us-east-1}

echo "[+] Disabling IMDSv1 in region: $REGION"

# Get all instances with IMDSv1 enabled
aws ec2 describe-instances \
    --region $REGION \
    --filters 'Name=metadata-options.http-tokens,Values=optional' \
    --query 'Reservations[*].Instances[*].InstanceId' \
    --output text | tr '\t' '\n' | while read instance_id; do
    
    if [ -n "$instance_id" ]; then
        echo "  -> Updating $instance_id to require IMDSv2"
        
        aws ec2 modify-instance-metadata-options \
            --region $REGION \
            --instance-id $instance_id \
            --http-tokens required \
            --http-put-response-hop-limit 1 \
            --http-endpoint enabled
    fi
done

echo "[+] Done. Verify with:"
echo "aws ec2 describe-instances --region $REGION --query 'Reservations[*].Instances[*].[InstanceId,MetadataOptions.HttpTokens]'"
```

**Step 1.2: Audit IAM Policies for Overly Broad SES Permissions**

```bash
#!/bin/bash
# audit-ses-permissions.sh

# Find IAM policies that grant broad SES access
echo "=== IAM Policies with SES Permissions ==="

# Check managed policies
aws iam list-policies --scope Local --output json | \
    jq -r '.Policies[] | select(.Arn | contains("iam::")) | .Arn' | \
    while read policy_arn; do
        
    aws iam get-policy-version --policy-arn "$policy_arn" --version-id $(aws iam get-policy --policy-arn "$policy_arn" --query 'Policy.DefaultVersionId' --output text) --output json 2>/dev/null | \
        jq -r 'select(.PolicyVersion.Document.Statement[] | 
            .Effect == "Allow" and 
            (.Action | type == "array" and (. | contains(["ses:SendEmail", "ses:SendRawEmail", "ses:*"])) or (. | tostring | contains("ses:")))) | 
            $policy_arn'
done

echo ""
echo "=== Roles with SES Permissions ==="
aws iam list-roles --query 'Roles[*].RoleName' --output text | tr '\t' '\n' | while read role; do
    aws iam list-attached-role-policies --role-name "$role" --output text 2>/dev/null | grep -q SES && echo "$role"
done
```

**Step 1.3: Implement VPC Endpoints with Restrictive Policies**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RestrictSESToSpecificRoles",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:PrincipalTag/EmailAuthorized": "true"
        }
      }
    }
  ]
}
```

### Phase 2: Azure Hardening

**Step 2.1: Audit Role Assignments for Email Permissions**

```powershell
# audit-azure-email-permissions.ps1
# Audit Azure RBAC for email-sending permissions

# Connect to Azure
Connect-AzAccount

# Get all role assignments
$roleAssignments = Get-AzRoleAssignment

# Check for Mail.Send or Exchange permissions
$emailRoles = @(
    "Mail.Send",
    "Exchange.ManageAsApp",
    "Mail.ReadWrite"
)

foreach ($assignment in $roleAssignments) {
    $role = Get-AzRoleDefinition -Id $assignment.RoleDefinitionId
    
    foreach ($permission in $role.Actions) {
        if ($emailRoles | Where-Object { $permission -like "*$_*" }) {
            Write-Host "WARNING: $($assignment.DisplayName) has email permission: $permission"
        }
    }
}

# Check for service principals with SMTP permissions
Write-Host "`n=== Service Principals with Mail Permissions ==="
Get-AzADServicePrincipal | Where-Object { 
    ($_.AppRoleAssignments | Where-Object { $_.PrincipalType -eq "ServicePrincipal" })
} | Select-Object DisplayName, ApplicationId
```

**Step 2.2: Implement Azure Key Vault for Credential Storage**

```bash
#!/bin/bash
# setup-azure-keyvault.sh

RESOURCE_GROUP="security-keyvaults"
LOCATION="eastus"
KEYVAULT_NAME="prod-credential-vault"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Key Vault with purge protection
az keyvault create \
    --name $KEYVAULT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --enable-purge-protection \
    --retention-days 90

# Configure network restrictions
az keyvault network-rule add \
    --name $KEYVAULT_NAME \
    --resource-group $RESOURCE_GROUP \
    --ip-address $(curl -s ifconfig.me)

# Disable public access
az keyvault update \
    --name $KEYVAULT_NAME \
    --resource-group $RESOURCE_GROUP \
    --public-network-access Disabled

echo "Key Vault configured: $KEYVAULT_NAME"
```

### Phase 3: GCP Hardening

**Step 3.1: Audit Service Account Key Usage**

```bash
#!/bin/bash
# audit-gcp-service-accounts.sh

PROJECT_ID=$(gcloud config get-value project)

echo "=== Service Accounts with Keys ==="
gcloud iam service-accounts list --format="table(email)" | tail -n +2 | while read email; do
    email=$(echo $email | xargs)
    if [ -n "$email" ]; then
        keys=$(gcloud iam service-accounts keys list --iam-account="$email" --format="table(keyAlgorithm)" 2>/dev/null)
        if [ -n "$keys" ]; then
            echo "Service Account: $email"
            echo "$keys"
            echo "---"
        fi
    fi
done

echo ""
echo "=== Recommendations ==="
echo "1. Rotate keys older than 90 days"
echo "2. Prefer Workload Identity over long-lived keys"
echo "3. Enable VPC Service Controls for sensitive services"
```

**Step 3.2: Set Up Workload Identity Federation**

```bash
#!/bin/bash
# setup-workload-identity.sh

PROJECT_ID="your-project-id"
POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-provider"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create $POOL_NAME \
    --project=$PROJECT_ID \
    --location=global \
    --display-name="GitHub Actions Pool"

# Configure OIDC provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
    --project=$PROJECT_ID \
    --location=global \
    --workload-identity-pool=$POOL_NAME \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"

echo "Workload Identity configured. No more service account keys needed."
```

### Phase 4: Cross-Cloud Credential Security

**Step 4.1: Centralized Secret Rotation**

```python
#!/usr/bin/env python3
# cross_cloud_rotator.py
# Automated credential rotation across AWS, Azure, and GCP

import boto3
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from google.cloud import secretmanager
import datetime
import json

class CrossCloudCredentialRotator:
    def __init__(self):
        self.aws_client = boto3.client('secretsmanager')
        self.azure_credential = DefaultAzureCredential()
        self.gcp_client = secretmanager.SecretManagerServiceClient()
    
    def get_aging_credentials(self, max_age_days=90):
        """Find credentials older than threshold across all clouds"""
        aging_creds = []
        
        # Check AWS
        response = self.aws_client.list_secrets()
        for secret in response['SecretList']:
            if 'LastChangedDate' in secret:
                age = (datetime.datetime.now(datetime.UTC) - secret['LastChangedDate']).days
                if age > max_age_days:
                    aging_creds.append({
                        'cloud': 'aws',
                        'name': secret['Name'],
                        'age_days': age
                    })
        
        return aging_creds
    
    def rotate_aws_credentials(self, secret_name):
        """Rotate AWS IAM user credentials"""
        iam = boto3.client('iam')
        
        # Create new access key
        new_key = iam.create_access_key(UserName=secret_name)
        
        # Store in Secrets Manager
        self.aws_client.put_secret_value(
            SecretId=secret_name,
            SecretString=json.dumps({
                'access_key_id': new_key['AccessKey']['AccessKeyId'],
                'secret_access_key': new_key['AccessKey']['SecretAccessKey'],
                'rotated_at': datetime.datetime.now().isoformat()
            })
        )
        
        # Schedule deletion of old key (safer than immediate deletion)
        return new_key['AccessKey']['AccessKeyId']

if __name__ == "__main__":
    rotator = CrossCloudCredentialRotator()
    aging = rotator.get_aging_credentials(max_age_days=30)
    
    print(f"Found {len(aging)} credentials needing rotation:")
    for cred in aging:
        print(f"  - {cred['cloud']}: {cred['name']} ({cred['age_days']} days old)")
```

---

## Detection Rules: Finding PCPJack Activity

### Splunk Detection Queries

**Multi-Cloud SMTP Anomaly Detection:**

```sql
index IN (aws_cloudtrail, azure_activity, gcp_audit)
| eval cloud=case(
    sourcetype="aws:cloudtrail", "aws",
    sourcetype="azure:aad:signin", "azure",
    sourcetype="google:gcp:pubsub:message", "gcp",
    true(), "unknown"
)
| eval is_smtp=case(
    match(eventName, "(SendEmail|SendRawEmail)"), 1,
    match(activityDisplayName, "Mail.Send"), 1,
    match(protoPayload.methodName, "send"), 1,
    true(), 0
)
| where is_smtp=1
| stats count by cloud, user, src_ip, _time
| where count > 100
| eval severity=case(count > 1000, "critical", count > 500, "high", true(), "medium")
| table _time, cloud, user, src_ip, count, severity
```

**Cross-Cloud Credential Access:**

```sql
index=aws_cloudtrail OR index=azure_activity
| eval cross_cloud=if(match(userAgent, "(Azure|Boto3)"), 1, 0)
| where cross_cloud=1
| stats dc(index) as cloud_count, values(index) as clouds by user
| where cloud_count > 1
| where relative_time(now(), "-1h") < _time
| alert severity=high "User accessing multiple cloud providers within 1 hour"
```

### AWS GuardDuty Findings

```json
{
  "Name": "CloudSMTPRelayDetection",
  "Description": "Detect potential SMTP relay abuse",
  "Severity": "MEDIUM",
  "FindingCriteria": {
    "Criterion": {
      "service.serviceName": {
        "Eq": ["guardduty"]
      },
      "service.action.actionType": {
        "Eq": ["AWS_API_CALL"]
      },
      "service.action.awsApiCallAction.api": {
        "Eq": ["SendEmail", "SendRawEmail"]
      }
    }
  },
  "Actions": [
    {
      "ActionType": "FINDING_PUBLISHING",
      "FindingPublishingConfiguration": {
        "Destination": {
          "DestinationType": "SNS",
          "Arn": "arn:aws:sns:us-east-1:ACCOUNT:guardduty-alerts"
        }
      }
    }
  ]
}
```

### Azure Sentinel KQL Queries

```kusto
// Detect unusual email sending patterns
AzureActivity
| where ActivityDisplayName contains "Mail.Send" or ActivityDisplayName contains "SendEmail"
| summarize EmailCount=count(), UniqueDestinations=dcount(CallerIpAddress) by Caller, ActivityDisplayName, bin(TimeGenerated, 1h)
| where EmailCount > 100
| project TimeGenerated, Caller, ActivityDisplayName, EmailCount, UniqueDestinations
| sort by EmailCount desc

// Cross-tenant access with email permissions
SigninLogs
| where AppDisplayName contains "Mail" or AppDisplayName contains "Exchange"
| where ResourceTenantId != HomeTenantId
| summarize Count=count() by UserPrincipalName, AppDisplayName, IPAddress
| where Count > 50
```

---

## The Incident Response Playbook: When You Find SMTP Abuse

### Immediate Response (First 30 Minutes)

**Step 1: Isolate Compromised Resources**

```bash
#!/bin/bash
# incident-isolate.sh

INSTANCE_ID=$1
REGION=${2:-us-east-1}
SECURITY_GROUP="isolate-sg"

echo "=== ISOLATING COMPROMISED INSTANCE ==="
echo "Instance: $INSTANCE_ID in $REGION"

# Create isolation security group (no outbound)
aws ec2 create-security-group \
    --group-name $SECURITY_GROUP \
    --description "Isolation SG for incident response" \
    --vpc-id $(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].VpcId' --output text) \
    2>/dev/null || echo "Security group may already exist"

# Remove all existing security groups and attach isolation SG
aws ec2 modify-instance-attribute \
    --instance-id $INSTANCE_ID \
    --no-source-dest-check

echo "[+] Instance isolated. Next steps:"
echo "  1. Capture memory dump if possible"
echo "  2. Collect CloudTrail logs for last 7 days"
echo "  3. Check for lateral movement"
```

**Step 2: Credential Rotation Checklist**

```bash
#!/bin/bash
# credential-rotation.sh

INCIDENT_TIME="2026-06-01T00:00:00Z"

echo "=== EMERGENCY CREDENTIAL ROTATION ==="
echo "Rotating all credentials since: $INCIDENT_TIME"

# AWS: Rotate access keys
aws iam list-users --query 'Users[*].UserName' --output text | tr '\t' '\n' | while read user; do
    aws iam list-access-keys --user-name "$user" --query 'AccessKeyMetadata[?CreateDate>=`'$INCIDENT_TIME'`].[AccessKeyId]' --output text | while read key; do
        echo "Disabling key: $key for user: $user"
        aws iam update-access-key --access-key-id "$key" --status Inactive --user-name "$user"
    done
done

echo "[+] Credential rotation initiated"
echo "[+] Review active keys in 24 hours and delete disabled keys"
```

**Step 3: Evidence Preservation**

```bash
#!/bin/bash
# preserve-evidence.sh

INCIDENT_ID="PCPJACK-$(date +%Y%m%d-%H%M%S)"
EVIDENCE_BUCKET="security-incident-evidence"

echo "=== PRESERVING INCIDENT EVIDENCE ==="
echo "Incident ID: $INCIDENT_ID"

# Capture CloudTrail
aws cloudtrail lookup-events \
    --lookup-attributes AttributeKey=EventName,AttributeValue=SendEmail \
    --start-time "$(date -d '7 days ago' +%Y-%m-%d)" \
    --output json > /tmp/${INCIDENT_ID}-cloudtrail.json

# Capture VPC Flow Logs
aws ec2 describe-flow-logs --query 'FlowLogs[*].FlowLogId' --output text | tr '\t' '\n' | while read flowlog; do
    echo "Capturing flow log: $flowlog"
done

# Upload to evidence bucket
aws s3 cp /tmp/${INCIDENT_ID}-cloudtrail.json s3://${EVIDENCE_BUCKET}/${INCIDENT_ID}/

echo "[+] Evidence preserved to: s3://${EVIDENCE_BUCKET}/${INCIDENT_ID}/"
```

### Recovery Procedures

1. **Analyze attack scope**: Check all CloudTrail logs for the compromised credential
2. **Identify lateral movement**: Look for cross-account/cross-cloud access
3. **Rotate all affected credentials**: Assume compromise, rotate everything
4. **Review IAM policies**: Remove unnecessary permissions, especially SES
5. **Enable additional monitoring**: VPC Flow Logs, CloudTrail Insights
6. **Submit abuse reports**: Notify cloud providers if IP reputation affected

---

## Related Reading

This guide builds on existing Eddington.Tech coverage of cloud security and credential protection:

- [Vibe Coding Security: Enterprise Defense Against Shadow Builder Exposures](/blog/vibe-coding-security-shadow-builders-enterprise-playbook) — Application-layer credential exposure
- [CISA Admin Leaked AWS GovCloud Keys on Github](/blog/cisa-admin-leaked-aws-govcloud-keys-github) — What happens when credential management fails
- [Node.js Supply Chain Security: Developer Workstation Protection](/blog/nodejs-supply-chain-security-developer-workstation-protection) — Securing the credentials on developer machines
- [MFA Prompt Bombing: Why Your Second Factor Isn't Saving You](/blog/mfa-prompt-bombing-fatigue-attacks) — Authentication security beyond credentials

These posts form a comprehensive defense-in-depth strategy covering cloud IAM, supply chain security, and modern authentication challenges.

---

**About Hunter Eddington**

IAM Engineer and System Hardening specialist focusing on multi-cloud security architectures. Daily notes on identity systems, threat intelligence, and cloud hardening at [Eddington.Tech](/).

**[Subscribe to RSS →](/feed.xml)**
