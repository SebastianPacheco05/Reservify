import { useState } from "react"

interface CustomerFormProps {
    onSubmit: (data: any) => void
    initialData: {
        nombre: string
        apellido: string
        email: string
        telefono: string
        tipo_documento: string
        documento: string
    }
}

export function CustomerForm({ onSubmit, initialData }: CustomerFormProps) {
    const [formData, setFormData] = useState(initialData)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-xl)] p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-6">Información del Cliente</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Nombre</label>
                    <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Apellido</label>
                    <input
                        type="text"
                        required
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Teléfono</label>
                    <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Tipo de Documento</label>
                    <select
                        value={formData.tipo_documento}
                        onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PA">Pasaporte</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Número de Documento</label>
                    <input
                        type="text"
                        required
                        value={formData.documento}
                        onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-6 w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
                Continuar al Pago
            </button>
        </form>
    )
}

