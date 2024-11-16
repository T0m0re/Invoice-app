import { notFound } from 'next/navigation';
import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

import Invoice from './Invoice';

export default async function InvoicePage({params}: {params: {invoiceId: string}}){

    // const invoiceId = parseInt(params.invoiceId)
    const invoiceId = parseInt(await params.invoiceId);

    // const {invoiceId} = await (params)
    const {userId, orgId} = await auth()
    if (isNaN(invoiceId)){
        throw new Error('Invalid Invoice Id')
    }

    if(!userId) return


    let result;
    if (orgId) {
     [result] = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.organizationId, orgId)
     ))
    .limit(1)
    }else{
        
    [result] = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.userId, userId),
        isNull(Invoices.organizationId)
     ))
    .limit(1)
    }


        if (!result) return notFound()

            const invoice = {
                ...result.invoices,
                customer: result.customers
            }
    return(
       <Invoice invoice={invoice}/>
    )
}