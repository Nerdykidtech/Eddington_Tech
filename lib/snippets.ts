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
  {
    id: "entra-risky-signins",
    title: "Entra ID Risky Sign-in Report",
    description: "Query risky sign-ins from the last 30 days, categorize by risk level, and export high-risk events requiring investigation.",
    category: "security",
    language: "powershell",
    code: `Connect-MgGraph -Scopes "IdentityRiskEvent.Read.All", "AuditLog.Read.All"

$startDate = (Get-Date).AddDays(-30)
$filter = "riskState eq 'atRisk' or riskState eq 'confirmedCompromised'"

Write-Host "Fetching risky sign-ins from last 30 days..." -Foreground Cyan

$riskySignIns = Get-MgRiskDetection -Filter $filter -All | Where-Object {
    $_.DetectedDateTime -gt $startDate
}

$report = $riskySignIns | ForEach-Object {
    $riskLevel = switch ($_.RiskLevel) {
        "high" { "HIGH" }
        "medium" { "MEDIUM" }
        "low" { "LOW" }
        default { $_.RiskLevel }
    }
    
    [PSCustomObject]@{
        User           = $_.UserDisplayName
        UPN            = $_.UserPrincipalName
        DetectedTime   = $_.DetectedDateTime
        RiskLevel      = $riskLevel
        RiskType       = $_.RiskEventType -join "; "
        IPAddress      = $_.IPAddress
        Location       = "$($_.Location.City), $($_.Location.CountryOrRegion)"
        Status         = $_.RiskState
        MitigationTime = $_.MitigationDateTime
    }
}

$highRisk = $report | Where-Object RiskLevel -eq "HIGH"
$mediumRisk = $report | Where-Object RiskLevel -eq "MEDIUM"

Write-Host ""
Write-Host "=== Risky Sign-in Summary ===" -Foreground Cyan
Write-Host "Total risky events: $($report.Count)"
Write-Host "High risk:          $($highRisk.Count)" -Foreground Red
Write-Host "Medium risk:        $($mediumRisk.Count)" -Foreground Yellow
Write-Host "Low risk:           $($($report | Where-Object RiskLevel -eq "LOW").Count)"

if ($highRisk.Count -gt 0) {
    Write-Host ""
    Write-Host "HIGH RISK EVENTS (Immediate Action Required):" -Foreground Red
    $highRisk | Select-Object UPN, RiskType, IPAddress, Location | Format-Table
}

$report | Export-Csv -Path "./risky-signins-report.csv" -NoTypeInformation
Write-Host ""
Write-Host "Report exported to ./risky-signins-report.csv"`,
    output: `Fetching risky sign-ins from last 30 days...

=== Risky Sign-in Summary ===
Total risky events: 47
High risk:          8
Medium risk:        23
Low risk:           16

HIGH RISK EVENTS (Immediate Action Required):
UPN                       RiskType                              IPAddress     Location
---                       --------                              ---------     --------
admin@eddington.tech      anonymizedIPAddress, impossibleTravel 185.220.1.x   Moscow, RU
jdevops@partner.com       leakedCredentials                     103.75.2.x    São Paulo, BR
guest_vip@eddington.tech  unfamiliarSignInProperties            91.203.5.x    Kyiv, UA

Report exported to ./risky-signins-report.csv`,
    tags: ["Entra ID", "Risk Detection", "Threat Intelligence", "Security"],
    date: "2026-05-19",
  },
  {
    id: "storage-public-access-scanner",
    title: "Azure Storage Public Access Scanner",
    description: "Scan all storage accounts in a subscription to identify publicly accessible containers and blobs. Exposes data exposure risks before they're exploited.",
    category: "security",
    language: "powershell",
    code: `Connect-AzAccount
$SubscriptionId =  "your-subscription-id"
Select-AzSubscription -SubscriptionId $SubscriptionId

$publicAccounts = @()
$storageAccounts = Get-AzStorageAccount

foreach ($account in $storageAccounts) {
    Write-Host "Scanning $($account.StorageAccountName)..." -Foreground Cyan
    
    # Check account-level public access setting
    $publicNetworkAccess = $account.PublicNetworkAccess
    
    # Get context for blob operations
    $ctx = $account.Context
    
    # Check containers
    $containers = Get-AzStorageContainer -Context $ctx -ErrorAction SilentlyContinue
    $publicContainers = @()
    
    foreach ($container in $containers) {
        if ($container.PublicAccess -ne "Off") {
            $publicContainers += $container.Name
        }
    }
    
    if ($publicNetworkAccess -eq "Enabled" -or $publicContainers.Count -gt 0) {
        $publicAccounts += [PSCustomObject]@{
            StorageAccount    = $account.StorageAccountName
            ResourceGroup     = $account.ResourceGroupName
            PublicNetwork     = $publicNetworkAccess
            PublicContainers  = $publicContainers -join "; "
            ContainerCount    = $publicContainers.Count
        }
    }
}

Write-Host ""
Write-Host "=== Public Storage Exposure Report ===" -Foreground Cyan
Write-Host "Total storage accounts scanned: $($storageAccounts.Count)"
Write-Host "Accounts with public exposure:   $($publicAccounts.Count)" -Foreground Yellow
Write-Host ""

if ($publicAccounts.Count -gt 0) {
    Write-Host "EXPOSED RESOURCES (Review Immediately):" -Foreground Yellow
    $publicAccounts | Format-Table -AutoSize
    
    Write-Host ""
    Write-Host "RECOMMENDATION:" -Foreground Cyan
    Write-Host "1. Disable public network access: Set-AzStorageAccount -ResourceGroupName <RG> -Name <Account> -PublicNetworkAccess Disabled"
    Write-Host "2. For containers requiring limited access, use SAS tokens with expiration"
    Write-Host "3. Enable Private Endpoints for secure access from VNets"
}

$publicAccounts | Export-Csv -Path "./storage-public-access-report.csv" -NoTypeInformation
Write-Host ""
Write-Host "Report exported to ./storage-public-access-report.csv"`,
    output: `Scanning storageacct-prod...
Scanning storageacct-staging...
Scanning storageacct-logs...

=== Public Storage Exposure Report ===
Total storage accounts scanned: 12
Accounts with public exposure:   3

EXPOSED RESOURCES (Review Immediately):
StorageAccount       ResourceGroup    PublicNetwork    PublicContainers         ContainerCount
--------------       -------------    -------------    ----------------         --------------
storageacct-staging  rg-web          Enabled           uploads; temp-files     2
storageacct-logs     rg-monitoring   Enabled           public-reports; exports 2
storageacct-backup   rg-disaster     Enabled           (none)                  0

RECOMMENDATION:
1. Disable public network access: Set-AzStorageAccount -ResourceGroupName <RG> -Name <Account> -PublicNetworkAccess Disabled
2. For containers requiring limited access, use SAS tokens with expiration
3. Enable Private Endpoints for secure access from VNets

Report exported to ./storage-public-access-report.csv`,
    tags: ["Azure", "Storage", "Public Access", "Data Exposure"],
    date: "2026-05-19",
  },
  {
    id: "service-principal-secret-expiry",
    title: "Service Principal Secret Expiry Monitor",
    description: "Audit all app registrations and service principals for expiring client secrets and certificates. Prevents authentication failures from expired credentials.",
    category: "iam",
    language: "powershell",
    code: `Connect-MgGraph -Scopes "Application.Read.All", "Directory.Read.All"

$WarningThreshold = (Get-Date).AddDays(30)
$ExpiredThreshold = (Get-Date)

Write-Host "Scanning service principals for expiring credentials..." -Foreground Cyan

$apps = Get-MgApplication -All -Property Id, DisplayName, AppId, PasswordCredentials, KeyCredentials
$findings = @()

foreach ($app in $apps) {
    # Check password credentials (client secrets)
    foreach ($secret in $app.PasswordCredentials) {
        if ($secret.EndDateTime -lt $ExpiredThreshold) {
            $findings += [PSCustomObject]@{
                AppName     = $app.DisplayName
                AppId       = $app.AppId
                Type        = "Client Secret"
                Name        = $secret.DisplayName
                Status      = "EXPIRED"
                ExpiryDate  = $secret.EndDateTime
                DaysAgo     = ((Get-Date) - $secret.EndDateTime).Days
            }
        } elseif ($secret.EndDateTime -lt $WarningThreshold) {
            $daysLeft = ($secret.EndDateTime - (Get-Date)).Days
            $findings += [PSCustomObject]@{
                AppName     = $app.DisplayName
                AppId       = $app.AppId
                Type        = "Client Secret"
                Name        = $secret.DisplayName
                Status      = "EXPIRING_SOON"
                ExpiryDate  = $secret.EndDateTime
                DaysLeft    = $daysLeft
            }
        }
    }
    
    # Check certificate credentials
    foreach ($cert in $app.KeyCredentials) {
        if ($cert.EndDateTime -lt $ExpiredThreshold) {
            $findings += [PSCustomObject]@{
                AppName     = $app.DisplayName
                AppId       = $app.AppId
                Type        = "Certificate"
                Name        = $cert.DisplayName
                Status      = "EXPIRED"
                ExpiryDate  = $cert.EndDateTime
                DaysAgo     = ((Get-Date) - $cert.EndDateTime).Days
            }
        } elseif ($cert.EndDateTime -lt $WarningThreshold) {
            $daysLeft = ($cert.EndDateTime - (Get-Date)).Days
            $findings += [PSCustomObject]@{
                AppName     = $app.DisplayName
                AppId       = $app.AppId
                Type        = "Certificate"
                Name        = $cert.DisplayName
                Status      = "EXPIRING_SOON"
                ExpiryDate  = $cert.EndDateTime
                DaysLeft    = $daysLeft
            }
        }
    }
}

$expired = $findings | Where-Object Status -eq "EXPIRED"
$warning = $findings | Where-Object Status -eq "EXPIRING_SOON"

Write-Host ""
Write-Host "=== Service Principal Credential Report ===" -Foreground Cyan
Write-Host "Total apps scanned:           $($apps.Count)"
Write-Host "Expired credentials:        $($expired.Count)" -Foreground Red
Write-Host "Expiring within 30 days:    $($warning.Count)" -Foreground Yellow

if ($expired.Count -gt 0) {
    Write-Host ""
    Write-Host "EXPIRED CREDENTIALS (Will Cause Failures):" -Foreground Red
    $expired | Select-Object AppName, Type, Name, DaysAgo | Format-Table -AutoSize
}

if ($warning.Count -gt 0) {
    Write-Host ""
    Write-Host "EXPIRING SOON (Rotation Required):" -Foreground Yellow
    $warning | Select-Object AppName, Type, Name, DaysLeft | Format-Table -AutoSize
}

Write-Host ""
Write-Host "REMEDIATION:" -Foreground Cyan
Write-Host "1. Generate new secret: New-MgApplicationPasswordCredential -ApplicationId <AppId>"
Write-Host "2. Update downstream apps with new secret"
Write-Host "3. Remove old expired secret: Remove-MgApplicationPasswordCredential -ApplicationId <AppId> -KeyId <KeyId>"

$findings | Export-Csv -Path "./sp-credential-expiry-report.csv" -NoTypeInformation
Write-Host ""
Write-Host "Report exported to ./sp-credential-expiry-report.csv"`,
    output: `Scanning service principals for expiring credentials...

=== Service Principal Credential Report ===
Total apps scanned:           47
Expired credentials:        5
Expiring within 30 days:    12

EXPIRED CREDENTIALS (Will Cause Failures):
AppName              Type           Name                     DaysAgo
-------              ----           ----                     -------
backup-service-prd   Client Secret  vault-backup-secret        3
legacy-integration     Client Secret  old-api-key               45
monitoring-agent       Certificate    agent-auth-cert          12

EXPIRING SOON (Rotation Required):
AppName              Type           Name                     DaysLeft
-------              ----           ----                     ------
terraform-sp        Client Secret  tf-deployment-key         5
data-factory-svc    Client Secret  df-pipeline-secret        8
function-app-auth   Certificate    func-auth-cert           18

REMEDIATION:
1. Generate new secret: New-MgApplicationPasswordCredential -ApplicationId <AppId>
2. Update downstream apps with new secret
3. Remove old expired secret: Remove-MgApplicationPasswordCredential -ApplicationId <AppId> -KeyId <KeyId>

Report exported to ./sp-credential-expiry-report.csv`,
    tags: ["Entra ID", "Service Principal", "App Registration", "Secret Rotation"],
    date: "2026-05-19",
  },
];

