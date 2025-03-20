"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { createUser, FormState } from "@/app/actions"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(1, {
    message: "Age must be at least 1.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add User'}
    </Button>
  );
}

export function ProfileForm() {
  const initialState: FormState = { errors: {} };
  const [state, formAction] = useFormState(createUser, initialState);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      email: "",
    },
  })

  // Show toast notifications based on form state
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      form.reset();
    } else if (state.errors?._form) {
      toast.error(state.message);
    }
  }, [state, form]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} name="name" />
              </FormControl>
              <FormDescription>
                Your full name.
              </FormDescription>
              <FormMessage />
              {state.errors?.name && (
                <p className="text-destructive text-sm">{state.errors.name[0]}</p>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="25" {...field} name="age" />
              </FormControl>
              <FormDescription>
                Your current age.
              </FormDescription>
              <FormMessage />
              {state.errors?.age && (
                <p className="text-destructive text-sm">{state.errors.age[0]}</p>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@example.com" {...field} name="email" />
              </FormControl>
              <FormDescription>
                Your email address.
              </FormDescription>
              <FormMessage />
              {state.errors?.email && (
                <p className="text-destructive text-sm">{state.errors.email[0]}</p>
              )}
            </FormItem>
          )}
        />
        
        {state.errors?._form && (
          <p className="text-destructive text-sm">{state.errors._form[0]}</p>
        )}
        
        <SubmitButton />
      </form>
    </Form>
  )
}
