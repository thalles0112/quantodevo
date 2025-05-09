// app/api/pagamentos/route.js
import { NextResponse } from 'next/server'

import { Pool } from 'pg'

const pool = new Pool({
  connectionString: 'postgresql://qntdevo_owner:npg_j6ZSMP7mYREN@ep-damp-queen-a4tjwr2z.us-east-1.aws.neon.tech/qntdevo?sslmode=require',
  
})


export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM pagamentos ORDER BY id ASC')
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { data, valor } = await req.json()

    if (!data || !valor) {
      return NextResponse.json({ error: 'valor é obrigatório' }, { status: 400 })
    }

    const result = await pool.query(
      'INSERT INTO pagamentos (data, valor) VALUES ($1, $2) RETURNING *',
      [data, valor]
    )

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao salvar pagamento' }, { status: 500 })
  }
}

export async function DELETE(req) {
  const id = parseInt(new URL(req.url).searchParams.get('id') || '')
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const result = await pool.query('DELETE FROM pagamentos WHERE id = $1 RETURNING *', [id])
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Pagamento deletado com sucesso' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao deletar pagamento' }, { status: 500 })
  }
}
