"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Building, User, FileText, Calculator } from "lucide-react"
import type { InvoiceData } from "@/app/page"

interface InvoiceFormProps {
  invoiceData: InvoiceData
  setInvoiceData: (data: InvoiceData) => void
}

export function InvoiceForm({ invoiceData, setInvoiceData }: InvoiceFormProps) {
  const [taxRate, setTaxRate] = useState(16) // 16% IVA por defecto

  const updateField = (field: keyof InvoiceData, value: any) => {
    setInvoiceData({ ...invoiceData, [field]: value })
  }

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
      total: 0,
    }
    updateField("items", [...invoiceData.items, newItem])
  }

  const updateItem = (id: string, field: string, value: any) => {
    const updatedItems = invoiceData.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantity" || field === "price") {
          updatedItem.total = updatedItem.quantity * updatedItem.price
        }
        return updatedItem
      }
      return item
    })

    updateField("items", updatedItems)
    calculateTotals(updatedItems)
  }

  const removeItem = (id: string) => {
    const updatedItems = invoiceData.items.filter((item) => item.id !== id)
    updateField("items", updatedItems)
    calculateTotals(updatedItems)
  }

  const calculateTotals = (items: typeof invoiceData.items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Información de tu Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Nombre de la Empresa *</Label>
              <Input
                id="companyName"
                value={invoiceData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Mi Empresa S.A."
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={invoiceData.companyEmail}
                onChange={(e) => updateField("companyEmail", e.target.value)}
                placeholder="contacto@miempresa.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="companyAddress">Dirección</Label>
            <Textarea
              id="companyAddress"
              value={invoiceData.companyAddress}
              onChange={(e) => updateField("companyAddress", e.target.value)}
              placeholder="Calle Principal 123, Ciudad, Estado, CP"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="companyPhone">Teléfono</Label>
            <Input
              id="companyPhone"
              value={invoiceData.companyPhone}
              onChange={(e) => updateField("companyPhone", e.target.value)}
              placeholder="+52 55 1234 5678"
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nombre del Cliente *</Label>
              <Input
                id="clientName"
                value={invoiceData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Cliente S.A."
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={invoiceData.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                placeholder="cliente@empresa.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clientAddress">Dirección</Label>
            <Textarea
              id="clientAddress"
              value={invoiceData.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
              placeholder="Dirección del cliente"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Teléfono</Label>
            <Input
              id="clientPhone"
              value={invoiceData.clientPhone}
              onChange={(e) => updateField("clientPhone", e.target.value)}
              placeholder="+52 55 9876 5432"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalles de la Factura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Número de Factura</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Fecha de Emisión</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => updateField("invoiceDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Productos/Servicios
            </div>
            <Button onClick={addItem} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoiceData.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Label>Descripción</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Descripción del producto/servicio"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Total</Label>
                  <Input value={`$${item.total.toFixed(2)}`} readOnly className="bg-muted" />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {invoiceData.items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay productos/servicios agregados</p>
                <p className="text-sm">Haz clic en "Agregar Item" para comenzar</p>
              </div>
            )}
          </div>

          {invoiceData.items.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>IVA:</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => {
                        const rate = Number.parseFloat(e.target.value) || 0
                        setTaxRate(rate)
                        calculateTotals(invoiceData.items)
                      }}
                      className="w-16 h-8"
                    />
                    <span>%</span>
                  </div>
                  <span className="font-medium">${invoiceData.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${invoiceData.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={invoiceData.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Términos y condiciones, información de pago, etc."
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  )
}
