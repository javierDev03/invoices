"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Eye, Sparkles } from "lucide-react"
import type { InvoiceData } from "@/app/page"

interface InvoicePreviewProps {
  invoiceData: InvoiceData
}

export function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const generatePDF = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    // Modern color palette
    const primaryColor = [59, 130, 246] // Blue-500
    const secondaryColor = [99, 102, 241] // Indigo-500
    const textColor = [30, 41, 59] // Slate-800
    const mutedColor = [100, 116, 139] // Slate-500

    const addHeader = (pageNumber = 1) => {
      // Header with gradient-like effect
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, 210, 40, "F")

      doc.setFillColor(99, 102, 241)
      doc.rect(0, 35, 210, 10, "F")

      // Company name in white on colored background
      doc.setFont("helvetica", "bold")
      doc.setFontSize(24)
      doc.setTextColor(255, 255, 255)
      doc.text(invoiceData.companyName || "Mi Empresa", 20, 25)

      // Company details in white
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      let yPos = 32
      if (invoiceData.companyAddress) {
        const addressLines = invoiceData.companyAddress.split("\n")
        addressLines.forEach((line, index) => {
          if (yPos < 40) {
            doc.text(line, 20, yPos)
            yPos += 4
          }
        })
      }

      // Invoice title and details in top right
      doc.setFont("helvetica", "bold")
      doc.setFontSize(28)
      doc.setTextColor(255, 255, 255)
      doc.text("FACTURA", 140, 25)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`#${invoiceData.invoiceNumber}`, 140, 32)
      doc.text(`Fecha: ${invoiceData.invoiceDate}`, 140, 37)

      // Page number
      if (pageNumber > 1) {
        doc.setFontSize(8)
        doc.setTextColor(255, 255, 255)
        doc.text(`Página ${pageNumber}`, 180, 37)
      }
    }

    addHeader(1)

    // Reset to normal background
    doc.setTextColor(...textColor)

    // Company contact info below header
    let yPos = 55
    doc.setFontSize(9)
    doc.setTextColor(...mutedColor)
    if (invoiceData.companyPhone) {
      doc.text(`Tel: ${invoiceData.companyPhone}`, 20, yPos)
      yPos += 5
    }
    if (invoiceData.companyEmail) {
      doc.text(`Email: ${invoiceData.companyEmail}`, 20, yPos)
      yPos += 5
    }

    // Due date in top right if exists
    if (invoiceData.dueDate) {
      doc.setTextColor(...primaryColor)
      doc.setFont("helvetica", "bold")
      doc.text(`Vencimiento: ${invoiceData.dueDate}`, 140, 50)
    }

    // Client section with modern styling
    yPos = 80
    doc.setFillColor(248, 250, 252) // Slate-50
    doc.rect(20, yPos - 5, 170, 35, "F")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(...primaryColor)
    doc.text("FACTURAR A:", 25, yPos + 5)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(...textColor)
    doc.text(invoiceData.clientName || "Cliente", 25, yPos + 15)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...mutedColor)
    let clientYPos = yPos + 22
    if (invoiceData.clientAddress) {
      const clientAddressLines = invoiceData.clientAddress.split("\n")
      clientAddressLines.forEach((line, index) => {
        if (clientYPos < yPos + 30) {
          doc.text(line, 25, clientYPos)
          clientYPos += 4
        }
      })
    }

    const addTableHeader = (currentY: number) => {
      doc.setFillColor(...primaryColor)
      doc.rect(20, currentY - 8, 170, 12, "F")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.text("DESCRIPCIÓN", 25, currentY - 2)
      doc.text("CANT.", 120, currentY - 2)
      doc.text("PRECIO", 140, currentY - 2)
      doc.text("TOTAL", 165, currentY - 2)

      return currentY + 8
    }

    // Table header with gradient-like effect
    yPos = 130
    yPos = addTableHeader(yPos)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...textColor)

    let pageNumber = 1
    const itemHeight = 8
    const maxYPosition = 250 // Maximum Y position before page break
    const headerHeight = 50 // Space needed for header on new page
    const tableHeaderHeight = 20 // Space needed for table header

    invoiceData.items.forEach((item, index) => {
      if (yPos + itemHeight > maxYPosition) {
        // Add new page
        doc.addPage()
        pageNumber++
        addHeader(pageNumber)

        // Reset Y position and add table header
        yPos = headerHeight
        yPos = addTableHeader(yPos)

        // Reset text properties
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(...textColor)
      }

      // Add alternating row background
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252) // Slate-50
        doc.rect(20, yPos - 4, 170, 8, "F")
      }

      // Add item data
      doc.text(item.description, 25, yPos)
      doc.text(item.quantity.toString(), 125, yPos)
      doc.text(`$${item.price.toFixed(2)}`, 145, yPos)
      doc.text(`$${item.total.toFixed(2)}`, 170, yPos)
      yPos += itemHeight
    })

    const totalsHeight = 45
    if (yPos + totalsHeight > maxYPosition) {
      doc.addPage()
      pageNumber++
      addHeader(pageNumber)
      yPos = headerHeight
    }

    // Totals section with modern styling
    yPos += 10
    const totalsStartY = yPos

    // Totals background
    doc.setFillColor(248, 250, 252)
    doc.rect(120, yPos - 5, 70, 35, "F")

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(...mutedColor)
    doc.text("Subtotal:", 125, yPos + 5)
    doc.text(`$${invoiceData.subtotal.toFixed(2)}`, 170, yPos + 5)

    doc.text("IVA:", 125, yPos + 12)
    doc.text(`$${invoiceData.tax.toFixed(2)}`, 170, yPos + 12)

    // Total with emphasis
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.text("TOTAL:", 125, yPos + 22)
    doc.text(`$${invoiceData.total.toFixed(2)}`, 165, yPos + 22)

    if (invoiceData.notes) {
      const notesHeight = 30
      if (yPos + 45 + notesHeight > maxYPosition) {
        doc.addPage()
        pageNumber++
        addHeader(pageNumber)
        yPos = headerHeight
      } else {
        yPos += 45
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(...textColor)
      doc.text("NOTAS:", 20, yPos)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...mutedColor)
      const noteLines = doc.splitTextToSize(invoiceData.notes, 170)
      doc.text(noteLines, 20, yPos + 8)
    }

    // Footer on last page
    doc.setFontSize(8)
    doc.setTextColor(...mutedColor)
    doc.text("Generado con Generador de Facturas Open Source", 20, 280)

    doc.save(`factura-${invoiceData.invoiceNumber}.pdf`)
  }

  const isDataComplete = invoiceData.companyName && invoiceData.clientName && invoiceData.items.length > 0

  return (
    <div className="space-y-8">
      <Card className="p-8 bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
        <div className="space-y-8">
          {/* Modern Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"></div>
            <div className="relative p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">{invoiceData.companyName || "Mi Empresa"}</h2>
                  {invoiceData.companyAddress && (
                    <div className="text-blue-100 mt-2 text-sm whitespace-pre-line opacity-90">
                      {invoiceData.companyAddress}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-bold">FACTURA</h1>
                  <div className="text-blue-100 mt-2 text-sm">
                    <div className="font-mono">#{invoiceData.invoiceNumber}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mt-4">
                <div className="text-blue-100 text-sm space-y-1">
                  {invoiceData.companyPhone && <div>📞 {invoiceData.companyPhone}</div>}
                  {invoiceData.companyEmail && <div>✉️ {invoiceData.companyEmail}</div>}
                </div>
                <div className="text-blue-100 text-sm text-right">
                  <div>Fecha: {invoiceData.invoiceDate}</div>
                  {invoiceData.dueDate && <div className="font-semibold">Vencimiento: {invoiceData.dueDate}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Client Info with modern card */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              FACTURAR A:
            </h3>
            <div className="text-slate-700">
              <div className="font-semibold text-lg">{invoiceData.clientName || "Cliente"}</div>
              {invoiceData.clientAddress && (
                <div className="text-slate-500 mt-2 whitespace-pre-line">{invoiceData.clientAddress}</div>
              )}
              <div className="text-slate-500 mt-2 space-y-1">
                {invoiceData.clientPhone && <div>📞 {invoiceData.clientPhone}</div>}
                {invoiceData.clientEmail && <div>✉️ {invoiceData.clientEmail}</div>}
              </div>
            </div>
          </div>

          {/* Modern Items Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="grid grid-cols-12 gap-4 font-semibold">
                <div className="col-span-6">Descripción</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-right">Precio</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
            </div>

            {invoiceData.items.length > 0 ? (
              <div className="bg-white">
                {invoiceData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-4 p-4 border-b border-slate-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <div className="col-span-6 font-medium text-slate-800">{item.description}</div>
                    <div className="col-span-2 text-center text-slate-600">{item.quantity}</div>
                    <div className="col-span-2 text-right text-slate-600">${item.price.toFixed(2)}</div>
                    <div className="col-span-2 text-right font-semibold text-slate-800">${item.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center text-slate-400">
                <Eye className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No hay items para mostrar</p>
                <p className="text-sm">Agrega productos o servicios para ver la vista previa</p>
              </div>
            )}
          </div>

          {/* Modern Totals */}
          {invoiceData.items.length > 0 && (
            <div className="flex justify-end">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 min-w-80">
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>IVA:</span>
                    <span className="font-mono">${invoiceData.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-2xl font-bold text-blue-600">
                    <span>TOTAL:</span>
                    <span className="font-mono">${invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoiceData.notes && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Notas:
              </h4>
              <p className="text-amber-700 whitespace-pre-line leading-relaxed">{invoiceData.notes}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={generatePDF}
          disabled={!isDataComplete}
          size="lg"
          className="gap-3 px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Download className="h-6 w-6" />
          Descargar PDF Profesional
        </Button>
      </div>

      {!isDataComplete && (
        <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-700 font-medium">
            ⚠️ Completa la información de la empresa, cliente y agrega al menos un item para generar el PDF
          </p>
        </div>
      )}
    </div>
  )
}
