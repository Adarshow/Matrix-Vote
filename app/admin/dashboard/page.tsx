"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Users,
  UserCheck,
  TrendingUp,
  Award,
  LogOut,
  Plus,
  Edit,
  Loader2,
  Shield,
  BarChart3,
  Search,
  Calendar,
  Mail,
  RefreshCw,
  Archive,
  RotateCcw,
  Clock,
  Linkedin,
  PieChart,
  Activity,
  Download,
  Settings,
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Line, Doughnut, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Admin {
  id: string
  name: string
  email: string
  role: string
}

interface Analytics {
  overview: {
    totalUsers: number
    totalCandidates: number
    totalVotes: number
    totalVoters: number
    participationRate: string
  }
  candidates: Array<{
    id: string
    name: string
    voteCount: number
    image: string
  }>
  recentVotes: Array<{
    id: string
    createdAt: string
    user: { name: string; email: string; linkedinUrl?: string }
  }>
  votingTrend: { [key: string]: number }
  voterDemographics: Array<{
    provider: string | null
    _count: number
  }>
}

interface Candidate {
  id: string
  name: string
  image: string
  bio: string
  linkedinUrl: string
  voteCount: number
  isArchived: boolean
  archivedAt?: string
  votes?: any[]
}

interface User {
  id: string
  name: string
  email: string
  linkedinUrl?: string
  provider?: string
  hasVoted: boolean
  createdAt: string
  vote?: {
    createdAt: string
    candidate: { name: string }
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [archivedCandidates, setArchivedCandidates] = useState<Candidate[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [candidatesView, setCandidatesView] = useState<"active" | "archived">("active")

  // Candidate dialog states
  const [candidateDialog, setCandidateDialog] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    image: "",
    bio: "",
    linkedinUrl: "",
  })
  const [formError, setFormError] = useState("")
  const [formLoading, setFormLoading] = useState(false)

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null)
  
  // Permanent delete confirmation
  const [permanentDeleteDialog, setPermanentDeleteDialog] = useState(false)
  const [candidateToDeletePermanently, setCandidateToDeletePermanently] = useState<string | null>(null)

  // Voting deadline states
  const [votingDeadline, setVotingDeadline] = useState<string>("")
  const [deadlineDialog, setDeadlineDialog] = useState(false)
  const [deadlineLoading, setDeadlineLoading] = useState(false)

  // Search states
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    verifyAuth()
  }, [])

  const verifyAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/verify")
      if (!response.ok) {
        router.push("/admin/login")
        return
      }
      const data = await response.json()
      setAdmin(data.admin)
      await fetchData()
    } catch (error) {
      router.push("/admin/login")
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [analyticsRes, candidatesRes, archivedRes, usersRes, settingsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/candidates"),
        fetch("/api/admin/candidates?archived=true"),
        fetch("/api/admin/users"),
        fetch("/api/admin/voting-settings"),
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }

      if (candidatesRes.ok) {
        const candidatesData = await candidatesRes.json()
        setCandidates(candidatesData)
      }

      if (archivedRes.ok) {
        const archivedData = await archivedRes.json()
        setArchivedCandidates(archivedData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        if (settingsData.votingDeadline) {
          const deadline = new Date(settingsData.votingDeadline)
          setVotingDeadline(deadline.toISOString().slice(0, 16))
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const openAddDialog = () => {
    setEditingCandidate(null)
    setCandidateForm({ name: "", image: "", bio: "", linkedinUrl: "" })
    setFormError("")
    setCandidateDialog(true)
  }

  const openEditDialog = (candidate: Candidate) => {
    setEditingCandidate(candidate)
    setCandidateForm({
      name: candidate.name,
      image: candidate.image,
      bio: candidate.bio,
      linkedinUrl: candidate.linkedinUrl,
    })
    setFormError("")
    setCandidateDialog(true)
  }

  const handleSaveCandidate = async () => {
    setFormError("")
    setFormLoading(true)

    try {
      const url = "/api/admin/candidates"
      const method = editingCandidate ? "PUT" : "POST"
      const body = editingCandidate
        ? { id: editingCandidate.id, ...candidateForm }
        : candidateForm

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        setFormError(data.error || "Failed to save candidate")
        return
      }

      setCandidateDialog(false)
      await fetchData()
    } catch (error) {
      setFormError("Something went wrong")
    } finally {
      setFormLoading(false)
    }
  }

  const handleArchiveCandidate = async () => {
    if (!candidateToDelete) return

    try {
      const response = await fetch(
        `/api/admin/candidates?id=${candidateToDelete}`,
        { method: "DELETE" }
      )

      if (response.ok) {
        setDeleteDialog(false)
        setCandidateToDelete(null)
        await fetchData()
      }
    } catch (error) {
      console.error("Archive error:", error)
    }
  }

  const handleRestoreCandidate = async (id: string) => {
    try {
      const response = await fetch("/api/admin/candidates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, restore: true }),
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Restore error:", error)
    }
  }

  const handlePermanentDelete = async () => {
    if (!candidateToDeletePermanently) return

    try {
      const response = await fetch(
        `/api/admin/candidates?id=${candidateToDeletePermanently}&permanent=true`,
        { method: "DELETE" }
      )

      if (response.ok) {
        setPermanentDeleteDialog(false)
        setCandidateToDeletePermanently(null)
        await fetchData()
      }
    } catch (error) {
      console.error("Permanent delete error:", error)
    }
  }

  const handleSaveDeadline = async () => {
    setDeadlineLoading(true)
    try {
      const response = await fetch("/api/admin/voting-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          votingDeadline: votingDeadline ? new Date(votingDeadline).toISOString() : null 
        }),
      })

      if (response.ok) {
        setDeadlineDialog(false)
        await fetchData()
      }
    } catch (error) {
      console.error("Save deadline error:", error)
    } finally {
      setDeadlineLoading(false)
    }
  }

  const handleGeneratePDF = async () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Matrix Vote Analytics Report", 14, 20)
    
    // Date
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 28)
    
    // Overview Statistics
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Overview Statistics", 14, 40)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Total Users: ${analytics?.overview.totalUsers || 0}`, 14, 48)
    doc.text(`Total Voters: ${analytics?.overview.totalVoters || 0}`, 14, 54)
    doc.text(`Participation Rate: ${analytics?.overview.participationRate || 0}%`, 14, 60)
    doc.text(`Total Candidates: ${analytics?.overview.totalCandidates || 0}`, 14, 66)
    
    // Candidates Table
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Candidate Results", 14, 80)
    
    const candidateData = analytics?.candidates.map((c) => [
      c.name,
      c.voteCount.toString(),
      `${((c.voteCount / (analytics?.overview.totalVotes || 1)) * 100).toFixed(1)}%`
    ]) || []
    
    autoTable(doc, {
      head: [['Candidate Name', 'Votes', 'Percentage']],
      body: candidateData,
      startY: 86,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
    })
    
    // Recent Votes
    const finalY = (doc as any).lastAutoTable.finalY || 98
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Recent Votes", 14, finalY + 14)
    
    const recentVotesData = analytics?.recentVotes.slice(0, 10).map((v) => [
      v.user.name,
      v.user.email,
      new Date(v.createdAt).toLocaleString(),
    ]) || []
    
    autoTable(doc, {
      head: [['Voter Name', 'Email', 'Vote Time']],
      body: recentVotesData,
      startY: finalY + 20,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
    })
    
    // Save PDF
    doc.save(`voting-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentCandidates = candidatesView === "active" ? candidates : archivedCandidates
  const filteredCandidates = currentCandidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Chart data
  const lineChartData = {
    labels: Object.keys(analytics?.votingTrend || {}),
    datasets: [
      {
        label: "Votes",
        data: Object.values(analytics?.votingTrend || {}),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const doughnutChartData = {
    labels: analytics?.voterDemographics.map((d) => d.provider || "credentials") || [],
    datasets: [
      {
        data: analytics?.voterDemographics.map((d) => d._count) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(249, 115, 22, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(249, 115, 22, 1)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const barChartData = {
    labels: analytics?.candidates.slice(0, 5).map((c) => c.name) || [],
    datasets: [
      {
        label: "Votes",
        data: analytics?.candidates.slice(0, 5).map((c) => c.voteCount) || [],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header with glassy effect */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                <Image
                  src="/logo.png"
                  alt="Matrix Vote Logo"
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Welcome back, {admin?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeadlineDialog(true)}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 text-xs"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Voting Deadline</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePDF}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 text-xs"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">PDF Report</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 text-xs"
              >
                <RefreshCw
                  className={`w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 text-xs"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/20 shadow-xl p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="candidates" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80">
              <Award className="w-4 h-4 mr-2" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards with glassy effect */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Users
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {analytics?.overview.totalUsers || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Voters
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {analytics?.overview.totalVoters || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl backdrop-blur-sm">
                    <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Participation Rate
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {analytics?.overview.participationRate || 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Candidates
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {analytics?.overview.totalCandidates || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl backdrop-blur-sm">
                    <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {/* Voting Trend Line Chart */}
              <Card className="p-4 md:p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                  <h3 className="text-sm md:text-lg font-semibold">Voting Trend (Last 7 Days)</h3>
                </div>
                <div className="h-48 md:h-64">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              </Card>
            </div>

            {/* Top Candidates Bar Chart */}
            <Card className="p-4 md:p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                <h3 className="text-sm md:text-lg font-semibold">Top 5 Candidates</h3>
              </div>
              <div className="h-48 md:h-64">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </Card>

            {/* Additional Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Participation Rate Chart */}
              <Card className="p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold">Voter Engagement</h3>
                </div>
                <div className="h-64">
                  <Doughnut 
                    data={{
                      labels: ['Voted', 'Not Voted'],
                      datasets: [{
                        data: [
                          analytics?.overview.totalVoters || 0,
                          (analytics?.overview.totalUsers || 0) - (analytics?.overview.totalVoters || 0)
                        ],
                        backgroundColor: [
                          'rgba(34, 197, 94, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                        ],
                        borderColor: [
                          'rgba(34, 197, 94, 1)',
                          'rgba(239, 68, 68, 1)',
                        ],
                        borderWidth: 2,
                      }],
                    }}
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: { 
                        legend: { position: 'bottom' },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const total = (analytics?.overview.totalUsers || 0);
                              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                              return `${label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </Card>
            </div>

            {/* Detailed Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Active Candidates</p>
                    <p className="text-2xl font-bold text-green-600">{candidates.length}</p>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Archived Candidates</p>
                    <p className="text-2xl font-bold text-orange-600">{archivedCandidates.length}</p>
                  </div>
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Archive className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Votes/Candidate</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {candidates.length > 0 
                        ? ((analytics?.overview.totalVotes || 0) / candidates.length).toFixed(1)
                        : 0}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-4 md:p-6 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                Recent Votes
              </h3>
              <div className="space-y-2 md:space-y-3">
                {analytics?.recentVotes.map((vote) => (
                  <div
                    key={vote.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 p-3 md:p-4 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50" />
                      <div>
                        <p className="font-medium text-sm md:text-base">{vote.user.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {vote.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 ml-4 sm:ml-0">
                      <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(vote.createdAt).toLocaleString()}
                      </div>
                      {vote.user.linkedinUrl && (
                        <a
                          href={vote.user.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <Linkedin className="w-3 h-3" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={candidatesView === "active" ? "default" : "outline"}
                  onClick={() => {
                    setCandidatesView("active")
                    setSearchTerm("")
                  }}
                  size="sm"
                  className={candidatesView === "active" ? "text-xs" : "backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 text-xs"}
                >
                  Active ({candidates.length})
                </Button>
                <Button
                  variant={candidatesView === "archived" ? "default" : "outline"}
                  onClick={() => {
                    setCandidatesView("archived")
                    setSearchTerm("")
                  }}
                  size="sm"
                  className={candidatesView === "archived" ? "text-xs" : "backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 text-xs"}
                >
                  <Archive className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Archived ({archivedCandidates.length})
                </Button>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:flex-1 sm:max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    className="pl-8 md:pl-10 text-xs md:text-sm backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {candidatesView === "active" && (
                  <Button onClick={openAddDialog} size="sm" className="shadow-lg text-xs whitespace-nowrap">
                    <Plus className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">Add</span>
                  </Button>
                )}
              </div>
            </div>

            <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-xs md:text-sm">Candidate</TableHead>
                    <TableHead className="text-xs md:text-sm hidden md:table-cell">Bio</TableHead>
                    <TableHead className="text-xs md:text-sm">LinkedIn</TableHead>
                    <TableHead className="text-xs md:text-sm">Votes</TableHead>
                    {candidatesView === "archived" && <TableHead className="text-xs md:text-sm hidden sm:table-cell">Archived</TableHead>}
                    <TableHead className="text-right text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="border-white/20">
                      <TableCell>
                        <div className="flex items-center gap-2 md:gap-3">
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border-2 border-white/20 shadow-lg"
                          />
                          <span className="font-medium text-xs md:text-sm">{candidate.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-xs md:text-sm hidden md:table-cell">
                        {candidate.bio}
                      </TableCell>
                      <TableCell>
                        <a
                          href={candidate.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs md:text-sm"
                        >
                          <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Profile</span>
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className="backdrop-blur-sm bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 text-xs"
                        >
                          {candidate.voteCount}
                        </Badge>
                      </TableCell>
                      {candidatesView === "archived" && (
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {candidate.archivedAt
                              ? new Date(candidate.archivedAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          {candidatesView === "active" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(candidate)}
                                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 p-1 md:p-2"
                              >
                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCandidateToDelete(candidate.id)
                                  setDeleteDialog(true)
                                }}
                                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 p-1 md:p-2"
                              >
                                <Archive className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestoreCandidate(candidate.id)}
                                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 text-xs"
                              >
                                <RotateCcw className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                                <span className="hidden md:inline">Restore</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCandidateToDeletePermanently(candidate.id)
                                  setPermanentDeleteDialog(true)
                                }}
                                className="backdrop-blur-sm bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-600 p-1 md:p-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 md:space-y-6">
            <div className="relative max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 md:pl-10 text-xs md:text-sm backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/20 shadow-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-xs md:text-sm">Name</TableHead>
                    <TableHead className="text-xs md:text-sm">Email</TableHead>
                    <TableHead className="text-xs md:text-sm">LinkedIn</TableHead>
                    <TableHead className="text-xs md:text-sm">Provider</TableHead>
                    <TableHead className="text-xs md:text-sm">Status</TableHead>
                    <TableHead className="text-xs md:text-sm">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-white/20">
                      <TableCell className="font-medium text-xs md:text-sm">
                        {user.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.linkedinUrl ? (
                          <a
                            href={user.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs md:text-sm"
                          >
                            <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">View</span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs md:text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className="backdrop-blur-sm bg-slate-500/10 text-[10px] sm:text-xs"
                        >
                          <span className="hidden sm:inline">{user.provider || "credentials"}</span>
                          <span className="sm:hidden">{(user.provider || "credentials").charAt(0).toUpperCase()}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.hasVoted ? (
                          <Badge 
                            variant="success"
                            className="backdrop-blur-sm bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 text-[10px] sm:text-xs"
                          >
                            <span className="hidden sm:inline">Voted</span>
                            <span className="sm:hidden">✓</span>
                          </Badge>
                        ) : (
                          <Badge 
                            variant="warning"
                            className="backdrop-blur-sm bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30 text-[10px] sm:text-xs"
                          >
                            <span className="hidden sm:inline">Not Voted</span>
                            <span className="sm:hidden">✗</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs md:text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Candidate Dialog */}
      <Dialog open={candidateDialog} onOpenChange={setCandidateDialog}>
        <DialogContent className="max-w-md backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/20">
          <DialogHeader>
            <DialogTitle>
              {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
            </DialogTitle>
            <DialogDescription>
              {editingCandidate
                ? "Update the candidate information below."
                : "Fill in the details to add a new candidate."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={candidateForm.name}
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, name: e.target.value })
                }
                placeholder="John Doe"
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={candidateForm.image}
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={candidateForm.bio}
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, bio: e.target.value })
                }
                placeholder="Brief description..."
                rows={3}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={candidateForm.linkedinUrl}
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    linkedinUrl: e.target.value,
                  })
                }
                placeholder="https://linkedin.com/in/username"
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCandidateDialog(false)}
              disabled={formLoading}
              className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCandidate} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/20">
          <DialogHeader>
            <DialogTitle>Archive Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this candidate? You can restore them
              later from the archived section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleArchiveCandidate}
              className="bg-gradient-to-r from-orange-500 to-red-500"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog open={permanentDeleteDialog} onOpenChange={setPermanentDeleteDialog}>
        <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-red-600">Permanently Delete Candidate</DialogTitle>
            <DialogDescription>
              <div className="space-y-2">
                <p className="font-semibold">⚠️ Warning: This action cannot be undone!</p>
                <p>Are you sure you want to permanently delete this candidate? All associated data including votes will be removed from the database.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPermanentDeleteDialog(false)}
              className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handlePermanentDelete}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Voting Deadline Dialog */}
      <Dialog open={deadlineDialog} onOpenChange={setDeadlineDialog}>
        <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/20">
          <DialogHeader>
            <DialogTitle>Set Voting Deadline</DialogTitle>
            <DialogDescription>
              Set an optional deadline for voting. Leave empty to allow voting indefinitely.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Voting Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={votingDeadline}
                onChange={(e) => setVotingDeadline(e.target.value)}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed as a countdown timer across all pages
              </p>
              {votingDeadline && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVotingDeadline("")}
                  className="w-full mt-2 backdrop-blur-sm bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Clear Deadline
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeadlineDialog(false)}
              disabled={deadlineLoading}
              className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveDeadline} 
              disabled={deadlineLoading}
            >
              {deadlineLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
