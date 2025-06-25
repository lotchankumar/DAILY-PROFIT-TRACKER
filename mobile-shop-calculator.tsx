"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, CreditCard, ShoppingCart, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { BalanceSummary } from "./components/balance-summary"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  time: string
  division: "recharge" | "money-transfer" | "daily-sales"
}

interface DivisionData {
  income: number
  expenses: number
  profit: number
  openingBalance: number
  closingBalance: number
  transactions: Transaction[]
}

export default function Component() {
  const [divisions, setDivisions] = useState<Record<string, DivisionData>>({
    recharge: { income: 0, expenses: 0, profit: 0, openingBalance: 0, closingBalance: 0, transactions: [] },
    "money-transfer": { income: 0, expenses: 0, profit: 0, openingBalance: 0, closingBalance: 0, transactions: [] },
    "daily-sales": { income: 0, expenses: 0, profit: 0, openingBalance: 0, closingBalance: 0, transactions: [] },
  })

  const [newTransaction, setNewTransaction] = useState({
    division: "recharge",
    type: "income",
    amount: "",
    description: "",
  })

  const [openingBalances, setOpeningBalances] = useState({
    recharge: "",
    "money-transfer": "",
    "daily-sales": "",
  })

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as "income" | "expense",
      amount: Number.parseFloat(newTransaction.amount),
      description: newTransaction.description,
      time: new Date().toLocaleTimeString(),
      division: newTransaction.division as "recharge" | "money-transfer" | "daily-sales",
    }

    setDivisions((prev) => {
      const updated = { ...prev }
      const division = updated[newTransaction.division]

      division.transactions.unshift(transaction)

      if (transaction.type === "income") {
        division.income += transaction.amount
      } else {
        division.expenses += transaction.amount
      }

      division.profit = division.income - division.expenses
      division.closingBalance = division.openingBalance + division.income - division.expenses

      return updated
    })

    setNewTransaction({
      division: "recharge",
      type: "income",
      amount: "",
      description: "",
    })
  }

  const setOpeningBalance = (division: string) => {
    const amount = Number.parseFloat(openingBalances[division as keyof typeof openingBalances])
    if (isNaN(amount)) return

    setDivisions((prev) => {
      const updated = { ...prev }
      updated[division].openingBalance = amount
      updated[division].closingBalance = amount + updated[division].income - updated[division].expenses
      return updated
    })

    setOpeningBalances((prev) => ({ ...prev, [division]: "" }))
  }

  const getTotalProfit = () => {
    return Object.values(divisions).reduce((total, division) => total + division.profit, 0)
  }

  const getTotalIncome = () => {
    return Object.values(divisions).reduce((total, division) => total + division.income, 0)
  }

  const getTotalExpenses = () => {
    return Object.values(divisions).reduce((total, division) => total + division.expenses, 0)
  }

  const getTotalOpeningBalance = () => {
    return Object.values(divisions).reduce((total, division) => total + division.openingBalance, 0)
  }

  const getTotalClosingBalance = () => {
    return Object.values(divisions).reduce((total, division) => total + division.closingBalance, 0)
  }

  const getDivisionIcon = (division: string) => {
    switch (division) {
      case "recharge":
        return <Smartphone className="h-4 w-4" />
      case "money-transfer":
        return <CreditCard className="h-4 w-4" />
      case "daily-sales":
        return <ShoppingCart className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getDivisionName = (division: string) => {
    switch (division) {
      case "recharge":
        return "Mobile Recharge"
      case "money-transfer":
        return "Money Transfer"
      case "daily-sales":
        return "Daily Sales"
      default:
        return division
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Mobile Shop Daily Calculator</h1>
          <p className="text-gray-600">Track your daily expenses and profits across all divisions</p>
          <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{getTotalIncome().toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{getTotalExpenses().toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTotalProfit() >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{getTotalProfit().toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {getTotalIncome() > 0 ? ((getTotalProfit() / getTotalIncome()) * 100).toFixed(1) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opening Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{getTotalOpeningBalance().toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closing Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{getTotalClosingBalance().toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Balance Flow Summary */}
        <BalanceSummary
          openingBalance={getTotalOpeningBalance()}
          totalIncome={getTotalIncome()}
          totalExpenses={getTotalExpenses()}
          closingBalance={getTotalClosingBalance()}
        />

        {/* Division Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(divisions).map(([key, division]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getDivisionIcon(key)}
                  {getDivisionName(key)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Income:</span>
                  <span className="font-medium text-green-600">₹{division.income.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expenses:</span>
                  <span className="font-medium text-red-600">₹{division.expenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Profit:</span>
                  <span className={`font-bold ${division.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{division.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Opening Balance:</span>
                  <span className="font-medium text-blue-600">₹{division.openingBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Closing Balance:</span>
                  <span className="font-bold text-green-600">₹{division.closingBalance.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Set Opening Balance
            </CardTitle>
            <CardDescription>
              Set the starting balance for each division (cash in hand, bank balance, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(divisions).map(([key, division]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`opening-${key}`} className="flex items-center gap-2">
                    {getDivisionIcon(key)}
                    {getDivisionName(key)}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`opening-${key}`}
                      type="number"
                      placeholder="0.00"
                      value={openingBalances[key as keyof typeof openingBalances]}
                      onChange={(e) => setOpeningBalances((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                    <Button
                      onClick={() => setOpeningBalance(key)}
                      disabled={!openingBalances[key as keyof typeof openingBalances]}
                    >
                      Set
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Current: ₹{division.openingBalance.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Transaction
            </CardTitle>
            <CardDescription>Record income or expenses for any division</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Select
                  value={newTransaction.division}
                  onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, division: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recharge">Mobile Recharge</SelectItem>
                    <SelectItem value="money-transfer">Money Transfer</SelectItem>
                    <SelectItem value="daily-sales">Daily Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={addTransaction} className="w-full">
                  Add Transaction
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>All transactions from today</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="recharge">Recharge</TabsTrigger>
                <TabsTrigger value="money-transfer">Money Transfer</TabsTrigger>
                <TabsTrigger value="daily-sales">Daily Sales</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(divisions)
                      .flatMap((division) => division.transactions)
                      .sort((a, b) => b.id.localeCompare(a.id))
                      .slice(0, 10)
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.time}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDivisionIcon(transaction.division)}
                              {getDivisionName(transaction.division)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {Object.entries(divisions).map(([key, division]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {division.transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.time}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
