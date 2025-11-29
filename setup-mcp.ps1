$configDir = "$env:APPDATA\Claude"

# Create directory if it doesn't exist
if (-not (Test-Path -Path $configDir)) {
  New-Item -ItemType Directory -Path $configDir -Force | Out-Null
  Write-Host "Created directory: $configDir" -ForegroundColor Cyan
}

# Write configuration file
@"
{
  "mcpServers": {
    "whop": {
      "command": "npx",
      "args": ["-y", "@whop/mcp"],
      "env": {
        "WHOP_API_KEY": "apik_9fqqLuNxixXw7_A2019446_C_5e314cad3308b450606e183a432e1151c3b48af0e697e8bfe20b297eb17786",
        "WHOP_WEBHOOK_SECRET": "ws_5c28248d7f0f21676aca3a9554b72e75ce209494688c0d2a0c58a0110e55431b",
        "WHOP_APP_ID": "app_UT9gYVlk4Hmsgu"
      }
    }
  }
}
"@ | Out-File -FilePath "$configDir\claude_desktop_config.json" -Encoding UTF8

Write-Host "MCP configuration installed successfully!" -ForegroundColor Green
Write-Host "Please restart Claude Desktop to activate the Whop MCP server." -ForegroundColor Yellow
