import { ResumeProfile } from './types'

/**
 * MOCK LAYER: Simulates Rialo RPC & Native HTTP calls.
 * Replace with @rialo/ts-cdk when DevNet opens.
 */
export async function fetchProfile(address: string): Promise<ResumeProfile> {
  await new Promise(r => setTimeout(r, 600))
  return {
    name: 'Builder Alpha',
    github: 'github/' + address.slice(0, 6),
    twitter: 'twitter/' + address.slice(0, 6),
    repos: Math.floor(Math.random() * 50) + 10,
    commits: Math.floor(Math.random() * 300) + 50,
    followers: Math.floor(Math.random() * 200) + 20,
    lastSync: new Date().toLocaleTimeString(),
    privacy: false,
    reactive: true,
    syncing: false
  }
}

export async function simulateReactiveUpdate(address: string) {
  console.log(`[Rialo Reactive] Triggered for ${address}. Executing native HTTP fetch...`)
  await new Promise(r => setTimeout(r, 1000))
}
