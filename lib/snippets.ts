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
  {
    id: "pim-activation-audit",
    title: "PIM Activation Request Audit",
    description: "Audit Privileged Identity Management (PIM) activation requests from the last 90 days. Identifies unapproved activations, expired requests, and activation patterns by role.",
    category: "iam",
    language: "powershell",
    code: `Connect-MgGraph -Scopes "PrivilegedAccess.Read.AzureAD", "AuditLog.Read.All"

$daysBack = 90
$startDate = (Get-Date).AddDays(-$daysBack)

Write-Host "Fetching PIM activations from last $daysBack days..." -Foreground Cyan

# Get audit logs for PIM activations
$filter = "activityDisplayName eq 'Add member to role completed (PIM activated)' and activityDateTime ge $($startDate.ToString('yyyy-MM-ddTHH:mm:ssZ'))"
$auditLogs = Get-MgAuditLogDirectoryAudit -Filter $filter -All -ErrorAction SilentlyContinue

$report = @()
foreach ($log in $auditLogs) {
    $roleName = ($log.TargetResources | Where-Object { $_.Type -eq 'Role' }).DisplayName
    $userName = ($log.TargetResources | Where-Object { $_.Type -eq 'User' }).UserPrincipalName
    $activationReason = ($log.AdditionalDetails | Where-Object { $_.Key -eq 'RoleAssignmentReason' }).Value
    $approvalStatus = if ($log.Result -eq 'success') { 'Approved' } else { 'Pending/Failed' }
    
    # Calculate if still active (default PIM duration is usually 4-8 hours)
    $activationTime = $log.ActivityDateTime
    $endTime = $activationTime.AddHours(8)
    $isActive = ($endTime -gt (Get-Date))
    
    $report += [PSCustomObject]@{
        User           = $userName
        Role           = $roleName
        ActivatedAt    = $activationTime
        ExpiresAt      = $endTime
        IsActive       = if ($isActive) { "Yes" } else { "Expired" }
        Reason         = if ($activationReason) { $activationReason } else { "Not provided" }
        ApprovalStatus = $approvalStatus
        InitiatedBy    = $log.InitiatedBy.User.UserPrincipalName
    }
}

$activeNow = $report | Where-Object { $_.IsActive -eq "Yes" }
$expired = $report | Where-Object { $_.IsActive -eq "Expired" }
$noReason = $report | Where-Object { $_.Reason -eq "Not provided" }

Write-Host ""
Write-Host "=== PIM Activation Audit Report ===" -Foreground Cyan
Write-Host "Total activations:    $report.Count"
Write-Host "Currently active:     $($activeNow.Count)" -Foreground Green
Write-Host "Expired/completed:    $($expired.Count)"
Write-Host "Missing reason:       $($noReason.Count)" -Foreground Yellow

if ($activeNow.Count -gt 0) {
    Write-Host ""
    Write-Host "ACTIVE PRIVILEGED SESSIONS:" -Foreground Green
    $activeNow | Select-Object User, Role, ActivatedAt, ExpiresAt, Reason | Format-Table -AutoSize
}

if ($noReason.Count -gt 0) {
    Write-Host ""
    Write-Host "ACTIVATIONS WITHOUT BUSINESS JUSTIFICATION:" -Foreground Yellow
    $noReason | Select-Object User, Role, ActivatedAt | Format-Table -AutoSize
}

$report | Export-Csv -Path "./pim-activation-audit.csv" -NoTypeInformation
Write-Host ""
Write-Host "Report exported to ./pim-activation-audit.csv"`,
    output: `Fetching PIM activations from last 90 days...

=== PIM Activation Audit Report ===
Total activations:    156
Currently active:     12
Expired/completed:    144
Missing reason:       23

ACTIVE PRIVILEGED SESSIONS:
User                    Role                       ActivatedAt          ExpiresAt            Reason
----                    ----                       -----------          ---------            ------
hunter@eddington.tech   Global Administrator       5/22/2026 2:15 PM    5/22/2026 10:15 PM   Emergency Azure config
admin@eddington.tech    Privileged Role Admin      5/22/2026 10:30 AM   5/22/2026 6:30 PM    User offboarding
jcloud@partner.com      User Administrator         5/22/2026 8:45 AM    5/22/2026 4:45 PM    Bulk user import

ACTIVATIONS WITHOUT BUSINESS JUSTIFICATION:
User                    Role                       ActivatedAt
----                    ----                       -----------
legacyadmin@old.com     Security Administrator     5/20/2026 3:00 PM
contractor@vendor.com   Exchange Administrator     5/19/2026 11:00 AM

Report exported to ./pim-activation-audit.csv`,
    tags: ["Entra ID", "PIM", "Privileged Identity", "Audit"],
    date: "2026-05-22",
  },
  {
    id: "nsg-rule-security-analyzer",
    title: "NSG Rule Security Analyzer",
    description: "Analyze Network Security Group rules across all subnets and VMs to identify overly permissive configurations, open management ports, and potential lateral movement paths.",
    category: "security",
    language: "powershell",
    code: `Connect-AzAccount
$SubscriptionId = "your-subscription-id"
Select-AzSubscription -SubscriptionId $SubscriptionId

Write-Host "Scanning NSG rules for security issues..." -Foreground Cyan

$nsgs = Get-AzNetworkSecurityGroup
$findings = @()

$highRiskPorts = @(22, 23, 25, 53, 110, 143, 3389, 5985, 5986, 1433, 3306, 5432, 6379, 27017)
$managementPorts = @(22, 3389, 5985, 5986)  # SSH, RDP, WinRM

foreach ($nsg in $nsgs) {
    Write-Host "Analyzing $($nsg.Name)..." -Foreground Gray
    
    foreach ($rule in $nsg.SecurityRules) {
        $riskLevel = "Low"
        $issues = @()
        
        # Check for ANY source
        if ($rule.SourceAddressPrefix -eq "*" -or $rule.SourceAddressPrefix -eq "Internet") {
            $issues += "Open to Internet"
            $riskLevel = "HIGH"
        }
        
        # Check for ANY port
        if ($rule.DestinationPortRange -eq "*") {
            $issues += "All ports allowed"
            $riskLevel = "HIGH"
        }
        
        # Check for high-risk ports
        $destinationPorts = $rule.DestinationPortRange -split ","
        foreach ($port in $destinationPorts) {
            $portNum = 0
            if ([int]::TryParse($port, [ref]$portNum)) {
                if ($highRiskPorts -contains $portNum) {
                    $issues += "High-risk port $portNum"
                    if ($riskLevel -ne "HIGH") { $riskLevel = "MEDIUM" }
                }
                if ($managementPorts -contains $portNum -and ($rule.SourceAddressPrefix -eq "*" -or $rule.SourceAddressPrefix -eq "Internet")) {
                    $riskLevel = "CRITICAL"
                    $issues += "Management port exposed to Internet"
                }
            }
        }
        
        # Check for inbound allow rules
        if ($rule.Direction -eq "Inbound" -and $rule.Access -eq "Allow" -and $issues.Count -gt 0) {
            $findings += [PSCustomObject]@{
                NSGName         = $nsg.Name
                ResourceGroup   = $nsg.ResourceGroupName
                RuleName        = $rule.Name
                Direction       = $rule.Direction
                Priority        = $rule.Priority
                Source          = $rule.SourceAddressPrefix -join ", "
                Destination     = $rule.DestinationAddressPrefix -join ", "
                Ports           = $rule.DestinationPortRange
                Protocol        = $rule.Protocol
                RiskLevel       = $riskLevel
                Issues          = ($issues -join "; ")
            }
        }
    }
}

$criticalRisk = $findings | Where-Object { $_.RiskLevel -eq "CRITICAL" }
$highRisk = $findings | Where-Object { $_.RiskLevel -eq "HIGH" }
$mediumRisk = $findings | Where-Object { $_.RiskLevel -eq "MEDIUM" }

Write-Host ""
Write-Host "=== NSG Security Analysis Report ===" -Foreground Cyan
Write-Host "NSGs scanned:           $($nsgs.Count)"
Write-Host "CRITICAL findings:      $($criticalRisk.Count)" -Foreground Red
Write-Host "HIGH risk rules:        $($highRisk.Count)" -Foreground Yellow
Write-Host "MEDIUM risk rules:      $($mediumRisk.Count)" -Foreground Yellow

if ($criticalRisk.Count -gt 0) {
    Write-Host ""
    Write-Host "CRITICAL: Management ports exposed to Internet!" -Foreground Red
    $criticalRisk | Select-Object NSGName, RuleName, Source, Ports | Format-Table -AutoSize
}

if ($highRisk.Count -gt 0) {
    Write-Host ""
    Write-Host "HIGH RISK: Open to Internet or allow all ports" -Foreground Yellow
    $highRisk | Select-Object NSGName, RuleName, Source, Ports, Issues | Format-Table -AutoSize
}

$recommendations = @"

RECOMMENDATIONS:
1. Restrict source IPs: Replace '*' with specific IP ranges
2. Disable RDP/SSH from Internet: Use Bastion or VPN instead
3. Implement least privilege: Remove 'Any' port rules
4. Enable NSG flow logs for traffic analysis
5. Use Application Security Groups for micro-segmentation
"@

Write-Host $recommendations -Foreground Cyan

$findings | Export-Csv -Path "./nsg-security-analysis.csv" -NoTypeInformation
Write-Host ""
Write-Host "Full report exported to ./nsg-security-analysis.csv"`,
    output: `Scanning NSG rules for security issues...
Analyzing nsg-web-prod...
Analyzing nsg-db-tier...
Analyzing nsg-bastion...
Analyzing nsg-default...

=== NSG Security Analysis Report ===
NSGs scanned:           8
CRITICAL findings:      2
HIGH risk rules:        7
MEDIUM risk rules:      12

CRITICAL: Management ports exposed to Internet!
NSGName        RuleName        Source    Ports
-------        --------        ------    -----
nsg-web-prod   Allow-RDP       *         3389
nsg-default    Allow-SSH       Internet  22

HIGH RISK: Open to Internet or allow all ports
NSGName        RuleName            Source       Ports    Issues
-------        --------            ------       -----    ------
nsg-web-prod   Allow-All-Inbound   *            *        Open to Internet; All ports allowed
nsg-db-tier    Allow-SQL           0.0.0.0/0    1433     Open to Internet

RECOMMENDATIONS:
1. Restrict source IPs: Replace '*' with specific IP ranges
2. Disable RDP/SSH from Internet: Use Bastion or VPN instead
3. Implement least privilege: Remove 'Any' port rules
4. Enable NSG flow logs for traffic analysis
5. Use Application Security Groups for micro-segmentation

Full report exported to ./nsg-security-analysis.csv`,
    tags: ["Azure", "NSG", "Network Security", "Firewall Rules"],
    date: "2026-05-22",
  },
  {
    id: "defender-recommendations-exporter",
    title: "Microsoft Defender for Cloud Recommendations Exporter",
    description: "Export and prioritize security recommendations from Defender for Cloud across all subscriptions. Identifies high-severity findings with actionable remediation steps.",
    category: "security",
    language: "powershell",
    code: `Connect-AzAccount

# Set subscription(s) to scan - leave empty for all accessible subscriptions
$targetSubscriptions = @()  # @("sub-id-1", "sub-id-2") for specific subs

if ($targetSubscriptions.Count -eq 0) {
    $subscriptions = Get-AzSubscription | Where-Object { $_.State -eq 'Enabled' }
} else {
    $subscriptions = $targetSubscriptions | ForEach-Object { Get-AzSubscription -SubscriptionId $_ }
}

Write-Host "Scanning $($subscriptions.Count) subscription(s)..." -Foreground Cyan

$allRecommendations = @()

foreach ($sub in $subscriptions) {
    Write-Host "Processing $($sub.Name)..." -Foreground Gray
    
    try {
        Select-AzSubscription -SubscriptionId $sub.Id -ErrorAction Stop | Out-Null
        
        # Get Security Recommendations
        $recommendations = Get-AzSecurityRecommendation | Where-Object { $_.RecommendationType -ne $null }
        
        foreach ($rec in $recommendations) {
            $severity = switch ($rec.RecommendationSeverity) {
                "High" { "HIGH" }
                "Medium" { "MEDIUM" }
                "Low" { "LOW" }
                default { $rec.RecommendationSeverity }
            }
            
            $allRecommendations += [PSCustomObject]@{
                SubscriptionId   = $sub.Id
                SubscriptionName = $sub.Name
                Recommendation   = $rec.RecommendationDisplayName
                ResourceType     = $rec.ResourceDetails.ResourceType
                ResourceName     = $rec.ResourceDetails.Resource.Name
                Severity         = $severity
                State            = $rec.RecommendationState
                Description      = if ($rec.Description) { $rec.Description.Substring(0, [Math]::Min(200, $rec.Description.Length)) } else { "N/A" }
                RemediationSteps = if ($rec.RemediationSteps) { ($rec.RemediationSteps -join "; ").Substring(0, [Math]::Min(300, ($rec.RemediationSteps -join "; ").Length)) } else { "See Azure Portal" }
                FirstFound       = $rec.TimeGenerated
                HealthyResources = $rec.HealthyResources
                UnhealthyResources = $rec.UnhealthyResources
            }
        }
    }
    catch {
        Write-Warning "Failed to scan $($sub.Name): $_.Exception.Message"
    }
}

# Analysis
$highSeverity = $allRecommendations | Where-Object { $_.Severity -eq "HIGH" }
$mediumSeverity = $allRecommendations | Where-Object { $_.Severity -eq "MEDIUM" }
$unhealthy = $allRecommendations | Where-Object { $_.State -eq "Unhealthy" }

Write-Host ""
Write-Host "=== Defender for Cloud Recommendations Report ===" -Foreground Cyan
Write-Host "Total recommendations:    $($allRecommendations.Count)"
Write-Host "High severity:            $($highSeverity.Count)" -Foreground Red
Write-Host "Medium severity:          $($mediumSeverity.Count)" -Foreground Yellow
Write-Host "Unhealthy resources:      $($unhealthy.Count)" -Foreground Yellow
Write-Host ""

# Group by recommendation type for prioritization
$grouped = $allRecommendations | Group-Object Recommendation | Sort-Object Count -Descending | Select-Object -First 10
Write-Host "Top Recommendation Categories:" -Foreground Cyan
$grouped | Select-Object Name, Count | Format-Table -AutoSize

if ($highSeverity.Count -gt 0) {
    Write-Host ""
    Write-Host "HIGH SEVERITY FINDINGS (Immediate Action Required):" -Foreground Red
    $highSeverity | Select-Object SubscriptionName, Recommendation, ResourceName, ResourceType |
        Format-Table -AutoSize
}

$allRecommendations | Export-Csv -Path "./defender-recommendations.csv" -NoTypeInformation
Write-Host ""
Write-Host "Full report exported to ./defender-recommendations.csv"
Write-Host ""
Write-Host "NEXT STEPS:" -Foreground Cyan
Write-Host "1. Review HIGH severity items in Azure Portal > Security Center"
Write-Host "2. Use Secure Score to track improvement"
Write-Host "3. Enable auto-remediation where applicable"
Write-Host "4. Assign recommendations to resource owners"`,
    output: `Scanning 1 subscription(s)...
Processing Eddington Production...

=== Defender for Cloud Recommendations Report ===
Total recommendations:    87
High severity:            12
Medium severity:          45
Unhealthy resources:      63

Top Recommendation Categories:
Name                                                                       Count
----                                                                       -----
Storage account should use a customer-managed key                          8
Web Application should have Incoming client certificates enabled            6
Machines should have a vulnerability assessment solution                     5
Audit SQL servers should have Advanced Data Security enabled                 5
Storage accounts should restrict network access using virtual network rules  4

HIGH SEVERITY FINDINGS (Immediate Action Required):
SubscriptionName       Recommendation                                          ResourceName                ResourceType
----------------       --------------                                          ------------                ------------
Eddington Production Internet-facing ports should be restricted              nsg-web-vm                  Microsoft.Network/networkSecurityGroups
Eddington Production Management ports should be protected with JIT access    hunter-workstation          Microsoft.Compute/virtualMachines
Eddington Production Storage account public access should be disallowed      storageacct-prod-logs       Microsoft.Storage/storageAccounts
Eddington Production Key Vault should have soft delete enabled               kv-prod-secrets             Microsoft.KeyVault/vaults

Full report exported to ./defender-recommendations.csv

NEXT STEPS:
1. Review HIGH severity items in Azure Portal > Security Center
2. Use Secure Score to track improvement
3. Enable auto-remediation where applicable
4. Assign recommendations to resource owners`,
    tags: ["Defender for Cloud", "Azure Security Center", "Compliance", "Security Posture"],
    date: "2026-05-22",
  },
  {
    id: "azure-rbac-permissions-audit",
    title: "Azure RBAC Permissions Audit and Overprivileged Detection",
    description: "Export all Azure RBAC role assignments across subscriptions to identify overprivileged accounts, external guests with elevated roles, and service principals with excessive permissions.",
    category: "iam",
    language: "powershell",
    code: String.raw`Connect-AzAccount

$Subscriptions = Get-AzSubscription | Where-Object { $_.State -eq 'Enabled' }
$PrivilegedRoles = @(
    "Owner",
    "Contributor",
    "User Access Administrator",
    "Role Based Access Control Administrator"
)

$report = @()
$stats = @{
    TotalAssignments       = 0
    PrivilegedAssignments  = 0
    ExternalGuestElevated  = 0
    ServicePrincipalOwner  = 0
}

Write-Host "Scanning $($Subscriptions.Count) subscriptions for RBAC assignments..." -Foreground Cyan

foreach ($sub in $Subscriptions) {
    Write-Host "Processing: $($sub.Name)" -Foreground Gray
    Select-AzSubscription -SubscriptionId $sub.Id | Out-Null

    try {
        $assignments = Get-AzRoleAssignment -ErrorAction SilentlyContinue

        foreach ($assignment in $assignments) {
            $stats.TotalAssignments++

            $isPrivileged = $PrivilegedRoles -contains $assignment.RoleDefinitionName
            $isExternal = $assignment.SignInName -like "*#EXT#*" -or $assignment.SignInName -match "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            $isServicePrincipal = $assignment.ObjectType -eq "ServicePrincipal"
            $isGuest = $assignment.ObjectType -eq "User" -and ($assignment.SignInName -notmatch "@(eddington\.tech|eddington\.com)$")

            $riskLevel = "Low"
            $issues = @()

            if ($isPrivileged) {
                $stats.PrivilegedAssignments++
                if ($isExternal -or $isGuest) {
                    $riskLevel = "HIGH"
                    $issues += "External/Guest with privileged role"
                    $stats.ExternalGuestElevated++
                }
                if ($isServicePrincipal) {
                    $issues += "Service Principal with elevated access"
                    $stats.ServicePrincipalOwner++
                    if ($assignment.RoleDefinitionName -eq "Owner") {
                        $riskLevel = "CRITICAL"
                    } elseif ($riskLevel -ne "CRITICAL") {
                        $riskLevel = "MEDIUM"
                    }
                }
            }

            if ($issues.Count -gt 0 -or $isPrivileged) {
                $report += [PSCustomObject]@{
                    SubscriptionId    = $sub.Id
                    SubscriptionName  = $sub.Name
                    PrincipalName     = if ($assignment.SignInName) { $assignment.SignInName } else { $assignment.DisplayName }
                    PrincipalType     = $assignment.ObjectType
                    Role              = $assignment.RoleDefinitionName
                    Scope             = $assignment.Scope
                    RiskLevel         = $riskLevel
                    Issues            = ($issues -join "; ")
                    IsPrivileged      = $isPrivileged
                }
            }
        }
    }
    catch {
        Write-Warning "Failed to scan $($sub.Name): $_ExceptionMessage"
    }
}

$criticalRisk = $report | Where-Object { $_.RiskLevel -eq "CRITICAL" }
$highRisk = $report | Where-Object { $_.RiskLevel -eq "HIGH" }
$mediumRisk = $report | Where-Object { $_.RiskLevel -eq "MEDIUM" }

Write-Host ""
Write-Host "=== Azure RBAC Permissions Audit ===" -Foreground Cyan
Write-Host "Subscriptions scanned:        $($Subscriptions.Count)"
Write-Host "Total role assignments:     $($stats.TotalAssignments)"
Write-Host "Privileged assignments:     $($stats.PrivilegedAssignments)"
Write-Host "CRITICAL risk:              $($criticalRisk.Count)" -Foreground Red
Write-Host "HIGH risk:                  $($highRisk.Count)" -Foreground Yellow
Write-Host "External/Guest privileged:  $($stats.ExternalGuestElevated)" -Foreground Yellow

if ($criticalRisk.Count -gt 0) {
    Write-Host ""
    Write-Host "CRITICAL: Service Principals with Owner role!" -Foreground Red
    $criticalRisk | Select-Object PrincipalName, SubscriptionName, Scope | Format-Table -AutoSize
}

if ($highRisk.Count -gt 0) {
    Write-Host ""
    Write-Host "HIGH RISK: External/Guest accounts with privileged access" -Foreground Yellow
    $highRisk | Select-Object PrincipalName, Role, SubscriptionName, Issues | Format-Table -AutoSize
}

$report | Export-Csv -Path "./azure-rbac-permissions-audit.csv" -NoTypeInformation
Write-Host ""
Write-Host "Full report exported to ./azure-rbac-permissions-audit.csv"`,
    output: String.raw`Scanning 4 subscriptions for RBAC assignments...
Processing: Eddington Production
Processing: Eddington Staging
Processing: Eddington Dev
Processing: Eddington Shared Services

=== Azure RBAC Permissions Audit ===
Subscriptions scanned:        4
Total role assignments:     127
Privileged assignments:     34
CRITICAL risk:              3
HIGH risk:                  8
External/Guest privileged:  5

CRITICAL: Service Principals with Owner role!
PrincipalName                 SubscriptionName        Scope
-------------                 ----------------        -----
terraform-sp-eddington        Eddington Production    /subscriptions/a1b2c3d4...
legacy-deployment-svc         Eddington Staging       /subscriptions/e5f6g7h8...
backup-automation-sp          Eddington Shared        /subscriptions/i9j0k1l2...

HIGH RISK: External/Guest accounts with privileged access
PrincipalName                 Role                    SubscriptionName      Issues
-------------                 ----                    ----------------      ------
consultant@vendor.com#EXT#    Contributor             Eddington Production  External/Guest with privileged role
contractor@partner.com#EXT#   Owner                   Eddington Staging     External/Guest with privileged role
external-auditor@firm.com     User Access Admin       Eddington Shared      External/Guest with privileged role

Full report exported to ./azure-rbac-permissions-audit.csv`,
    tags: ["Azure", "RBAC", "IAM", "Privileged Access", "Audit"],
    date: "2026-05-29",
  },
  {
    id: "jit-access-request-tracker",
    title: "JIT VM Access Request Tracker and Audit",
    description: "Monitor and audit Just-In-Time (JIT) VM access requests across Azure subscriptions. Tracks active JIT sessions, analyzes request patterns, and identifies failed or suspicious access attempts.",
    category: "security",
    language: "powershell",
    code: String.raw`Connect-AzAccount

$Subscriptions = Get-AzSubscription | Where-Object { $_.State -eq 'Enabled' }
$DaysBack = 30
$StartDate = (Get-Date).AddDays(-$DaysBack)

$report = @()
$stats = @{
    TotalRequests     = 0
    ApprovedRequests  = 0
    DeniedRequests    = 0
    ActiveSessions    = 0
    ExpiredSessions   = 0
}

Write-Host "Fetching JIT access requests from last $DaysBack days..." -Foreground Cyan

foreach ($sub in $Subscriptions) {
    Select-AzSubscription -SubscriptionId $sub.Id | Out-Null

    try {
        # Get JIT policies and active requests
        $jitPolicies = Get-AzJitNetworkAccessPolicy -ErrorAction SilentlyContinue

        foreach ($policy in $jitPolicies) {
            $vmName = $policy.VirtualMachine.Name
            $resourceGroup = $policy.VirtualMachine.ResourceGroup

            foreach ($rule in $policy.VirtualMachines) {
                foreach ($port in $rule.Ports) {
                    $requestHistory = Get-AzJitNetworkAccessPolicy -ResourceGroupName $resourceGroup -Name $policy.Name -ErrorAction SilentlyContinue

                    if ($requestHistory) {
                        foreach ($req in $requestHistory.Requests) {
                            if ($req.StartTimeUtc -gt $StartDate) {
                                $stats.TotalRequests++

                                $status = $req.Status
                                if ($status -eq "Approved") { $stats.ApprovedRequests++ }
                                if ($status -eq "Denied") { $stats.DeniedRequests++ }

                                # Check if session is still active
                                $endTime = $req.EndTimeUtc
                                $isActive = ($endTime -gt (Get-Date).ToUniversalTime())
                                if ($isActive) { $stats.ActiveSessions++ } else { $stats.ExpiredSessions++ }

                                $report += [PSCustomObject]@{
                                    SubscriptionId   = $sub.Id
                                    SubscriptionName = $sub.Name
                                    VMName           = $vmName
                                    ResourceGroup    = $resourceGroup
                                    Requestor        = $req.Requestor
                                    StartTime        = $req.StartTimeUtc
                                    EndTime          = $endTime
                                    Status           = $status
                                    IsActive         = if ($isActive) { "Yes" } else { "No" }
                                    Port             = $port.Number
                                    AllowedSourceIP  = ($req.SourceIPs -join "; ")
                                    DurationMinutes  = ($endTime - $req.StartTimeUtc).TotalMinutes
                                    Justification    = if ($req.Justification) { $req.Justification } else { "Not provided" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    catch {
        Write-Warning "Failed to scan $($sub.Name): $_ExceptionMessage"
    }
}

$activeNow = $report | Where-Object { $_.IsActive -eq "Yes" }
$deniedRequests = $report | Where-Object { $_.Status -eq "Denied" }
$noJustification = $report | Where-Object { $_.Justification -eq "Not provided" }

Write-Host ""
Write-Host "=== JIT Access Request Tracker ===" -Foreground Cyan
Write-Host "Subscriptions scanned:  $($Subscriptions.Count)"
Write-Host "Total JIT requests:     $($stats.TotalRequests)"
Write-Host "Approved:               $($stats.ApprovedRequests)"
Write-Host "Denied:                 $($stats.DeniedRequests)"
Write-Host "Currently active:       $($activeNow.Count)" -Foreground Green
Write-Host "Expired:                $($stats.ExpiredSessions)"
Write-Host "Missing justification:  $($noJustification.Count)"

if ($activeNow.Count -gt 0) {
    Write-Host ""
    Write-Host "ACTIVE JIT SESSIONS:" -Foreground Green
    $activeNow | Select-Object VMName, Requestor, StartTime, EndTime, Port | Format-Table -AutoSize
}

if ($deniedRequests.Count -gt 0) {
    Write-Host ""
    Write-Host "DENIED REQUESTS (Review for policy violations):" -Foreground Yellow
    $deniedRequests | Select-Object VMName, Requestor, StartTime, Justification | Format-Table -AutoSize
}

# Top requestors analysis
$topRequestors = $report | Group-Object Requestor | Sort-Object Count -Descending | Select-Object -First 5
Write-Host ""
Write-Host "Top JIT Requestors:" -Foreground Cyan
$topRequestors | Select-Object Name, Count | Format-Table -AutoSize

$report | Export-Csv -Path "./jit-access-request-tracker.csv" -NoTypeInformation
Write-Host ""
Write-Host "Full report exported to ./jit-access-request-tracker.csv"`,
    output: String.raw`Fetching JIT access requests from last 30 days...

=== JIT Access Request Tracker ===
Subscriptions scanned:  3
Total JIT requests:     156
Approved:               148
Denied:                 8
Currently active:       12
Expired:                144
Missing justification:  23

ACTIVE JIT SESSIONS:
VMName                Requestor               StartTime             EndTime               Port
------                ---------               ---------             -------               ----
vm-admin-prod-01      hunter@eddington.tech   5/29/2026 1:30 PM     5/29/2026 9:30 PM     3389
vm-webserver-02       admin@eddington.tech      5/29/2026 8:00 AM     5/29/2026 4:00 PM     22
vm-db-primary         dbadmin@eddington.tech    5/29/2026 9:15 AM     5/29/2026 5:15 PM     1433

DENIED REQUESTS (Review for policy violations):
VMName                Requestor                 StartTime             Justification
------                ---------                 ---------             -------------
vm-domain-controller  unknown@external.com      5/28/2026 3:00 PM
vm-admin-prod-01      consultant@vendor.com     5/27/2026 11:00 AM    Emergency access

Top JIT Requestors:
Name                                  Count
----                                  -----
hunter@eddington.tech                 42
admin@eddington.tech                  28
jcloud@eddington.tech               19

Full report exported to ./jit-access-request-tracker.csv`,
    tags: ["Azure", "JIT", "VM Access", "Security Center", "Audit"],
    date: "2026-05-29",
  },
  {
    id: "dlp-policy-incident-exporter",
    title: "Microsoft 365 DLP Policy Incident Exporter",
    description: "Export Data Loss Prevention (DLP) policy incidents from Microsoft 365 to analyze data exfiltration attempts, policy violations by department, and trends over time for compliance reporting.",
    category: "security",
    language: "powershell",
    code: String.raw`Connect-IPPSSession

$DaysBack = 90
$StartDate = (Get-Date).AddDays(-$DaysBack)
$EndDate = (Get-Date)

Write-Host "Fetching DLP incidents from last $DaysBack days..." -Foreground Cyan

try {
    # Get DLP incidents
    $incidents = Get-DlpIncidentDetailReport -StartDate $StartDate -EndDate $EndDate -ErrorAction SilentlyContinue

    $report = @()
    $stats = @{
        TotalIncidents        = 0
        HighSeverity          = 0
        MediumSeverity        = 0
        LowSeverity           = 0
        FalsePositive         = 0
        PolicyOverride        = 0
    }

    foreach ($incident in $incidents) {
        $stats.TotalIncidents++

        # Track severity
        switch ($incident.Severity) {
            "High" { $stats.HighSeverity++ }
            "Medium" { $stats.MediumSeverity++ }
            "Low" { $stats.LowSeverity++ }
        }

        if ($incident.Status -eq "FalsePositive") { $stats.FalsePositive++ }
        if ($incident.Status -eq "Override") { $stats.PolicyOverride++ }

        $report += [PSCustomObject]@{
            IncidentId      = $incident.IncidentId
            CreatedTime     = $incident.CreationDate
            PolicyName      = $incident.PolicyName
            RuleName        = $incident.RuleName
            Severity        = $incident.Severity
            Status          = $incident.Status
            UserPrincipalName = $incident.UserPrincipalName
            Department      = if ($incident.Department) { $incident.Department } else { "Unknown" }
            Location        = $incident.Location
            Operation       = $incident.Operation
            ObjectId        = $incident.ObjectId
            SensitiveInfoTypes = ($incident.SensitiveInfoType -join "; ")
            DetectedValues  = if ($incident.DetectedValues) { ($incident.DetectedValues -join "; ").Substring(0, [Math]::Min(200, ($incident.DetectedValues -join "; ").Length)) } else { "N/A" }
            FalsePositive   = if ($incident.Status -eq "FalsePositive") { "Yes" } else { "No" }
            PolicyOverride  = if ($incident.Status -eq "Override") { "Yes" } else { "No" }
            OverrideJustification = if ($incident.OverrideJustification) { $incident.OverrideJustification } else { "N/A" }
        }
    }

    # Analysis
    $highSeverity = $report | Where-Object { $_.Severity -eq "High" }
    $byPolicy = $report | Group-Object PolicyName | Sort-Object Count -Descending | Select-Object -First 5
    $byDepartment = $report | Group-Object Department | Sort-Object Count -Descending | Select-Object -First 5

    Write-Host ""
    Write-Host "=== DLP Policy Incident Report ===" -Foreground Cyan
    Write-Host "Date range:             $DaysBack days"
    Write-Host "Total incidents:          $($stats.TotalIncidents)"
    Write-Host "High severity:            $stats.HighSeverity"
    Write-Host "Medium severity:          $stats.MediumSeverity"
    Write-Host "Low severity:             $stats.LowSeverity"
    Write-Host "False positives:          $($stats.FalsePositive)"
    Write-Host "Policy overrides:         $($stats.PolicyOverride)"

    if ($highSeverity.Count -gt 0) {
        Write-Host ""
        Write-Host "HIGH SEVERITY INCIDENTS:" -Foreground Red
        $highSeverity | Select-Object CreatedTime, UserPrincipalName, PolicyName, SensitiveInfoTypes | Format-Table -AutoSize
    }

    Write-Host ""
    Write-Host "Top DLP Policies Triggered:" -Foreground Cyan
    $byPolicy | Select-Object Name, Count | Format-Table -AutoSize

    Write-Host ""
    Write-Host "Incidents by Department:" -Foreground Cyan
    $byDepartment | Select-Object Name, Count | Format-Table -AutoSize

    $report | Export-Csv -Path "./dlp-incidents-report.csv" -NoTypeInformation
    Write-Host ""
    Write-Host "Full report exported to ./dlp-incidents-report.csv" -Foreground Green
}
catch {
    Write-Error "Failed to retrieve DLP incidents. Ensure you have the required permissions: $_ExceptionMessage"
}`,
    output: String.raw`Fetching DLP incidents from last 90 days...

=== DLP Policy Incident Report ===
Date range:             90 days
Total incidents:          247
High severity:            18
Medium severity:          89
Low severity:             140
False positives:          23
Policy overrides:         12

HIGH SEVERITY INCIDENTS:
CreatedTime          UserPrincipalName          PolicyName                SensitiveInfoTypes
-----------          -----------------          ----------                ------------------
5/28/2026 2:15 PM    executive@eddington.tech   Credit Card Data Export   Credit Card Number
5/27/2026 11:03 AM   sales@eddington.tech       PII Email Disclosure      Social Security Number; US Person Name
5/25/2026 9:47 AM    contractor@vendor.com      HIPAA Content Sharing     Medical Term; US Person Name

Top DLP Policies Triggered:
Name                                            Count
----                                            -----
Financial Data Protection                       68
PII Email Filter                                52
HIPAA Compliance - Healthcare Data              38
GDPR - EU Personal Data                         45
Confidential Document Label                     44

Incidents by Department:
Name             Count
----             -----
Sales            89
Engineering      67
HR               34
Finance          31
Legal            26

Full report exported to ./dlp-incidents-report.csv`,
    tags: ["Microsoft 365", "DLP", "Data Loss Prevention", "Compliance", "MIP"],
    date: "2026-05-29",
  },
];

