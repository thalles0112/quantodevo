import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'db.json')
console.log(filePath)

function lerPagamentos() {
    if (!fs.existsSync(filePath)) return []
    const data = fs.readFileSync(filePath, 'utf-8')
    console.log(data)
    return JSON.parse(data)
  }
  
  function salvarPagamentos(pagamentos) {
    const pagamentosAntigos = lerPagamentos()
    pagamentosAntigos.push(pagamentos)
    fs.writeFileSync(filePath, JSON.stringify(pagamentos, null, 2))

    return true
  }
  
  export function deletarPagamento(id){
    const pagamentos = lerPagamentos()
    const filtrados = pagamentos.filter(p => p.id !== id)
    const foiDeletado = pagamentos.length !== filtrados.length
    if (foiDeletado) salvarPagamentos(filtrados)
    return foiDeletado
  }
  

export async function GET() {
  const pagamentos = lerPagamentos()
  return NextResponse.json(pagamentos)
}

export async function POST(req) {
  const data = await req.json()

  const novo = salvarPagamentos(data)
  return NextResponse.json(novo)
}

export async function DELETE(req) {
  const id = parseInt(new URL(req.url).searchParams.get('id') || '')

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const ok = deletarPagamento(id)
  if (!ok) {
    return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Pagamento deletado com sucesso' })
}