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
    code: `Connect-MgGraph -Scopes "User.Read.All", "Group.Read.All"

$users = Get-MgUser -All -Property \
  Id, DisplayName, UserPrincipalName, \
  AccountEnabled, AssignedLicenses, SignInActivity \
  -ExpandProperty "MemberOf"

$report = $users | ForEach-Object {
  [PSCustomObject]@{
    Name                = $_.DisplayName
    UPN                 = $_.UserPrincipalName
    Enabled             = $_.AccountEnabled
    Licenses            = ($_.AssignedLicenses | ForEach-Object { $_.SkuId }) -join "; "
    LastSignIn          = $_.SignInActivity.LastSignInDateTime
    Groups              = ($_.MemberOf | ForEach-Object { $_.DisplayName }) -join "; "
  }
}

$report | Export-Csv -Path "./entra-user-audit.csv" -NoTypeInformation
Write-Host "Exported $($report.Count) users to entra-user-audit.csv"`,
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
    code: `# Validate an OAuth token against the introspection endpoint
$Token = "eyJhbG...VCJ9..."
$IntrospectionUrl = "https://login.eddington.tech/oauth2/v2/introspect"
$ClientId = "your-client-id"
$ClientSecret = "your-client-secret"

$body = @{
  token = $Token
  token_type_hint = "access_token"
}

$headers = @{
  "Content-Type" = "application/x-www-form-urlencoded"
}

$response = Invoke-RestMethod \
  -Uri $IntrospectionUrl \
  -Method Post \
  -Body $body \
  -Headers $headers \
  -Authentication Basic \
  -Credential (New-Object PSCredential($ClientId, (ConvertTo-SecureString $ClientSecret -AsPlainText -Force)))

$response | ConvertTo-Json`,
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
    code: `Connect-AzAccount
$SubscriptionId = "your-subscription-id"
$Subscription = Select-AzSubscription -SubscriptionId $SubscriptionId

$ExpiryThreshold = (Get-Date).AddDays(-30)
$DeletedCount = 0

$Vaults = Get-AzKeyVault

foreach ($vault in $Vaults) {
  Write-Host "Scanning $($vault.VaultName)..." -Foreground Cyan

  $certs = Get-AzKeyVaultCertificate -VaultName $vault.VaultName

  foreach ($cert in $certs) {
    if ($cert.Attributes.Expires -and $cert.Attributes.Expires -lt $ExpiryThreshold) {
      $daysExpired = ((Get-Date) - $cert.Attributes.Expires).Days
      Write-Host "  [EXPIRED] $($cert.Name) - $daysExpired d expired" -Foreground Yellow

      Remove-AzKeyVaultCertificate \
        -VaultName $vault.VaultName \
        -Name $cert.Name \
        -Confirm:$false

      $DeletedCount++
    }
  }
}

Write-Host "Deleted $DeletedCount expired certificates." -Foreground Green`,
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
    id: "mfa-status-dashboard",
    title: "MFA Status Dashboard and Weak Methods Report",
    description: "Export all Entra ID users with their MFA registration status, method types, and identify accounts vulnerable to SIM swap or lacking MFA entirely.",
    category: "iam",
    language: "powershell",
    code: `Connect-MgGraph -Scopes "User.Read.All", "UserAuthenticationMethod.Read.All"

$users = Get-MgUser -All -Property Id, DisplayName, UserPrincipalName, AccountEnabled

$report = @()
foreach ($user in $users) {
  $methods = Get-MgUserAuthenticationMethod -UserId $user.Id -ErrorAction SilentlyContinue

  $mfaRegistered = $methods.Count -gt 0
  $methodTypes = $methods | ForEach-Object { $_.GetType().Name } | Select-Object -Unique

  $hasAuthenticator = $methodTypes -contains "MicrosoftAuthenticatorAuthenticationMethod"
  $hasPhone = $methodTypes -contains "PhoneAuthenticationMethod"
  $hasFido = $methodTypes -contains "Fido2AuthenticationMethod"
  $hasTempAccess = $methodTypes -contains "TemporaryAccessPassAuthenticationMethod"

  $riskLevel = "Low"
  if (-not $mfaRegistered) { $riskLevel = "HIGH - No MFA" }
  elseif ($hasPhone -and -not $hasAuthenticator -and -not $hasFido) {
    $riskLevel = "MEDIUM - SMS only"
  }
  elseif ($hasTempAccess) { $riskLevel = "Temp Access" }

  $report += [PSCustomObject]@{
    DisplayName    = $user.DisplayName
    UPN            = $user.UserPrincipalName
    Enabled        = $user.AccountEnabled
    MFA_Registered = if ($mfaRegistered) { "Yes" } else { "No" }
    Method_Types   = ($methodTypes -replace "AuthenticationMethod", "" -join ", ")
    Risk_Level     = $riskLevel
  }
}

$highRisk = $report | Where-Object { $_.Risk_Level -like "*HIGH*" -or $_.Risk_Level -like "*MEDIUM*" }
Write-Host "=== MFA Status Dashboard ===" -Foreground Cyan
Write-Host "Total users:        $($report.Count)"
Write-Host "MFA registered:     $($($report | Where-Object MFA_Registered -eq 'Yes').Count)"
Write-Host "No MFA:             $($($report | Where-Object MFA_Registered -eq 'No').Count)" -Foreground Red
Write-Host "SMS-only (SIM risk): $($($report | Where-Object Risk_Level -like '*SMS*').Count)" -Foreground Yellow
Write-Host ""
Write-Host "High/Medium Risk Accounts:" -Foreground Yellow
$highRisk | Select-Object UPN, Risk_Level | Format-Table -AutoSize

$report | Export-Csv -Path "./mfa-status-dashboard.csv" -NoTypeInformation`,
    output: `=== MFA Status Dashboard ===
Total users:        248
MFA registered:     231
No MFA:             17                      
SMS-only (SIM risk): 34

High/Medium Risk Accounts:
UPN                       Risk_Level
---                       ----------
admin@eddington.tech      HIGH - No MFA
legacy-svc@eddington.tech HIGH - No MFA
guest_user1@partner.com   MEDIUM - SMS only
contractor@vendor        MEDIUM - SMS only

Exported to ./mfa-status-dashboard.csv`,
    tags: ["MFA", "Entra ID", "Authentication", "Security Score"],
    date: "2026-05-19",
  },
  {
    id: "conditional-access-gaps",
    title: "Conditional Access Policy Gap Analyzer",
    description: "Identify Conditional Access policies that do not cover high-privilege roles or lack modern authentication requirements such as MFA, compliant devices, or trusted locations.",
    category: "iam",
    language: "powershell",
    code: `Connect-MgGraph -Scopes "Policy.Read.All", "Directory.Read.All"

$policies = Get-MgIdentityConditionalAccessPolicy -All
$privilegedRoles = @(
  "62e90394-bb34-4ae3-b5c9-0c7c1b9a8c99",  # Global Admin
  "baf7b7d4-4c55-4f6e-8f2b-2f70f8b7b6b8",  # Privileged Role Administrator
  "d37b0d99-1e1d-45f8-b3b9-9b6a9f9c8d0c",  # User Administrator
  "88aa1f5b-9d77-4b8f-8c2a-1a2b3c4d5e6f",  # Security Administrator
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890"   # Exchange Administrator
)

$findings = @()
foreach ($policy in $policies) {
  if ($policy.State -ne "enabled") { continue }

  $hasModernAuth = ($policy.GrantControls.BuiltInControls -contains "mfa") -or
                    ($policy.GrantControls.BuiltInControls -contains "compliantDevice") -or
                    ($policy.GrantControls.BuiltInControls -contains "domainJoinedDevice")

  $coversPrivileged = $false
  foreach ($role in $privilegedRoles) {
    if ($policy.Conditions.Users.IncludeRoles -contains $role) {
      $coversPrivileged = $true
      break
    }
  }

  $gapType = @()
  if (-not $hasModernAuth) { $gapType += "No modern auth requirements" }
  if (-not $coversPrivileged) { $gapType += "Does not cover privileged roles" }

  if ($gapType.Count -gt 0) {
    $findings += [PSCustomObject]@{
      PolicyName = $policy.DisplayName
      Gaps       = ($gapType -join "; ")
      Modified   = $policy.ModifiedDateTime
    }
  }
}

Write-Host "=== Conditional Access Gap Analysis ===" -Foreground Cyan
Write-Host "Total policies scanned: $($policies.Count)"
Write-Host "Policies with gaps:     $($findings.Count)" -Foreground Yellow
Write-Host ""
$findings | Format-Table -AutoSize

$findings | Export-Csv -Path "./ca-policy-gaps.csv" -NoTypeInformation
Write-Host "Exported to ca-policy-gaps.csv"`,
    output: `=== Conditional Access Gap Analysis ===
Total policies scanned: 14
Policies with gaps:     6

PolicyName                          Gaps
----------                          ----
Base-Platform-Policy                No modern auth requirements; Does not cover privileged roles
Allow-All-Intune-Devices           No modern auth requirements; Does not cover privileged roles
Block-Bad-GeoIPs                    Does not cover privileged roles
Legacy-Office365-Policy            No modern auth requirements
Guest-Access-Policy                No modern auth requirements
Partner-Vendor-Access              No modern auth requirements

Exported to ca-policy-gaps.csv`,
    tags: ["Conditional Access", "Zero Trust", "Gap Analysis", "Entra ID"],
    date: "2026-05-19",
  },
  {
    id: "keyvault-secret-expiry",
    title: "Azure Key Vault Secret Expiry Scanner",
    description: "Scan all Key Vaults in a subscription for secrets and keys nearing expiration or already expired. Identifies rotation gaps before they cause outages or security incidents.",
    category: "security",
    language: "powershell",
    code: `Connect-AzAccount
$SubscriptionId = "your-subscription-id"
Select-AzSubscription -SubscriptionId $SubscriptionId

$WarningThreshold = (Get-Date).AddDays(30)  # 30 days warning
$ExpiredThreshold = (Get-Date)

$findings = @()
$vaults = Get-AzKeyVault

foreach ($vault in $vaults) {
  Write-Host "Scanning $vault.VaultName..." -Foreground Cyan

  # Check secrets
  $secrets = Get-AzKeyVaultSecret -VaultName $vault.VaultName
  foreach ($secret in $secrets) {
    if ($secret.Expires -and $secret.Expires -lt $ExpiredThreshold) {
      $findings += [PSCustomObject]@{
        Vault      = $vault.VaultName
        Type       = "Secret"
        Name       = $secret.Name
        Status     = "EXPIRED"
        Expires    = $secret.Expires
        DaysAgo    = ((Get-Date) - $secret.Expires).Days
      }
    } elseif ($secret.Expires -and $secret.Expires -lt $WarningThreshold) {
      $daysLeft = ($secret.Expires - (Get-Date)).Days
      $findings += [PSCustomObject]@{
        Vault      = $vault.VaultName
        Type       = "Secret"
        Name       = $secret.Name
        Status     = "EXPIRING_SOON"
        Expires    = $secret.Expires
        DaysLeft   = $daysLeft
      }
    }
  }

  # Check keys
  $keys = Get-AzKeyVaultKey -VaultName $vault.VaultName
  foreach ($key in $keys) {
    if ($key.Expires -and $key.Expires -lt $ExpiredThreshold) {
      $findings += [PSCustomObject]@{
        Vault      = $vault.VaultName
        Type       = "Key"
        Name       = $key.Name
        Status     = "EXPIRED"
        Expires    = $key.Expires
      }
    } elseif ($key.Expires -and $key.Expires -lt $WarningThreshold) {
      $daysLeft = ($key.Expires - (Get-Date)).Days
      $findings += [PSCustomObject]@{
        Vault      = $vault.VaultName
        Type       = "Key"
        Name       = $key.Name
        Status     = "EXPIRING_SOON"
        Expires    = $key.Expires
        DaysLeft   = $daysLeft
      }
    }
  }
}

$expired = $findings | Where-Object Status -eq "EXPIRED"
$warning = $findings | Where-Object Status -eq "EXPIRING_SOON"

Write-Host "=== Key Vault Secret Expiry Report ===" -Foreground Cyan
Write-Host "Expired:        $expired.Count" -Foreground Red
Write-Host "Expiring soon:  $warning.Count" -Foreground Yellow
if ($expired.Count -gt 0) {
  Write-Host ""
  Write-Host "EXPIRED (Action Required):" -Foreground Red
  $expired | Select-Object Vault, Type, Name, DaysAgo | Format-Table
}
if ($warning.Count -gt 0) {
  Write-Host ""
  Write-Host "EXPIRING SOON (Rotate Soon):" -Foreground Yellow
  $warning | Select-Object Vault, Type, Name, DaysLeft | Format-Table
}

$findings | Export-Csv -Path "./keyvault-expiry-report.csv" -NoTypeInformation`,
    output: `=== Key Vault Secret Expiry Report ===
Expired:        2
Expiring soon:  4

EXPIRED (Action Required):
Vault         Type      Name               DaysAgo
-----         ----      ----               -------
kv-prod       Secret    db-connection-str    12
kv-prod       Key       storage-encrypt      45

EXPIRING SOON (Rotate Soon):
Vault         Type      Name               DaysLeft
-----         ----      ----               --------
kv-prod       Secret    api-key-primary      5
kv-staging    Secret    jwt-signing-key     12
kv-prod       Secret    service-bus-conn     18
kv-shared     Key       backup-key          22

Exported to ./keyvault-expiry-report.csv`,
    tags: ["Azure", "Key Vault", "Secrets Management", "Certificate Expiry"],
    date: "2026-05-19",
  },
];

