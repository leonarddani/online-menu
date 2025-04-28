import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address."}),
    password: z.string().min(6,{message: "Password must be at least 6 characters."})
    });

const LoginForm = () => {

    const form = useForm({
        resolver: zodResolver(formSchema),
    });
    
    function onSubmit(values) {
        console.log(values)
        }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-96">
            <div className='text-center'>
                <h1 className=' text-green-900 font-bold text-2xl mb-1'>
                    Login
                </h1>
                <p className='text-s text-green-900 font-normal mb-8'>Welcome back, please login to continue</p>
            </div>
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-green-900">Email</FormLabel>
                <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-green-900">Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="*********" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit" className="bg-green-900 cursor-pointer text-white" >Submit</Button>
        </form>
        </Form>
  )
}

export default LoginForm