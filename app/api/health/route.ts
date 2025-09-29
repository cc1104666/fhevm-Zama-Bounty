import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        nextjs: 'healthy',
      } as Record<string, string>
    };

    // Optional: Check Hardhat node connectivity
    try {
      const hardhatUrl = process.env.HARDHAT_RPC_URL || 'http://localhost:8545';
      const response = await fetch(hardhatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'web3_clientVersion',
          params: [],
          id: 1,
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        healthStatus.services = {
          ...healthStatus.services,
          hardhat: 'healthy',
        };
      } else {
        healthStatus.services = {
          ...healthStatus.services,
          hardhat: 'unhealthy',
        };
      }
    } catch (error) {
      healthStatus.services = {
        ...healthStatus.services,
        hardhat: 'unavailable',
      };
    }

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }, 
      { status: 500 }
    );
  }
}
