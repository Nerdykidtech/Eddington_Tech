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
  {
    id: "cap-policy-inventory",
    title: "Conditional Access Policy Inventory & Gap Analysis",
    description: "Export every Entra ID Conditional Access policy with its grant controls, conditions, and session settings — then flag any enabled policies that don't cover privileged role assignments.",
    category: "iam",
    language: "powershell",
    code: [
      'Connect-MgGraph -Scopes "Policy.Read.All"',
      '',
      '$policies = Get-MgIdentityConditionalAccessPolicy -All',
      '',
      '$report = $policies | ForEach-Object {',
      '  [PSCustomObject]@{',
      '    PolicyName       = $_.DisplayName',
      '    State            = $_.State',
      '    GrantOperator    = $_.GrantControls.Operator',
      '    BuiltInControls  = ($_.GrantControls.BuiltInControls -join ", ")',
      '    SessionControls  = ($_.SessionControls | ConvertTo-Json -Compress -Depth 1)',
      '    IncludeUsers     = ($_.Conditions.Users.IncludeUsers -join ", ")',
      '    IncludeApps      = ($_.Conditions.Applications.IncludeApplications -join ", ")',
      '    Created          = $_.CreatedDateTime',
      '    Modified         = $_.ModifiedDateTime',
      '  }',
      '}',
      '',
      '# Gap check: enabled policies that do NOT target privileged roles',
      '$privilegedRolePolicies = $policies | Where-Object {',
      '  $_.State -eq "enabled" -and',
      '  $_.Conditions.Users.IncludeRoles -match "Privileged"',
      '}',
      '',
      '$gaps = $policies | Where-Object {',
      '  $_.State -eq "enabled" -and',
      '  $_.Conditions.Users.IncludeRoles -notmatch "Privileged"',
      '}',
      '',
      'Write-Host "=== CAP Policy Summary ===" -Foreground Cyan',
      'Write-Host "Total policies:    $($policies.Count)"',
      'Write-Host "Enabled:           $($($policies | Where-Object State -eq \"enabled\").Count)"',
      'Write-Host "Covering priv roles: $($privilegedRolePolicies.Count)"',
      'Write-Host "Gap — no priv role coverage: $($gaps.Count)" -Foreground Yellow',
      '',
      '$gaps | Select-Object PolicyName, State | Format-Table',
      '',
      '$report | Export-Csv -Path "./cap-policy-inventory.csv" -NoTypeInformation',
      'Write-Host "Exported to ./cap-policy-inventory.csv"',
    ].join('\n'),
    output: `=== CAP Policy Summary ===
Total policies:    14
Enabled:           11
Covering priv roles: 2
Gap — no priv role coverage: 9

PolicyName                          State
-----------                         -----
Base-Platform-Policy                enabled
Allow-All-Intune-Devices           enabled
Block-Bad-GeoIPs                    enabled
Exported to ./cap-policy-inventory.csv`,
    tags: ["Conditional Access", "Entra ID", "Zero Trust", "Audit"],
    date: "2026-05-09",
  },
  {
    id: "entra-service-principal-audit",
    title: "Service Principal & High-Privilege App Role Audit",
    description: "Inventory every service principal in Entra ID, map granted app roles, identify apps with Global Admin or privileged role assignments, and list their owners.",
    category: "iam",
    language: "powershell",
    code: [
      'Connect-MgGraph -Scopes "Application.Read.All", "AppRoleAssignment.Read.All", "Directory.Read.All"',
      '',
      '$servicePrincipals = Get-MgServicePrincipal -All -Property \\',
      '  Id, DisplayName, AppId, PublisherName, AppOwnerOrganizationId',
      '',
      '$highPrivRoles = @(',
      '  "Company Administrator",',
      '  "Global Administrator",',
      '  "Privileged Role Administrator",',
      '  "Identity Governance Administrator"',
      ')',
      '',
      '$report = @()',
      'foreach ($sp in $servicePrincipals) {',
      '  $assignments = Get-MgServicePrincipalAppRoleAssignment \\',
      '    -ServicePrincipalId $sp.Id -All',
      '',
      '  $highPriv = $false',
      '  foreach ($a in $assignments) {',
      '    if ($a.RoleId) {',
      '      $role = Get-MgServicePrincipalAppRole \\',
      '        -ServicePrincipalId $sp.Id \\',
      '        -AppRoleId $a.RoleId \\',
      '        -ErrorAction SilentlyContinue',
      '      if ($role.Value -in $highPrivRoles) { $highPriv = $true; break }',
      '    }',
      '  }',
      '',
      '  $owners = (Get-MgServicePrincipalOwner -ServicePrincipalId $sp.Id |',
      '    ForEach-Object { $_.DisplayName }) -join "; "',
      '',
      '  $report += [PSCustomObject]@{',
      '    Name       = $sp.DisplayName',
      '    AppId      = $sp.AppId',
      '    Publisher  = $sp.PublisherName',
      '    PermCount  = $assignments.Count',
      '    HighPriv   = if ($highPriv) { "YES" } else { "No" }',
      '    Owners     = if ($owners) { $owners } else { "None" }',
      '  }',
      '}',
      '',
      '$highPrivApps = $report | Where-Object HighPriv -eq "YES"',
      'Write-Host "=== Service Principal Audit ===" -Foreground Cyan',
      'Write-Host "Total: $($report.Count) | High-privilege apps: $($highPrivApps.Count)"',
      'Write-Host ""',
      '$highPrivApps | Select-Object Name, Publisher, PermCount | Format-Table -AutoSize',
      '$report | Export-Csv -Path "./sp-audit.csv" -NoTypeInformation',
    ].join('\n'),
    output: `=== Service Principal Audit ===
Total: 312 | High-privilege apps: 4

Name                           Publisher          PermCount
----                           ---------          ---------
Microsoft.Graph                Microsoft Corp.           48
Entra-Privileged-IDM           IT Security Team           6
PIM-Automation-Service         IAM Automation             3
Exported to ./sp-audit.csv`,
    tags: ["Entra ID", "App Registrations", "Service Principals", "Audit"],
    date: "2026-05-09",
  },
  {
    id: "pim-role-activation-report",
    title: "PIM Role Activation Audit — After-Hours Flagging",
    description: "Pull Privileged Identity Management activations from the last 30 days via Entra audit logs, flag activations outside business hours (before 7am or after 8pm), and export for review.",
    category: "iam",
    language: "powershell",
    code: [
      'Connect-MgGraph -Scopes "AuditLog.Read.All"',
      '',
      '$startDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-ddTHH:mm:ssZ")',
      '',
      '$auditLogs = Get-MgBetaAuditLogDirectoryAudit \\',
      '  -Filter "ActivityDateTime ge $startDate" -All',
      '',
      '# Filter to PIM activation operations',
      '$pimLogs = $auditLogs | Where-Object {',
      '  $_.OperationType -match "Activate" -and',
      '  $_.ServicePrincipalId -match "privilegedAccess"',
      '}',
      '',
      '$report = foreach ($log in $pimLogs) {',
      '  $ts = [DateTime]::Parse($log.ActivityDateTime)',
      '  $afterHours = ($ts.Hour -lt 7) -or ($ts.Hour -gt 20)',
      '',
      '  $target = $log.TargetResources | Select-Object -First 1',
      '  $roleProp = $target.ModifiedProperties | Where-Object { $_.DisplayName -eq "Role" }',
      '',
      '  [PSCustomObject]@{',
      '    InitiatedBy = $log.InitiatedBy.UserId',
      '    Target      = $target.UserPrincipalName',
      '    Role        = $roleProp.NewValue',
      '    Timestamp   = $ts',
      '    AfterHours  = if ($afterHours) { "YES" } else { "No" }',
      '    Status      = $log.Status',
      '  }',
      '}',
      '',
      '$afterHoursFlags = $report | Where-Object AfterHours -eq "YES"',
      'Write-Host "=== PIM Activation Report (30d) ===" -Foreground Cyan',
      'Write-Host "Total activations: $($report.Count)"',
      'Write-Host "After-hours:       $($afterHoursFlags.Count)" -Foreground $(',
      '  if ($afterHoursFlags.Count -gt 0) { "Yellow" } else { "Green" })',
      '',
      'if ($afterHoursFlags.Count -gt 0) {',
      '  $afterHoursFlags | Format-Table -AutoSize',
      '}',
      '$report | Export-Csv -Path "./pim-activations.csv" -NoTypeInformation',
    ].join('\n'),
    output: `=== PIM Activation Report (30d) ===
Total activations: 47
After-hours:        3

InitiatedBy           Target                     Role                      Timestamp           AfterHours
-----------           ------                     ----                      ---------           ----------
admin@eddington...     hunter@eddington.tech      Privileged Role Admin...  5/3/2026 2:14:11 AM  YES
svc-pim-auto           admin@eddington.tech       Global Administrator       5/7/2026 3:30:00 AM  YES
Exported to ./pim-activations.csv`,
    tags: ["PIM", "Privileged Identity Management", "Entra ID", "Audit"],
    date: "2026-05-09",
  },
  {
    id: "service-account-expiry-check",
    title: "AD Service Account Password Expiry & Status Audit",
    description: "Scan AD for service accounts matching svc_/sa_/service account naming patterns, check password age and expiry, flag expired and expiring-soon accounts, and export actionable findings.",
    category: "iam",
    language: "powershell",
    code: [
      'Import-Module ActiveDirectory',
      '',
      '$filter = "(|(Name=svc_*)(Name=sa_*)(Description=*service account*)(Name=*_svc))"',
      '',
      '$accounts = Get-ADUser -Filter $filter \\',
      '  -Properties Name, SamAccountName, PasswordExpired, \\',
      '  PasswordNeverExpires, PasswordLastSet, LastLogonDate, \\',
      '  Enabled, DistinguishedName',
      '',
      '$maxPasswordAgeDays = 90',
      '$warningDays = 14',
      '$today = Get-Date',
      '',
      '$report = foreach ($acct in $accounts) {',
      '  $passwordAge = if ($acct.PasswordLastSet) {',
      '    ($today - $acct.PasswordLastSet).Days',
      '  } else { $null }',
      '',
      '  $expiryDate = if (-not $acct.PasswordNeverExpires -and $acct.PasswordLastSet) {',
      '    $acct.PasswordLastSet.AddDays($maxPasswordAgeDays)',
      '  } else { $null }',
      '',
      '  $daysLeft = if ($expiryDate) {',
      '    ($expiryDate - $today).Days',
      '  } else { $null }',
      '',
      '  $status = if (-not $acct.Enabled)                { "DISABLED" }',
      '    elseif ($acct.PasswordExpired)                 { "EXPIRED" }',
      '    elseif ($null -ne $daysLeft -and $daysLeft -lt 0) { "EXPIRED" }',
      '    elseif ($daysLeft -le $warningDays)             { "EXPIRING SOON" }',
      '    else                                            { "OK" }',
      '',
      '  [PSCustomObject]@{',
      '    SamAccount = $acct.SamAccountName',
      '    Status     = $status',
      '    DaysOld    = $passwordAge',
      '    DaysLeft   = $daysLeft',
      '    LastLogon  = if ($acct.LastLogonDate) { $acct.LastLogonDate.ToString("yyyy-MM-dd") } else { "Never" }',
      '    OU         = ($acct.DistinguishedName -split ",OU=")[1]',
      '  }',
      '}',
      '',
      '$findings = $report | Where-Object { $_.Status -ne "OK" }',
      'Write-Host "=== Service Account Audit ===" -Foreground Cyan',
      'Write-Host "Total scanned:  $($report.Count)"',
      'Write-Host "Action needed:  $($findings.Count)" -Foreground $(',
      '  if ($findings.Count -gt 0) { "Yellow" } else { "Green" })',
      '',
      '$findings | Sort-Object Status, DaysLeft | Format-Table -AutoSize',
      '$report | Export-Csv -Path "./service-account-audit.csv" -NoTypeInformation',
    ].join('\n'),
    output: `=== Service Account Audit ===
Total scanned:  28
Action needed:  5

SamAccount         Status          DaysOld  DaysLeft LastLogon  OU
-----------         ------          -------  -------- ---------  --
svc_azure_sync     EXPIRED             107       -17 2026-04-01  Service Accounts
sa_backup_v2       EXPIRING SOON        82         8 Never       Managed
svc_github_runner  DISABLED            200        N/A 2026-02-14  Service Accounts
Exported to ./service-account-audit.csv`,
    tags: ["Active Directory", "Service Accounts", "Password Policy", "Audit"],
    date: "2026-05-09",
  },
  {
    id: "external-guest-user-audit",
    title: "External Guest User & Stale B2B Access Audit",
    description: "Pull all Entra ID B2B guest users, check their invitation state and last sign-in, flag stale accounts with no activity in 30+ days, and export for access review.",
    category: "iam",
    language: "python",
    code: [
      'import subprocess',
      'import json',
      'import csv',
      'from datetime import datetime, timezone',
      '',
      'def run_m365(cmd):',
      '    result = subprocess.run(',
      '        cmd, shell=True, capture_output=True, text=True)',
      '    if result.returncode != 0:',
      '        print(f"Error: {result.stderr.strip()}")',
      '        return []',
      '    try:',
      '        return json.loads(result.stdout)',
      '    except json.JSONDecodeError:',
      '        return []',
      '',
      'cmd = (',
      '    "m365 entra user list \\"',
      '    --query \\"[?userType==\'Guest\']\\" \\"',
      '    --properties displayName,userPrincipalName,externalUserState,',
      '    mail,refreshTokensValidFrom,lastSignInDateTime,creationType",
      '")',
      '',
      'guests = run_m365(cmd)',
      '',
      'if not guests:',
      '    print("No guests found or CLI returned empty.")',
      '    exit(0)',
      '',
      'now = datetime.now(timezone.utc)',
      'stale_threshold = 30  # days',
      '',
      'results = []',
      'for g in guests:',
      '    last_signin = g.get("lastSignInDateTime")',
      '    if last_signin:',
      '        try:',
      '            last_dt = datetime.fromisoformat(last_signin.replace("Z", "+00:00"))',
      '            days_inactive = (now - last_dt).days',
      '            status = "STALE" if days_inactive > stale_threshold else "ACTIVE"',
      '        except Exception:',
      '            days_inactive = None',
      '            status = "UNKNOWN"',
      '    else:',
      '        days_inactive = None',
      '        status = "NEVER_SIGNED_IN"',
      '',
      '    results.append({',
      '        "displayName": g.get("displayName", "N/A"),',
      '        "upn": g.get("userPrincipalName"),',
      '        "state": g.get("externalUserState", "Unknown"),',
      '        "status": status,',
      '        "daysInactive": days_inactive,',
      '        "lastSignIn": last_signin or "Never",',
      '        "inviteType": g.get("creationType", "Unknown"),',
      '    })',
      '',
      'stale = [r for r in results if r["status"] in ("STALE", "NEVER_SIGNED_IN")]',
      '',
      'print("=== External Guest Audit ===")',
      'print(f"Total guests:      {len(results)}")',
      'print(f"Stale (30d+ idle): {len(stale)}")',
      'print(f"Active:            {len(results) - len(stale)}")',
      'print()',
      'for s in stale:',
      '    print(f"  [{s[\'status\']}] {s[\'upn\']} — last: {s[\'lastSignIn\']}")',
      '',
      'with open("external-guest-audit.csv", "w", newline="") as f:',
      '    if results:',
      '        writer = csv.DictWriter(f, fieldnames=results[0].keys())',
      '        writer.writeheader()',
      '        writer.writerows(results)',
      'print("\\nExported to external-guest-audit.csv")',
    ].join('\n'),
    output: `=== External Guest Audit ===
Total guests:      47
Stale (30d+ idle): 12
Active:            35

  [STALE] guest_firma@eddington.tech — last: 2026-03-01T...
  [STALE] partner_dev@eddington.tech — last: 2026-01-14T...
  [NEVER_SIGNED_IN] contractor_jane@eddington.onmicrosoft.com — last: Never
Exported to external-guest-audit.csv`,
    tags: ["B2B", "Guest Users", "External Access", "Entra ID", "Audit"],
    date: "2026-05-09",
  },
];
