'use client'
import { Badge } from '@/components/ui/badge';
import { Customers, Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';
import { useOptimistic } from 'react';
import Container from '@/components/Container';
import { ChevronDown, CreditCard, Ellipsis, Trash2 } from 'lucide-react';


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import { Button } from '@/components/ui/button';

import {AVAILABLE_STATUS} from '@/data/invoice'
import { updateStatusAction, deleteInvoiceAction } from '@/actions';
import Link from 'next/link';

interface InvoiceProps{
    invoice : typeof Invoices.$inferSelect & {
        customer: typeof Customers.$inferSelect
    }
}

export default function Invoice({invoice}:InvoiceProps){
    const [currentStatus, setCurrentStatus] = useOptimistic(invoice.status, (state, newStatus) =>{return String(newStatus)})

    async function handleOnUpdate(formData:FormData) {
        const originalValue = currentStatus;

        setCurrentStatus(formData.get('status'))
        try {
       await updateStatusAction(formData)
        } catch (e) {
            setCurrentStatus(originalValue)
        }
    }
    return(
        <main className="w-full h-full">
            <Container>
            <div className="flex justify-between mb-4">
            <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoices {invoice.id}
                <Badge className={cn(
                    "rounded-full capitalize",
                  currentStatus ==='open' && 'bg-blue-500',
                  currentStatus === 'paid' && 'bg-green-600',
                  currentStatus === 'void' && 'bg-zinc-700',
                  currentStatus === 'uncollectable' && 'bg-red-600',
                )}>
                    {currentStatus}
                </Badge>
            </h1>
            <div className='flex gap-4'>
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className='flex gap-2'>
                    Change Status
                    <ChevronDown className='w-4 h-auto'/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>

                    {AVAILABLE_STATUS.map((status) =>{
                        return(
                            <DropdownMenuItem key={status.id} onClick={() => {
                                const formData = new FormData();
                                formData.append('id', String(invoice.id));
                                formData.append('status', status.id);
                                handleOnUpdate(formData);
                            }}>
                                {status.label}
                            </DropdownMenuItem>
                        )
                    })}
                   
                </DropdownMenuContent>
          </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                        <span className="sr-only">More Options</span>
                        <Ellipsis className="w-4 h-auto" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="flex items-center gap-2 p-1">
                                    <Trash2 className="w-4 h-auto" />
                                    Delete Invoice
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this invoice and remove it from the system.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        const formData = new FormData();
                                        formData.append('id', String(invoice.id));
                                        deleteInvoiceAction(formData);
                                    }}>
                                        Confirm Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link className='flex items-center gap-2' href={`/invoices/${invoice.id}/payment`}>
                        <CreditCard className='w-4 h-auto'/>
                        Payment
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            
            </DropdownMenu>


          </div>
            </div>

            <p className='text-3xl mb-3'>
                ${(invoice.value / 100).toFixed(2)}
            </p>

            <p className='text-lg mb-8'>
                {invoice.description}
            </p>

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
                <li className='flex gap 4'>
                    <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Billing Email</strong>
                    <span>{invoice.customer.email}</span>
                </li>
            </ul>
            </Container>
        </main>
    )
}