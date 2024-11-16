
import { Badge } from '@/components/ui/badge';
import { Customers, Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';

import Container from '@/components/Container';

import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';
import { createPayment } from '@/actions';



export default async function InvoicePage({params}: {params: {invoiceId: string}}){

    const invoiceId = parseInt(params.invoiceId)
    // const {invoiceId} = await (params)

    if (isNaN(invoiceId)){
        throw new Error('Invalid Invoice Id')
    }

   const  [result] = await db.select({
    id: Invoices.id,
    status: Invoices.status,
    createTs: Invoices.createTs,
    value: Invoices.value,
    description: Invoices.description,
    name: Customers.name
   })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1)
    
    if (!result) return notFound()

     const invoice = {
        ...result,
        customer:{
            name: result.name
        }
        }

    return(
        <main className="w-full h-full">
            <Container>
                <div className='grid grid-cols-2'>
                <div>
            <div className="flex justify-between mb-4">
            <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoices {invoice.id}
                <Badge className={cn(
                    "rounded-full capitalize",
                  invoice.status ==='open' && 'bg-blue-500',
                  invoice.status === 'paid' && 'bg-green-600',
                  invoice.status === 'void' && 'bg-zinc-700',
                  invoice.status === 'uncollectable' && 'bg-red-600',
                )}>
                    {invoice.status}
                </Badge>
            </h1>

            </div>

            <p className='text-3xl mb-3'>
                ${(invoice.value / 100).toFixed(2)}
            </p>

            <p className='text-lg mb-8'>
                {invoice.description}
            </p>
            </div>

                <div>
                    <h2 className='text-3xl font-bold mb-4'>Manage Invoice</h2>
                    {invoice.status === 'open' && (
                          <form action={createPayment}>
                            <input type="hidden" name="id" value={invoice.id} />
                          <Button className='flex gap-2 font-bold bg-green-500'>
                              <CreditCard className='w-5 h-auto'/>
                              Pay Invoice
                          </Button>
                         </form>
                    )}
             
             {invoice.status === "paid" &&(
                <p className='flex gap-2 text-xl'>
                    <Check className='w-8 h-auto bg-green-500 rounded-full text-white p-1'/>
                    Invoice Paid
                </p>
             )}
                </div>


            </div>


            <h2 className='font-bold text-lg mb-4'>
                Billing Details
            </h2>

            <ul className='grid gap-2'>
                <li className='flex gap 4'>
                    <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice ID</strong>
                    <span>{invoice.id}</span>
                </li>
                <li className='flex gap 4'>
                    <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice Date</strong>
                    <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
                </li>
                <li className='flex gap 4'>
                    <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Billing Name</strong>
                    <span>{invoice.customer.name}</span>
                </li>
            </ul>
           
            </Container>
        </main>
    )
}