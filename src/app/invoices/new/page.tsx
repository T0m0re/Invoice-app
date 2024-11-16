'use client'

import { SyntheticEvent, useState } from "react"
import Form from 'next/form'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SubmitButton from "@/components/ui/SubmitButton"

  import { createAction } from "@/actions"
import Container from "@/components/Container"

export default function Home(){
    const [state, setState] = useState('ready')
   
    async function handleOnsubmit(event: SyntheticEvent){
        
        if(state === 'pending') {
            event.preventDefault()
            return
        }
        setState('pending')
    }

   
    return(
        <main className="my-12">
            <Container>
                <div className="flex justify-between">
                    <h1 className="text-3xl font-semibold mb-5">
                        Create Invoice
                    </h1>
                </div>

                <Form action={createAction} onSubmit={handleOnsubmit} className="grid gap-4 max-w-xs">
                    <div>
                        <Label htmlFor="name" className="block mb-2 font-semibold text-sm">Billing Name</Label>
                        <Input id="name" name="name" type="text" />
                    </div>

                    <div>
                        <Label htmlFor="email" className="block mb-2 font-semibold text-sm">Billing Email</Label>
                        <Input id="email" name="email" type="email" />
                    </div>

                    <div>
                        <Label htmlFor="value" className="block mb-2 font-semibold text-sm">Value</Label>
                        <Input id="value" name="value" type="text" />
                    </div>

                    <div>
                        <Label htmlFor="description" className="block mb-2 font-semibold text-sm">Description</Label>
                        <Textarea name="description" id="description"></Textarea>
                    </div>
                    <div>
                        <SubmitButton/>
                    </div>
                </Form>
            </Container>
        </main>
    )
}