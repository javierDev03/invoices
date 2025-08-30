"use client"

import { useState, useEffect } from "react"
import { InvoiceForm } from "@/app/components/invoice-form"
import { InvoicePreview } from "@/app/components/invoice-preview"
import { Card } from "@/components/ui/card"
import { FileText, Sparkles, Zap, Github } from "lucide-react"

export interface InvoiceData {
  // Company info
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string

  // Client info
  clientName: string
  clientAddress: string
  clientPhone: string
  clientEmail: string

  // Invoice details
  invoiceNumber: string
  invoiceDate: string
  dueDate: string

  // Items
  items: Array<{
    id: string
    description: string
    quantity: number
    price: number
    total: number
  }>

  // Totals
  subtotal: number
  tax: number
  total: number

  // Notes
  notes: string
}

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
    invoiceNumber: "INV-001",
    invoiceDate: "",
    dueDate: "",
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: "",
  })

  useEffect(() => {
    setInvoiceData((prev) => ({
      ...prev,
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split("T")[0],
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20"></div>
              <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Generador de Facturas
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Profesional & Moderno</span>
                <Zap className="h-4 w-4 text-indigo-500" />
              </div>
            </div>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Crea facturas profesionales con diseño moderno. Completa los datos y genera tu factura en PDF con un diseño
            elegante y profesional.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
            <Card className="relative p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Datos de la Factura</h2>
              </div>
              <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
            </Card>
          </div>

          {/* Preview Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
            <Card className="relative p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Vista Previa</h2>
              </div>
              <InvoicePreview invoiceData={invoiceData} />
            </Card>
          </div>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
            >
              <Github className="h-5 w-5 text-slate-700" />
              <span className="text-slate-700 font-medium">Ver en GitHub</span>
            </a>
          </div>
          <p className="text-slate-500 text-lg">
            Generador de Facturas Open Source - Creado con <span className="text-red-500">❤️</span> para{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              pequeñas empresas y freelancers
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
