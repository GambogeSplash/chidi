"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, Phone, Mail, MapPin, ShoppingBag } from "lucide-react"

interface Customer {
  id: number
  name: string
  phone: string
  email?: string
  location?: string
  totalOrders: number
  totalSpent: string
  lastOrder: string
  status: "active" | "inactive" | "vip"
  notes?: string
  joinDate: string
  image?: string
}

interface CustomersTabProps {
  customers: Customer[]
  onAddCustomer: () => void
  onViewCustomer: (customer: Customer) => void
  onEditCustomer: (customer: Customer) => void
}

export function CustomersTab({ customers, onAddCustomer, onViewCustomer, onEditCustomer }: CustomersTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter = filterStatus === "all" || customer.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Customers</h2>
          <p className="text-sm text-muted-foreground">{customers.length} total customers</p>
        </div>
        <Button onClick={onAddCustomer} size="sm" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-1" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
          {filterStatus !== "all" && (
            <Badge variant="secondary" className="capitalize">
              {filterStatus}
            </Badge>
          )}
        </div>

        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "vip" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("vip")}
            >
              VIP
            </Button>
            <Button
              variant={filterStatus === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("inactive")}
            >
              Inactive
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No customers found</p>
              <Button onClick={onAddCustomer} className="mt-2" size="sm">
                Add Your First Customer
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onViewCustomer(customer)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 w-full">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                      {customer.image ? (
                        <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                      ) : null}
                      <AvatarFallback>
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-medium text-sm sm:text-base truncate">{customer.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(customer.status)}`}>
                          {customer.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span className="truncate">{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                        )}
                        {customer.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{customer.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-xs sm:text-sm w-full sm:w-auto">
                    <div className="font-medium">{customer.totalSpent}</div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      {customer.totalOrders} orders
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Last: {customer.lastOrder}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
