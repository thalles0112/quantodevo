'use client'

import axios from "axios";
import { randomInt, randomUUID } from "crypto";
import { useEffect, useState, useRef } from "react";







export default function Home() {
  const [pagamentos, setPagamentos] = useState([])
  const formRef = useRef(null)
  useEffect(()=>{
    async function getPagamentos(params) {
      const p = await axios.get('/api/pagamento').then(pgmnt=>pgmnt.data)  
      setPagamentos(p)
    }
    getPagamentos()
  },[])
  
  
  function calculateTotal(){
    let valor = 0
    pagamentos.map(p=>valor += parseFloat(p.valor))

    return valor
  }

  function calculateRestante(){
    return 750 - calculateTotal()
  }

  


  async function handleSubmit(e){
    e.preventDefault()
    const form = formRef.current
    const valor = form.valor.value
    const data = new Date().toLocaleDateString()
    const resp = await axios.post('/api/pagamento', {valor:parseFloat(valor), data:data})

    if (resp.data == true){
      setPagamentos([...pagamentos, {valor: parseFloat(valor), data:data}])
    }
    


  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
        <h1>Quanto eu devo o thalles?</h1>

        <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 flex flex-col items-start">
        <h2>Pix feitos:</h2>
        <ul>
          {pagamentos.map((pgmnt, idx)=>{
              return(
                <li key={idx}>
                  #{idx+1} R$ {pgmnt.valor} - {pgmnt.data}
                </li>
              )
          })}
        </ul>
        </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 flex flex-col items-start">
            <h2>Dívida restante:</h2>
            <ul>
              <li>Dívida: R$ 750</li>
              <li>Total pago:  R$ {calculateTotal()}</li>
              <li>Restante:  R${calculateRestante()}</li>
              
            </ul>
          </div>

        <form ref={formRef} onSubmit={handleSubmit} method="POST" action={'/api/pagamento'} className="bg-slate-100 dark:bg-slate-800 rounded p-4 flex flex-col items-start">
          <label>Quanto eu paguei hoje?</label>
          <input name="valor" className="border-b outline-none mt-4 bg-transparent" type="number"/>
          <button type="submit" className="p-4 rounded mt-4 bg-blue-500 text-white">Confirmar</button>
        </form>
      </main>
    </div>
  );
}
