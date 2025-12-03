"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  userProfile: any
  onUpdateProfile: (profile: any) => void
}

export function ProfileEditModal({ isOpen, onClose, userProfile, onUpdateProfile }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    ownerName: userProfile?.ownerName || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    businessName: userProfile?.businessName || "",
    businessDescription: userProfile?.businessDescription || "",
    address: userProfile?.address || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onUpdateProfile(formData)
    onClose()
  }

  const getInitials = () => {
    return (
      formData.ownerName
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase() || "BO"
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-transparent"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Click to change profile picture</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="ownerName" className="text-sm">
                Full Name
              </Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="businessName" className="text-sm">
                Business Name
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <Label htmlFor="businessDescription" className="text-sm">
                Business Description
              </Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                placeholder="Describe your business"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm">
                Business Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your business address"
                rows={2}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
