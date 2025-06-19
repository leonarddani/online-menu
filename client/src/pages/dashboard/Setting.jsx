import Sidebar from "@/components/shared/dashboard/Sidebar/SideBar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock, Phone, Save } from "lucide-react"

const Setting = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar area - white background */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <Sidebar />
      </div>

      {/* Main content area - green background */}
      <div className="flex-1 bg-green-800 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-white">Manage your online menu account preferences</p>
          </div>

          {/* Profile Information Card */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="border-white">
            <CardHeader className="bg-white">
              <CardTitle className="flex items-center gap-2 text-black">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Keep your account secure with a strong password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white border-gray-300">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button className="flex-1 bg-green-600 border-gray-300 text-white">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
 export default Setting