'use server'

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// Define validation schema
const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(1, {
    message: "Age must be at least 1.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type FormState = {
  errors?: {
    name?: string[];
    age?: string[];
    email?: string[];
    _form?: string[];
  };
  success?: boolean;
  message?: string;
};

export async function createUser(prevState: FormState, formData: FormData): Promise<FormState> {
  // Extract form data
  const name = formData.get('name') as string;
  const age = formData.get('age') as string;
  const email = formData.get('email') as string;
  
  // Validate form data
  const validatedFields = userSchema.safeParse({
    name,
    age: parseInt(age),
    email,
  });

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: 'Invalid form data. Please check the fields.'
    };
  }

  try {
    // Insert the user into the database
    await db.insert(usersTable).values({
      name: validatedFields.data.name,
      age: validatedFields.data.age,
      email: validatedFields.data.email,
    });
    
    // Revalidate the path to refresh the data
    revalidatePath('/');
    
    return {
      success: true,
      message: 'User created successfully!'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Check if it's a unique constraint violation (duplicate email)
    if (error instanceof Error && error.message.includes('users_email_unique')) {
      return {
        errors: {
          _form: ['A user with this email already exists']
        },
        success: false,
        message: 'A user with this email already exists'
      };
    }
    
    return {
      errors: {
        _form: ['An error occurred while creating the user']
      },
      success: false,
      message: 'An error occurred while creating the user'
    };
  }
}

export async function deleteUser(userId: number): Promise<FormState> {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, userId));
    
    // Revalidate the path to refresh the data
    revalidatePath('/');
    
    return {
      success: true,
      message: 'User deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    
    return {
      errors: {
        _form: ['An error occurred while deleting the user']
      },
      success: false,
      message: 'An error occurred while deleting the user'
    };
  }
}

export async function updateUser(userId: number, data: z.infer<typeof userSchema>): Promise<FormState> {
  // Validate form data
  const validatedFields = userSchema.safeParse(data);

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: 'Invalid form data. Please check the fields.'
    };
  }

  try {
    // Update the user in the database
    await db.update(usersTable)
      .set({
        name: validatedFields.data.name,
        age: validatedFields.data.age,
        email: validatedFields.data.email,
      })
      .where(eq(usersTable.id, userId));
    
    // Revalidate the path to refresh the data
    revalidatePath('/');
    
    return {
      success: true,
      message: 'User updated successfully!'
    };
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Check if it's a unique constraint violation (duplicate email)
    if (error instanceof Error && error.message.includes('users_email_unique')) {
      return {
        errors: {
          _form: ['A user with this email already exists']
        },
        success: false,
        message: 'A user with this email already exists'
      };
    }
    
    return {
      errors: {
        _form: ['An error occurred while updating the user']
      },
      success: false,
      message: 'An error occurred while updating the user'
    };
  }
}