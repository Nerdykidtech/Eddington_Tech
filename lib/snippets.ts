export interface Snippet {
  id: string;
  title: string;
  description: string;
  category: "iam" | "security" | "infrastructure" | "productivity";
  language: "powershell" | "bash" | "python" | "typescript";
  code: string;
  output?: string;
  tags: string[];
  date: string;
}

export const snippets: Snippet[] = [
  {
    id: "bulk-user-export-entra",
    title: "Bulk User Export to CSV",
    description: "Export all Entra ID users with their group memberships, license status, and last sign-in to a CSV for audit.",
    category: "iam",
    language: "powershell",
    code: [
      'Connect-MgGraph -Scopes "User.Read.All", "Group.Read.All"',
      '',
      '$users = Get-MgUser -All -Property \\',
      '  Id, DisplayName, UserPrincipalName, \\',
      '  AccountEnabled, AssignedLicenses, SignInActivity \\',
      '  -ExpandProperty "MemberOf"',
      '',
      '$report = $users | ForEach-Object {',
      '  [PSCustomObject]@{',
      '    Name                = $_.DisplayName',
      '    UPN                 = $_.UserPrincipalName',
      '    Enabled             = $_.AccountEnabled',
      '    Licenses            = ($_.AssignedLicenses | ForEach-Object { $_.SkuId }) -join "; "',
      '    LastSignIn          = $_.SignInActivity.LastSignInDateTime',
      '    Groups              = ($_.MemberOf | ForEach-Object { $_.DisplayName }) -join "; "',
      '  }',
      '}',
      '',
      '$report | Export-Csv -Path "./entra-user-audit.csv" -NoTypeInformation',
      'Write-Host "Exported $($report.Count) users to entra-user-audit.csv"',
    ].join('\n'),
    output: `Name         UPN                      Enabled Licenses              LastSignIn           Groups
----         ---                      ------- ---------              -----------           ------
Hunter E.   hunter@eddington.tech    True    a123b456-...           5/8/2026 10:42:11 AM  Global Admins; IAM Readers
Admin Acc.  admin@eddington.tech      True    789xyz-...             4/12/2026 3:07:22 AM  Global Admins
Exported 248 users to entra-user-audit.csv`,
    tags: ["Entra ID", "Azure AD", "Reporting", "Audit"],
    date: "2026-05-08",
  },
  {
    id: "oauth-token-check",
    title: "OAuth Token Introspection",
    description: "Check if an OAuth access token is still valid against your IdP's introspection endpoint.",
    category: "iam",
    language: "powershell",
    code: [
      '# Validate an OAuth token against the introspection endpoint',
      '$Token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."',
      '$IntrospectionUrl = "https://login.eddington.tech/oauth2/v2/introspect"',
      '$ClientId = "your-client-id"',
      '$ClientSecret = "your-client-secret"',
      '',
      '$body = @{',
      '  token = $Token',
      '  token_type_hint = "access_token"',
      '}',
      '',
      '$headers = @{',
      '  "Content-Type" = "application/x-www-form-urlencoded"',
      '}',
      '',
      '$response = Invoke-RestMethod \\',
      '  -Uri $IntrospectionUrl \\',
      '  -Method Post \\',
      '  -Body $body \\',
      '  -Headers $headers \\',
      '  -Authentication Basic \\',
      '  -Credential (New-Object PSCredential($ClientId, (ConvertTo-SecureString $ClientSecret -AsPlainText -Force)))',
      '',
      '$response | ConvertTo-Json',
    ].join('\n'),
    output: `{
  "active": true,
  "scope": "openid profile email groups",
  "client_id": "iam-audit-tool",
  "username": "hunter@eddington.tech",
  "token_type": "Bearer",
  "exp": 1749384000,
  "iat": 1749376800,
  "sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "groups": ["Global Admin", "IAM Readers"]
}`,
    tags: ["OAuth", "OIDC", "Token Validation", "Security"],
    date: "2026-05-07",
  },
  {
    id: "remove-expired-certificates",
    title: "Remove Expired Certificates from Azure Key Vault",
    description: "Find and delete certificates that have been expired for more than 30 days across all Key Vaults in a subscription.",
    category: "security",
    language: "powershell",
    code: [
      'Connect-AzAccount',
      '$SubscriptionId = "your-subscription-id"',
      '$Subscription = Select-AzSubscription -SubscriptionId $SubscriptionId',
      '',
      '$ExpiryThreshold = (Get-Date).AddDays(-30)',
      '$DeletedCount = 0',
      '',
      '$Vaults = Get-AzKeyVault',
      '',
      'foreach ($vault in $Vaults) {',
      '  Write-Host "Scanning $($vault.VaultName)..." -Foreground Cyan',
      '',
      '  $certs = Get-AzKeyVaultCertificate -VaultName $vault.VaultName',
      '',
      '  foreach ($cert in $certs) {',
      '    if ($cert.Attributes.Expires -and $cert.Attributes.Expires -lt $ExpiryThreshold) {',
      '      $daysExpired = ((Get-Date) - $cert.Attributes.Expires).Days',
      '      Write-Host "  [EXPIRED] $($cert.Name) - ${daysExpired}d expired" -Foreground Yellow',
      '',
      '      Remove-AzKeyVaultCertificate \\',
      '        -VaultName $vault.VaultName \\',
      '        -Name $cert.Name \\',
      '        -Confirm:$false',
      '',
      '      $DeletedCount++',
      '    }',
      '  }',
      '}',
      '',
      'Write-Host "Deleted $DeletedCount expired certificates." -Foreground Green',
    ].join('\n'),
    output: `Scanning kv-prod-edt...
  [EXPIRED] wildcard-eddington-tech - 45d expired
  [EXPIRED] letsencrypt-prod - 12d expired
Scanning kv-staging-edt...
  [EXPIRED] cert-staging-2024 - 90d expired
Deleted 3 expired certificates.`,
    tags: ["Azure", "Key Vault", "Certificates", "Automation"],
    date: "2026-05-06",
  },
  {
    id: "ad-group-members-export",
    title: "Export AD Group Members with Nested Resolution",
    description: "Resolve all members of a protected AD group including nested group membership, with no external modules.",
    category: "iam",
    language: "powershell",
    code: [
      'function Get-NestedGroupMembers {',
      '  param(',
      '    [string]$GroupName,',
      '    [int]$Depth = 0',
      '  )',
      '',
      '  $members = Get-ADGroupMember -Identity $GroupName -Recursive',
      '',
      '  foreach ($member in $members) {',
      '    $indent = "  " * $Depth',
      '    if ($member.objectClass -eq "user") {',
      '      $user = Get-ADUser -Identity $member.SamAccountName -Properties DisplayName, LastLogonDate, Enabled',
      '      [PSCustomObject]@{',
      '        Name       = "$indent$($user.DisplayName)"',
      '        Type       = "User"',
      '        SamAccount = $member.SamAccountName',
      '        Enabled    = $user.Enabled',
      '        LastLogon  = $user.LastLogonDate',
      '      }',
      '    } else {',
      '      [PSCustomObject]@{',
      '        Name       = "$indent$($member.Name) [GROUP]"',
      '        Type       = "Group"',
      '        SamAccount = $member.SamAccountName',
      '        Enabled    = "N/A"',
      '        LastLogon  = "N/A"',
      '      }',
      '    }',
      '  }',
      '}',
      '',
      'Get-NestedGroupMembers -GroupName "Domain Admins" | \\',
      '  Export-Csv -Path "./domain-admins-report.csv" -NoTypeInformation',
    ].join('\n'),
    output: `Name                           Type   SamAccount        Enabled LastLogon
----                           ----   -------------       ------- ---------
John Doe [GROUP]               Group  jdoe                N/A     N/A
  Jane Smith                   User   jsmith              True    5/7/2026
  Bob Wilson                   User   bwilson            False   3/12/2025
Builtin\\Administrators [GROUP] Group  Administrators      N/A     N/A
  Administrator                User   Administrator      True    1/15/2026`,
    tags: ["Active Directory", "Group Membership", "Reporting"],
    date: "2026-05-05",
  },
  {
    id: "audit-signin-logs",
    title: "Entra ID Risky Sign-in Audit",
    description: "Pull all risky sign-ins from the last 30 days, cross-reference with user risk level, and flag accounts needing immediate action.",
    category: "security",
    language: "powershell",
    code: [
      'Connect-MgGraph -Scopes "AuditLog.Read.All"',
      '',
      '$startDate = (Get-Date).AddDays(-30)',
      '$endDate = Get-Date',
      '',
      '$params = @{',
      '  startDateTime = $startDate',
      '  endDateTime   = $endDate',
      '}',
      '',
      '$signIns = Get-MgBetaAuditSignInLog @params',
      '',
      '$riskySignIns = $signIns | Where-Object {',
      '  $_.RiskLevelDuringSignIn -ne "none" -or',
      '  $_.RiskState -eq "atRisk" -or',
      '  $_.RiskState -eq "confirmedCompromised"',
      '}',
      '',
      '$report = $riskySignIns | ForEach-Object {',
      '  [PSCustomObject]@{',
      '    User          = $_.UserPrincipalName',
      '    App           = $_.AppDisplayName',
      '    IP            = $_.IPAddress',
      '    RiskDuring    = $_.RiskLevelDuringSignIn',
      '    RiskState     = $_.RiskState',
      '    Timestamp     = $_.CreatedDateTime',
      '    Location      = $_.Location',
      '    DeviceDetail  = $_.DeviceDetail.OS',
      '  }',
      '}',
      '',
      '$report | Sort-Object Timestamp -Descending | \\',
      '  Export-Csv -Path "./risky-signins-audit.csv" -NoTypeInformation',
      '',
      'Write-Host "Flagged $($report.Count) risky sign-ins" -Foreground $(',
      '  if ($report.Count -gt 0) { "Yellow" } else { "Green" })',
    ].join('\n'),
    output: `User                       App                IP             RiskDuring  RiskState    Timestamp
----                       ---                --             ------------  ----------- ---------
admin@eddington.tech       Azure Portal       185.220.x.x     high          atRisk       5/8/2026 02:14:33 AM
hunter@eddington.tech      Microsoft Graph    104.28.x.x      medium        none         5/7/2026 11:42:08 PM
Flagged 2 risky sign-ins`,
    tags: ["Entra ID", "Risk Detection", "Sign-in Logs", "Audit"],
    date: "2026-05-04",
  },
  {
    id: "terraform-plan-summary",
    title: "Terraform Plan Output Parser",
    description: "Parse a terraform plan output and generate a human-readable summary of what resources will change, added, or destroyed.",
    category: "infrastructure",
    language: "bash",
    code: `#!/bin/bash
# Parse terraform plan and post a summary to stdout

PLAN_OUTPUT=$(terraform show -json plan.tfplan 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "Error: Could not parse plan.tfplan"
  exit 1
fi

ADD=$(echo "$PLAN_OUTPUT" | jq '[.resource_changes[] | select(.actions | contains("create"))] | length')
UPDATE=$(echo "$PLAN_OUTPUT" | jq '[.resource_changes[] | select(.actions | contains("update"))] | length')
DELETE=$(echo "$PLAN_OUTPUT" | jq '[.resource_changes[] | select(.actions | contains("delete"))] | length')

echo "=== Terraform Plan Summary ==="
echo "  + Add:    $ADD"
echo "  ~ Update: $UPDATE"
echo "  - Delete: $DELETE"
echo ""
echo "=== Resources by type ==="
echo "$PLAN_OUTPUT" | jq -r '.resource_changes[] | "\\(.actions[0]) \\(.type) (\\(.name))"' | sort | uniq -c | sort -rn`,
    output: `=== Terraform Plan Summary ===
  + Add:    12
  ~ Update: 5
  - Delete: 1

=== Resources by type ===
  + azurerm_key_vault (vault-prod)
  + azurerm_role_assignment (keyvault-reader)
  + azurerm_managed_identity (func-identity)
  ~ azurerm_storage_account (storage-prod)
  - azurerm_resource_group (legacy-rg)`,
    tags: ["Terraform", "IaC", "Azure", "Automation"],
    date: "2026-05-03",
  },
];