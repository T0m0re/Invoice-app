import { CirclePlus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Container from '@/components/Container';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { eq, and, isNull } from 'drizzle-orm';

  

export default async function Dashboard(){
    const {userId, orgId} = await auth()

    if(!userId) return
    
    let result;
    if(orgId){
        result = await db.select()
        .from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(eq(Invoices.organizationId, orgId));
    }else{
        result = await db.select()
        .from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(
            and(
                eq(Invoices.userId, userId),
                isNull(Invoices.organizationId)
        ));
    }

   

    const invoices = result?.map(({invoices, customers}) =>{
        return{
            ...invoices,
            customer: customers
        }
    })
    return(
        <main>
            <Container>
                <div className="flex justify-between">
                <h1 className="text-3xl font-semibold mb-4">
                    Invoices
                </h1>
                <p>
                    <Button variant="ghost" className='inline-flex gap-2' asChild>
                        <Link href="/invoices/new">
                        <CirclePlus className='h-4 w-4' />
                            Create Invoice
                        </Link>
                    </Button>
                </p>
                </div>
                <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px] p-4">Date</TableHead>
                    <TableHead className="p-4">Customer</TableHead>
                    <TableHead className="p-4">Email</TableHead>
                    <TableHead className="text-center p-4">Status</TableHead>
                    <TableHead className="text-right p-4">Value</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>

                    {invoices.map(result =>{
                        return(
                            <TableRow key={result.id}>
                            <TableCell className="p-0 font-medium text-left">
                                <Link href={`/invoices/${result.id}`} className="font-semibold p-4 block">
                                {new Date(result.createTs).toLocaleDateString()}
                                </Link>
                            </TableCell>
                            <TableCell className="p-0 text-left">
                                <Link href={`/invoices/${result.id}`} className="font-semibold p-4 block">
                                {result.customer.name}
                                </Link>
                            </TableCell>
                            <TableCell className="p-0 text-left">
                                <Link href={`/invoices/${result.id}`} className='p-4 block'>
                                    {result.customer.email}
                                </Link>
                            </TableCell>
                            <TableCell className="p-0 text-center">
                                <Link href={`/invoices/${result.id}`} className='p-4 block'>
                                <Badge className={cn(
                        "rounded-full capitalize",
                        result.status ==='open' && 'bg-blue-500',
                        result.status === 'paid' && 'bg-green-600',
                        result.status === 'void' && 'bg-zinc-700',
                        result.status === 'uncollectable' && 'bg-red-600',
                    )}>
                        {result.status}
                    </Badge>
                                </Link>
                            </TableCell>
                            <TableCell className="p-0 text-right">
                                <Link href={`/invoices/${result.id}`} className="block p-4 font-semibold">
                                ${(result.value / 100).toFixed(2)}
                                </Link>
                            </TableCell>
                            </TableRow>
                        )
                    })}
                
                </TableBody>
                </Table>
            </Container>
        </main>
    )
}