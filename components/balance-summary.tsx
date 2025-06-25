import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Wallet } from "lucide-react"

interface BalanceSummaryProps {
  openingBalance: number
  totalIncome: number
  totalExpenses: number
  closingBalance: number
}

export function BalanceSummary({ openingBalance, totalIncome, totalExpenses, closingBalance }: BalanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Daily Balance Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="text-center">
            <p className="text-gray-600">Opening Balance</p>
            <p className="text-2xl font-bold text-blue-600">₹{openingBalance.toFixed(2)}</p>
          </div>

          <ArrowRight className="h-4 w-4 text-gray-400" />

          <div className="text-center">
            <p className="text-gray-600">+ Income</p>
            <p className="text-xl font-semibold text-green-600">₹{totalIncome.toFixed(2)}</p>
          </div>

          <ArrowRight className="h-4 w-4 text-gray-400" />

          <div className="text-center">
            <p className="text-gray-600">- Expenses</p>
            <p className="text-xl font-semibold text-red-600">₹{totalExpenses.toFixed(2)}</p>
          </div>

          <ArrowRight className="h-4 w-4 text-gray-400" />

          <div className="text-center">
            <p className="text-gray-600">Closing Balance</p>
            <p className="text-2xl font-bold text-green-600">₹{closingBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Balance Change:{" "}
            <span
              className={`font-semibold ${(closingBalance - openingBalance) >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ₹{(closingBalance - openingBalance).toFixed(2)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
