import { Metadata } from 'next'
import { DirectoryClient } from './directory-client'

export const metadata: Metadata = {
  title: 'MCP Server Directory - MCPHubz',
  description: 'Browse and discover Model Context Protocol servers. Find the perfect MCP integration for your AI applications.',
}

export default function DirectoryPage() {
  return <DirectoryClient />
}