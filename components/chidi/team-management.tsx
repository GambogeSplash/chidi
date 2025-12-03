"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, MoreVertical, Mail, Phone, Shield, UserCheck, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TeamMember {
  id: number
  name: string
  email: string
  phone: string
  role: "owner" | "admin" | "staff"
  status: "active" | "inactive"
  joinedDate: string
  permissions: string[]
}

const INITIAL_TEAM = [
  {
    id: 1,
    name: "Business Owner",
    email: "owner@business.com",
    phone: "+234 801 234 5678",
    role: "owner" as const,
    status: "active" as const,
    joinedDate: "Jan 2024",
    permissions: ["all"],
  },
]

export function TeamManagement({ onBack }: { onBack: () => void }) {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff" as const,
  })

  const handleAddMember = () => {
    const member: TeamMember = {
      id: Math.max(...team.map((m) => m.id), 0) + 1,
      ...newMember,
      status: "active",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      permissions:
        newMember.role === "admin" ? ["manage_products", "manage_orders", "view_analytics"] : ["manage_orders"],
    }
    setTeam([...team, member])
    setShowAddModal(false)
    setNewMember({ name: "", email: "", phone: "", role: "staff" })
  }

  const handleRemoveMember = (id: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeam(team.filter((m) => m.id !== id))
    }
  }

  const handleToggleStatus = (id: number) => {
    setTeam(
      team.map((m) =>
        m.id === id ? { ...m, status: m.status === "active" ? ("inactive" as const) : ("active" as const) } : m,
      ),
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-sm text-muted-foreground">Manage staff access to CHIDI</p>
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{team.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{team.filter((m) => m.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{team.filter((m) => m.role === "admin").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <div className="space-y-3">
        {team.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge className={getRoleBadgeColor(member.role)}>{member.role.toUpperCase()}</Badge>
                      {member.status === "active" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          <UserX className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Joined {member.joinedDate}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.permissions.map((perm, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {perm.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {member.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                        {member.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-600">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Team Member Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+234 801 234 5678"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newMember.role}
                onValueChange={(value: any) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={!newMember.name || !newMember.email || !newMember.phone}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
